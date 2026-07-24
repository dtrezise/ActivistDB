import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the claims investigation", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Claim \/ Cause/);
  assert.match(html, /30 testable claims/);
  assert.match(html, /History is real/);
  assert.match(html, /ANTIFA dossier/);
  assert.doesNotMatch(html, /Codex is working|react-loading-skeleton/);
});

test("server-renders the Antifa research dossier", async () => {
  const response = await render("/antifa/");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /The ANTIFA file/);
  assert.match(html, /Antifa is not one thing/);
  assert.match(html, /Prairieland/);
  assert.match(html, /Oregon wildfires/);
});

test("research data is complete and source-linked", async () => {
  const [claims, antifa] = await Promise.all([
    readFile(new URL("../public/data/claims.json", import.meta.url), "utf8").then(
      JSON.parse,
    ),
    readFile(
      new URL("../public/data/antifa-attributions.json", import.meta.url),
      "utf8",
    ).then(JSON.parse),
  ]);

  assert.equal(claims.length, 30);
  assert.equal(new Set(claims.map((claim) => claim.id)).size, claims.length);
  assert.ok(
    claims.every(
      (claim) =>
        claim.sources.length > 0 &&
        claim.sources.every((source) => source.url.startsWith("https://")),
    ),
  );
  assert.ok(antifa.length >= 13);
  assert.ok(antifa.some((item) => item.status === "confirmed"));
  assert.ok(antifa.some((item) => item.status === "false"));
});
