const CACHE_NAME = 'talentisos-shell-v7';
const BASE_PATH = new URL('./', self.registration.scope).pathname;
const APP_SHELL = [
  BASE_PATH,
  `${BASE_PATH}index.html`,
  `${BASE_PATH}offline.html`,
  `${BASE_PATH}manifest.webmanifest`,
  `${BASE_PATH}icons/icon-192.svg`,
  `${BASE_PATH}icons/icon-512.svg`,
  `${BASE_PATH}icons/apple-touch-icon.svg`,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      ),
  );
  self.clients.claim();
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const isNavigation = event.request.mode === 'navigate';
  event.respondWith((async () => {
    if (!isNavigation) {
      const cached = await caches.match(event.request);
      if (cached) return cached;
    }

    try {
      const response = await fetch(event.request);
      const destination = event.request.destination;
      const shouldCache = response.ok && new URL(event.request.url).origin === self.location.origin &&
        ['font', 'image', 'manifest', 'script', 'style'].includes(destination);
      if (shouldCache || isNavigation) {
        event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone())));
      }
      return response;
    } catch {
      const cached = await caches.match(event.request);
      return cached || (isNavigation ? caches.match(`${BASE_PATH}offline.html`) : Response.error());
    }
  })());
});
