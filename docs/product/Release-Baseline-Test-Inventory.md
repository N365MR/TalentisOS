# TalentisOS Release-Baseline Test Inventory

Baseline commit inspected: `625b19015b15319546e9c56e8cbcde02c0339862` on 2026-09-19.

Phase 01 controlling implementation commit: `a2fb0a869295f0696f5318c70a820c77fe20b317` (`feat: establish Phase 01 app shell, PWA and persistence baseline`).

| Validation area | Command / method | Result | Evidence and limitation |
| --- | --- | --- | --- |
| Automated tests | `npm test` | Pass | Node's built-in test runner executed eight Phase 01 checks: timezone validation, Core-route allow-list, PWA assets/manifest, cache cleanup, connection probe, registration timing and v2 migration guard. |
| Source checks | `node --check` and manifest JSON parse | Pass | Active JavaScript modules, service worker and Vite config parse; `manifest.webmanifest` parses as JSON. No lint/type-check tool is installed. |
| Production build | `npm run build` | Pass | Vite 8.3.0 transformed 7 modules and produced the relative-path static shell successfully in 34 ms. |
| Manual visible-route inspection | Browser inspection | Pass | Today/Home opens by default; exactly five Core destinations are available. The five pages remain shell-only foundations, not simulated product workflows. |
| Phase 01 database bootstrap and migration inspection | Source and browser persistence check | Pass with limitation | An initial empty v1 database was safely repaired by the additive v2 migration; `settings` and `drafts` were available and a saved `Australia/Melbourne` settings record persisted through reload. |
| Phase 01 PWA asset and service-worker inspection | Production build, Pages artifact and device inspection | Pass | Manifest JSON, 192/512/180 px PNG assets, relative Pages path, registration and cache-versioned service worker pass checks. Mac, iPhone and iPad each had an active Pages-origin controller and only the current shell cache. Mac independently verified v4→v5 replacement and v4 deletion. |
| Responsive and accessibility checks | Browser inspection at 390 px, 768 px and 1440 px; device install checks | Pass | 390 px menu, 768/1440 px desktop navigation, visible keyboard focus, reduced-motion rule and no horizontal overflow passed. Mac, iPhone and iPad install, offline launch, non-colour offline status and timezone persistence passed. |

## Build execution record

## Phase 03 validation record — 2026-09-20

## Phase 04 validation record — 2026-09-21

Controlling implementation commit: `322601deda92397febc44e55df50aa2883fc4d88` (`feat: implement Phase 04 daily decision surface`).

| Validation area | Command / method | Result | Evidence and limitation |
| --- | --- | --- |
| Automated tests | `npm test` | Pass | 37 Node tests, including EOD-to-Huddle context, duplicate-safe commitment linking/resume, ordering, canonical completion identity, EOD carry/save feedback and the local Vite service-worker bypass. |
| Local Vite service-worker module bypass | `npm test`; Safari localhost revalidation | Pass | `/src/`, `/@vite/`, `/@id/`, and `/node_modules/.vite/` are network-only and excluded from the TalentisOS shell cache. Safari confirmed the current EOD module and visible feedback load without stale source. Production built-asset caching and offline-shell fallback remain covered. |
| Source checks and build | `node --check` and `npm run build` | Pass | `public/sw.js`, `src/main.js`, `src/persistence/database.js`, `src/domain/eod.js` and `src/domain/huddle.js` parse; Vite built 12 modules. |
| Manual workflow | Seeded Safari local browser workflow | Pass | Real Sunday 2026-09-20 EOD to Monday 2026-09-21 Huddle inherited carried canonical tasks, Top 3 and recognition without re-entry. Completing the linked canonical task once synchronised Huddle, Home, Today and Tasks. Carry/save feedback, EOD read-only completion, 390/768/1440 layouts, no overflow, keyboard access, reduced motion, navigation and persistence passed. |

Controlling implementation commit: `cb45dfa3045791fc489974b23cae1029d7c02327` (`feat: implement Phase 03 End of Day workflow`).

| Validation area | Command / method | Result | Evidence and limitation |
| --- | --- | --- |
| Automated tests | `npm test` | Pass | 27 Node tests passed, including EOD identity/resume, Top 3 integrity, individual/selected/all canonical carry, carry history idempotence, Friday–Sunday Monday behaviour, Quick Capture due-date regression and read-only completed EOD controls. |
| Source checks | `node --check src/main.js`, `node --check src/persistence/database.js`, `node --check src/domain/eod.js`, `git diff --check` | Pass | Active Phase 03 modules parse and no whitespace errors were found. |
| Production build | `npm run build` | Pass | Vite transformed 11 modules and emitted a Pages-compatible relative-path build. |
| Safari workflow validation | Safari at `http://127.0.0.1:5193/` | Pass | Founder-recorded final validation confirmed Quick Capture date persistence; individual, selected-subset and carry-all canonical carry/history and task-view synchronisation; EOD save/resume; completion persistence; read-only completed-EOD controls; 390/768/1440-class no-overflow checks; keyboard access; and reduced motion. |

Executed `npm test`, `npm run build`, JavaScript syntax checks and manifest JSON validation. All passed. Manual browser inspection passed at 390 px, 768 px and 1440 px, including mobile menu behaviour, Core navigation, keyboard focus, reduced-motion rule presence, no horizontal overflow and persisted timezone settings. Pages-origin clean install, automatic registration, cache update, offline launch and persisted timezone checks completed on Mac, iPhone and iPad; the Mac v4→v5 transition removed the prior cache. Phase 01 result: PASS — ready for founder approval.
