# TalentisOS Documented Gap List

Evidence baseline: source inspection at `625b19015b15319546e9c56e8cbcde02c0339862` on 2026-09-19. These are gaps, not approval to expand scope outside the approved phase sequence.

| ID | Gap or conflict | Evidence | Impact | Approved follow-up |
| --- | --- | --- | --- | --- |
| G-001 | Resolved in Phase 01 — Vite starter surface replaced. | Controlling SHA `a2fb0a869295f0696f5318c70a820c77fe20b317`; `src/main.js` renders the TalentisOS shell and `index.html` supplies product/PWA metadata. | No workflow is claimed complete; the shell now provides an accurate foundation. | Founder approval pending. |
| G-002 | Resolved in Phase 01 — Core route visibility framework exists. | Controlling SHA `a2fb0a869295f0696f5318c70a820c77fe20b317`; hash routes expose exactly five approved Core destinations and no advanced routes. | Later routes remain hidden rather than shown as placeholders. | Founder approval pending. |
| G-003 | Resolved in Phase 01 — persistence baseline exists. | Controlling SHA `a2fb0a869295f0696f5318c70a820c77fe20b317`; IndexedDB schema v2 and [data-model baseline](Phase-01-Data-Model.md) provide `settings`, `drafts`, additive migration handling and a saved timezone. | Canonical Task and relationships remain Phase 02 work. | Founder approval pending. |
| G-004 | Resolved for the Phase 01 foundation. | `npm test` runs eight focused Node tests; no additional test package was installed. | Later domain/browser coverage remains required. | Add focused tests in each implementation phase. |
| G-005 | Resolved for the Phase 01 foundation. | Manifest, iOS PNG icons, Pages-origin registration, cache-version updates and verified offline shell passed on Mac, iPhone and iPad. | Later recovery/export verification remains Phase 08 work. | Retain the validation evidence; verify recovery in Phase 08. |
| G-006 | Temporary Pages validation is verified. | Public Pages serves generated-only artifacts from `gh-pages`; v5 was inspected on all supported validation devices. No tracked release workflow exists. | The branch is a validation aid, not an approved permanent release process. | Retain it until Phase 01 approval and the approved source/deployment decision. |
| G-007 | Resolved for the Phase 01 shell. | Shell checks passed at 390/768/1440 px; Mac, iPhone and iPad install/offline/persistence checks passed. | Later workflow accessibility evidence remains required as workflows are introduced. | Continue accessibility validation in each implementation phase and Phase 08. |
| G-008 | README describes a local-first rebuild but does not identify the starter baseline or governance records. | Root README contains only generic local development/build instructions. | It can be read as more product-ready than code evidence supports. | Keep current root README unchanged in Phase 00; reconsider an accurate project overview with product shell work in Phase 01. |

There are no detected conflicts among the three controlling product documents. The material reconciliation is between the detailed future product contract and the intentionally minimal current Vite foundation.
