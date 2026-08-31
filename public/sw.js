/* Kisan Mitra Service Worker
 * Enables installability (PWA) + offline app-shell caching.
 * API requests (/api) are always fetched from the network (no stale market/crop data).
 */
const CACHE_VERSION = 'kisanmitra-v1';
const APP_SHELL = '/';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll([APP_SHELL]).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith('kisanmitra-') && key !== STATIC_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never intercept non-http(s) or cross-origin API calls we don't own.
  if (!url.protocol.startsWith('http')) return;

  // API + Socket.IO + external images/fonts: always network-first, fall back to cache only if offline.
  const isApi = url.pathname.startsWith('/api') || url.pathname.includes('/socket.io/');
  if (isApi) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || Response.error())
        )
    );
    return;
  }

  // Same-origin static assets: cache-first (immutable hashed files), falling back to network.
  if (url.origin === location.origin && request.method === 'GET') {
    // SPA navigation: network-first so the latest deploy is always picked up.
    if (request.mode === 'navigate') {
      event.respondWith(
        fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const copy = response.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
            }
            return response;
          })
          .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
      );
      return;
    }

    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
          }
          return response;
        });
      })
    );
    return;
  }

  // Cross-origin (Unsplash images, Google Fonts): try network, fall back to cache.
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || Response.error()))
  );
});
