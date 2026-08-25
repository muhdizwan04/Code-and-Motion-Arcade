const CACHE = "civsim-v7";
const FILES = [
  ".",
  "index.html",
  "style.css",
  "app.js",
  "manifest.webmanifest",
  "icon.svg",
  "icon-192.png",
  "icon-512.png",
  "icon-180.png",
  "../gesturegame/vendor/vision_bundle.mjs",
  "../gesturegame/vendor/hand_landmarker.task",
  "../gesturegame/vendor/wasm/vision_wasm_internal.js",
  "../gesturegame/vendor/wasm/vision_wasm_internal.wasm",
  "../gesturegame/vendor/wasm/vision_wasm_nosimd_internal.js",
  "../gesturegame/vendor/wasm/vision_wasm_nosimd_internal.wasm",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (!e.request.url.startsWith(self.location.origin)) return;
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then((res) => {
      if (res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match(e.request).then(hit => hit || caches.match("index.html")))
  );
});
