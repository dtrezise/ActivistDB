import { readFile, writeFile } from "node:fs/promises";

const claimsUrl = new URL("../app/data/claims.json", import.meta.url);
const publicClaimsUrl = new URL("../public/data/claims.json", import.meta.url);
const csvUrl = new URL("../public/data/claims.csv", import.meta.url);
const antifaUrl = new URL(
  "../app/data/antifa-attributions.json",
  import.meta.url,
);
const publicAntifaUrl = new URL(
  "../public/data/antifa-attributions.json",
  import.meta.url,
);
const policyUrl = new URL("../app/data/policy-context.json", import.meta.url);
const publicPolicyUrl = new URL(
  "../public/data/policy-context.json",
  import.meta.url,
);
const claims = JSON.parse(await readFile(claimsUrl, "utf8"));
const antifa = await readFile(antifaUrl, "utf8");
const policy = await readFile(policyUrl, "utf8");

const fields = [
  "number",
  "id",
  "title",
  "quote",
  "period",
  "region",
  "category",
  "verdict",
  "confidence",
  "actors",
  "ideology",
  "finding",
  "context",
  "legalStatus",
  "sources",
];

const escapeCell = (value) => {
  const normalized =
    typeof value === "string"
      ? value
      : Array.isArray(value)
        ? value.map((item) => `${item.label}: ${item.url}`).join(" | ")
        : String(value ?? "");
  return `"${normalized.replaceAll('"', '""')}"`;
};

const rows = [
  fields.map(escapeCell).join(","),
  ...claims.map((claim) =>
    fields.map((field) => escapeCell(claim[field])).join(","),
  ),
];

await Promise.all([
  writeFile(publicClaimsUrl, `${JSON.stringify(claims, null, 2)}\n`),
  writeFile(publicAntifaUrl, antifa),
  writeFile(publicPolicyUrl, policy),
  writeFile(csvUrl, `${rows.join("\n")}\n`),
]);
