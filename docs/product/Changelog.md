# TalentisOS Changelog

## Unreleased — 2026-09-19

### Added

- Phase 00 governance baseline: requirements index, master phase register, project status register, decision log, documented gap list, module status list and release-baseline test inventory.
- Phase 01 shell, IndexedDB schema v2, draft API, leadership-workday timezone preference, PWA assets and data-model baseline. Founder approval remains required before Phase 02.

### Changed

- Expanded the product documentation README with links to the Phase 00 governance baseline.
- Founder approved Phase 00. Its controlling implementation SHA is `5e496fb525f0de32608e208c7affa8746773ffbe`.
- Committed the Phase 01 implementation baseline as `a2fb0a869295f0696f5318c70a820c77fe20b317` (`feat: establish Phase 01 app shell, PWA and persistence baseline`).

### Verified

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
