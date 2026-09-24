# TalentisOS Changelog

## Unreleased — 2026-09-19

### Added

- Phase 06 Start Here, First 7 Days and current Days 1–30 roadmap: additive IndexedDB v8 orientation record, local drafts, privacy-safe observation validation, contextual Today entry points and explicitly optional canonical task creation.
- Phase 06 data model and acceptance scenarios.
- Phase 05 implementation: IndexedDB v7 structured Risk, Decision and Handover stores, lifecycle validation, atomic canonical task-reference repair, a contextual Needs attention route, and Home/EOD/Huddle/Today exception retrieval.
- Phase 04 Morning Huddle, Home and Today's Work: additive IndexedDB v5 Huddle references, live prior-EOD carry/Top 3/recognition context, and canonical task completion across daily views.
- Phase 04 data model and acceptance scenarios.
- Phase 03 End of Day workflow: additive IndexedDB v4 `eods` store, resumable daily closeout, canonical task completion/archive, duplicate-safe carry-forward and concise Top 3/recognition/lesson references.
- Phase 03 EOD data model and acceptance scenarios, with focused unit coverage for EOD identity/resume, Top 3 limits, carry integrity/idempotence, same-record completion and Friday–Sunday Monday handling.
- Phase 02 canonical task engine: IndexedDB schema v3 task store, validated stable IDs, workday utility, Quick Capture, task views, detail editing, completion, archive/restore and atomic task-reference repair.
- Phase 02 data dictionary, relationship map, acceptance scenarios and 15 focused automated tests.
- Phase 00 governance baseline: requirements index, master phase register, project status register, decision log, documented gap list, module status list and release-baseline test inventory.
- Phase 01 shell, IndexedDB schema v2, draft API, leadership-workday timezone preference, PWA assets and data-model baseline. Founder approval remains required before Phase 02.

### Changed

- Expanded the product documentation README with links to the Phase 00 governance baseline.
- Founder approved Phase 00. Its controlling implementation SHA is `5e496fb525f0de32608e208c7affa8746773ffbe`.
- Committed the Phase 01 implementation baseline as `a2fb0a869295f0696f5318c70a820c77fe20b317` (`feat: establish Phase 01 app shell, PWA and persistence baseline`).

### Verified

- Phase 06 Start Here, First 7 Days and current Days 1–30 roadmap passed 61 automated tests, production build and diff check. Safari evidence covered first-run completion in 1 minute 10 seconds, safe persistence/privacy rejection, draft/skip, optional canonical tasks, 390/768/1440 layouts, keyboard focus, no overflow and normal-origin console cleanliness. The unavailable local reduced-motion toggle is covered by a focused automated regression.
- Phase 05 controlling implementation `d36ebec1df0f6e25bde9896a75b548246d0e0158` (`feat: implement Phase 05 needs-attention workflows`) passed Risk, Decision and Handover lifecycle/history validation; canonical task link/replace/unlink integrity; seeded daily-loop retrieval through Home, EOD, Huddle, Today and Tasks; 390/768/1440 responsive checks; keyboard focus; reduced motion; and no red console errors. Founder approved the phase on 2026-09-23.
- Phase 04 implementation `322601deda92397febc44e55df50aa2883fc4d88` (`feat: implement Phase 04 daily decision surface`) passed final seeded Safari validation across the real Sunday 2026-09-20 EOD to Monday 2026-09-21 Huddle transition: canonical carry-over, Top 3 and recognition loaded without re-entry; Home derived the next best action, Today's Work used the approved attention order, and one completion synchronised across Huddle, Home, Today and Tasks. Carry/save feedback, completed-EOD read-only behavior, localhost Vite `/src` and HMR cache bypass, and 390/768/1440 accessibility checks passed. Phase 04 is ready for founder approval.
- Phase 03 controlling implementation `cb45dfa3045791fc489974b23cae1029d7c02327` (`feat: implement Phase 03 End of Day workflow`) passed final Safari validation: selected Quick Capture due dates; individual, selected-subset and carry-all same-task EOD carry/history; Top 3/recognition/lesson resume; completed-EOD read-only state; 390/768/1440-class no-overflow; keyboard access; and reduced motion. Phase 03 is ready for founder approval.
- Phase 02 implementation commit `1afc7229294f0ff0f44bf930b4367ca2d1fba13f`: canonical tasks/IndexedDB v3, Today/Tasks Quick Capture, edit/complete/archive/restore, workday/date utility, typed references and atomic permanent-delete repair passed. Final browser deletion validation confirmed the linked title, stable ID and `depends-on` relationship before deletion; Target removal, Linked reference repair and Unrelated preservation passed. Responsive 390 px/768 px/1440 px, keyboard/reduced-motion, 15/15 tests and build passed. Phase 02 is PASS — ready for founder approval.
- Documented clean pre-change working tree, branch/HEAD, locally available `origin/main` parity, package scripts, visible starter surface and absence of tracked test, data-model and deployment configuration.
- Phase 01: eight focused Node tests, JavaScript syntax checks, production build, persisted settings at schema v2, Core navigation and 390 px/768 px/1440 px shell checks. Pages-origin clean install, automatic registration, cache update, offline launch and persistence passed on Mac, iPhone and iPad. The Mac independently completed the v4-to-v5 cache transition with v4 removal and `Australia/Hobart` persistence.
- Phase 01 result: PASS — ready for founder approval.

### Not changed

- No packages were installed. The temporary generated-only `gh-pages` validation branch remains separate from the committed Phase 01 source and must be retained until the post-approval deployment decision.

## Governance baseline approval — 2026-09-19

### Changed

- Recorded the approved and complete Phase 00 status, controlling implementation SHA and completed validation evidence in the phase and project registers, decision log and changelog.

### Not changed

- No application source, runtime behaviour, dependency, deployment or GitHub Pages configuration was changed.
