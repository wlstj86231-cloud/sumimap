const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Client-ID"
};

const allowedKinds = new Set(["idea", "bug", "question"]);

export function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function onRequestPost({ request, env }) {
  if (!env.REPORTS_DB) return json({ ok: false, error: "REPORTS_DB binding missing" }, 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const message = cleanText(body.message, 1200);
  if (message.length < 2) return json({ ok: false, error: "Message is too short" }, 400);

  const id = cleanId(body.id) || crypto.randomUUID();
  const kind = allowedKinds.has(body.kind) ? body.kind : "idea";
  const now = new Date().toISOString();

  await env.REPORTS_DB.prepare(`
    INSERT INTO feedback (
      id, app, kind, message, contact, language, path, user_agent, client_id, created_at, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open')
  `).bind(
    id,
    "sumimap",
    kind,
    message,
    cleanText(body.contact, 180),
    cleanText(body.language, 12),
    cleanText(body.path, 240),
    cleanText(body.userAgent, 180),
    cleanText(body.clientId || request.headers.get("X-Client-ID"), 90),
    cleanText(body.createdAt, 40) || now
  ).run();

  return json({ ok: true, id });
}

function json(payload, status = 200) {
  return Response.json(payload, { status, headers: corsHeaders });
}

function cleanText(value, max) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

function cleanId(value) {
  return String(value || "").replace(/[^a-zA-Z0-9:_-]/g, "").slice(0, 90);
}
