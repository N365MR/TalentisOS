# Phase 06 data model — Start Here, First 7 Days and roadmap

## Persistence and migration

Phase 06 raises IndexedDB to schema v8. The migration is additive: it creates one `orientation` store and does not alter `settings`, `drafts`, `tasks`, `eods`, `huddles`, `risks`, `decisions` or `handovers`.

The store contains at most one `core-orientation` record. It has no task copies and no task references. Optional actions are created only as new canonical records in the existing `tasks` store after the leader explicitly chooses them.

## Orientation record

| Field | Purpose and boundary |
| --- | --- |
| `responsibility` | Brief role/work responsibility. |
| `usualWorkdays` | One or more weekday names for orientation context; it does not replace the saved timezone or alter existing EOD/Huddle next-workday rules. |
| `weeklyOutcome`, `tomorrowAttention` | The remaining two Start Here answers. |
| `guidanceStatus` | `not-started`, `in-progress`, `skipped`, or `complete`; skipping never blocks daily work. |
| `observations` | Themes, evidence, contradictions and questions to test only. Validation rejects explicitly labelled names and HR/personal-file commentary. |
| `roadmapStage`, `roadmapNextAction` | Fixed Phase 06 Days 1–30 stage and exactly one listening/verification action. |

Drafts remain in the existing `drafts` store under separate Start Here and First 7 Days draft IDs, so interrupted forms can resume locally.

## Exclusions

No employee profile, names, personal judgements, HR commentary, advanced Team Takeover map, Days 120–365 control, Phase 07 conversation toolkit, Help Now, or Weekly Review record is created in this phase.
