import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const readJson = (path) => readFile(new URL(path, root), "utf8").then(JSON.parse);

const [claims, antifa, policy, meta, corrections, log, watchlist, transcript] =
  await Promise.all([
    readJson("app/data/claims.json"),
    readJson("app/data/antifa-attributions.json"),
    readJson("app/data/policy-context.json"),
    readJson("app/data/project-meta.json"),
    readJson("app/data/corrections.json"),
    readJson("app/data/research-log.json"),
    readJson("app/data/watchlist.json"),
    readFile(new URL("public/data/rubio-speech-transcript.txt", root), "utf8"),
  ]);

const isoDate = /^\d{4}-\d{2}-\d{2}$/;
const sourceFields = [
  "title",
  "url",
  "publisher",
  "sourceType",
  "evidenceRole",
  "accessedAt",
];
const claimDimensionKeys = [
  "event",
  "actorAttribution",
  "ideologyAttribution",
  "terrorismThreshold",
  "organizationalLink",
  "networkInference",
];
const antifaDimensionKeys = [
  "identity",
  "conduct",
  "motive",
  "coordination",
  "command",
  "networkLink",
  "adjudication",
];

function validateSources(record) {
  assert.ok(record.sources.length > 0, `${record.id}: missing sources`);
  for (const source of record.sources) {
    for (const field of sourceFields) {
      assert.ok(source[field], `${record.id}: source missing ${field}`);
    }
    assert.match(source.url, /^https:\/\//, `${record.id}: source must use HTTPS`);
    assert.match(source.accessedAt, isoDate, `${record.id}: invalid accessedAt`);
  }
}

function validateReview(record) {
  assert.match(record.reviewedAt, isoDate, `${record.id}: invalid reviewedAt`);
  assert.match(record.nextReviewAt, isoDate, `${record.id}: invalid nextReviewAt`);
  assert.ok(record.nextReviewAt >= record.reviewedAt, `${record.id}: next review predates review`);
  assert.ok(record.reviewer.length >= 12, `${record.id}: missing reviewer disclosure`);
}

assert.equal(claims.length, 30, "speech ledger must retain all 30 claims");
assert.equal(antifa.length, 13, "ANTIFA ledger count changed; update scope disclosure deliberately");
assert.equal(policy.length, 5, "policy claim count changed; update scope disclosure deliberately");

for (const collection of [claims, antifa, policy]) {
  assert.equal(new Set(collection.map(({ id }) => id)).size, collection.length, "duplicate record IDs");
  for (const record of collection) {
    validateSources(record);
    validateReview(record);
  }
}

for (const claim of claims) {
  assert.deepEqual(Object.keys(claim.dimensions), claimDimensionKeys, `${claim.id}: incomplete dimensions`);
  if (claim.verdict === "pending") {
    const safeguards = `${claim.context} ${claim.legalStatus}`.toLowerCase();
    assert.ok(
      safeguards.includes("presumed innocent") || safeguards.includes("allegation"),
      `${claim.id}: pending record lacks allegation safeguard`,
    );
  }
}

for (const item of antifa) {
  assert.deepEqual(Object.keys(item.dimensions), antifaDimensionKeys, `${item.id}: incomplete dimensions`);
  if (item.status === "pending") {
    const safeguards = `${item.evidence} ${item.attribution} ${item.scope}`.toLowerCase();
    assert.ok(
      safeguards.includes("alleg") || safeguards.includes("not guilty") || safeguards.includes("not-guilty"),
      `${item.id}: pending record lacks allegation safeguard`,
    );
  }
}

const allIds = new Set([...claims, ...antifa, ...policy].map(({ id }) => id));
const recordsById = new Map([...claims, ...antifa, ...policy].map((record) => [record.id, record]));
for (const item of corrections) assert.ok(allIds.has(item.recordId), `unknown correction record ${item.recordId}`);
for (const item of watchlist) {
  assert.ok(allIds.has(item.id), `unknown watchlist record ${item.id}`);
  assert.ok(item.query && item.urls.length, `${item.id}: incomplete watch rule`);
  assert.equal(
    item.nextReviewAt,
    recordsById.get(item.id)?.nextReviewAt,
    `${item.id}: watchlist and record review dates differ`,
  );
}

assert.equal(meta.scope.speechClaims, claims.length);
assert.equal(meta.scope.antifaCases, antifa.length);
assert.equal(meta.scope.policyClaims, policy.length);
assert.equal(log[0].version, meta.version);
assert.equal(log[0].date, meta.publishedAt);
assert.equal(
  createHash("sha256").update(transcript).digest("hex"),
  meta.primarySpeech.transcriptSha256,
  "transcript hash does not match provenance metadata",
);

console.log(
  `Validated ${claims.length + antifa.length + policy.length} records, ` +
    `${claims.flatMap((item) => item.sources).length + antifa.flatMap((item) => item.sources).length + policy.flatMap((item) => item.sources).length} source placements, ` +
    `${watchlist.length} watch rules, and the transcript checksum.`,
);
