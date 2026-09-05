# Data Model

**Status:** PROPOSED
**Authority:** Founder; engineering implementation owner

IndexedDB is the primary store. Planned conceptual stores/entities are: tasks, subtasks, end-of-day records, huddle sessions, today references, KPIs, rocks, issues, meetings, actions, risks, blockers, decisions, improvements, SOPs/playbooks, roadmap items, templates, settings, and migration metadata.

Canonical entities own their data; surfaces hold immutable entity IDs plus contextual reference metadata. Relationships include task-to-subtask, task-to-session references, actions originating from meetings/issues/decisions, and corrective actions linked to off-track KPIs. Historical sessions preserve what occurred without changing entity identity.

Phase 01 database version 2 creates `metadata`, `tasks`, and `settings`. Tasks are preparation-only canonical records (not a task-management UI): one immutable ID, timestamps, workflow-ready fields and no surface copies. The `tasks` store indexes `status` and `updatedAt`; settings uses a stable `key`. No people or sensitive HR entity is modelled.
