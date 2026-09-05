# Phase 02 — Canonical Task Engine, Subtasks & Workflow Reference Model

**Status:** IMPLEMENTED — AWAITING FOUNDER ACCEPTANCE

## Objective

Establish one authoritative local task record that can be referenced by future TalentisOS workflows without cloning work.

## Scope and architecture

Tasks live in the existing IndexedDB `tasks` store. Each record contains task content, operational state, embedded subtasks, workflow references and chronological history. This retains a simple, atomic local-first persistence model while ensuring every workflow points to the same `taskId`.

The task domain API in `src/state/tasks.js` owns lifecycle changes, subtask operations, workflow-reference duplicate prevention, carry-forward semantics and state history. UI code does not write task records directly.

## Business rules

- A task has a stable UUID and is the only authoritative copy.
- References are unique by workflow type, source ID and date; repeated adds are idempotent.
- Carry-forward creates a reference and increments `carryCount` only once for a destination.
- Completing and reopening update canonical state and append history. Subtask completion never auto-completes its parent.
- Deletion removes the embedded references with the task, so no orphaned references remain.
- Inbox and Anytime show open, unscheduled, non-Someday tasks. Today includes dated tasks due today or overdue; Upcoming is future-dated work. Sorting is due date then most recently updated.

## Persistence and migration

Schema version 3 adds due-date and completion-date indexes to the existing task store. The migration is additive and preserves Phase 01 metadata, settings and task records; no database reset is performed. Timestamps use ISO 8601 and dates remain date-only strings where appropriate.

## UI and testing

The Tasks route provides fast title-first capture, the eight operational views, touch-sized completion controls, contextual state toggles, subtasks and visible progress. Automated tests cover task-view derivation and subtask progress; existing schema, transfer, source integrity, build and syntax checks remain part of validation.

## Acceptance notes

Founder manual acceptance should follow Scenarios A–G in the Phase 02 brief: create a task, edit its state, add and complete subtasks, block/unblock, wait/resume, complete, reload and reopen.
