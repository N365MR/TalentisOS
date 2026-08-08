const CACHE_NAME = 'talentisos-shell-v4';
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
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
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
  event.respondWith(
    isNavigation
      ? fetch(event.request)
          .then((response) => {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            return response;
          })
          .catch(() => caches.match(event.request).then((cached) => cached || caches.match(`${BASE_PATH}offline.html`)))
      : caches.match(event.request).then((cached) => {
          const network = fetch(event.request)
            .then((response) => {
              if (response.ok && new URL(event.request.url).origin === self.location.origin) {
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
              }
              return response;
            })
            .catch(() => cached || Response.error());
          return cached || network;
        }),
  );
});
