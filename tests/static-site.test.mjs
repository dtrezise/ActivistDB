import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function readOutput(path) {
  return readFile(new URL(`out/${path}`, root), "utf8");
}

test("static export contains all public research surfaces", async () => {
  const [home, antifa, methodology] = await Promise.all([
    readOutput("index.html"),
    readOutput("antifa/index.html"),
    readOutput("methodology/index.html"),
  ]);

  assert.match(home, /30 testable claims/);
  assert.match(home, /Six-dimensional claim testing/);
  assert.match(home, /Treasury sanctions groups and digital infrastructure/);
  assert.match(antifa, /Thirteen purposively selected cases/);
  assert.match(antifa, /Sampling limit/);
  assert.match(methodology, /Six questions, not one label/);
  assert.match(methodology, /independent human fact-check/i);
});

test("downloadable data mirrors the canonical records", async () => {
  const files = [
    "claims.json",
    "claims.csv",
    "antifa-attributions.json",
    "policy-context.json",
    "project-meta.json",
    "research-log.json",
    "corrections.json",
    "watchlist.json",
    "rubio-speech-transcript.txt",
  ];
  await Promise.all(files.map((file) => access(new URL(`out/data/${file}`, root))));

  const [canonical, published] = await Promise.all([
    readFile(new URL("app/data/claims.json", root), "utf8"),
    readOutput("data/claims.json"),
  ]);
  assert.deepEqual(JSON.parse(published), JSON.parse(canonical));
});

test("static links use the GitHub Pages base path", async () => {
  const home = await readOutput("index.html");
  assert.match(home, /href="\/ActivistDB\/antifa\/"/);
  assert.match(home, /href="\/ActivistDB\/methodology\/"/);
  assert.match(home, /href="\/ActivistDB\/data\/claims\.json"/);
});
