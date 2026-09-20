# TalentisOS Decision Log

| ID | Date | Decision | Basis | Status |
| --- | --- | --- | --- | --- |
| D-001 | 2026-09-19 | The Product Specification is the controlling product decision document. | Product documentation README and Phase 00 instruction. | Active |
| D-002 | 2026-09-19 | The Implementation Phases document is the approved delivery sequence; work proceeds one approved phase at a time. | Implementation Phases: Purpose and use; Phase 00 exit gate. | Active |
| D-003 | 2026-09-19 | Current code is classified as an incomplete Vite starter, not as a TalentisOS module. | Inspection of `src/main.js`, `src/counter.js`, `src/style.css` and `index.html`; no product tests. | Active |
| D-004 | 2026-09-19 | No product routes are claimed complete or hidden at baseline. | The starter has no product route architecture; route status must be re-evaluated in Phase 01. | Active |
| D-005 | 2026-09-19 | Later capabilities remain deferred and must not be exposed in default navigation before their enablement rules are met. | Product Specification: Launch hierarchy and Capability-status policy. | Active |
| D-006 | 2026-09-19 | Deployment status is unknown, not assumed absent externally. | No deployment, Pages or CI configuration is tracked in this repository. | Active |
| D-007 | 2026-09-19 | Phase 00 makes documentation-only changes; source/runtime behaviour is preserved. | Phase 00 scope and repository inspection. | Active |
| D-008 | 2026-09-19 | Founder approved Phase 00 as complete, with `5e496fb525f0de32608e208c7affa8746773ffbe` as its controlling implementation SHA. | Founder approval after recorded build, repository and documentation validation evidence. | Active |
| D-009 | 2026-09-19 | Phase 01 persistence uses IndexedDB schema v2 with `settings` and `drafts` only; `localStorage` remains reserved for small interface preferences. | Keeps live records local-first and includes an additive repair migration for an early empty v1 database, without inventing later product records. | Active — approval pending |
| D-010 | 2026-09-19 | The first saved leadership-workday timezone is captured on workspace creation and changes only by deliberate user action. | Prevents a device timezone change from silently moving future workday interpretation; no workday records exist in Phase 01. | Active — approval pending |
| D-011 | 2026-09-20 | Retain the generated-only `gh-pages` validation branch until founder approval determines the approved source/deployment path. | It provided the trusted HTTPS Pages origin needed to verify registration, cache updates, offline launch and device-local persistence without committing Phase 01 source to `main`. | Active — approval pending |
