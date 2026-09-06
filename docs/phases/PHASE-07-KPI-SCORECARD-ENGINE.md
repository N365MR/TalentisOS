# Phase 07 — KPI / Scorecard Engine

**Status:** IMPLEMENTED / AWAITING FOUNDER ACCEPTANCE  
**Scope:** A local-first operational scorecard that turns current KPI exceptions into canonical corrective actions.

## Architecture and data model

Schema v9 adds `kpis` and `kpiEntries` IndexedDB stores. A KPI contains its UUID, operational definition, role/function owner, formula/data-source description, unit, frequency, direction, threshold ranges, and `linkedTaskIds`. A reporting entry contains a UUID, KPI ID, deterministic period key, numeric actual, note, timestamps, and an append-only correction history. No employee, HR, health, payroll, disciplinary, surveillance, or other sensitive personal information is modelled.

The threshold model is deterministic. Higher-is-better evaluates target-or-above as On Track, warning-or-above as At Risk, otherwise Off Track. Lower-is-better uses the inverse. Within-range evaluates target range as On Track, warning range as At Risk, otherwise Off Track. Missing current-period actuals are Not Reported. Target ranges must nest inside warning ranges, which nest inside off-track ranges.

`src/state/kpis.js` provides pure period-key, threshold-validation, status, trend, current-period and corrective-action functions. Entries are unique by `[kpiId, periodKey]`; saving the same period intentionally updates the existing entry and appends correction history.

## Integration and compatibility

Red measures require an open linked canonical task to be actioned. The Scorecard can create a canonical task through the existing task service or link an existing open task; KPI records hold only IDs and task references use the existing `kpi` reference type. Completing/reopening tasks therefore remains live everywhere. Today’s Work receives a corrective task only through its existing canonical selection rules.

Morning Huddle resolves current At Risk and Off Track measures from the scorecard service and displays their live task references; it stores no KPI data. Export version 5 round-trips KPI definitions and entries. Versions 1–4 remain import-compatible; malformed references are rejected by validation or safely dropped during import. Migration is additive, preserving existing stores and user data.

## Evidence, exclusions, follow-on

Automated coverage includes status boundaries for all directions, missing actuals, deterministic period keys, trends, update-safe period entries, corrective-action eligibility, Huddle exception selection, and export shape. Run `npm test`, `npm run check`, `npm run build`, and `git diff --check` before acceptance. Manual browser verification remains required for KPI creation, actual reporting, task linking, refresh persistence, empty state, mobile layout, and console review.

Optional editable templates cover response time, on-time completion, rework/error rate, customer issues resolved in target, and plan adherence. Phase 07 does not add external connectors, analytics, Rocks, IDS, L10, cloud storage, or a second task/Today store.
