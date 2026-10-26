import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadRows, groupRegions, hasProvincePage } from "./lib/farm-data.mjs";
import { GUIDES } from "./lib/guides.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteRoot = path.join(root, "site");
const siteUrl = "https://sumimap.com";
const lastmod = "2026-10-26";
const finderRoute = "/kr/farm-waste-collection/";

const provinceRoutes = groupRegions(loadRows()).filter(hasProvincePage).map((province) => `/kr/${province.slug}/`);
const guideRoutes = GUIDES.map((guide) => guide.route);
const sitemapRoutes = [
  "/",
  finderRoute,
  "/kr/",
  ...provinceRoutes,
  ...guideRoutes,
  "/about/",
  "/sources/",
  "/editorial/",
  "/policy/",
  "/contact/",
  "/privacy/",
  "/terms/"
];
const feedRoutes = [finderRoute, ...guideRoutes, "/kr/", ...provinceRoutes];

for (const route of sitemapRoutes) {
  const file = route === "/" ? path.join(siteRoot, "index.html") : path.join(siteRoot, ...route.split("/").filter(Boolean), "index.html");
  if (!fs.existsSync(file)) throw new Error(`Missing allowlisted public page: ${route}`);
}

const priority = (route) => route === "/" ? "1.0" : route === finderRoute ? "0.9" : route.startsWith("/guide/") || route.startsWith("/kr/") ? "0.8" : "0.4";
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes.map((route) => `  <url><loc>${siteUrl}${route}</loc><lastmod>${lastmod}</lastmod><changefreq>${route === "/" || route === finderRoute ? "weekly" : "monthly"}</changefreq><priority>${priority(route)}</priority></url>`).join("\n")}
</urlset>
`;

const items = feedRoutes.map((route) => {
  const file = path.join(siteRoot, ...route.split("/").filter(Boolean), "index.html");
  const html = fs.readFileSync(file, "utf8");
  const title = decodeHtml(match(html, /<title>([^<]+)<\/title>/i)).replace(/\s+\|\s+영농폐기물 집하장 지도$/, "");
  const description = decodeHtml(match(html, /<meta\s+name="description"\s+content="([^"]+)"/i));
  const url = `${siteUrl}${route}`;
  return `    <item>
      <title>${xml(title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>Mon, 26 Oct 2026 00:00:00 GMT</pubDate>
      <description>${xml(description)}</description>
    </item>`;
}).join("\n");

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>영농폐기물 집하장 지도</title>
    <link>${siteUrl}/</link>
    <description>영농폐기물 공동집하장 주소 찾기와 폐비닐·농약 빈 용기 등 종류별 배출 방법 안내.</description>
    <language>ko-KR</language>
    <lastBuildDate>Mon, 26 Oct 2026 00:00:00 GMT</lastBuildDate>
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
