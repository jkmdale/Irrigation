// Service worker for 46 Holiday Drive Watering.
// Strategy: cache-first. Everything the app needs is cached on install so it
// opens offline. Bump CACHE_VERSION whenever index.html or the icons change,
// so phones pick up the new files instead of serving the old cache forever.
const CACHE_VERSION = 'v1';
const CACHE_NAME = `watering-${CACHE_VERSION}`;

// Files to cache up front. The Google Fonts CSS is included so the fonts
// still resolve offline once they have been loaded at least once.
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-512-maskable.png',
  '/icons/apple-touch-icon.png',
  'https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Figtree:wght@400;500;600;700&display=swap'
];

// Install: open the versioned cache and store every file in the list.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()) // activate the new worker straight away
  );
});

// Activate: delete any cache that does not match the current version name.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim()) // take control of open pages now
  );
});

// Fetch: serve from cache first. If it is not cached, go to the network and
// store a copy for next time (this is how the actual font files get cached).
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Only cache good responses. "opaque" covers cross-origin font files.
        if (response && (response.ok || response.type === 'opaque')) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => {
        // Offline and not cached: for page navigations fall back to the app shell.
        if (event.request.mode === 'navigate') return caches.match('/index.html');
      });
    })
  );
});
