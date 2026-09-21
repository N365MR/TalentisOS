# Phase 04 Morning Huddle data model

Phase 04 adds a resumable Morning Huddle while keeping Task as the only actionable-work record. Home and Today's Work are derived views and persist no task copies.

Database `talentisos` advances from version 4 to **5** with an additive `huddles` store keyed by `id`; existing settings, drafts, tasks and EOD records are unchanged.

| Field | Rule |
| --- | --- |
| `id` | Deterministic `huddle_YYYY-MM-DD`; one record per leadership workday. |
| `sourceEodId` | The prior EOD whose shared `nextWorkday` equals the Huddle workday, if available. |
| `taskIds` | Unique canonical Task IDs only, initially carried task IDs and EOD Top 3. |
| `top3TaskIds` | Ordered EOD Top 3 references; maximum three and a subset of `taskIds`. |
| `commitmentTaskIds` | Unique subset of `taskIds` selected from existing tasks during Huddle. |
| `recognition` | Prior-EOD recognition context; no structured exception record is invented. |
| `status`, timestamps | `in-progress` or `completed`, with stable created/updated/completed timestamps. |

Task deletion repairs Huddle task, Top 3 and commitment references in the same IndexedDB transaction. Blocked/waiting context stays on the canonical Task. Risks, decisions and handovers remain Phase 05 work.

Home selects one next canonical task. Today's Work orders canonical open tasks: blocked/waiting or overdue first; then Top 3, urgent, due-today, carried and Huddle-committed work; then routine work. Phase 05 critical-continuity records are not represented until those records exist.
