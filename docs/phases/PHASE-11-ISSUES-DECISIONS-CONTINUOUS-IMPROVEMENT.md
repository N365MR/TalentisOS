# Phase 11 — Issues, Decisions & Continuous Improvement

**Status:** IMPLEMENTED — pending Founder approval

TalentisOS now provides a deliberately lightweight local-first operational issue loop: Identify, Discuss, Solve, and Verify. It is not HR case management, performance management, CRM, payroll, or project management. Issue records use role/function ownership only; users must not enter employee, health, disciplinary, or confidential personal information.

## Data and workflow

- IndexedDB schema 11 adds the `issues` store with status, priority, impact, context, decision, concise optional 5 Whys, resolution, verification, related-reference, and canonical task-link fields.
- Statuses are Open, Prioritised, In Progress, Waiting, Resolved, and Verified. Resolving requires a resolution summary; verification requires an outcome; reopening requires a reason.
- Corrective actions are canonical task IDs. The Issue view reads the live task state, so completion and reopening remain consistent in Tasks, Today, End of Day, and Morning Huddle.
- Issues can create or link an existing task. Repeated creation with the same linked action title reuses the canonical task rather than cloning it.
- Home and Morning Huddle show read-only material issue references only; neither creates issue records or task copies.

## Backup compatibility

JSON export version 8 includes issues. Imports from prior supported backups safely initialise an empty issues collection and update metadata to schema 11.

## Validation

Focused tests cover record validation and persistence shape, 5 Whys, live canonical task completion state, projection rules, and modern/legacy export compatibility. Browser acceptance remains required before Founder approval.
