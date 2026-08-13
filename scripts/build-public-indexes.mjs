import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteRoot = path.join(root, "site");
const siteUrl = "https://sumimap.com";
const lastmod = "2026-08-14";

const sitemapRoutes = [
  "/",
  "/guide/",
  "/routes/",
  "/routes/battery/",
  "/routes/restroom/",
  "/routes/rain/",
  "/routes/rest/",
  "/routes/station/",
  "/routes/first-day/",
  "/routes/korean/",
  "/cities/",
  "/cities/tokyo/",
  "/cities/osaka/",
  "/cities/kyoto/",
  "/cities/fukuoka/",
  "/cities/sapporo/",
  "/cities/nagoya/",
  "/sources/",
  "/about/",
  "/editorial/",
  "/policy/",
  "/privacy/",
  "/terms/",
  "/contact/"
];

const feedRoutes = sitemapRoutes.filter((route) =>
  route === "/guide/" || route === "/routes/" || route.startsWith("/routes/") ||
  route === "/cities/" || route.startsWith("/cities/") || route === "/sources/"
);

for (const route of sitemapRoutes) {
  const file = route === "/" ? path.join(siteRoot, "index.html") : path.join(siteRoot, ...route.split("/").filter(Boolean), "index.html");
  if (!fs.existsSync(file)) throw new Error(`Missing allowlisted public page: ${route}`);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes.map((route, index) => `  <url><loc>${siteUrl}${route}</loc><lastmod>${lastmod}</lastmod><changefreq>${index === 0 ? "daily" : "monthly"}</changefreq><priority>${index === 0 ? "1.0" : route === "/sources/" ? "0.9" : "0.8"}</priority></url>`).join("\n")}
</urlset>
`;

const items = feedRoutes.map((route) => {
  const file = path.join(siteRoot, ...route.split("/").filter(Boolean), "index.html");
  const html = fs.readFileSync(file, "utf8");
  const title = decodeHtml(match(html, /<title>([^<]+)<\/title>/i)).replace(/\s+-\s+스미맵$/, "");
  const description = decodeHtml(match(html, /<meta\s+name="description"\s+content="([^"]+)"/i));
  const url = `${siteUrl}${route}`;
  return `    <item>
      <title>${xml(title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>Thu, 13 Aug 2026 15:00:00 GMT</pubDate>
      <description>${xml(description)}</description>
    </item>`;
}).join("\n");

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>스미맵 공식 생활정보 가이드</title>
    <link>${siteUrl}/</link>
    <description>일본 생활 중 필요한 시설과 안내를 공식 원문에서 확인하는 스미맵 콘텐츠 피드.</description>
    <language>ko-KR</language>
    <lastBuildDate>Thu, 13 Aug 2026 15:00:00 GMT</lastBuildDate>
${items}
  </channel>
</rss>
`;

fs.writeFileSync(path.join(siteRoot, "sitemap.xml"), sitemap, "utf8");
fs.writeFileSync(path.join(siteRoot, "feed.xml"), feed, "utf8");
console.log(`Built sitemap (${sitemapRoutes.length}) and feed (${feedRoutes.length}) from explicit allowlists.`);

function match(text, pattern) {
  const value = text.match(pattern)?.[1];
  if (!value) throw new Error(`Required metadata missing for ${pattern}`);
  return value.trim();
}

function decodeHtml(value) {
  return value.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
}

function xml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}
