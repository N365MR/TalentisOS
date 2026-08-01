# PWA and Offline Strategy

TalentisOS is local-first: the app remains useful without a network connection, and user-entered operating data is stored in IndexedDB in a later phase. The service worker caches the application shell and uses a cache-first response for previously cached GET requests.

The app must never require a remote API, cloud database, analytics script, or third-party tracker. The versioned `service-worker.js` caches the shell and `offline.html`, caches same-origin assets as they are requested, removes obsolete caches during activation, and serves an offline navigation fallback. It also supports update notification hooks and safe activation.

The manifest includes standalone display, any orientation, theme and background colors, install icons, and an Apple touch icon. The layout uses safe-area insets for iPad and mobile browser chrome.

For local inspection without a server, `index.html` detects the `file://` protocol and loads `file-app.js`, a generated IIFE bundle, plus the local stylesheet. This preserves the onboarding and Today experience when the file is opened directly. `npm run build` keeps that bundle current. Service workers are unavailable under `file://` by browser design, so offline shell caching must be verified through Vite preview or the deployed HTTPS site.
