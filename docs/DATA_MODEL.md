# Data Model

The data model is local-only and centered on leadership work, decisions, risks, discussion points, follow-ups, daily reviews, and improvements.

## IndexedDB version 2

Database name: `talentisos`. Schema version: `1`.

- `settings` — the five onboarding preferences and appearance-related settings.
- `dailyPlans` — one local plan per calendar date, including focus, carryover, risks, decisions, follow-ups, meetings, and end-of-day status.
- `priorities` — dated leadership priorities with outcome, why, due point, order, and status. Today enforces a maximum of three.
- `workItems` — focused leadership work with type, group, minimal base fields, type-specific risk/decision/follow-up fields, and related item IDs. The Work view enforces a maximum of three active items in Now.
- `appMeta` — schema-safe application metadata, including resumable onboarding progress and completion acknowledgment.

The first open creates only onboarding metadata and an empty current daily plan. It does not create sample priorities, work items, or demonstration workspace content. Existing version 1 databases migrate by adding `workItems`; future schema changes must use explicit `onupgradeneeded` migrations.

Potential Phase 1 records should use generated local identifiers, timestamps, explicit status values, and schema versioning. Records must be designed around the leader’s operating rhythm rather than people management.

## Explicit exclusion

There is no `Employee`, `Person`, employee profile, HR record, payroll record, performance review, surveillance record, or time-tracking entity. Do not add one indirectly through a foreign key or contact directory.
