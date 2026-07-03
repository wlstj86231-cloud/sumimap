import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const siteRoot = path.join(root, "site");
const siteUrl = "https://sumimap.com";

const blockedAdPaths = new Set([
  "/",
  "/about/",
  "/editorial/",
  "/policy/",
  "/privacy/",
  "/terms/",
  "/contact/",
  "/review-readiness/"
]);

const nonContentPaths = new Set([
  ...blockedAdPaths
]);

const contentEntryPrefixes = [
  "/guide/",
  "/routes/",
  "/cities/",
  "/spots/"
];

const ignoredLinkExtensions = new Set([
  ".css",
  ".js",
  ".json",
  ".map",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".webp",
  ".ico",
  ".xml",
  ".txt",
  ".webmanifest"
]);

async function collectFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function routeFromHtmlFile(filePath) {
  const rel = path.relative(siteRoot, filePath).replaceAll(path.sep, "/");
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return `/${rel.slice(0, -"index.html".length)}`;
  return `/${rel}`;
}

function normalizeRoute(input) {
  let value = input.trim();
  if (!value || value.startsWith("#")) return null;
  if (/^(mailto|tel|javascript):/i.test(value)) return null;

  try {
    if (/^https?:\/\//i.test(value)) {
      const url = new URL(value);
      if (url.origin !== siteUrl) return null;
      value = `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return null;
  }

  if (!value.startsWith("/")) return null;

  const withoutHash = value.split("#")[0];
  const withoutQuery = withoutHash.split("?")[0];
  if (!withoutQuery || withoutQuery === "/") return "/";

  const ext = path.extname(withoutQuery).toLowerCase();
  if (ignoredLinkExtensions.has(ext)) return null;
  if (ext) return withoutQuery;
  return withoutQuery.endsWith("/") ? withoutQuery : `${withoutQuery}/`;
}

function decodeEntities(text) {
  return text
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'");
}

function matchFirst(html, regex) {
  const match = html.match(regex);
  return match ? decodeEntities(match[1].trim()) : "";
}

function extractLinks(html) {
  const links = [];
  const regex = /\bhref=["']([^"']+)["']/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const normalized = normalizeRoute(decodeEntities(match[1]));
    if (normalized) links.push(normalized);
  }
  return [...new Set(links)].sort();
}

function isVerificationPath(route) {
  return route.startsWith("/google") || /^\/[a-f0-9]{16,}\.html$/i.test(route);
}

function isContentPath(route) {
  if (isVerificationPath(route)) return false;
  if (nonContentPaths.has(route)) return false;
  return route.endsWith("/");
}

function isContentEntry(route) {
  if (!isContentPath(route)) return false;
  return contentEntryPrefixes.some((prefix) => route === prefix || route.startsWith(prefix));
}

function parseXmlLinks(xml, tagName) {
  const regex = new RegExp(`<${tagName}>\\s*([^<]+?)\\s*</${tagName}>`, "gi");
  const values = [];
  let match;
  while ((match = regex.exec(xml)) !== null) values.push(decodeEntities(match[1]));
  return values;
}

function parseFeedItemLinks(xml) {
  const itemRegex = /<item\b[\s\S]*?<\/item>/gi;
  const links = [];
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const link = matchFirst(match[0], /<link>\s*([^<]+?)\s*<\/link>/i);
    if (link) links.push(link);
  }
  return links;
}

function pathFromAbsoluteUrl(urlValue) {
  try {
    const url = new URL(urlValue);
    if (url.origin !== siteUrl) return null;
    return normalizeRoute(url.pathname);
  } catch {
    return null;
  }
}

function countParagraphs(html) {
  return (html.match(/<p\b/gi) || []).length;
}

function textLength(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .length;
}

async function main() {
  const htmlFiles = (await collectFiles(siteRoot))
    .filter((filePath) => filePath.endsWith(".html"))
    .sort();
  const htmlRoutes = new Map();

  for (const filePath of htmlFiles) {
    const route = routeFromHtmlFile(filePath);
    const html = await fs.readFile(filePath, "utf8");
    const links = extractLinks(html);
    htmlRoutes.set(route, {
      route,
      file: path.relative(root, filePath).replaceAll(path.sep, "/"),
      title: matchFirst(html, /<title>([\s\S]*?)<\/title>/i),
      description: matchFirst(html, /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i),
      canonical: matchFirst(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i),
      hasAds: /pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js|adsbygoogle/i.test(html),
      paragraphCount: countParagraphs(html),
      textLength: textLength(html),
      internalLinks: links
    });
  }

  const sitemapXml = await fs.readFile(path.join(siteRoot, "sitemap.xml"), "utf8");
  const feedXml = await fs.readFile(path.join(siteRoot, "feed.xml"), "utf8");
  const sitemapRoutes = parseXmlLinks(sitemapXml, "loc").map(pathFromAbsoluteUrl).filter(Boolean);
  const feedRoutes = parseFeedItemLinks(feedXml).map(pathFromAbsoluteUrl).filter(Boolean);

  const errors = [];
  const warnings = [];
  const htmlRouteSet = new Set(htmlRoutes.keys());
  const sitemapSet = new Set(sitemapRoutes);
  const feedSet = new Set(feedRoutes);

  for (const route of sitemapRoutes) {
    if (!htmlRouteSet.has(route)) errors.push(`sitemap route has no local HTML: ${route}`);
  }

  for (const route of feedRoutes) {
    if (!htmlRouteSet.has(route)) errors.push(`feed route has no local HTML: ${route}`);
  }

  for (const [route, page] of htmlRoutes) {
    if (isVerificationPath(route)) continue;
    if (!page.title) errors.push(`missing title: ${route}`);
    if (!page.description) errors.push(`missing meta description: ${route}`);
    if (!page.canonical) errors.push(`missing canonical: ${route}`);
    if (blockedAdPaths.has(route) && page.hasAds) errors.push(`ad script on blocked page: ${route}`);

    if (isContentPath(route) && !sitemapSet.has(route)) warnings.push(`content page missing from sitemap: ${route}`);
    if (isContentPath(route) && !feedSet.has(route)) warnings.push(`content page missing from feed: ${route}`);
    if (isContentPath(route) && !blockedAdPaths.has(route) && !page.hasAds) warnings.push(`content page without ad script: ${route}`);
    if (isContentPath(route) && page.internalLinks.length < 3) warnings.push(`content page has fewer than 3 internal links: ${route}`);
    if (isContentPath(route) && page.paragraphCount < 4) warnings.push(`content page has fewer than 4 paragraphs: ${route}`);

    for (const link of page.internalLinks) {
      if (!htmlRouteSet.has(link)) errors.push(`broken internal link from ${route} to ${link}`);
    }
  }

  const duplicateSitemap = sitemapRoutes.filter((route, index) => sitemapRoutes.indexOf(route) !== index);
  const duplicateFeed = feedRoutes.filter((route, index) => feedRoutes.indexOf(route) !== index);
  for (const route of [...new Set(duplicateSitemap)]) errors.push(`duplicate sitemap route: ${route}`);
  for (const route of [...new Set(duplicateFeed)]) errors.push(`duplicate feed route: ${route}`);

  const pages = [...htmlRoutes.values()];
  const contentPages = pages.filter((page) => isContentPath(page.route));
  const contentEntries = pages.filter((page) => isContentEntry(page.route));
  const blockedWithAds = pages.filter((page) => blockedAdPaths.has(page.route) && page.hasAds);
  const contentWithAds = contentPages.filter((page) => page.hasAds);
  const summary = {
    site: "sumimap",
    siteUrl,
    htmlPages: pages.length,
    contentPages: contentPages.length,
    contentEntryPages: contentEntries.length,
    sitemapUrls: sitemapRoutes.length,
    feedItems: feedRoutes.length,
    adAllowedContentPagesWithAds: contentWithAds.length,
    blockedPagesWithAds: blockedWithAds.length,
    errors: errors.length,
    warnings: warnings.length
  };

  if (process.argv.includes("--json")) {
    console.log(JSON.stringify({ summary, errors, warnings }, null, 2));
  } else {
    console.log(`Content inventory for ${summary.site}`);
    console.log(`- HTML pages: ${summary.htmlPages}`);
    console.log(`- Content pages: ${summary.contentPages}`);
    console.log(`- Content entry pages: ${summary.contentEntryPages}`);
    console.log(`- Sitemap URLs: ${summary.sitemapUrls}`);
    console.log(`- Feed items: ${summary.feedItems}`);
    console.log(`- Content pages with ad script: ${summary.adAllowedContentPagesWithAds}`);
    console.log(`- Blocked pages with ad script: ${summary.blockedPagesWithAds}`);
    console.log(`- Errors: ${summary.errors}`);
    console.log(`- Warnings: ${summary.warnings}`);
    if (errors.length) {
      console.log("\nErrors:");
      for (const error of errors) console.log(`  - ${error}`);
    }
    if (warnings.length) {
      console.log("\nWarnings:");
      for (const warning of warnings.slice(0, 30)) console.log(`  - ${warning}`);
      if (warnings.length > 30) console.log(`  - ... ${warnings.length - 30} more warnings`);
    }
  }

  if (errors.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
