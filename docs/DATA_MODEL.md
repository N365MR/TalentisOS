# TalentisOS Data Model

## Purpose

TalentisOS uses a local-first browser data model for early product phases. In
Phase 2 the app persists all working state in `localStorage` so the shell works
without a backend or package-based runtime.

## Storage Strategy

- `schemaVersion`: `1`
- `localStorage` key: `talentisOS_state_v1`
- Persistence format: JSON
- Import and export format: JSON
- Default bootstrap: realistic sample data covering all current placeholder
  views

## Top-Level State Shape

```text
appState
├── schemaVersion
├── lastSavedAt
├── managerProfile
├── teamMembers[]
├── roles[]
├── tasks[]
├── meetings[]
├── kpis[]
├── rocks[]
├── issues[]
├── praise[]
├── feedback[]
├── coachingNotes[]
├── trainingItems[]
├── skillRatings[]
├── inductionPlans[]
├── thirtySixtyNinetyPlans[]
├── sops[]
├── improvements[]
├── handovers[]
├── settings
└── analyticsSnapshots[]
```

## Collections

### `managerProfile`

Single object describing the current manager context.

Suggested fields:
- `id`
- `name`
- `role`
- `location`
- `focusArea`

### `teamMembers`

People the leader manages or coordinates.

Suggested fields:
- `id`
- `name`
- `roleId`
- `department`
- `managerId`
- `oneOnOneDue`
- `status`

### `roles`

Role ownership, accountability and backup coverage.

Suggested fields:
- `id`
- `title`
- `ownerId`
- `accountability`
- `backupOwnerId`

### `tasks`

Action and commitment tracking for daily execution.

Suggested fields:
- `id`
- `title`
- `ownerId`
- `status`
- `priority`
- `dueDate`
- `linkedMeetingId`
- `linkedKpiId`
- `linkedIssueId`

### `meetings`

Leadership rhythm items such as huddles, one-on-ones and L10s.

Suggested fields:
- `id`
- `title`
- `cadence`
- `ownerId`
- `scheduledAt`
- `type`

### `kpis`

Operational scorecard data.

Suggested fields:
- `id`
- `name`
- `target`
- `actual`
- `status`
- `ownerId`
- `trend`

### `rocks`

Quarterly priority tracking.

Suggested fields:
- `id`
- `title`
- `ownerId`
- `quarter`
- `status`

### `issues`

Structured issue capture and escalation flow.

Suggested fields:
- `id`
- `title`
- `severity`
- `status`
- `ownerId`
- `source`

### `praise`

Positive recognition logging.

Suggested fields:
- `id`
- `memberId`
- `note`
- `loggedAt`

### `feedback`

Leadership feedback loops that need follow-up.

Suggested fields:
- `id`
- `memberId`
- `note`
- `followUpDue`
- `status`

### `coachingNotes`

One-on-one and development coaching history.

Suggested fields:
- `id`
- `memberId`
- `topic`
- `summary`
- `nextStep`

### `trainingItems`

Training actions, sessions and development work.

Suggested fields:
- `id`
- `title`
- `ownerId`
- `status`
- `dueDate`

### `skillRatings`

Role capability or skills-matrix values.

Suggested fields:
- `id`
- `memberId`
- `skill`
- `rating`

### `inductionPlans`

New starter induction checkpoints.

Suggested fields:
- `id`
- `memberId`
- `stage`
- `status`

### `thirtySixtyNinetyPlans`

Structured onboarding and development milestones.

Suggested fields:
- `id`
- `memberId`
- `milestone`
- `status`

### `sops`

Standard operating procedure metadata and review tracking.

Suggested fields:
- `id`
- `title`
- `ownerId`
- `reviewDate`
- `status`

### `improvements`

Continuous improvement work and experiments.

Suggested fields:
- `id`
- `title`
- `ownerId`
- `stage`
- `impact`

### `handovers`

End-of-day or shift handover notes.

Suggested fields:
- `id`
- `ownerId`
- `shiftDate`
- `summary`

### `settings`

Local preferences for the shell.

Suggested fields:
- `theme`
- `reducedMotion`
- `localFirstMode`
- `activeView`

### `analyticsSnapshots`

Time-based summary records for later trend visualisation.

Suggested fields:
- `id`
- `capturedAt`
- `openTasks`
- `redKpis`
- `openIssues`

## Notes

- `normaliseState()` should always be used before persisting or importing data.
- `generateId()` provides lightweight local identifiers for prototype-safe data
  creation.
- Future schema migrations should increment `schemaVersion` and add a dedicated
  migration path before loading persisted data into the app shell.
