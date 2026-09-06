# Phase 05A — GitHub Pages Production Runtime

**Status:** IMPLEMENTED — pending deployment verification and Founder approval

## Purpose

GitHub Pages is TalentisOS’s official production runtime at `https://n365mr.github.io/TalentisOS/`. It hosts only the Vite-built static application shell; it does not add a backend, account system, cloud database, analytics, or telemetry.

## Deployment

The Vite build uses `/TalentisOS/` as its production base path. Local development remains root-relative through `npm run dev`. `.github/workflows/deploy-pages.yml` runs on pushes to `main` and on manual dispatch: it installs with `npm ci`, builds with `npm run build`, uploads `dist`, and deploys with the official GitHub Pages actions.

Repository configuration still requires **Settings → Pages → Build and deployment → Source → GitHub Actions** before the first deployment can become live.

## Data and PWA boundaries

The manifest, service-worker registration, icon URLs and app-shell references remain relative to the deployed project subpath. The service worker caches static shell files only. Canonical tasks, EOD records, Morning Huddles, Today references, carry history and completion state remain untouched in browser IndexedDB and are device-specific. JSON export/import remains the user-controlled way to transfer or back up data.

## Validation

Validation includes clean install, tests, checks, production build, whitespace validation, inspection of `/TalentisOS/` paths in `dist`, and a subpath-hosted runtime check. Generated `dist/` remains ignored by Git.
