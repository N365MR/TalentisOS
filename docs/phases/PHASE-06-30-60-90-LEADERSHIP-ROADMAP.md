# Phase 06 — 30–60–90 Leadership Roadmap

**Status:** IMPLEMENTED — pending validation and Founder approval  
**Authority:** Founder

## Purpose

Provide a calm, local-first guide for a new or transitioning leader. The route presents one Next Best Action from a fixed 90-day roadmap and complements the existing daily rhythm.

## Included scope

- One local singleton roadmap record with fixed, outcome-led milestones.
- Stage 30 — Learn & Stabilise: role and operating context; stakeholders; first 1:1s; KPI and risk baseline; End of Day → Morning Huddle → Today’s Work rhythm.
- Stage 60 — Align & Improve: expectations and ownership; feedback cadence; coaching and deliberate delegation; disciplined meeting and issue routines.
- Stage 90 — Scale & Lead: standardised leadership rhythm; root-cause reduction; 90-day review and next priorities.
- Completion/reopen controls, stage and overall progress, and the first incomplete milestone as Next Best Action.

## Excluded scope and boundary

The roadmap is not a task manager. It does not create, copy, carry, alter, complete, or delete canonical tasks. It does not introduce task, carry-over, decision, issue, KPI, or meeting engines, and it does not change approved End of Day, Morning Huddle, Today’s Work, carry history, or canonical-task behaviour.

## Persistence and transfer

Schema version 7 adds the `roadmap` IndexedDB store additively. Its single `leadership-roadmap` record contains the 12 fixed milestone identifiers, stages, titles, intended outcomes, status, and completion timestamps. Existing browser data remains untouched by the upgrade.

Export version 4 includes `data.roadmap`. Imports from versions 1–3 remain supported; when roadmap data is absent a new untouched singleton is safely initialised during import.

## Validation and acceptance criteria

- The singleton, fixed milestones, progress, Next Best Action, completion/reopen behaviour, and export validation are covered by focused automated tests.
- Completion state persists across reloads and immediately updates progress and Next Best Action.
- The route is usable at desktop, iPad, and iPhone widths with semantic controls, keyboard access, 44px actions, and reduced-motion-safe styling.
- Regression checks confirm canonical tasks and daily-rhythm records are unaffected.
