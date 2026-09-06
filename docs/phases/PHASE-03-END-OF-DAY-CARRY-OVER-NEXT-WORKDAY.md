# Phase 03 — End of Day Capture, Carry-Over & Next-Workday Engine

**Status:** IMPLEMENTED — AWAITING FOUNDER APPROVAL

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

## Deferred work

Phase 03 deliberately does not implement Morning Huddle, Today's Work, holiday calendars, full Risks, CRM/customer management, Decisions, Handovers, Continuous Improvement, cloud sync, authentication or analytics modules.
