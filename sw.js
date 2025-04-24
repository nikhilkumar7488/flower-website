const CACHE_NAME = 'site-cache-v2';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/cart.html',
  '/dist/css/styles.min.css',
  '/dist/js/main.min.js',
];

// Install event: pre-cache resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing and caching files');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating and cleaning old caches');
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[Service Worker] Deleting cache:', name);
            return caches.delete(name);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch event: serve from cache first, then network fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log('[Service Worker] Serving from cache:', event.request.url);
        return cachedResponse;
      }
      console.log('[Service Worker] Fetching from network:', event.request.url);
      return fetch(event.request)
        .catch(() => {
          // Optional: add custom fallback logic here
          return caches.match('/index.html'); // fallback if totally offline
        });
    })
  );
});
