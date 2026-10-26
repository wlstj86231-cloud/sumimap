// Shared reader for the verified 2025 farm waste collection TSV.
// The TSV itself is checked by verify-farm-waste-data.mjs; this module only
// derives display fields (full address, 읍·면·동 hint) without changing rows.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
export const tsvPath = path.join(root, "site", "data", "farm-waste-collection-sites-2025.tsv");

export const DATA = Object.freeze({
  baseDate: "2025-08-27",
  baseDateLabel: "2025년 8월 27일",
  version: "20250827",
  totalRows: 9553,
  sourceUrl: "https://www.data.go.kr/data/15106132/fileData.do",
  sourceTitle: "한국환경공단_전국 영농폐기물 공동집하장 위치_20250827",
  provider: "한국환경공단",
  portalShownDate: "2026-09-29",
  checkedAt: "2026-10-26"
});

// Slugs match the region paths Boribay already uses for the same provinces.
export const PROVINCES = Object.freeze([
  { name: "강원특별자치도", short: "강원", slug: "gangwon" },
  { name: "경기도", short: "경기", slug: "gyeonggi" },
  { name: "경상남도", short: "경남", slug: "gyeongnam" },
  { name: "경상북도", short: "경북", slug: "gyeongbuk" },
  { name: "대구광역시", short: "대구", slug: "daegu" },
  { name: "대전광역시", short: "대전", slug: "daejeon" },
  { name: "세종특별자치시", short: "세종", slug: "sejong" },
  { name: "울산광역시", short: "울산", slug: "ulsan" },
  { name: "인천광역시", short: "인천", slug: "incheon" },
  { name: "전라남도", short: "전남", slug: "jeonnam" },
  { name: "전북특별자치도", short: "전북", slug: "jeonbuk" },
  { name: "제주특별자치도", short: "제주", slug: "jeju" },
  { name: "충청남도", short: "충남", slug: "chungnam" },
  { name: "충청북도", short: "충북", slug: "chungbuk" }
]);

export const NO_AREA = "읍·면 표기 없음";
// Provinces with fewer rows are listed in full on /kr/ instead of a thin page.
export const PROVINCE_PAGE_MIN = 20;
export const hasProvincePage = (province) => province.count >= PROVINCE_PAGE_MIN;
export const provinceHref = (province) => hasProvincePage(province) ? `/kr/${province.slug}/` : `/kr/#${province.slug}`;

// Same rule the finder used before: drop an exact doubled region prefix and
// prepend region columns that the 소재지 text omits. Source rows stay intact.
export function fullAddress(province, city, raw) {
  let address = raw.replaceAll(/\s+/g, " ").trim();
  const regionPrefix = `${province} ${city} `;
  if (address.startsWith(regionPrefix + regionPrefix)) address = address.slice(regionPrefix.length);
  const missing = [province, city].filter((part) => !address.includes(part));
  return [...missing, address].join(" ");
}

const EUPMYEON = /^([가-힣]{1,5}?(?:읍|면))(?=$|[0-9]|산|[가-힣]{1,6}(?:리|길|로|동))/u;
const DONG = /^([가-힣]{1,5}?[0-9]?(?:동|가))(?=$|[0-9]|산)/u;
const BARE = /^[가-힣]{2,4}$/u;
const VILLAGE = /^[가-힣]+[0-9]*리/u;

// Reads the first 읍·면·동 written in the address. Some counties write the
// 면 name without "면" (e.g. "의성군 가음 가산리"); that bare token is kept as
// written. Rows whose address starts directly with a 리 get NO_AREA.
export function rawAreaOf(province, city, address) {
  const skip = new Set([province, ...city.split(" ")]);
  const tokens = address.split(" ").filter((token) => token && !skip.has(token));
  for (let index = 0; index < Math.min(tokens.length, 3); index += 1) {
    const token = tokens[index];
    if (/구$/u.test(token) && token.length <= 4) continue;
    const eupmyeon = token.match(EUPMYEON);
    if (eupmyeon) return eupmyeon[1];
    const dong = token.match(DONG);
    if (dong) return dong[1];
    if (BARE.test(token) && !/(리|동|로|길|읍|면|가|구)$/u.test(token) && VILLAGE.test(tokens[index + 1] || "")) return token;
    break;
  }
  const paren = address.match(/\(([가-힣]+[0-9]?(?:동|읍|면))\)/u);
  return paren ? paren[1] : "";
}

