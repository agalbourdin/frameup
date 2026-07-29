import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

test("build produces a portable static application", async () => {
  const dist = resolve("dist");
  await access(resolve(dist, "index.html"));
  await access(resolve(dist, "preset-backgrounds/purple.png"));
  const html = await readFile(resolve(dist, "index.html"), "utf8");
  const presetBackgrounds = await readdir(resolve("public/preset-backgrounds"));
  for (const filename of presetBackgrounds.filter((name) => /\.(avif|gif|jpe?g|png|webp)$/i.test(name))) {
    assert.match(html, new RegExp(`/preset-backgrounds/${filename}`));
  }
  assert.match(html, /href="https:\/\/www\.color4bg\.com" target="_blank" rel="noopener noreferrer">Create your own on color4bg\.com/);
  assert.match(html, /href="https:\/\/www\.alexisg\.net" target="_blank" rel="noopener noreferrer">alexisg/);
  assert.doesNotMatch(html, /document\.cookie/);
});
