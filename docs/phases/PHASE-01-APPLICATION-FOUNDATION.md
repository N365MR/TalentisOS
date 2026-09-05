# Phase 01 — Application Shell, Design System & Persistence Foundation

**Status:** APPROVED / BASELINED
**Authority:** Founder; engineering implementation owner

**Founder approval:** Confirmed 2026-09-06
**Controlling implementation baseline:** `d54da6f999994f3e19536c3ce8701729e76a371f`

Phase 01 delivers a responsive daily-shell navigation, centralised design tokens and reusable surface/action/empty-state primitives. The daily view presents End of Day → Morning Huddle → Today’s Work; other destinations intentionally render bounded placeholders.

## Persistence and portability

`TalentisOS` IndexedDB is version 2. It has `metadata`, `tasks`, and `settings`; task records use immutable UUIDs where available and ISO-8601 `createdAt`/`updatedAt` timestamps. Version 2 is additive from the metadata-only version 1 database. The repository layer provides initialise, read, list, create, update, delete and transaction-backed replacement operations.

Exports are versioned JSON envelopes. Imports treat files as untrusted, validate before writing, and require explicit confirmation before replacing Phase 01 tasks/settings. No server, analytics, account, or sensitive people-data model is introduced.

## PWA and limitations

The manifest, icons, service-worker registration and a versioned same-origin application-shell cache are present. The service worker caches loaded same-origin shell resources conservatively. Founder human validation passed for offline application-shell reload after cache warm-up.

## Acceptance evidence

Automated validation covers schema/task/export validation, route/shell source integrity and persistence API presence. Founder human acceptance passed for IndexedDB CRUD persistence across refresh/relaunch, touch-device navigation and interaction, and final responsive visual acceptance. Future phases preserve this foundation unless changed through approved governance and change control.
