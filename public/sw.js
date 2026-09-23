// Keystone service worker — v1 offline scope (ticket 12).
//
// SCOPE BOUNDARY (read this before "fixing" it to do more): this is
// intentionally NOT a full offline-first app. Keystone is a Postgres-backed
// dynamic app; the LLM chat/dock, test-taking/grading, search, SRS review
// and highlight creation all require a live round trip to the Next.js
// server and are not meaningfully usable offline, so this worker does not
// try to fake that. What it DOES do: cache-first for static build assets
// (_next/static, icons) and stale-while-revalidate for GET requests to
// article reading pages (/articles/*, /domains/*) and their document
// payloads, so articles you've already opened once stay readable (text +
// layout) without a network connection — e.g. on a train after browsing a
// few articles at home. Anything else (POST requests, /api/*, the dock,
// tests) always goes straight to the network and is never cached.
//
// Registration is gated by FeatureFlags.pwaEnabled — see
// components/pwa/RegisterServiceWorker.tsx, which only calls
// navigator.serviceWorker.register() when that flag is true.

const CACHE_NAME = "keystone-v1";
const STATIC_CACHE = "keystone-static-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== STATIC_CACHE)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

function isArticleReadingPath(url) {
  return url.pathname.startsWith("/articles/") || url.pathname.startsWith("/domains/");
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/manifest.webmanifest"
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Never intercept non-GET requests (POST/PUT/etc — chat, highlights,
  // tests, import, ...) or anything outside our own origin.
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // API routes are always live data — never cached, never intercepted.
  if (url.pathname.startsWith("/api/")) return;

  if (isStaticAsset(url)) {
    // Cache-first: build assets are content-hashed by Next.js, safe to
    // serve straight from cache indefinitely.
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      })
    );
    return;
  }

  if (isArticleReadingPath(url)) {
    // Stale-while-revalidate: show the last-cached render instantly (works
    // offline), but always kick off a background fetch to refresh the
    // cache for next time.
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        const networkFetch = fetch(request)
          .then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached ?? networkFetch;
      })
    );
  }
});
