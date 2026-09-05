# TalentisOS X

TalentisOS X is a private, local-first leadership operating system built with browser-native ES modules. It has no framework, build process, package manager, runtime dependency, account, or required cloud service.

## Phase 00A status

This repository contains the modular rebuild foundation: a semantic four-route app shell, initial workspace schema, module boundaries, a minimal PWA registration, and Node-native tests. Product workflows, persistence, caching, and sync are intentionally deferred to their named phases.

## Run locally

From this folder, run:

```sh
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173).

The core product is designed to keep workspace data on the device. IndexedDB/localStorage persistence, backup/restore, and optional sync are not implemented in Phase 00A.

## Verify changes

Run the dependency-free checks before publishing changes:

```sh
node --test
node --check src/main.js
node --check sw.js
git diff --check
```

The product contract and staged rebuild plan are in [docs/REBUILD_FROM_ZERO_PLAYBOOK.md](docs/REBUILD_FROM_ZERO_PLAYBOOK.md) and [docs/TALENTISOS_X_PRODUCT_REQUIREMENTS_DOCUMENT.md](docs/TALENTISOS_X_PRODUCT_REQUIREMENTS_DOCUMENT.md).
