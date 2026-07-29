export const prerender = true;

export function GET() {
  const siteUrl = import.meta.env.SITE;
  const pageUrl = siteUrl ? new URL(siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`).toString() : undefined;
  const body = pageUrl
    ? `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${pageUrl}</loc></url>\n</urlset>\n`
    : `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
