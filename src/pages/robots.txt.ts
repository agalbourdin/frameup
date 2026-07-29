export const prerender = true;

export function GET() {
  const siteUrl = import.meta.env.SITE;
  const publicRootUrl = siteUrl ? new URL(siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`) : undefined;
  const sitemapUrl = publicRootUrl ? new URL("sitemap.xml", publicRootUrl).toString() : undefined;
  const body = ["User-agent: *", "Allow: /", ...(sitemapUrl ? [`Sitemap: ${sitemapUrl}`] : [])].join("\n");

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
