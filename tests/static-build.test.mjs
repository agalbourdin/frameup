import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

test("build produces a portable static application", async () => {
  const dist = resolve("dist");
  await access(resolve(dist, "index.html"));
  await access(resolve(dist, "preset-backgrounds/purple.png"));
  const html = await readFile(resolve(dist, "index.html"), "utf8");
  assert.match(html, /FrameUp \| Screenshot composer/);
  assert.match(html, /Background image/);
  assert.match(html, /Screenshot/);
  assert.match(html, /Download PNG/);
  assert.match(html, /Processed in your browser/);
  assert.match(html, /No uploads/);
  assert.match(html, /Nothing is stored/);
  assert.match(html, /No account or cookies/);
  assert.match(html, /href="https:\/\/alexisg\.net" target="_blank" rel="noopener noreferrer">alexisg/);
  assert.match(html, /(?:src|href)="\.\//);
  assert.doesNotMatch(html, /cloudflare|vinext|wrangler|openai|worker/i);

  assert.doesNotMatch(html, /document\.cookie/);
});
