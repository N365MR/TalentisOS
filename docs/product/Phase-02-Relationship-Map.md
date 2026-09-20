# Phase 02 relationship map

```text
Task (canonical record, one stable ID)
  ├─ typedLinks[] ──> future typed record (reference only)
  └─ typedLinks[] <── another canonical Task (dependency/context only)

archive(Task)  → preserves ID, links and history
restore(Task)  → clears archive state; preserves ID and links
delete(Task)   → one IndexedDB transaction repairs incoming task links,
                 then removes the task; otherwise the transaction fails
```

Future EOD, Huddle, meetings, KPIs, issues, risks, decisions, handovers and roadmap records must store a typed reference to the task ID. They must not embed a task payload. They do not exist in Phase 02, so no such records are created or shown.

Permanent deletion first reports inbound references. The current Phase 02 store repairs links from canonical tasks atomically by removing them (or replacing their task ID if a valid replacement is supplied through the service). Future record stores must participate in the same transaction before their workflow is enabled.
