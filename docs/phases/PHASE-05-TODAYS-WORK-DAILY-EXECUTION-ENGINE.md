# Phase 05 — Today’s Work & Daily Execution Engine

**Status:** IMPLEMENTED — pending validation and Founder approval

Today’s Work is TalentisOS’s Execute-stage surface. It aggregates canonical tasks for the current local workday without creating task copies or independently changing carry-over state.

## Behaviour

The deterministic, side-effect-free aggregation includes open canonical tasks that are Top 3, Morning Huddle commitments, due today, overdue, carried to the current workday, urgent, blocked, waiting, explicitly referenced for Today, or categorised as a decision/follow-up. One task is de-duplicated by its canonical identifier and may show several concise contextual labels.

Top 3 preserves Morning Huddle ordering. Needs Attention contains open exception work, and Today contains the other actionable work. Completed Today is based only on the canonical `completedAt` date. Daily progress counts each relevant canonical task once.

## References and persistence

Add to Today writes one idempotent `today` workflow reference to the existing canonical task. Quick capture creates one normal canonical task and then adds that reference. Neither path creates EOD, Huddle, or carry-over records. Existing IndexedDB task persistence is used; no schema migration is needed.

Completion and reopening call the approved canonical task service, so state remains synchronised in Tasks, End of Day, Morning Huddle, and Today’s Work. Today aggregation and rendering never modify carry count or carry history.

## Relationship to the daily rhythm

End of Day remains authoritative for carry-forward; Morning Huddle remains the alignment layer; Today’s Work consumes their outputs for execution. No separate task manager, carry engine, decision module, or external service is introduced.

## Validation and deferred scope

Automated coverage verifies multi-context de-duplication, reason labels, completion-date handling, unique progress, and side-effect-free carry consumption. The existing task, EOD, Huddle, persistence, and source-integrity tests remain part of regression validation. Advanced decision management, notifications, scheduling, collaboration, analytics, and planning tools remain deferred.
