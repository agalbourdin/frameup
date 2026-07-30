import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

test("build produces a portable static application", async () => {
  const dist = resolve("dist");
  await access(resolve(dist, "index.html"));
  await access(resolve(dist, "preset-backgrounds"));
  await access(resolve(dist, "preset-backgrounds/preview"));
  await access(resolve(dist, "robots.txt"));
  await access(resolve(dist, "sitemap.xml"));
  const html = await readFile(resolve(dist, "index.html"), "utf8");
  const robots = await readFile(resolve(dist, "robots.txt"), "utf8");
  const sitemap = await readFile(resolve(dist, "sitemap.xml"), "utf8");
  const siteUrl = process.env.SITE_URL;
  const publicPageUrl = siteUrl ? new URL(siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`).toString() : undefined;
  const presetBackgrounds = await readdir(resolve("public/preset-backgrounds"));
  const imageFiles = presetBackgrounds.filter((name) => /\.(avif|gif|jpe?g|png|webp)$/i.test(name));
  assert.ok(imageFiles.length > 0, "at least one preset background is available");
  for (const filename of imageFiles) {
    await access(resolve(dist, "preset-backgrounds", filename));
    await access(resolve(dist, "preset-backgrounds/preview", filename));
    assert.match(html, new RegExp(`data-preset-src="\\./preset-backgrounds/${filename}"`));
    assert.match(html, new RegExp(`src="\\./preset-backgrounds/preview/${filename}"`));
  }
  assert.match(html, /<!doctype html>/i);
  assert.match(html, /<main>/);
  assert.match(html, /<canvas[^>]+id="preview-canvas"/);
  assert.match(html, /<input[^>]+id="background-upload"[^>]+type="file"/);
  assert.match(html, /<input[^>]+id="screenshot-upload"[^>]+type="file"/);
  assert.match(html, /<meta name="description" content="[^"]+">/);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /<meta property="og:title" content="[^"]+">/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
  assert.match(html, /type="application\/ld\+json"/);
  assert.match(html, /id="twitter-download-button"/);
  assert.match(robots, /User-agent: \*\nAllow: \//);
  assert.doesNotMatch(html, /document\.cookie/);

  if (publicPageUrl) {
    assert.match(html, new RegExp(`<link rel="canonical" href="${publicPageUrl}">`));
    assert.match(html, new RegExp(`<meta property="og:image" content="${publicPageUrl}og.jpg">`));
    assert.match(robots, new RegExp(`Sitemap: ${publicPageUrl}sitemap.xml`));
    assert.match(sitemap, new RegExp(`<loc>${publicPageUrl}</loc>`));
  } else {
    assert.doesNotMatch(html, /rel="canonical"/);
    assert.doesNotMatch(html, /property="og:image"/);
    assert.doesNotMatch(robots, /Sitemap:/);
    assert.doesNotMatch(sitemap, /<loc>/);
  }
});
