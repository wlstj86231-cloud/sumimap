const CACHE_NAME = "sumimap-v13-readability";
const LOCAL_ASSETS = [
  "/",
  "/assets/styles.css?v=20260507-readability",
  "/assets/app.js?v=20260507-readability",
  "/assets/vendor/leaflet/leaflet.css",
  "/assets/vendor/leaflet/leaflet.js",
  "/assets/vendor/leaflet/images/layers.png",
  "/assets/vendor/leaflet/images/layers-2x.png",
  "/assets/vendor/leaflet/images/marker-icon.png",
  "/assets/vendor/leaflet/images/marker-icon-2x.png",
  "/assets/vendor/leaflet/images/marker-shadow.png",
  "/assets/icon.svg",
  "/manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(LOCAL_ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() =>
      self.clients.claim()
    )
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok && (url.pathname.startsWith("/assets/") || url.pathname === "/manifest.webmanifest")) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => {
        if (event.request.mode === "navigate") return caches.match("/");
        throw new Error("offline");
      });
    })
  );
});
