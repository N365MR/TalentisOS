# PWA Architecture

**Status:** PROPOSED
**Authority:** Engineering implementation owner

The static application has a web manifest, SVG icons, and an application-shell service worker. The current cache is deliberately restricted to the foundation shell and contains no API, sync, or user-data cache.

Future PWA work must version cache names, delete stale named caches during activation, avoid caching mutable IndexedDB data, validate every cache reference after a Vite build, surface update behaviour clearly, and test offline installability. The manifest remains GitHub Pages-compatible; deployment must set an appropriate base path if served from a project subpath.
