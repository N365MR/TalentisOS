# Canonical Task Model

**Status:** PROPOSED
**Authority:** Founder

A task has one immutable canonical ID and one record. It contains ID, title, notes, status, priority, urgent/flagged state, category, tags, local due date, optional local due time, created/updated/completed timestamps, blocked/waiting state, embedded subtasks, workflow references, carry history and carry count.

Completing a task anywhere completes the same record everywhere. Workflow references use `{ id, taskId, type, sourceId, date, createdAt }` and are unique per `type + sourceId + date`. Carrying forward adds a destination reference and `{ id, fromDate, toDate, createdAt }` carry-history entry, not a new identity. Removing a reference, completing, archiving, and deleting the entity are distinct operations. No surface may clone a task.
