// Builds per-province JSON for the finder from the verified 2025 TSV.
// JSON is compressed by the CDN (the TSV content type is not), so a phone
// downloads only the province it needs.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DATA, loadRows, groupRegions } from "./lib/farm-data.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outRoot = path.join(root, "site", "data", "farm-waste");
const outDir = path.join(outRoot, DATA.version);

const provinces = groupRegions(loadRows());
fs.rmSync(outRoot, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

let written = 0;
for (const province of provinces) {
  const payload = {
    v: DATA.version,
    baseDate: DATA.baseDate,
    source: DATA.sourceUrl,
    province: province.name,
    rows: province.rows.map((row) => [row.city, row.area, row.name, row.address])
  };
  fs.writeFileSync(path.join(outDir, `${province.slug}.json`), `${JSON.stringify(payload)}\n`, "utf8");
  written += payload.rows.length;
}
if (written !== DATA.totalRows) throw new Error(`Wrote ${written} rows, expected ${DATA.totalRows}`);
console.log(`Built finder data: ${provinces.length} province files, ${written} rows (${DATA.version}).`);
