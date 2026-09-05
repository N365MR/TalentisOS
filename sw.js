// Registration is intentionally minimal in Phase 00A. Offline caching arrives in Phase 7.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
