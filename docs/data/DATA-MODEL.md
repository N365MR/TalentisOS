# Data Model

**Status:** PROPOSED
**Authority:** Founder; engineering implementation owner

IndexedDB is the primary store. Planned conceptual stores/entities are: tasks, subtasks, end-of-day records, huddle sessions, today references, KPIs, rocks, issues, meetings, actions, risks, blockers, decisions, improvements, SOPs/playbooks, roadmap items, templates, settings, and migration metadata.

Canonical entities own their data; surfaces hold immutable entity IDs plus contextual reference metadata. Relationships include task-to-subtask, task-to-session references, actions originating from meetings/issues/decisions, and corrective actions linked to off-track KPIs. Historical sessions preserve what occurred without changing entity identity.

Phase 00 currently creates only `metadata/foundation`; no domain entity is implemented.
