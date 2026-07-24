import { readFile, writeFile } from "node:fs/promises";

const claimsUrl = new URL("../public/data/claims.json", import.meta.url);
const csvUrl = new URL("../public/data/claims.csv", import.meta.url);
const claims = JSON.parse(await readFile(claimsUrl, "utf8"));

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

await writeFile(csvUrl, `${rows.join("\n")}\n`);
