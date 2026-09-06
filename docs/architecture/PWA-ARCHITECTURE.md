# PWA Architecture

**Status:** PROPOSED
**Authority:** Engineering implementation owner

The static application has a web manifest, SVG icons, and an application-shell service worker. The current cache is deliberately restricted to the foundation shell and contains no API, sync, or user-data cache.

GitHub Pages is the production runtime. The Vite production build uses the `/TalentisOS/` project subpath and GitHub Actions deploys only `dist/`. The manifest, service-worker registration and application-shell cache use relative paths so they remain scoped to that project subpath. IndexedDB is never deployed or cached as a static asset; it remains local to each browser/device.

PWA work must version cache names, delete stale named caches during activation, avoid caching mutable IndexedDB data, validate every cache reference after a Vite build, surface update behaviour clearly, and test offline installability.
