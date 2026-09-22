# Phase 05 Needs attention data model

Phase 05 advances IndexedDB `talentisos` from v5 to **v7**, adding `risks`, `decisions` and `handovers`. The v7 additive step also repairs a pre-existing v6 database that does not yet contain these stores. All are keyed by stable `id`; no task payload is stored in these records.

| Record | Required structured fields | Canonical task relationship | Lifecycle |
| --- | --- | --- |
| Risk | title, context, severity, owner role, status, next action, waiting on, review date | `mitigationTaskId`, zero or one | open/monitoring → resolved (resolution note required) → archived |
| Decision | title, context, options, owner role, status, next action, waiting on, review date, revision history/count | unique `followUpTaskIds` | open/decided/deferred → archived; archive retains history |
| Handover | title, concise context, owner/recipient roles, next action, waiting on, review date | unique `linkedTaskIds` | Draft → Ready → Acknowledged → Archived; acknowledgement required for archive |

Every record includes `recordType`, `lifecycleStatus`, `createdAt` and `updatedAt`. Needs attention is derived from these records and canonical task blocked/waiting state; it stores no duplicate blocker or task record. Deleting a canonical task repairs risk, decision and handover references in the same IndexedDB transaction as EOD and Huddle repairs. Archiving a source record never deletes its linked task.
