# Phase 02 canonical task data dictionary

## Scope

Phase 02 adds the single canonical `Task` record for actionable work. It does not add End of Day, Morning Huddle, meeting, KPI, issue, risk, decision, handover or import/export records. Those later record types may be named only as typed links; no placeholder records or task copies are created.

## IndexedDB migration

Database `talentisos` advances from schema version 2 to **3**. Migration v3 is additive: it creates `tasks` with `id` as its key path and does not rewrite the existing `settings` or `drafts` stores. A failed upgrade leaves the app in its recoverable storage-error state.

## Canonical Task

| Field | Type / rule |
| --- | --- |
| `id` | Stable `task_…` identifier, generated once and never replaced on edit, complete, archive or restore. |
| `recordType`, `lifecycleStatus` | Always `task`; active, completed or archived lifecycle projection. |
| `title`, `notes` | Required trimmed title (maximum 240 characters); optional local notes. |
| `status`, `priority` | `open`, `blocked`, `waiting`, `completed`; priority `none`, `low`, `medium`, `high`. Blocked/waiting requires `stateContext`; other states must not retain it. |
| `dueDate`, `dueTime` | Optional `YYYY-MM-DD` date and optional `HH:MM` time. Date-only assignment uses the saved leadership-workday timezone. |
| `urgent`, `flagged`, `category`, `tags` | Optional urgency and flag booleans, category, and de-duplicated text tags. `category: someday` selects the Someday view. |
| `subtasks` | Stable subtask IDs, title and completed boolean; progress is derived as completed/total, never stored separately. |
| `createdAt`, `updatedAt`, `completedAt` | ISO instants. Completion is set on completion and cleared if reopened. |
| `carryHistory` | Reserved append-only structured history for Phase 03; no carry-over UI is enabled in this phase. |
| `image` | Optional metadata only: JPEG, PNG or WebP, maximum 2 MB, name/type/size/local key. Image bytes are deliberately not persisted until a quota/recovery design is approved. |
| `archivedAt` | ISO instant or null. Archive preserves all fields and identity; restore clears it. |
| `typedLinks` | Unique `{ recordType, recordId, relationship }` references. These are references, never embedded task copies. |

## Storage boundary

Live tasks are only stored in IndexedDB. `localStorage` remains unused for task data and reserved for small interface preferences. There is no migration of existing task records because no earlier task store existed.
