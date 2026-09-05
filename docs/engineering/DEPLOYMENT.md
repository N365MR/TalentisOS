# Deployment

Vite produces the deployable `dist/` directory with `npm run build`. `dist/` is generated and ignored by Git. `public/` contains deployable root assets, including the manifest, icons, and service worker. The service worker precaches only the static foundation application shell; it has no API, runtime-data, or update-management strategy in Phase 00A.
