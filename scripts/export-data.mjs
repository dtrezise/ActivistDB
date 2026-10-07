import { copyFile, readFile, writeFile } from "node:fs/promises";

const claimsUrl = new URL("../app/data/claims.json", import.meta.url);
const csvUrl = new URL("../public/data/claims.csv", import.meta.url);
const claims = JSON.parse(await readFile(claimsUrl, "utf8"));
const mirroredDataFiles = [
  "antifa-attributions.json",
  "claims.json",
  "policy-context.json",
  "project-meta.json",
  "research-log.json",
  "corrections.json",
  "watchlist.json",
];

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
  "reviewedAt",
  "nextReviewAt",
  "reviewer",
  "dimensions",
  "sources",
];

const escapeCell = (value) => {
  const normalized =
    typeof value === "string"
      ? value
      : Array.isArray(value)
        ? value.map((item) => `${item.label}: ${item.url}`).join(" | ")
        : typeof value === "object" && value !== null
          ? JSON.stringify(value)
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
  ...mirroredDataFiles.map((file) =>
    copyFile(
      new URL(`../app/data/${file}`, import.meta.url),
      new URL(`../public/data/${file}`, import.meta.url),
    ),
  ),
  writeFile(csvUrl, `${rows.join("\n")}\n`),
]);
