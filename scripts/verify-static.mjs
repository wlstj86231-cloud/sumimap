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

const retiredPrefixes = ["/japan/", "/routes/", "/cities/", "/spots/"];
for (const file of htmlFiles) {
  const relative = path.relative(site, file).replaceAll(path.sep, "/");
  const html = fs.readFileSync(file, "utf8");
  for (const match of html.matchAll(/href=["'](\/[^"'#?]*)/gi)) {
    if (retiredPrefixes.some((prefix) => match[1].startsWith(prefix))) failures.push(`${relative}: links to retired route ${match[1]}`);
  }
  if (/스미맵|Sumimap(?!-)/.test(html.replace(/sumimap\.com|sumimap:last-region|wlstj86231-cloud\/sumimap/gi, ""))) failures.push(`${relative}: old brand name`);
}

const finderFile = fs.readdirSync(path.join(site, "assets")).find((name) => /^finder-\d+\.js$/.test(name));
if (!finderFile) failures.push("assets: finder script missing");
const finder = finderFile ? fs.readFileSync(path.join(site, "assets", finderFile), "utf8") : "";
for (const token of ["/api/reports", "/api/feedback", "getTrustScore", "feedbackApiUrl", "reportApiUrl"]) {
  if (finder.includes(token)) failures.push(`${finderFile}: retired runtime token ${token}`);
}
const dataDir = path.join(site, "data", "farm-waste");
const dataFiles = fs.existsSync(dataDir) ? walk(dataDir).filter((file) => file.endsWith(".json")) : [];
const dataRows = dataFiles.reduce((sum, file) => sum + JSON.parse(fs.readFileSync(file, "utf8")).rows.length, 0);
if (dataFiles.length !== 14 || dataRows !== 9553) failures.push(`finder data: expected 14 files / 9553 rows, got ${dataFiles.length} / ${dataRows}`);
const sw = fs.readFileSync(path.join(site, "sw.js"), "utf8");
for (const asset of [...sw.matchAll(/"(\/assets\/[^"]+)"/g)].map((match) => match[1])) {
  if (!fs.existsSync(path.join(site, ...asset.split("?")[0].split("/").filter(Boolean)))) failures.push(`sw.js: precached asset missing ${asset}`);
}

const notFound = fs.readFileSync(path.join(site, "404.html"), "utf8");
if (!/name=["']robots["'][^>]+noindex/i.test(notFound)) failures.push("404.html: missing noindex");
if (/rel=["']canonical["']/i.test(notFound)) failures.push("404.html: must not have canonical");
if (/adsbygoogle|pagead2\.googlesyndication\.com/i.test(notFound)) failures.push("404.html: must not load ads");

const ads = fs.readFileSync(path.join(site, "ads.txt"), "utf8").trim();
if (ads !== "google.com, pub-5877883031077615, DIRECT, f08c47fec0942fa0") failures.push("ads.txt: unexpected publisher record");
JSON.parse(fs.readFileSync(path.join(site, "manifest.webmanifest"), "utf8"));

const sitemap = fs.readFileSync(path.join(site, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
if (sitemapUrls.length !== new Set(sitemapUrls).size) failures.push("sitemap.xml: duplicate URLs");
if (sitemapUrls.some((url) => retiredPrefixes.some((prefix) => url.includes(prefix)) || url.includes("review-readiness"))) failures.push("sitemap.xml: retired URL included");

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
