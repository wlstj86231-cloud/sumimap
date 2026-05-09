export function onRequestOptions() {
  return json({ ok: true });
}

export async function onRequestDelete({ request, env, params }) {
  const db = env.REPORTS_DB;
  if (!db) return json({ ok: false, error: "REPORTS_DB binding missing" }, 503);

  const reportId = cleanId(params.id, "");
  const clientId = cleanId(request.headers.get("X-Client-ID"), "");
  if (!reportId || !clientId) return json({ ok: false, error: "invalid request" }, 400);

  const existing = await db.prepare("SELECT client_id FROM reports WHERE id = ? AND deleted_at IS NULL")
    .bind(reportId)
    .first();
  if (!existing) return json({ ok: true, deleted: true });
  if (existing.client_id !== clientId) return json({ ok: false, error: "not owner" }, 403);

  await db.prepare("UPDATE reports SET deleted_at = ?, updated_at = ? WHERE id = ?")
    .bind(new Date().toISOString(), new Date().toISOString(), reportId)
    .run();

  return json({ ok: true, deleted: true });
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Client-ID"
    }
  });
}

function cleanId(value, fallback) {
  const id = String(value || fallback || "").replace(/[^a-zA-Z0-9:_-]/g, "").slice(0, 90);
  return id || fallback;
}
