# TalentisOS

**Your Daily Leadership Playbook.** TalentisOS is a calm, local-first leadership operating system that helps a leader prepare, align, execute, review, and improve through **End of Day → Morning Huddle → Today’s Work**.

This repository is the canonical TalentisOS repository. The approved documentation in it is the authoritative product and engineering source of truth; see [document authority](docs/governance/DOCUMENT-AUTHORITY-AND-STATUS.md).

## Current state

Phase 10 adds Leadership Conversations: private, guided praise, feedback, coaching, delegation, expectations and difficult-conversation preparation with optional canonical follow-up task links. It remains local-first, excludes HR records, and preserves Home as a read-only dashboard and every existing canonical workflow. **IMPLEMENTED — AWAITING FOUNDER APPROVAL.**

## Production runtime

The official production runtime is [GitHub Pages](https://n365mr.github.io/TalentisOS/). GitHub Actions builds the Vite production bundle and deploys static assets to the repository subpath `/TalentisOS/`; no local server, backend, authentication, or cloud database is part of production.

TalentisOS data remains local to each browser and device in IndexedDB. To move data between devices or retain a backup, use **Settings → Export** to download the JSON backup, then use **Settings → Import** on the destination device. GitHub Pages deploys only the app shell, never your task data.

## Run and verify

```sh
npm install
npm run dev
npm run build
npm test
npm run check
```

For a clean, CI-equivalent install, run `npm ci`. `npm run dev` serves the application locally; `npm run build` emits the GitHub Pages-ready production bundle to `dist/` (which is intentionally not committed).

The project uses Vite, browser-native ES modules, semantic HTML, modern CSS, IndexedDB, a web manifest, and a service worker. It has no account, backend, analytics, or required cloud service.

Start with the [project charter](docs/PROJECT-CHARTER.md), [master product definition](docs/MASTER-PRODUCT-DEFINITION.md), [phase register](docs/MASTER-PHASE-REGISTER.md), and [Phase 00 record](docs/phases/PHASE-00-PROJECT-FOUNDATION.md).