// "고단1리" -> "고단리" (행정리 number dropped). The finder search applies
// the same rule, so a village button finds every numbered 리 of that name.
// Keep in sync with loose() in site/assets/finder-*.js.
export function looseVillage(text) {
  return text.replace(/([가-힣]+리)[0-9]+리/gu, "$1").replace(/([가-힣])[0-9]+리/gu, "$1리");
}

// First 리/동 name as written in the address (e.g. "고단1리"), used as a
// search shortcut where the address has no 읍·면.
export function villageOf(province, city, address) {
  const skip = new Set([province, ...city.split(" ")]);
  const tokens = address.split(" ").filter((token) => token && !skip.has(token)).slice(0, 3);
  for (const token of tokens) {
    const match = token.match(/^([가-힣]+[0-9]*(?:리|동))(?=$|[0-9]|산|\()/u);
    if (match && !/(읍|면)$/u.test(match[1])) return match[1];
  }
  return "";
}

export function loadRows() {
  const text = fs.readFileSync(tsvPath, "utf8").replace(/^﻿/u, "").replaceAll("\r\n", "\n");
  const [header, ...lines] = text.trimEnd().split("\n");
  if (header !== "province\tcity\tname\taddress") throw new Error("Unexpected TSV header");
  if (lines.length !== DATA.totalRows) throw new Error(`Unexpected row count ${lines.length}`);
  const rows = lines.map((line, index) => {
    const [province, city, name, address] = line.split("\t");
    const full = fullAddress(province, city, address);
    return { id: index, line, province, city, name, address: full, area: rawAreaOf(province, city, full), village: villageOf(province, city, full) };
  });
  // Merge a bare token into the suffixed name when the same city also writes
  // it with 읍/면 (e.g. "점곡" + "점곡면"), so one place gets one button.
  const byCity = new Map();
  for (const row of rows) {
    const key = `${row.province}\t${row.city}`;
    if (!byCity.has(key)) byCity.set(key, new Set());
    if (row.area) byCity.get(key).add(row.area);
  }
  for (const row of rows) {
    const known = byCity.get(`${row.province}\t${row.city}`);
    if (row.area && !/(읍|면|동|가)$/u.test(row.area)) {
      const match = [`${row.area}면`, `${row.area}읍`].find((candidate) => known.has(candidate));
      if (match) row.area = match;
    }
    if (!row.area) row.area = NO_AREA;
  }
  return rows;
}

export function groupRegions(rows) {
  const provinces = PROVINCES.map((meta) => {
    const own = rows.filter((row) => row.province === meta.name);
    const cityMap = new Map();
    for (const row of own) {
      if (!cityMap.has(row.city)) cityMap.set(row.city, []);
      cityMap.get(row.city).push(row);
    }
    const cities = [...cityMap].sort(([left], [right]) => left.localeCompare(right, "ko")).map(([name, cityRows]) => {
      const areaMap = new Map();
      for (const row of cityRows) areaMap.set(row.area, (areaMap.get(row.area) || 0) + 1);
      const areas = [...areaMap].sort(([left], [right]) => {
        if (left === NO_AREA) return 1;
        if (right === NO_AREA) return -1;
        return left.localeCompare(right, "ko");
      });
      const noArea = areaMap.get(NO_AREA) || 0;
      return { name, count: cityRows.length, areas, noArea, rows: cityRows };
    });
    return { ...meta, count: own.length, cities, rows: own };
  });
  const total = provinces.reduce((sum, province) => sum + province.count, 0);
  if (total !== DATA.totalRows) throw new Error("Province mapping does not cover every row");
  return provinces;
}

// Map search query: keep the displayed address untouched, but drop notes in
// parentheses, use the 법정리 name for numbered 행정리 ("고단1리" -> "고단리")
// and split glued tokens so 지번 search has a better chance.
// Keep in sync with mapQuery() in site/assets/finder-*.js.
export function mapQuery(address) {
  return address
    .replace(/\([^)]*\)/gu, " ")
    .replace(/(읍|면)(?=[가-힣]+[0-9]*리)/gu, "$1 ")
    .replace(/([가-힣]+리)[0-9]+리/gu, "$1")
    .replace(/([가-힣])[0-9]+리(?=$|\s|산|[0-9])/gu, "$1리")
    .replace(/리(?=산?[0-9])/gu, "리 ")
    .replace(/\s+/gu, " ")
    .trim();
}
