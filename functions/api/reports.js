const ALLOWED_TAGS = new Set([
  "충전 가능",
  "직원 허락 필요",
  "화장실 가능",
  "화장실만 이용 애매",
  "잠깐 쉬기 좋음",
  "장시간 비추천",
  "와이파이",
  "한국어 대응",
  "응대 불편",
  "비 피하기 좋음"
]);
const ALLOWED_RECENCY = new Set(["today", "week", "month", "old"]);

export function onRequestOptions() {
  return json({ ok: true });
}

export async function onRequestGet({ env }) {
  const db = env.REPORTS_DB;
  if (!db) return json({ ok: false, error: "REPORTS_DB binding missing" }, 503);

  const { results } = await db.prepare(`
    SELECT id, place_id, tags, recency, created_at, updated_at, agrees, disputes, client_id,
           place_name, place_area, name_ko, area_ko, name_ja, area_ja, lat, lng, city, category
    FROM reports
    WHERE deleted_at IS NULL
    ORDER BY updated_at DESC
    LIMIT 200
  `).all();

  return json({ ok: true, reports: results.map(serializeReport) });
}

export async function onRequestPost({ request, env }) {
  const db = env.REPORTS_DB;
  if (!db) return json({ ok: false, error: "REPORTS_DB binding missing" }, 503);

  const clientId = cleanId(request.headers.get("X-Client-ID"), "guest");
  const body = await readJsonBody(request);
  const report = normalizeIncomingReport(body, clientId);
  if (!report) return json({ ok: false, error: "invalid report" }, 400);

  await db.prepare(`
    INSERT INTO reports (
      id, place_id, tags, recency, created_at, updated_at, agrees, disputes, client_id,
      place_name, place_area, name_ko, area_ko, name_ja, area_ja, lat, lng, city, category
    ) VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      tags = excluded.tags,
      recency = excluded.recency,
      updated_at = excluded.updated_at,
      place_name = excluded.place_name,
      place_area = excluded.place_area,
      name_ko = excluded.name_ko,
      area_ko = excluded.area_ko,
      name_ja = excluded.name_ja,
      area_ja = excluded.area_ja,
      lat = excluded.lat,
      lng = excluded.lng,
      city = excluded.city,
      category = excluded.category,
      deleted_at = NULL
  `).bind(
    report.id,
    report.placeId,
    JSON.stringify(report.tags),
    report.recency,
    report.createdAt,
    report.updatedAt,
    clientId,
    report.place.name,
    report.place.area,
    report.place.nameKo,
    report.place.areaKo,
    report.place.nameJa,
    report.place.areaJa,
    report.place.lat,
    report.place.lng,
    report.place.city,
    report.place.category
  ).run();

  const saved = await db.prepare(`
    SELECT id, place_id, tags, recency, created_at, updated_at, agrees, disputes, client_id,
           place_name, place_area, name_ko, area_ko, name_ja, area_ja, lat, lng, city, category
    FROM reports
    WHERE id = ? AND deleted_at IS NULL
  `).bind(report.id).first();

  return json({ ok: true, report: serializeReport(saved) });
}

function normalizeIncomingReport(body, clientId) {
  const place = normalizePlace(body?.place || {});
  const placeId = cleanId(body?.placeId || place?.id, "");
  const tags = Array.isArray(body?.tags) ? body.tags.filter((tag) => ALLOWED_TAGS.has(tag)).slice(0, 8) : [];
  const recency = ALLOWED_RECENCY.has(body?.recency) ? body.recency : "old";
  if (!place || !placeId || !tags.length) return null;

  const now = new Date().toISOString();
  return {
    id: cleanId(body?.id, crypto.randomUUID()),
    placeId,
    place: { ...place, id: placeId },
    tags,
    recency,
    createdAt: validIso(body?.createdAt) || now,
    updatedAt: now,
    clientId
  };
}

function normalizePlace(place) {
  const lat = Number(place?.lat);
  const lng = Number(place?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (lat < 24 || lat > 46 || lng < 122 || lng > 154) return null;
  return {
    id: cleanId(place?.id, ""),
    name: cleanText(place?.name || "제보 위치", 80),
    area: cleanText(place?.area || `${lat.toFixed(5)}, ${lng.toFixed(5)}`, 160),
    nameKo: cleanText(place?.nameKo || "", 80),
    areaKo: cleanText(place?.areaKo || "", 160),
    nameJa: cleanText(place?.nameJa || "", 80),
    areaJa: cleanText(place?.areaJa || "", 160),
    city: cleanId(place?.city, ""),
    category: cleanId(place?.category, "custom"),
    lat,
    lng
  };
}

function serializeReport(row) {
  return {
    id: row.id,
    placeId: row.place_id,
    tags: parseTags(row.tags),
    recency: row.recency,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    agrees: row.agrees || 0,
    disputes: row.disputes || 0,
    clientId: row.client_id || "",
    place: {
      id: row.place_id,
      name: row.place_name || "제보 위치",
      area: row.place_area || "",
      nameKo: row.name_ko || "",
      areaKo: row.area_ko || "",
      nameJa: row.name_ja || "",
      areaJa: row.area_ja || "",
      lat: row.lat,
      lng: row.lng,
      city: row.city || "",
      category: row.category || "custom"
    }
  };
}

async function readJsonBody(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Client-ID"
    }
  });
}

function cleanId(value, fallback) {
  const id = String(value || fallback || "").replace(/[^a-zA-Z0-9:_-]/g, "").slice(0, 90);
  return id || fallback;
}

function cleanText(value, max) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function validIso(value) {
  const text = String(value || "");
  return Number.isFinite(Date.parse(text)) ? text : "";
}

function parseTags(value) {
  try {
    const tags = JSON.parse(value);
    return Array.isArray(tags) ? tags.filter((tag) => ALLOWED_TAGS.has(tag)) : [];
  } catch {
    return [];
  }
}
