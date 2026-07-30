import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

test("build produces a portable static application", async () => {
  const dist = resolve("dist");
  await access(resolve(dist, "index.html"));
  await access(resolve(dist, "preset-backgrounds/0_purple_grained.png"));
  await access(resolve(dist, "preset-backgrounds/preview/0_purple_grained.png"));
  await access(resolve(dist, "og.jpg"));
  await access(resolve(dist, "robots.txt"));
  await access(resolve(dist, "sitemap.xml"));
  const html = await readFile(resolve(dist, "index.html"), "utf8");
  const robots = await readFile(resolve(dist, "robots.txt"), "utf8");
  const sitemap = await readFile(resolve(dist, "sitemap.xml"), "utf8");
  const pageSource = await readFile(resolve("src/pages/index.astro"), "utf8");
  const siteUrl = process.env.SITE_URL;
  const publicPageUrl = siteUrl ? new URL(siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`).toString() : undefined;
  const presetBackgrounds = await readdir(resolve("public/preset-backgrounds"));
  for (const filename of presetBackgrounds.filter((name) => /\.(avif|gif|jpe?g|png|webp)$/i.test(name))) {
    assert.match(html, new RegExp(`data-preset-src="\\./preset-backgrounds/${filename}"`));
    assert.match(html, new RegExp(`src="\\./preset-backgrounds/preview/${filename}"`));
  }
  assert.match(html, /<meta property="og:title" content="Free Online Screenshot Composer for Social Media \| FrameUp">/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image">/);
  assert.match(html, /type="application\/ld\+json"/);
  assert.match(html, /href="https:\/\/www\.color4bg\.com" target="_blank" rel="noopener noreferrer">Create your own background on color4bg\.com <svg class="external-link-icon" aria-hidden="true"/);
  assert.match(html, /href="https:\/\/www\.alexisg\.net" target="_blank" rel="noopener noreferrer">alexisg/);
  assert.match(html, /href="https:\/\/github\.com\/agalbourdin\/frameup" target="_blank" rel="noopener noreferrer">View FrameUp on GitHub/);
  assert.match(html, /2400 × 1260 PX/);
  const composerSource = await readFile(resolve("src/scripts/composer.ts"), "utf8");
  assert.match(composerSource, /OUTPUT_SCALE=2/);
  assert.match(composerSource, /imageSmoothingQuality="high"/);
  assert.match(composerSource, /canvasBlob\(canvas\)/);
  assert.match(composerSource, /value\.toBlob\(blob=>blob\?resolve\(blob\):reject\(new Error\("encode"\)\),type,quality\)/);
  assert.match(composerSource, /URL\.revokeObjectURL\(url\)/);
  assert.match(composerSource, /canvas\.toDataURL\("image\/png"\)/);
  assert.match(composerSource, /frameup@2x\.png/);
  assert.match(html, /id="twitter-download-button"/);
  assert.match(html, /Download X \/ Twitter Card JPEG \(1200 × 630\)/);
  assert.match(composerSource, /canvasBlob\(twitterCardCanvas\(\),"image\/jpeg",\.95\)/);
  assert.match(composerSource, /frameup-twitter-card\.jpg/);
  assert.doesNotMatch(composerSource, /pica/);
  assert.match(robots, /User-agent: \*\nAllow: \//);
  assert.doesNotMatch(html, /document\.cookie/);
  assert.doesNotMatch(pageSource, /agalbourdin\.github\.io/);

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
