const CACHE = "arcade-hub-v1";
const FILES = [
  ".",
  "index.html",
];

/* Each game ships its own service worker and its own cache — gesturegame and
   civsim share a 26 MB MediaPipe bundle between them. Requests under those
   directories are deliberately left alone here: whichever game has been opened
   online has registered a worker of its own to serve them, and passing them
   through keeps this cache from holding a second copy. */
const GAME_PATHS = ["civsim/", "codinggame/", "gesturegame/"]
  .map((dir) => new URL(dir, self.location).pathname);

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});

/* CacheStorage belongs to the whole origin, not to one service worker, so this
   only ever removes THIS worker's older versions. Deleting every cache that is
   not the current one would wipe the three games' offline caches. */
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k.startsWith("arcade-hub-") && k !== CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (!e.request.url.startsWith(self.location.origin)) return;
  if (e.request.method !== "GET") return;
  const path = new URL(e.request.url).pathname;
  if (GAME_PATHS.some((dir) => path.startsWith(dir))) return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(
      (hit) =>
        hit ||
        fetch(e.request).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        }).catch(() => caches.match("index.html"))
    )
  );
});
