# Phase 10 — Leadership Conversations

**Status:** IMPLEMENTED — pending Founder approval

## Objective and non-goals

Leadership Conversations gives a leader a compact way to prepare, hold and follow through on Praise & Recognition, Feedback, Coaching, Delegation, Expectations, and Difficult Conversations. It is not an HRIS, employee-performance system, CRM, surveillance or disciplinary-record system. The optional reference is a generic role or function; no employee profiles, ratings, health, payroll, or disciplinary data is modelled.

## Data model and migration

Schema v10 adds the `conversations` IndexedDB store with status and follow-up-date indexes. A conversation stores its type, optional role/function reference, preparation notes, outcome, discussion points, agreed action links, dates, workflow references and timestamps. The migration is additive. Existing v1–v9 databases remain valid and receive an empty store on upgrade.

## Workflow and task-link rules

The guided composer begins as `draft`, then moves through `prepared`, `held`, `follow_up_due`, and `closed`; constrained transitions preserve a legible operating flow. Every follow-up action is either an existing canonical task or a newly created canonical task. The conversation stores only task IDs and adds a `conversation` workflow reference to the canonical task. Repeated action creation for an existing agreed action returns that linked task rather than creating another. Completion and reopening are read directly from the canonical task, so all surfaces stay synchronised.

Home and Today show follow-up-due conversations as read-only action items. Morning Huddle is deliberately unchanged: its approved architecture accepts canonical task commitments, avoiding a second conversation projection or data copy.

## Export/import and privacy

Backup format v7 exports conversations alongside existing stores. Import accepts v1–v6 backups, initializes conversations to an empty collection, validates all v7 conversation records and task references before atomic replacement, and retains the local-first privacy boundary.

## Coverage and validation

Automated coverage includes record validation, all type prompt defaults, due/overdue projections, linked canonical task completion/reopen projection, and v7/legacy export-import handling. Manual browser checks remain pending Founder acceptance at desktop, iPad and iPhone widths.
