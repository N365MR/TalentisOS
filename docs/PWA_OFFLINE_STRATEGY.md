# PWA and Offline Strategy

TalentisOS is local-first: the app remains useful without a network connection, and user-entered operating data is stored in IndexedDB in a later phase. The service worker caches the application shell and uses a cache-first response for previously cached GET requests.

The app must never require a remote API, cloud database, analytics script, or third-party tracker. Service-worker cache names must be versioned and old caches removed deliberately during upgrades. Offline failures should be recoverable and must not erase local data.
