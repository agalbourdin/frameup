import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

test("build produces a portable static application", async () => {
  const dist = resolve("dist");
  await access(resolve(dist, "index.html"));
  await access(resolve(dist, "preset-backgrounds/purple.png"));
  const html = await readFile(resolve(dist, "index.html"), "utf8");
  assert.match(html, /href="https:\/\/www\.alexisg\.net" target="_blank" rel="noopener noreferrer">alexisg/);
  assert.doesNotMatch(html, /document\.cookie/);
});
