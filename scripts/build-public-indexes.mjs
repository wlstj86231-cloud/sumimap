import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteRoot = path.join(root, "site");
const siteUrl = "https://sumimap.com";
const lastmod = "2026-08-14";
const farmFinderRoute = "/kr/farm-waste-collection/";
const farmHubRoute = "/kr/";
const farmFinderLastmod = "2026-10-15";
const farmHubLastmod = "2026-09-24";
const agricultureHomeLastmod = "2026-09-27";
const updatedRoutes = new Set(["/", "/about/", "/sources/", "/editorial/", "/japan/", "/japan/about/", "/japan/editorial/"]);
const evidenceUpdatedRoutes = new Set(["/about/", "/sources/", "/editorial/"]);

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
  "/contact/",
  "/japan/",
  "/japan/about/",
  "/japan/editorial/",
  farmHubRoute,
  farmFinderRoute
];

const feedRoutes = sitemapRoutes.filter((route) =>
  route === "/guide/" || route === "/routes/" || route.startsWith("/routes/") ||
  route === "/cities/" || route.startsWith("/cities/") || route === "/sources/" || route === farmHubRoute || route === farmFinderRoute
);

for (const route of sitemapRoutes) {
  const file = route === "/" ? path.join(siteRoot, "index.html") : path.join(siteRoot, ...route.split("/").filter(Boolean), "index.html");
  if (!fs.existsSync(file)) throw new Error(`Missing allowlisted public page: ${route}`);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes.map((route, index) => `  <url><loc>${siteUrl}${route}</loc><lastmod>${route === farmFinderRoute ? farmFinderLastmod : route === farmHubRoute ? farmHubLastmod : route === "/about/" ? "2026-10-26" : evidenceUpdatedRoutes.has(route) ? "2026-10-15" : updatedRoutes.has(route) ? agricultureHomeLastmod : lastmod}</lastmod><changefreq>${index === 0 ? "weekly" : "monthly"}</changefreq><priority>${index === 0 ? "1.0" : route === farmFinderRoute ? "0.9" : "0.8"}</priority></url>`).join("\n")}
</urlset>
`;

const items = feedRoutes.map((route) => {
  const file = path.join(siteRoot, ...route.split("/").filter(Boolean), "index.html");
  const html = fs.readFileSync(file, "utf8");
  const title = decodeHtml(match(html, /<title>([^<]+)<\/title>/i)).replace(/\s+-\s+영농폐기물 집하장 지도$/, "");
  const description = decodeHtml(match(html, /<meta\s+name="description"\s+content="([^"]+)"/i));
  const url = `${siteUrl}${route}`;
  return `    <item>
      <title>${xml(title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${route === farmFinderRoute || route === farmHubRoute ? "Wed, 23 Sep 2026 15:00:00 GMT" : "Thu, 13 Aug 2026 15:00:00 GMT"}</pubDate>
      <description>${xml(description)}</description>
    </item>`;
}).join("\n");

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>영농폐기물 집하장 지도 - 농촌 공공정보와 이전 생활 가이드</title>
    <link>${siteUrl}/</link>
    <description>한국 농촌 공공주소 자료와 이전 일본 생활 안내의 원문 확인 방법을 다루는 영농폐기물 집하장 지도 자료 피드.</description>
    <language>ko-KR</language>
    <lastBuildDate>Wed, 14 Oct 2026 15:00:00 GMT</lastBuildDate>
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
