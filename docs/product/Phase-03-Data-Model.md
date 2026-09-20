# Phase 03 End of Day data model

## Scope

Phase 03 adds one local End of Day (`EOD`) review record per leadership workday. It reuses the Phase 02 canonical `Task` records; an EOD stores task IDs as references only and never embeds task titles, status, notes, due dates or copies.

## IndexedDB migration

Database `talentisos` advances from schema version 3 to **4**. Migration v4 is additive: it creates `eods` with `id` as its key path and does not rewrite `settings`, `drafts` or `tasks`. A failed upgrade leaves the browser in its recoverable storage-error state.

## EOD record

| Field | Type / rule |
| --- | --- |
| `id` | Deterministic stable `eod_YYYY-MM-DD` ID. It enforces one EOD record per workday. |
| `recordType`, `lifecycleStatus` | Always `eod`, `active`. |
| `workday` | Required leadership workday `YYYY-MM-DD`; it is interpreted through the saved timezone. |
| `status`, `completedAt` | `in-progress` or `completed`; completion is an explicit workflow closeout and remains resumable/readable. |
| `taskIds` | Unique canonical task IDs reviewed in the EOD. References only, no task copies. |
| `top3TaskIds` | Ordered unique subset of `taskIds`, maximum three. These are references to existing canonical tasks. |
| `recognition`, `lessons` | Optional concise closeout text, maximum 1,000 characters each. No parallel risk, decision, handover or issue records are created in this phase. |
| `createdAt`, `updatedAt` | ISO instants. |

## Task carry relationship

`Task.carryHistory` remains append-only. An EOD carry appends `{ id, fromWorkday, toWorkday, eodId, carriedAt }` to the same canonical task and changes that task's `dueDate` to the shared `nextWorkday` result. Repeating the same EOD carry is idempotent: it makes no second history entry and does not clone a task. Friday, Saturday and Sunday resolve to Monday.

Task completion, archive and carry actions from EOD update the canonical task store in the same IndexedDB transaction as the EOD reference update. Task deletion removes or replaces EOD references in that transaction, so no stale task ID remains. Existing tasks receive no destructive migration; their empty `carryHistory` arrays remain valid.
