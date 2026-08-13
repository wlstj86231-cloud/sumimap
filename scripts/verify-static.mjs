import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const site = path.join(root, "site");
const failures = [];

const htmlFiles = walk(site).filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const relative = path.relative(site, file).replaceAll(path.sep, "/");
  const html = fs.readFileSync(file, "utf8");
  if (html.includes("\uFFFD")) failures.push(`${relative}: replacement character`);
  if (/^google[a-f0-9]+\.html$/i.test(relative)) continue;
  if ((html.match(/<html\b/gi) || []).length !== 1 || (html.match(/<\/html>/gi) || []).length !== 1) failures.push(`${relative}: html tag imbalance`);
  if ((html.match(/<body\b/gi) || []).length !== 1 || (html.match(/<\/body>/gi) || []).length !== 1) failures.push(`${relative}: body tag imbalance`);
  const jsonLd = [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const match of jsonLd) {
    try { JSON.parse(match[1]); } catch (error) { failures.push(`${relative}: invalid JSON-LD (${error.message})`); }
  }
  for (const match of html.matchAll(/(?:href|src)=["'](\/[^"'#?]+)(?:[?#][^"']*)?["']/gi)) {
    const urlPath = match[1];
    if (urlPath === "/") continue;
    const extension = path.extname(urlPath);
    const target = extension ? path.join(site, ...urlPath.split("/").filter(Boolean)) : path.join(site, ...urlPath.split("/").filter(Boolean), "index.html");
    if (!fs.existsSync(target)) failures.push(`${relative}: missing internal target ${urlPath}`);
  }
}

const app = fs.readFileSync(path.join(site, "assets", "app.js"), "utf8");
for (const token of ["/api/reports", "/api/feedback", "getTrustScore", "feedbackApiUrl", "reportApiUrl"]) {
  if (app.includes(token)) failures.push(`app.js: retired runtime token ${token}`);
}

const notFound = fs.readFileSync(path.join(site, "404.html"), "utf8");
if (!/name=["']robots["'][^>]+noindex/i.test(notFound)) failures.push("404.html: missing noindex");
if (/rel=["']canonical["']/i.test(notFound)) failures.push("404.html: must not have canonical");
if (/adsbygoogle|pagead2\.googlesyndication\.com/i.test(notFound)) failures.push("404.html: must not load ads");

const ads = fs.readFileSync(path.join(site, "ads.txt"), "utf8").trim();
if (ads !== "google.com, pub-7217591196020054, DIRECT, f08c47fec0942fa0") failures.push("ads.txt: unexpected publisher record");
JSON.parse(fs.readFileSync(path.join(site, "manifest.webmanifest"), "utf8"));

const sitemap = fs.readFileSync(path.join(site, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (sitemapUrls.length !== new Set(sitemapUrls).size) failures.push("sitemap.xml: duplicate URLs");
if (sitemapUrls.some((url) => url.includes("/spots/") || url.includes("review-readiness"))) failures.push("sitemap.xml: retired URL included");

if (failures.length) {
  console.error(`Static verification failed (${failures.length})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Static verification passed: ${htmlFiles.length} HTML files, ${sitemapUrls.length} sitemap URLs.`);

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
