# Phase 03 — End of Day Capture, Carry-Over & Next-Workday Engine

**Status:** APPROVED AND BASELINED

## Scope

Phase 03 adds the local-first End of Day operating rhythm: a compact dashboard, progressive capture sections, daily close-out records, careful carry-over, Tomorrow's Top 3, and a clean hand-off interface for a later Morning Huddle.

## Dependencies

The implementation extends the approved Phase 01 application shell and the approved Phase 02 canonical task engine. Phase 02 task identity, references, history and completion lifecycle remain authoritative.

## Architecture and data model

`src/state/end-of-day.js` is the EOD domain service. There is one IndexedDB `endOfDay` record for each `workDate`; retrieval/creation is deterministic through `getOrCreateEndOfDay`. Each record has a stable UUID, status (`not-started`, `in-progress`, `complete`), timestamps, next-workday date, canonical task IDs, ordered Top 3 IDs, and lightweight entries for risks, customer/service issues, decisions, handovers and improvements.

The database schema moves additively from version 4 to version 5. It adds only the `endOfDay` store and a unique date index, preserving task stores, subtasks, references, history, carry data and timestamps. Export format version 2 includes EOD records; version 1 imports remain accepted.

## Carry-over rules

Carry-over preserves canonical task identity. Tasks are referenced, not cloned.

Closing EOD adds an EOD reference plus a next-workday hand-off reference to the same canonical task. The task's original creation and completion history remains intact. A carry event appends existing Phase 02 movement history and increments `carryCount` only when the target reference is new. Repeated closes, reloads, reopening and repeated selections are idempotent.

## Next-workday rules

The next-workday service uses local, noon-based date semantics to avoid UTC/DST shifts. Monday–Thursday advances one calendar day; Friday, Saturday and Sunday resolve to Monday. Public holidays are intentionally deferred behind this reusable date utility.

## UX and readiness

The End of Day route presents status-aware tiles for completed, outstanding, risks, customer/service issues, blocked/waiting, decisions, handovers, Top 3 and improvements. Progressive sections avoid a monolithic form while saving draft work continuously. Completed tasks are derived from canonical `completedAt`; interactive task status remains canonical after completion from any view.

`getMorningHuddleInputs(date)` provides the completed EOD record for a target next workday, including carry-over, Top 3 and captured lightweight operational context. Morning Huddle itself is not implemented in this phase.

## Acceptance and validation

Automated coverage includes next-workday weekday/weekend/month/year boundaries, local date shape, EOD schema construction, task canonical normalization, transfer compatibility and source integrity. The repository quality commands are recorded with the implementation validation run.

Final browser acceptance was completed on 2026-09-06 at desktop, 1024 × 1366 iPad, and 390 × 844 iPhone viewports. It verified IndexedDB initialization, one EOD record per work date across navigation/reload/reopen, persisted lightweight captures, canonical completion display, idempotent carry-over for selected open tasks, Friday/Saturday/Sunday hand-off to Monday, and Top 3 ordering, limit, persistence and replacement. A final corrective validation found that a completed Top 3 task could remain counted as active. The EOD view now derives active Top 3 items from canonical open-task state while retaining historical record data; regression coverage and a cache-version update ensure the correction is tested and delivered to returning PWA clients.

## Final status

**APPROVED AND BASELINED**

## Founder approval

- Date: 2026-09-06
- Approved implementation: `de52773b3d94445a4fc72cb44e061bfa7b9076ce`

## Final validation

- Desktop acceptance: PASS
- iPad acceptance: PASS
- iPhone acceptance: PASS
- Persistence/reload: PASS
- One EOD record per date: PASS
- Canonical completion synchronisation: PASS
- Friday → Monday: PASS
- Duplicate prevention: PASS
- Console/runtime audit: PASS
- `npm test`: PASS — 20 tests
- `npm run build`: PASS
- `npm run check`: PASS
- `git diff --check`: PASS
- Lint: unavailable; no script defined

## Approved Phase 03 behaviour

1. One persistent EOD record resolves for each work date.
2. Canonical task identity is preserved across EOD and carry-over; tasks are referenced, not cloned.
3. Carry count increments only for a genuine new target workday; carries are idempotent and retain `carried-forward` movement history.
4. Monday–Thursday resolve to the next calendar workday; Friday, Saturday and Sunday resolve to Monday.
5. Tomorrow's Top 3 supports at most three active canonical open tasks; completed tasks leave active presentation while historical EOD context remains intact.
6. EOD completion and reopen use the same daily record.
7. IndexedDB version 5 adds the `endOfDay` store with unique date identity while preserving Phase 02 task data.
8. Phase 03 outputs are the approved prerequisite for Phase 04 — Morning Huddle & Alignment Engine. Phase 04 must consume the EOD service interfaces for carry-over, Top 3, lightweight operational captures, blocked/waiting state and next-workday identity rather than recreating them.

These rules are protected by the approved project governance and change-control process.

## Deferred work

Phase 03 deliberately does not implement Morning Huddle, Today's Work, holiday calendars, full Risks, CRM/customer management, Decisions, Handovers, Continuous Improvement, cloud sync, authentication or analytics modules.
