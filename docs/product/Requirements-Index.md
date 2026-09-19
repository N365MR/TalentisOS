# TalentisOS Requirements Index

## Purpose and authority

This index reconciles the product contract with the repository at baseline commit `625b19015b15319546e9c56e8cbcde02c0339862`, inspected on 2026-09-19. The [Product Specification](TalentisOS-Product-Specification.md) remains the controlling product decision document; the [Implementation Phases](TalentisOS-Implementation-Phases.md) remain the approved build sequence.

Status meanings: **verified** means code and relevant evidence were inspected; **planned** means required but not yet implemented; **not evidenced** means no relevant implementation or test evidence exists.

| Contract area | Controlling specification section | Approved phase(s) | Baseline evidence | Status / next verification |
| --- | --- | --- | --- | --- |
| Product scope, local-first and exclusions | Product definition; Foundational decisions; Explicit exclusions | 00–14 | Vite starter has no product-domain implementation. | Planned; confirm each feature against scope before implementation. |
| New Leader Core and progressive disclosure | New Leader Core; Launch hierarchy; Capability-status policy | 01–08 | `src/main.js` exposes only Vite starter content, not product navigation. | Not evidenced; Phase 01 establishes shell and route visibility. |
| Canonical data and relationships | Implementation contract: Canonical data dictionary and relationships | 01–05, 09–13 | No data-model document, IndexedDB code, record schema or relationship tests exist. | Planned; Phase 01 documents schema foundation, Phase 02 establishes Task. |
| Daily loop: EOD, Huddle, Today/Home | Required PWA capabilities 1–6; Acceptance scenarios | 02–04 | No task, EOD, Huddle, Home or workday code exists. | Not evidenced; validate end-to-end in Phases 02–04. |
| Core guidance: Start Here, First 7 Days, roadmap, conversations, weekly review | New Leader Core; Required PWA capabilities 7 and 11 | 06–08 | No related routes, content or tests exist. | Planned; validate in Phases 06–08. |
| Needs attention and operational controls | Required PWA capabilities 9 and 12 | 05, 09–10 | No risk, blocker, decision, handover, KPI, issue or meeting code exists. | Planned; validate typed references in relevant phase. |
| Reusable systems and Training 360 | Required PWA capabilities 10, 13 and 14; Training 360 privacy clarification | 09–14 | No related code or privacy controls exist. | Deferred; remain hidden until their approved phase and enablement rule. |
| Engineering, accessibility, PWA and recovery | Engineering and quality requirements; PWA resilience; release readiness gates | 01, 08 | Vite build tooling exists; no manifest, service worker, persistence, accessibility test suite, import/export or release record exists. | Partially evidenced only for build; Phase 01 and 08 must add and validate requirements. |
| Acceptance and release evidence | Acceptance scenarios; Delivery and quality gate; release readiness gates | Every phase, especially 08 | No automated test framework or test scripts are defined. | Not evidenced; add focused executable scenarios in relevant phases. |

## Traceability records

- Current module evidence: [Module Status List](Module-Status-List.md)
- Current gaps and required follow-up: [Documented Gap List](Documented-Gap-List.md)
- Available validation evidence: [Release-Baseline Test Inventory](Release-Baseline-Test-Inventory.md)
- Phase ownership and sequencing: [Master Phase Register](Master-Phase-Register.md)

No item in this index establishes feature completion. Completion requires code inspection plus relevant automated and manual evidence recorded for its phase.
