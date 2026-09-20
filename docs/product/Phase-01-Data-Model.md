# Phase 01 data model and migration baseline

## Scope

Phase 01 establishes persistence infrastructure only. It does not create Task, End of Day, Morning Huddle, Conversation or other product records. The browser is the private, device-specific workspace; no data is sent to a service.

## IndexedDB contract

Database: `talentisos`  
Current schema version: `2`

| Store | Key | Phase 01 purpose | Required fields |
| --- | --- | --- | --- |
| `settings` | `id` | One workspace settings record | `id`, `recordType`, `lifecycleStatus`, `leadershipWorkdayTimezone`, `createdAt`, `updatedAt` |
| `drafts` | `id` | Local, resumable text drafts for a future route/form | `id`, `recordType`, `lifecycleStatus`, `route`, `content`, `createdAt`, `updatedAt` |

The initial settings record has ID `workspace`. Its timezone is captured once from the browser only when the record is first created. Later browser timezone changes do not update that record. A deliberate preference change updates `leadershipWorkdayTimezone` and `updatedAt`; future workday logic must use the saved value and must not move existing records.

## Migration rules

- Each schema version is additive and guarded by `oldVersion` in `onupgradeneeded`.
- Version 2 safely repairs an early empty version 1 database by adding the two required stores if they are absent; it does not remove or rewrite records.
- A later migration must retain existing stores and records, create only the required new store/index/field, and stop with a recoverable error if it cannot preserve data.
- Schema changes require a migration test and an update to this document before approval.
- The database closes when another version requests access, avoiding concurrent-tab writes during an upgrade.
- `localStorage` is reserved for small interface preferences only; it is not used for settings, drafts, or other live records.

## Draft boundary

`saveDraft` and `getDraft` provide a validated local-draft seam for later approved forms. A draft is not a canonical task and is never displayed as one. The API currently requires a stable ID and string content, preserving original creation time when a draft is updated.

## Deferred data contract

Task identity, relationships, lifecycle history, workday calculations, export/import, backup health, archive/restore, and data reset are not implemented in Phase 01. They require their respective approved phases and must build on this versioned foundation.
