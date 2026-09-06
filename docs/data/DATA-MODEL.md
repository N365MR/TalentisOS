# Data Model

**Status:** PROPOSED
**Authority:** Founder; engineering implementation owner

IndexedDB is the primary store. Planned conceptual stores/entities are: tasks, subtasks, end-of-day records, huddle sessions, today references, KPIs, rocks, issues, meetings, actions, risks, blockers, decisions, improvements, SOPs/playbooks, roadmap items, templates, settings, and migration metadata.

Canonical entities own their data; surfaces hold immutable entity IDs plus contextual reference metadata. Relationships include task-to-subtask, task-to-session references, actions originating from meetings/issues/decisions, and corrective actions linked to off-track KPIs. Historical sessions preserve what occurred without changing entity identity.

Phase 01 database version 2 creates `metadata`, `tasks`, and `settings`. Tasks are preparation-only canonical records (not a task-management UI): one immutable ID, timestamps, workflow-ready fields and no surface copies. The `tasks` store indexes `status` and `updatedAt`; settings uses a stable `key`. No people or sensitive HR entity is modelled.

Phase 04 database version 6 adds `morningHuddles`, indexed uniquely by `workDate`. A Huddle owns only its lifecycle, source EOD identity, lightweight meeting context, and canonical task ID references (`carryoverTaskIds`, ordered `top3TaskIds`, and `commitmentTaskIds`). It never stores task copies or task completion state. The huddle service assembles live task detail from the canonical task store.

Phase 07 database version 9 adds `kpis` and `kpiEntries`. KPIs own operational definitions, role/function owner, threshold ranges, frequency, and canonical `linkedTaskIds`; entries own one current/historical actual per `[kpiId, periodKey]` with correction history. Neither record embeds task objects. The `kpiEntries` store has a unique composite `by-kpi-period` index and a `by-kpi` index.
