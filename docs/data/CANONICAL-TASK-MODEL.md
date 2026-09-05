# Canonical Task Model

**Status:** PROPOSED
**Authority:** Founder

A task has one immutable canonical ID and one record. It will contain ID, title, notes, status, priority, urgent/flagged state, category, tags, local due date, optional local due time, created/updated/completed timestamps, blocked/waiting state, subtasks, links, source, movement/carry history, carry count, EOD/Huddle references, and optional local image reference.

Completing a task anywhere completes the same record everywhere. Carrying forward adds/changes references and movement history, not identity. Removing a reference, completing, archiving, and deleting the entity are distinct operations. No surface may clone a task.
