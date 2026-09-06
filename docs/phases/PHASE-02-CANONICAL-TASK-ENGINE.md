# Phase 02 — Canonical Task Engine, Subtasks & Workflow Reference Model

**Status:** IMPLEMENTED — AWAITING FOUNDER ACCEPTANCE

## Launch recovery

Founder reported that the application would not open after the initial Phase 02 implementation. The startup renderer awaited `listTasks()` before creating the application shell; a rejected IndexedDB task read could therefore prevent every route from rendering. The recovery catches storage initialisation and task-read failures, logs the original error, renders the shell with an unobtrusive non-destructive notice, and preserves the existing database.

Phase 01 records are now normalised on read rather than migrated destructively. Missing Phase 02 arrays and optional fields receive safe in-memory defaults, preserving the original task ID and stored data. Regression coverage verifies legacy record rendering and the guarded startup read path. Browser validation confirmed shell launch, Tasks navigation, task creation and persistence after reload without console errors.

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

Schema version 4 adds a priority index after version 3 introduced due-date and completion-date indexes. The migration is additive and preserves Phase 01 metadata, settings and task records; no database reset is performed. Missing optional Phase 02 fields, including carry history, are normalised safely at read time. Timestamps use ISO 8601 and dates remain date-only strings where appropriate.

## UI and testing

The Tasks route provides fast title-first capture, the eight operational views, touch-sized completion controls, a responsive editable task-detail dialog, confirmed deletion, contextual state toggles, subtasks and visible progress. Workflow references are validated against the future workflow type set and deduplicated by type, source and date. Carry-forward records a destination reference plus a dedicated carry-history entry. Automated tests cover task-view derivation, completed ordering, legacy/corrupt optional fields, subtask progress and detail-flow source integrity; build and syntax checks remain part of validation.

## Acceptance notes

Founder manual acceptance should follow Scenarios A–G in the Phase 02 brief: create a task, edit its state, add and complete subtasks, block/unblock, wait/resume, complete, reload and reopen. Technical validation on 2026-09-06 passed desktop (default), iPad (768×1024), and iPhone (390×844) layouts with no horizontal overflow. The live acceptance test created one temporary canonical task, attached EOD/Huddle/Today references, confirmed duplicate prevention and canonical completion, removed one reference without deleting the task, then removed the test data. Completion controls and task actions use 44px minimum touch targets.
