import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const outputPath = new URL("artifacts/research-watch.json", root);
const markdownPath = new URL("artifacts/research-watch.md", root);
const checkedAt = new Date();
const checkedDate = checkedAt.toISOString().slice(0, 10);
const requestHeaders = {
  "user-agent": "ActivistDB research monitor/2.0 (+https://github.com/dtrezise/ActivistDB)",
  accept: "text/html,application/json;q=0.9,*/*;q=0.7",
};

const readJson = (path) => readFile(new URL(path, root), "utf8").then(JSON.parse);
const [claims, antifa, policy, watchlist] = await Promise.all([
  readJson("app/data/claims.json"),
  readJson("app/data/antifa-attributions.json"),
  readJson("app/data/policy-context.json"),
  readJson("app/data/watchlist.json"),
]);

const records = [...claims, ...antifa, ...policy];
const uniqueSources = [
  ...new Map(
    records.flatMap((record) =>
      record.sources.map((source) => [source.url, { ...source, recordIds: [record.id] }]),
    ),
  ).values(),
];

for (const record of records) {
  for (const source of record.sources) {
    const item = uniqueSources.find(({ url }) => url === source.url);
    if (item && !item.recordIds.includes(record.id)) item.recordIds.push(record.id);
  }
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal, redirect: "follow" });
  } finally {
    clearTimeout(timer);
  }
}

async function mapLimit(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await mapper(items[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

const sourceHealth = await mapLimit(uniqueSources, 8, async (source) => {
  try {
    const response = await fetchWithTimeout(source.url, { headers: requestHeaders });
    return {
      url: source.url,
      recordIds: source.recordIds,
      status: response.status,
      finalUrl: response.url,
      hardFailure: response.status === 404 || response.status === 410,
    };
  } catch (error) {
    return {
      url: source.url,
      recordIds: source.recordIds,
      status: null,
      error: error instanceof Error ? error.message : String(error),
      hardFailure: false,
    };
  }
});

function decodeXml(value = "") {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function safeFeedText(value = "") {
  return value
    .replace(/\s+/g, " ")
    .trim()
    .replaceAll("\\", "\\\\")
    .replaceAll("[", "\\[")
    .replaceAll("]", "\\]")
    .replaceAll("@", "@\u200b");
}

function safeFeedUrl(value = "") {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}

function parseRss(xml) {
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .slice(0, 8)
    .map(([, item]) => ({
      title: safeFeedText(decodeXml(item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1]?.trim())),
      url: safeFeedUrl(decodeXml(item.match(/<link>([\s\S]*?)<\/link>/)?.[1]?.trim())),
      seenDate: item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1]?.trim(),
      source: safeFeedText(decodeXml(item.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1]?.trim())),
    }))
    .filter(({ title, url }) => title && url);
}

const signals = await mapLimit(watchlist, 2, async (item) => {
  const params = new URLSearchParams({
    q: `(${item.query}) when:2d`,
    hl: "en-US",
    gl: "US",
    ceid: "US:en",
  });
  try {
    const response = await fetchWithTimeout(
      `https://news.google.com/rss/search?${params}`,
      { headers: { ...requestHeaders, accept: "application/rss+xml,application/xml,text/xml" } },
      30000,
    );
    if (!response.ok) throw new Error(`News RSS returned ${response.status}`);
    const articles = parseRss(await response.text());
    return { id: item.id, query: item.query, articles };
  } catch (error) {
    return {
      id: item.id,
      query: item.query,
      monitorError: error instanceof Error ? error.message : String(error),
      articles: [],
    };
  }
});

const due = records
  .filter((record) => record.nextReviewAt <= checkedDate)
  .map(({ id, nextReviewAt }) => ({ id, nextReviewAt }));
const broken = sourceHealth.filter(({ hardFailure }) => hardFailure);
const candidates = signals.filter(({ articles }) => articles.length);
const report = {
  schemaVersion: 1,
  checkedAt: checkedAt.toISOString(),
  editorialBoundary: "Candidate discovery and link checks only; no verdicts changed automatically.",
  counts: {
    sourcesChecked: sourceHealth.length,
    hardFailures: broken.length,
    candidateSets: candidates.length,
    reviewsDue: due.length,
  },
  due,
  broken,
  signals,
  sourceHealth,
};

const markdown = [
  `# ActivistDB daily research watch — ${checkedDate}`,
  "",
  "> Candidate discovery and link checks only. Every candidate requires source-level review before any record or verdict changes.",
  "",
  `- ${sourceHealth.length} unique sources checked`,
  `- ${broken.length} hard link failures (404/410)`,
  `- ${candidates.length} watchlist queries returned recent candidates`,
  `- ${due.length} records reached their next-review date`,
  "",
  ...(due.length
    ? ["## Reviews due", "", ...due.map((item) => `- \`${item.id}\` (due ${item.nextReviewAt})`), ""]
    : []),
  ...(broken.length
    ? ["## Hard link failures", "", ...broken.map((item) => `- ${item.url} — ${item.recordIds.join(", ")}`), ""]
    : []),
  ...(candidates.length
    ? [
        "## Recent candidate coverage",
        "",
        ...candidates.flatMap((item) => [
          `### ${item.id}`,
          "",
          ...item.articles.map((article) => `- [${article.title}](${article.url}) — ${article.source || "unknown source"}`),
          "",
        ]),
      ]
    : []),
].join("\n");

await mkdir(dirname(fileURLToPath(outputPath)), { recursive: true });
await Promise.all([
  writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`),
  writeFile(markdownPath, `${markdown}\n`),
]);

const hasFindings = broken.length > 0 || candidates.length > 0 || due.length > 0;
if (process.env.GITHUB_OUTPUT) {
  await writeFile(process.env.GITHUB_OUTPUT, `has_findings=${hasFindings}\n`, { flag: "a" });
}
console.log(markdown);
