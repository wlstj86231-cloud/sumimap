const CACHE_NAME = "sumimap-v69-farm-finder";
const PAGE_CACHE = "sumimap-pages-v1";
const LOCAL_ASSETS = [
  "/assets/site-20261026.css",
  "/assets/finder-2026102602.js",
  "/assets/icon.svg",
  "/manifest.webmanifest"
];
// Pages kept for weak rural signal: the last good copy is shown when offline.
const OFFLINE_PAGES = new Set(["/", "/kr/farm-waste-collection/"]);

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(LOCAL_ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME && key !== PAGE_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;
  if (url.pathname === "/api" || url.pathname.startsWith("/api/")) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok && OFFLINE_PAGES.has(url.pathname)) {
            const copy = response.clone();
            caches.open(PAGE_CACHE).then((cache) => cache.put(url.pathname, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = OFFLINE_PAGES.has(url.pathname) ? await caches.match(url.pathname, { cacheName: PAGE_CACHE }) : null;
          return cached || new Response(
            "인터넷에 연결되어 있지 않아 페이지를 불러올 수 없습니다. 연결된 뒤 다시 열어 주세요.",
            { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } }
          );
        })
    );
    return;
  }

  // Versioned, immutable files: assets and per-province finder data.
  const cacheable = url.pathname.startsWith("/assets/") || url.pathname.startsWith("/data/farm-waste/") || url.pathname === "/manifest.webmanifest";
  if (!cacheable) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      });
    })
  );
});
