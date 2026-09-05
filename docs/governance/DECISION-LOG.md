# Decision Log

**Status:** PROPOSED
**Authority:** Founder

| ID | Date | Decision and rationale | Affected requirements / files | Approval |
| --- | --- | --- | --- | --- |
| DEC-0001 | 2026-09-06 | Establish TalentisOS (without the legacy “X” suffix) as the canonical product identity; it aligns the repository with the Founder’s Phase 00 brief. | REQ-CORE-001; documentation, title, manifest, package metadata | Founder confirmed via Phase 00 approval |
| DEC-0002 | 2026-09-06 | Keep Phase 00 persistence metadata-only while documenting the future versioned IndexedDB architecture. This avoids prematurely implementing domain features. | REQ-DATA-001; data docs, `src/state/` | Founder confirmed via Phase 00 approval |
| DEC-0003 | 2026-09-06 | Use canonical entities and references rather than copied task records. | REQ-TASK-001, REQ-DATA-002; data docs | Founder confirmed via Phase 00 approval |
| DEC-0004 | 2026-09-06 | Approve and baseline Phase 00 — Project Foundation, Control Centre & Engineering Baseline. | All Phase 00 requirements; phase/status records | Founder confirmed |
| DEC-0005 | 2026-09-06 | Establish Phase 01 local-first shell using IndexedDB v2, hash-based static routing and version-1 user-controlled backup envelope. Task records are canonical preparation records only; workflow modules remain deferred. | Phase 01 shell, data and PWA files | Technical implementation; Founder acceptance pending |
| DEC-0006 | 2026-09-06 | Approve and baseline Phase 01 — Application Shell, Design System & Persistence Foundation. The Founder passed offline shell, IndexedDB persistence, touch interaction and responsive visual acceptance. Phase 02 is authorised; future work must preserve Phase 01 architecture unless governed change control approves otherwise. | Phase 01 records; Phase 02 readiness | Founder confirmed |
