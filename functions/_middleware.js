const CANONICAL_HOST = "sumimap.com";
const REDIRECT_HOSTS = new Set(["www.sumimap.com", "sumimap.pages.dev"]);

// The site used to be a Japan daily-life map. That content does not fit the
// current farm waste service and has no matching page here, so its URLs
// answer 410 Gone with a short notice instead of redirecting to unrelated pages.
const RETIRED_PREFIXES = ["/japan/", "/routes/", "/cities/", "/spots/"];
const RETIRED_PATHS = new Set([
  "/japan",
  "/routes",
  "/cities",
  "/spots",
  "/review-readiness/",
  "/fukuoka-convenience-restroom-guide/",
  "/fukuoka-rain-shelter/",
  "/fukuoka-station-charging-guide/",
  "/japan-arrival-first-hour-checklist/",
  "/japan-convenience-store-restroom/",
  "/japan-first-day-living-map/",
  "/japan-korean-resident-map/",
  "/japan-response-discomfort-signal/",
  "/japan-station-rest-spots/",
  "/kyoto-korean-support/",
  "/kyoto-mobile-battery-rental-guide/",
  "/kyoto-rainy-day-rest-guide/",
  "/kyoto-tourist-restroom-guide/",
  "/nagoya-station-living-guide/",
  "/osaka-cafe-charging-checklist/",
  "/osaka-first-day-map-reading-guide/",
  "/osaka-rain-waiting-spots/",
  "/osaka-restroom-guide/",
  "/osaka-station-restroom-route/",
  "/sapporo-winter-restroom-guide/",
  "/tokyo-charging-spots/",
  "/tokyo-first-day-korean-living-guide/",
  "/tokyo-late-night-living-spots/",
  "/tokyo-phone-charging-options/",
  "/tokyo-rain-shelter-route/",
  "/tokyo-restroom-urgent-guide/"
]);

const NO_INDEX_HEADERS = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer"
};

const RETIRED_HTML = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>종료된 안내입니다 | 영농폐기물 집하장 지도</title>
<link rel="stylesheet" href="/assets/site-2026102602.css">
</head>
<body>
<main id="main" class="wrap narrow">
<div class="page-head">
<h1>이 안내는 종료되었습니다</h1>
<p class="lead">이 주소에 있던 일본 생활 지도와 도시·상황별 안내는 2026년 10월에 서비스를 마쳤습니다. sumimap.com은 지금 한국의 영농폐기물 공동집하장 주소를 찾는 서비스로 운영됩니다.</p>
</div>
<p class="cta-row"><a class="btn" href="/kr/farm-waste-collection/">집하장 주소 찾기</a><a class="btn-line" href="/">처음으로</a></p>
<p class="small">운영: 제이 미디어(J MEDIA)</p>
</main>
</body>
</html>`;

function isRetired(pathname) {
  if (RETIRED_PATHS.has(pathname) || RETIRED_PATHS.has(`${pathname}/`)) return true;
  return RETIRED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (REDIRECT_HOSTS.has(url.hostname)) {
    url.hostname = CANONICAL_HOST;
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  if (isRetired(url.pathname)) {
    return new Response(context.request.method === "HEAD" ? null : RETIRED_HTML, {
      status: 410,
      headers: { ...NO_INDEX_HEADERS, "Content-Type": "text/html; charset=utf-8" }
    });
  }

  if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
    const body = context.request.method === "HEAD"
      ? null
      : JSON.stringify({ ok: false, error: "Not found" });

    return new Response(body, {
      status: 404,
      headers: {
        ...NO_INDEX_HEADERS,
        "Content-Type": "application/json; charset=utf-8"
      }
    });
  }

  const response = await context.next();
  if (response.status !== 404) return response;

  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(NO_INDEX_HEADERS)) {
    headers.set(name, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
