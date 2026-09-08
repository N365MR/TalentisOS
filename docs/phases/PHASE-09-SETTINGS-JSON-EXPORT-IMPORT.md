# Phase 09 — Settings, JSON Export & Import

**Result:** PASS

**Status:** APPROVED / BASELINED

**Founder approval:** confirmed 2026-09-08

**Approved implementation:** `1ae367b` — `feat: add Phase 09 settings backup and recovery`

## Outcome

Settings gives a local-first user a clear backup, restore and removal path without adding a server, account, analytics, or second task system. GitHub Pages serves only the app shell; live data remains in the current browser and device.

## Export format and compatibility

Exports use `{ format: "TalentisOS", exportVersion: 6, exportedAt, data }`. The `data` object contains every current IndexedDB store: `metadata`, `tasks`, `endOfDay`, `morningHuddles`, `roadmap`, `settings`, `kpis`, and `kpiEntries`. Records retain their stored IDs, including canonical task IDs, task subtasks/history, workflow references, carry history and KPI corrective-task links. The browser download is named `talentisos-backup-YYYYMMDD-HHmmss.json`.

Version 6 is the current format. Version 1–5 files are accepted only where their missing later stores can be unambiguously initialized as empty (and a default roadmap/metadata record created). Future or malformed versions are rejected; imports never merge.

## Validation and replacement safeguards

The file is parsed and fully validated before any write: identity, version, timestamp, complete store arrays, record shapes, unique IDs, one metadata/roadmap record, task references from EOD/Huddle/KPIs, and KPI-entry-to-KPI references. A validated preview gives export date, schema version and record counts. After explicit confirmation, all stores are replaced in one IndexedDB multi-store transaction. Validation failure means no live data is touched. The UI rerenders after success.

## Clear/reset behaviour

There is no approved sample-data mechanism, so no sample reset is exposed. “Clear all local data” has a distinct confirmation, clears all TalentisOS stores, then recreates only valid foundation metadata. The app shell, hash routing and PWA installability remain intact.

## Data integrity and evidence

Affected IndexedDB stores are the eight listed above. Canonical task identity is preserved because exports/imports store task records once and all consuming modules retain task IDs. Automated transfer tests cover malformed/foreign/future rejection, legacy normalization, reference validation, envelope metadata, summary and filename.

Delivery validation passed: `npm test` (43/43), `npm run check`, `npm run build`, and `git diff --check`. Browser Settings checks passed at desktop, iPad, and iPhone widths. The export implementation and unit coverage passed, but the local test browser did not surface a captured download event; this is recorded as a test-environment limitation, not a failed export implementation.

## Known limitation

The browser’s native install prompt is browser-controlled; Settings explains how to use the browser’s Install App/Add to Home Screen action rather than duplicating that platform UI.
