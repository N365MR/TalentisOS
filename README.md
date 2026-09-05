# TalentisOS X

TalentisOS-X is a private, local-first leadership playbook built with Vite, Vanilla JavaScript, browser-native ES modules, semantic HTML, and modern CSS. It has no runtime dependency, account, or required cloud service.

## Phase 00A status

This repository contains a restrained foundation screen, metadata-only IndexedDB infrastructure, route constants for future mapping, an application-shell PWA cache, and Node-native tests. Product workflows and domain persistence are intentionally deferred to later approved phases.

## Run locally

From this folder, run:

```sh
npm install
npm run dev
```

Then open [http://localhost:4173](http://localhost:4173).

Phase 00A uses IndexedDB only for a small foundation metadata record. No workspace-domain persistence, backup/restore, or sync is implemented.

## Verify changes

Run the dependency-free checks before publishing changes:

```sh
npm run build
npm test
npm run check
```

Start with the [canonical source-of-truth](docs/governance/SOURCE-OF-TRUTH.md) and [Phase 00A record](docs/phases/PHASE-00A-BOOTSTRAP.md). Earlier audits and rebuild material remain historical context only.
