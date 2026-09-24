import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(root, "site", "data", "farm-waste-collection-sites-2025.tsv");
const sourceHash = "38714dd249fba836e8baa37d680c761086a4ad3abd9a18b94d35251e8185df65";
const outputHash = "91de4e2ba801e647e38e3f3819186b4339fa0369a2488bc56483878e4ee784ee";
const expectedRows = 9553;
const expectedUnnamed = 16;
const sourceColumns = ["시도", "시군구", "공동집하장명", "소재지"];
const outputHeader = "province\tcity\tname\taddress";

function sha256(input) {
  return createHash("sha256").update(input).digest("hex");
}

// CSV fields can contain commas, quotes, and line breaks. Reject malformed quotes
// rather than silently shifting a location into the wrong column.
function parseCsv(csv) {
  const records = [];
  let record = [];
  let field = "";
  let quoted = false;
  let closedQuote = false;
  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    if (quoted) {
      if (char === '"' && csv[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
        closedQuote = true;
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') {
      if (field || closedQuote) throw new Error(`Malformed CSV quote near character ${index}`);
      quoted = true;
    } else if (char === "," || char === "\r" || char === "\n") {
      record.push(field);
      field = "";
      closedQuote = false;
      if (char === "\r" || char === "\n") {
        if (char === "\r" && csv[index + 1] === "\n") index += 1;
        records.push(record);
        record = [];
      }
    } else {
      if (closedQuote && !/\s/u.test(char)) throw new Error(`Malformed CSV character after quote near ${index}`);
      field += char;
    }
  }
  if (quoted) throw new Error("Unclosed CSV quote");
  if (field || record.length) records.push([...record, field]);
  return records;
}

async function fromOfficialCsv(buffer) {
  assert.equal(sha256(buffer), sourceHash, "Official CSV does not match the reviewed 2025 snapshot");
  const { default: iconv } = await import("iconv-lite");
  const csv = iconv.decode(buffer, "cp949").replace(/^\uFEFF/u, "");
  assert.ok(!csv.includes("\uFFFD"), "Official CSV has undecodable CP949 bytes");
  const [header, ...data] = parseCsv(csv);
  assert.ok(header, "CSV header missing");
  const columns = sourceColumns.map((column) => header.indexOf(column));
  assert.ok(columns.every((index) => index >= 0), "Required CSV columns missing");
  assert.equal(data.length, expectedRows, "Unexpected source row count");
  const lines = data.map((record, index) => {
    assert.equal(record.length, header.length, `CSV row ${index + 2} has wrong column count`);
    const [province, city, originalName, address] = columns.map((column) => record[column].trim());
    const name = originalName || "이름 미등록";
    assert.ok(province && city && address, `CSV row ${index + 2} missing region or address`);
    for (const value of [province, city, name, address]) {
      assert.ok(!/[\t\r\n]/u.test(value), `CSV row ${index + 2} contains TSV control character`);
    }
    return [province, city, name, address].join("\t");
  });
  const output = `${outputHeader}\n${lines.join("\n")}\n`;
  assert.equal(sha256(Buffer.from(output, "utf8")), outputHash, "Converted TSV differs from the reviewed 2025 snapshot");
  return output;
}

function verifyTsv(text) {
  const normalized = text.replaceAll("\r\n", "\n");
  assert.equal(sha256(Buffer.from(normalized, "utf8")), outputHash, "Published TSV hash differs from the reviewed 2025 snapshot");
  const [header, ...data] = normalized.trimEnd().split("\n");
  assert.equal(header, outputHeader);
  assert.equal(data.length, expectedRows);
  let unnamed = 0;
  const provinceCounts = new Map();
  const distinctRows = new Set();
  for (const [index, line] of data.entries()) {
    const parts = line.split("\t");
    assert.equal(parts.length, 4, `TSV row ${index + 2} has wrong column count`);
    assert.ok(parts.every(Boolean), `TSV row ${index + 2} has an empty field`);
    if (parts[2] === "이름 미등록") unnamed += 1;
    provinceCounts.set(parts[0], (provinceCounts.get(parts[0]) || 0) + 1);
    distinctRows.add(line);
  }
  assert.equal(unnamed, expectedUnnamed);
  assert.equal(provinceCounts.size, 14);
  assert.equal([...provinceCounts.values()].reduce((sum, count) => sum + count, 0), expectedRows);
  return { rows: data.length, provinces: provinceCounts.size, unnamed, exactDuplicateExtraRows: data.length - distinctRows.size };
}

const command = process.argv[2] || "verify";
const csvPath = process.argv[3];
if (!["verify", "import"].includes(command)) {
  throw new Error("Usage: node scripts/verify-farm-waste-data.mjs verify [official.csv] | import official.csv");
}
if (command === "import" && !csvPath) throw new Error("Import requires an official CSV path");
if (command === "import") {
  const transformed = await fromOfficialCsv(await fs.readFile(csvPath));
  await fs.writeFile(outputPath, transformed, "utf8");
}
const published = (await fs.readFile(outputPath, "utf8")).replace(/^\uFEFF/u, "");
const summary = verifyTsv(published);
if (csvPath && command === "verify") {
  const transformed = await fromOfficialCsv(await fs.readFile(csvPath));
  assert.equal(published.replaceAll("\r\n", "\n"), transformed, "Published TSV differs from the official CSV conversion");
}
console.log(`Farm waste 2025 data verified: ${summary.rows} rows, ${summary.provinces} provinces, ${summary.unnamed} unnamed, ${summary.exactDuplicateExtraRows} exact duplicate extra rows.`);
