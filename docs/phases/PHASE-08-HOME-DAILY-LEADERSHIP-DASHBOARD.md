# Phase 08 — Home / Daily Leadership Dashboard & Next Best Action V1

**Status:** APPROVED / BASELINED — Founder approval 2026-09-08. Controlling approved implementation: `d18183ea3fea85223222d172df212ab0d6784b15` (`feat: implement Phase 08 leadership dashboard`).

## Approval and validation record

Founder approval was confirmed on 2026-09-08. Delivery validation passed: 40/40 automated tests, syntax checks, production build, seeded IndexedDB browser validation, desktop/iPad/iPhone responsive review, refresh synchronisation, no duplicate-record behaviour, and successful GitHub Pages deployment run `34230441383`.

Phase 08 is the controlling baseline for the read-only Home / Daily Leadership Dashboard and deterministic Next Best Action v1. It preserves one canonical task record, creates no dashboard-owned operational records, and requires no IndexedDB migration or JSON transfer-model change.

## Scope delivered

Home (`#daily`) is now the read-only launch point for the daily leadership rhythm. It projects canonical tasks, the current-workday End of Day record, Morning Huddle, Today aggregation, and KPI scorecard without creating, changing, carrying, completing, or duplicating any record. Opening Home does not create a Morning Huddle record.

It includes a direct Next Best Action, Daily Rhythm links, exception-only task/KPI/Huddle surfaces, Top 3 progress, and canonical completed-today momentum. Every action takes the leader to its existing source module.

## Deterministic Next Best Action order

1. Open corrective task linked to an off-track KPI.
2. Open overdue or urgent canonical task.
3. Open blocked or waiting canonical task.
4. Open current-workday Huddle commitment, then recorded risk, customer issue, or decision.
5. Incomplete current-workday Top 3 task.
6. Prepare a missing Morning Huddle, then an incomplete End of Day review.
7. Calm aligned state.

Within task categories, ordering is stable: due date, then title. The dashboard has no persistence API and no IndexedDB store, schema, migration, or export/import change.

## Status sources

- Tasks needing attention and momentum: canonical task status, due date, urgent, blocked, waiting, and completion timestamp.
- Top 3 and Today progress: Phase 05 Today aggregation using the existing workday date.
- KPI exceptions and linked corrective actions: Phase 07 scorecard snapshot and canonical task links.
- Huddle attention: current-workday Morning Huddle commitments, risks, customer issues, and decisions.
- Daily Rhythm: End of Day status, Huddle status/Top 3 IDs, and Today progress.
