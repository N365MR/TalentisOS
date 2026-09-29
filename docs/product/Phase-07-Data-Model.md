# Phase 07 data model — conversations, Help Now and Weekly Review

## Persistence and migration

Phase 07 raises IndexedDB to schema v9. The migration is additive: it creates `conversations`, `weeklyReviews` and `howILead`. It does not alter existing settings, drafts, tasks, EODs, Huddles, Needs attention records or orientation data.

Interruption-safe form state stays in the existing `drafts` store. Each Phase 07 draft has a route-specific ID and may be deliberately discarded. No general notes store is created.

There is no general local export/import workflow in the current implementation. Phase 07 therefore changes no import/export behaviour; Phase 08 must include all three v9 stores and their optional task IDs in its validated backup/recovery envelope.

## Records and canonical references

| Store | Record | Boundary |
| --- | --- | --- |
| `conversations` | Named preparation fields for one of six flows and one optional `followUpTaskId`. | The task value is an existing canonical task ID, never a copy. |
| `weeklyReviews` | Dated results, learning, risks, recognition and next-week priorities in `fields`; Manager-up update values, including `decisionsNeeded`, in the separate `managerUp` object; one optional `nextWeekTaskId`. | Optional prompts may be blank; no scorecard, meeting or issue record is created. |
| `howILead` | One local `how-i-lead` record with values, communication standards, non-negotiable behaviours and practices to improve. | Private leader commitments only; never an assessment of another person. |

Canonical task deletion includes the new stores in its single repair transaction. It removes a deleted task ID or replaces it with the explicitly selected replacement. The deletion confirmation includes these new references.

## Privacy and escalation boundary

Each saved text field is limited to 600 characters and rejects explicitly labelled names, personnel, health, HR, payroll, performance-rating, disciplinary and equivalent personal-file commentary. The UI directs safety, serious quality/customer failure, legal/privacy concerns, suspected misconduct, wellbeing emergencies and formal performance/disciplinary matters to the appropriate formal system. Help Now stores no record by itself.

## Exclusions

This phase creates no employee profile, personnel or performance record, confidential HR note, generic notes database, meeting/L10, scorecard/KPI, issue/IDS, advanced capability or new primary destination.
