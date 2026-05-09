const ALLOWED_VOTES = new Set(["agree", "dispute"]);

export function onRequestOptions() {
  return json({ ok: true });
}

export async function onRequestPost({ request, env, params }) {
  const db = env.REPORTS_DB;
  if (!db) return json({ ok: false, error: "REPORTS_DB binding missing" }, 503);

  const reportId = cleanId(params.id, "");
  const clientId = cleanId(request.headers.get("X-Client-ID"), "");
  const body = await readJsonBody(request);
  const vote = ALLOWED_VOTES.has(body?.vote) ? body.vote : "";
  if (!reportId || !clientId || !vote) return json({ ok: false, error: "invalid vote" }, 400);

  const report = await db.prepare("SELECT id FROM reports WHERE id = ? AND deleted_at IS NULL")
    .bind(reportId)
    .first();
  if (!report) return json({ ok: false, error: "not found" }, 404);

  const previous = await db.prepare("SELECT vote FROM report_votes WHERE report_id = ? AND client_id = ?")
    .bind(reportId, clientId)
    .first();

  if (previous?.vote !== vote) {
    const now = new Date().toISOString();
    const agreeDelta = (vote === "agree" ? 1 : 0) - (previous?.vote === "agree" ? 1 : 0);
    const disputeDelta = (vote === "dispute" ? 1 : 0) - (previous?.vote === "dispute" ? 1 : 0);
    await db.batch([
      db.prepare(`
        INSERT INTO report_votes (report_id, client_id, vote, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(report_id, client_id) DO UPDATE SET vote = excluded.vote, updated_at = excluded.updated_at
      `).bind(reportId, clientId, vote, now, now),
      db.prepare(`
        UPDATE reports
        SET agrees = MAX(0, agrees + ?),
            disputes = MAX(0, disputes + ?),
            updated_at = ?
        WHERE id = ?
      `).bind(agreeDelta, disputeDelta, now, reportId)
    ]);
  }

  const saved = await db.prepare(`
    SELECT id, place_id, tags, recency, created_at, updated_at, agrees, disputes, client_id,
           place_name, place_area, name_ko, area_ko, name_ja, area_ja, lat, lng, city, category
    FROM reports
    WHERE id = ? AND deleted_at IS NULL
  `).bind(reportId).first();

  return json({ ok: true, report: serializeReport(saved) });
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
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Client-ID"
    }
  });
}

function cleanId(value, fallback) {
  const id = String(value || fallback || "").replace(/[^a-zA-Z0-9:_-]/g, "").slice(0, 90);
  return id || fallback;
}

function parseTags(value) {
  try {
    const tags = JSON.parse(value);
    return Array.isArray(tags) ? tags : [];
  } catch {
    return [];
  }
}
