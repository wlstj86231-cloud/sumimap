const CANONICAL_HOST = "sumimap.com";
const REDIRECT_HOSTS = new Set(["www.sumimap.com", "sumimap.pages.dev"]);

// Keep retired public URLs here so exact redirects remain auditable.
const LEGACY_REDIRECTS = new Map([
  ["/review-readiness/", "/about/"],
  ["/routes/convenience/", "/routes/restroom/"],
  ["/routes/late-night/", "/routes/first-day/"],
  ["/routes/response/", "/editorial/"],
  ["/spots/", "/cities/"],
  ["/fukuoka-convenience-restroom-guide/", "/routes/restroom/"],
  ["/fukuoka-rain-shelter/", "/routes/rain/"],
  ["/fukuoka-station-charging-guide/", "/routes/battery/"],
  ["/japan-arrival-first-hour-checklist/", "/routes/first-day/"],
  ["/japan-convenience-store-restroom/", "/routes/restroom/"],
  ["/japan-first-day-living-map/", "/routes/first-day/"],
  ["/japan-korean-resident-map/", "/routes/korean/"],
  ["/japan-response-discomfort-signal/", "/editorial/"],
  ["/japan-station-rest-spots/", "/routes/station/"],
  ["/kyoto-korean-support/", "/routes/korean/"],
  ["/kyoto-mobile-battery-rental-guide/", "/routes/battery/"],
  ["/kyoto-rainy-day-rest-guide/", "/routes/rain/"],
  ["/kyoto-tourist-restroom-guide/", "/routes/restroom/"],
  ["/nagoya-station-living-guide/", "/cities/nagoya/"],
  ["/osaka-cafe-charging-checklist/", "/routes/battery/"],
  ["/osaka-first-day-map-reading-guide/", "/routes/first-day/"],
  ["/osaka-rain-waiting-spots/", "/routes/rain/"],
  ["/osaka-restroom-guide/", "/routes/restroom/"],
  ["/osaka-station-restroom-route/", "/routes/restroom/"],
  ["/sapporo-winter-restroom-guide/", "/cities/sapporo/"],
  ["/tokyo-charging-spots/", "/routes/battery/"],
  ["/tokyo-first-day-korean-living-guide/", "/routes/first-day/"],
  ["/tokyo-late-night-living-spots/", "/routes/first-day/"],
  ["/tokyo-phone-charging-options/", "/routes/battery/"],
  ["/tokyo-rain-shelter-route/", "/routes/rain/"],
  ["/tokyo-restroom-urgent-guide/", "/routes/restroom/"],
  ["/spots/tokyo/shinjuku-station-restroom-002/", "/cities/tokyo/"],
  ["/spots/tokyo/shibuya-cafe-charging-002/", "/cities/tokyo/"],
  ["/spots/tokyo/ueno-rain-shelter-001/", "/cities/tokyo/"],
  ["/spots/tokyo/shinjuku-cafe-charging-001/", "/cities/tokyo/"],
  ["/spots/osaka/umeda-restroom-002/", "/cities/osaka/"],
  ["/spots/osaka/namba-charging-001/", "/cities/osaka/"],
  ["/spots/osaka/tennoji-rain-shelter-002/", "/cities/osaka/"],
  ["/spots/osaka/tennoji-restroom-001/", "/cities/osaka/"],
  ["/spots/kyoto/gion-restroom-001/", "/cities/kyoto/"],
  ["/spots/kyoto/kyoto-station-charging-001/", "/cities/kyoto/"],
  ["/spots/kyoto/station-rest-001/", "/cities/kyoto/"],
  ["/spots/fukuoka/hakata-charging-001/", "/cities/fukuoka/"],
  ["/spots/fukuoka/hakata-restroom-001/", "/cities/fukuoka/"],
  ["/spots/fukuoka/tenjin-rain-shelter-001/", "/cities/fukuoka/"],
  ["/spots/sapporo/sapporo-station-winter-restroom-001/", "/cities/sapporo/"]
]);

const NO_INDEX_HEADERS = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer"
};

export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (REDIRECT_HOSTS.has(url.hostname)) {
    url.hostname = CANONICAL_HOST;
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  const legacyTarget = LEGACY_REDIRECTS.get(url.pathname)
    || (!url.pathname.endsWith("/") ? LEGACY_REDIRECTS.get(`${url.pathname}/`) : null);
  if (legacyTarget) {
    const redirectUrl = new URL(legacyTarget, `https://${CANONICAL_HOST}`);
    redirectUrl.search = url.search;
    return Response.redirect(redirectUrl.toString(), 301);
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
