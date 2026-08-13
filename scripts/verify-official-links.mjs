import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "site", "sources", "index.html"), "utf8");
const urls = [...new Set([...html.matchAll(/href=["'](https?:\/\/[^"']+)["']/g)].map((match) => match[1]))];
const failures = [];
let cursor = 0;

await Promise.all(Array.from({ length: Math.min(6, urls.length) }, async () => {
  while (cursor < urls.length) {
    const url = urls[cursor];
    cursor += 1;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(url, {
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": "Sumimap-Link-Check/1.0 (+https://sumimap.com/sources/)" }
      });
      if (response.status < 200 || response.status >= 400) failures.push(`${response.status} ${url}`);
      await response.body?.cancel();
    } catch (error) {
      failures.push(`${error.name}: ${url}`);
    } finally {
      clearTimeout(timeout);
    }
  }
}));

if (failures.length) {
  console.error(`Official link verification failed (${failures.length}/${urls.length})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Official link verification passed: ${urls.length} external source and correction URLs.`);
