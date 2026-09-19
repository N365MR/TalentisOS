# TalentisOS implementation phases

## Purpose and use

This document converts the controlling product specification into a safe build sequence. It is deliberately ordered so TalentisOS proves one dependable daily leadership loop before advanced leadership tools are exposed.

Use one phase at a time. Paste the relevant instruction block into a new Codex task only after the prior phase has passed its acceptance gate and has been approved. Do not combine phases, introduce unapproved features or expose incomplete routes in the production navigation.

**Canonical repository:** `~/Desktop/GitHub/TalentisOS`  
**Runtime:** Vite, vanilla JavaScript ES modules, semantic HTML, modern CSS, IndexedDB, Service Worker, JSON export/import and static GitHub Pages.  
**Launch promise:** TalentisOS helps a new leader know what matters, lead the next conversation and follow through every workday.

**Controlling release split:** The New Leader Core may release after Phase 08. Phases 09–14 are later capabilities and must not delay the Core merely because they remain in the long-term product vision.

## Non-negotiable implementation rules

Apply these rules in every phase:

- Inspect the repository, current branch, working tree, data model, tests and governing documents before changing anything. Preserve unrelated user work.
- Use one canonical task record. EOD, Morning Huddle, Today, meetings, KPIs, issues, risks, decisions, handovers and roadmap items store references, never task copies.
- Use IndexedDB for live records and localStorage only for small user preferences. Keep all records local-first and functional offline after installation.
- Do not introduce employee profiles, confidential HR records, sensitive personal data, chat, email, calendar synchronisation, CRM, payroll, timesheets, surveillance or general project-management features.
- Use plain English in the interface. Framework terms such as Rocks, L10 and IDS must be optional explanations, never prerequisites to act.
- Default navigation must remain limited to the implemented New Leader Core. Hide unfinished, advanced or placeholder routes.
- Core capabilities are available immediately after Start Here. Meetings, issues, KPI scorecards, priorities and recurring routines require explicit user enablement after Core orientation. SOPs/playbooks, Training 360, extended Team Takeover, search, analytics, operating calendar, scenarios and annual review remain hidden until explicitly enabled after Core live-use validation.
- Design mobile and iPad first. Meet WCAG 2.2 AA for supported workflows, including semantic controls, keyboard support, visible focus, non-colour status cues, 44 px targets and reduced motion.
- Implement the smallest coherent change. Keep domain services, validation, views and tests separated; do not grow a monolithic controller.
- Update the data dictionary, relationship rules, phase register, project status, decision log and changelog where the phase changes them.
- Before proposing approval, run the relevant automated tests, production build, source checks and manual workflow checks at 390 px, 768 px and 1440 px. Record actual evidence, not assumptions.
- Material workflows must be interruption-safe: local draft save, visible saved state, deliberate resume/discard and conflict-safe handling when the same record is open in more than one tab.
- Do not commit or push unless the founder authorises it for that phase. Report the exact changed files, validation output, known limitations and proposed commit message.

## Phase map

| Phase | Outcome | Release position |
| --- | --- | --- |
| 00 | Repository, governance and product-contract reconciliation | Foundation |
| 01 | App shell, design system, PWA and persistence baseline | Foundation |
| 02 | Canonical task engine, workday utility and safe relationships | Foundation |
| 03 | End of Day, carry-over and next-workday integrity | Core |
| 04 | Morning Huddle, Today and Home decision surface | Core |
| 05 | Needs attention: risks, blockers, decisions and handovers | Core |
| 06 | Start Here, First 7 Days and current-stage roadmap | Core |
| 07 | Conversation toolkit, Help Now and weekly review | Core |
| 08 | New Leader Core hardening, recovery and launch readiness | Core release gate |
| 09 | Meetings, issue solving and improvement actions | Progressive capability |
| 10 | Scorecards, priorities and recurring operating routines | Progressive capability |
| 11 | SOPs, playbooks, templates and verified improvement lifecycle | Progressive capability |
| 12 | Extended team-takeover, stakeholder and change controls | Progressive capability |
| 13 | Training 360 role-based capability coverage | Progressive capability |
| 14 | Search, analytics, annual review and remaining advanced tools | Later capability |

---

## Phase 00 — repository, governance and product-contract reconciliation

### Goal

Establish one trustworthy implementation baseline. No feature work is permitted until the repository, branch history, product specification, phase register, data documentation and deployment configuration agree.

### Deliverables

- Repository audit showing branch, HEAD, remote parity, worktree condition and current deployed version.
- Reconciled master phase register, project status register, decision log and changelog.
- A controlled requirements index linking the product specification to data-model, module, acceptance-test and release documents.
- A list of implemented, incomplete, hidden and deferred modules.
- A release-baseline test inventory and a documented gap list.

### Exit gate

There is one declared source of truth for current implementation and the next approved phase. No documentation claims a module is complete when the code or tested evidence says otherwise.

### Copy-paste implementation instruction

```text
Work in ~/Desktop/GitHub/TalentisOS.

Goal: complete Phase 00 — repository, governance and product-contract reconciliation. Do not implement new product features.

First inspect: git status, branch, HEAD, origin/main parity, recent history, README, phase register, project status register, decision log, changelog, data-model documents, tests, package scripts, GitHub Pages configuration and visible routes. Preserve unrelated work. If the working tree is dirty, identify each change and do not overwrite it.

Use TalentisOS-Product-Specification.md as the controlling product decision document. Reconcile the repository documentation with the actual code and verified test evidence. Create or update a requirements index that maps: product scope; New Leader Core; canonical data/relationship rules; module requirements; acceptance scenarios; engineering/release standards. Record whether each module is implemented, incomplete, hidden or deferred.

Do not describe a route as complete without both code inspection and relevant test evidence. Hide no routes and change no runtime behaviour unless needed solely to remove an incorrect claim or a broken documentation link.

Validate links and Markdown structure. Run existing tests, checks and build without changing unrelated source code. Update governance documents with the exact repository state and known gaps.

Do not commit or push. Report: audit result; exact documents changed; code changes, if any; test/check/build results; unresolved conflicts; and the proposed next phase. Stop for founder approval.
```

---

## Phase 01 — app shell, design system, PWA and persistence baseline

### Goal

Create a calm, accessible, offline-capable shell that feels reliable before it contains advanced features.

### Deliverables

- Semantic app shell, route architecture and Core navigation framework.
- Design tokens for colour, typography, spacing, elevation, focus and motion.
- Home as the opening state for Today, not a separate dashboard destination.
- IndexedDB database bootstrap, schema versioning and migration framework.
- Local draft-store foundation and leadership-workday timezone preference.
- Manifest, iOS-compatible icons, service-worker update policy and verified offline shell.
- Explicit unsupported-browser and storage-error states.

### Exit gate

The app installs, refreshes and opens offline on supported mobile and desktop browsers without losing a test record. Core navigation is visually clear at 390 px, 768 px and 1440 px.

### Copy-paste implementation instruction

```text
Work in ~/Desktop/GitHub/TalentisOS.

Goal: implement Phase 01 — app shell, design system, PWA and persistence baseline. This phase creates foundations only; do not build advanced modules or placeholders.

Inspect the current source, styles, entry point, routes, IndexedDB code, manifest, service worker, icons, tests and governance documents. Preserve working functionality and follow the Product Specification and Phase 00 requirements index.

Implement a semantic, mobile-first shell with these visible New Leader Core destinations only: Today/Home, Prepare tomorrow, Start the day, Conversations and Tasks. Home must be the Today opening state, not an extra control-room route. Hide unfinished routes.

Create semantic CSS design tokens. Use restrained surfaces, clear typography, generous spacing and one primary action per screen. Dark appearance is default; any light appearance must meet the same clarity and contrast standard. Provide visible focus, 44 px targets, non-colour status cues and reduced-motion support. Do not add decorative gradients, glass effects or dense card grids unless they improve comprehension.

Create or strengthen the versioned IndexedDB bootstrap and safe migration framework. Establish the local draft-store foundation and leadership-workday timezone preference; do not let a device timezone change silently move existing work between days. Add a deliberate service-worker cache version/update policy, valid manifest metadata and iOS home-screen assets. Provide plain-language unsupported-browser, storage-failure and offline states.

Add focused tests for database bootstrap/migration, route visibility and PWA asset registration. Run tests, checks and build. Manually verify the shell, keyboard focus, reduced motion, install/refresh/offline launch and one persisted test record at 390 px, 768 px and 1440 px.

Update the data model and governance documents. Do not commit or push. Report changed files, validation evidence, limitations and the proposed commit message. Stop for founder approval.
```

---

## Phase 02 — canonical task engine, workday utility and relationships

### Goal

Make one task the durable system of record for actionable work, with reliable references, state transitions and workday rules.

### Deliverables

- Task schema, validation, lifecycle, archive/restore and history.
- Shared date, workday, identifier, confirmation and reference-repair utilities.
- Task capture, detail and views: Inbox, Today, Upcoming, Anytime, Someday, Flagged, Urgent and Completed.
- Quick Capture: title with optional urgency and due date only.
- Subtasks, blocked/waiting context, due date/time, priority, optional image limits and typed relationships.
- Atomic reference repair for archive/delete operations.

### Exit gate

Tasks retain one identity across references; archive/delete cannot orphan a reference; the same task can be completed and restored safely without duplicate records.

### Copy-paste implementation instruction

```text
Work in ~/Desktop/GitHub/TalentisOS.

Goal: implement Phase 02 — canonical task engine, shared workday utility and safe record relationships.

Inspect existing task, database, date, import/export and view code. Reuse valid structures and migrate safely. Do not build EOD, Huddle, meetings or advanced modules beyond the typed references needed for integrity.

Define and document the canonical Task schema: stable ID; title; notes; status; priority; due date/time; urgent; flagged; category; tags; subtasks; blocked/waiting state and context; created, updated and completed timestamps; carry history; optional local image metadata; archive state; and typed links. Tasks are the only general actionable-work record.

Create one shared utility for workday calculation, timezone-safe date handling, IDs, confirmation and reference repair. Configure workdays and use Monday–Thursday next day and Friday–Sunday Monday as the current next-workday rule. Do not assume public holidays.

Implement Quick Capture from Today and Tasks: title with optional urgency and due date only. It must never require a category, framework, link or long form. Add accessible detail editing for all further fields. Support Inbox, Today, Upcoming, Anytime, Someday, Flagged, Urgent and Completed views. Use archive before permanent deletion for material work. A delete flow must identify links and either repair or preserve them; one atomic transaction must succeed or fail safely.

Add service/domain tests for schema validation, task identity, subtask progress, blocked/waiting rules, workday calculation, archive/restore and reference repair. Run tests, checks and build. Manually test task creation, editing, completion, archive, restore and deletion at 390 px, 768 px and 1440 px.

Update data dictionary, relationship map, acceptance scenarios and governance documents. Do not commit or push. Report changed files, evidence, known limitations and proposed commit message. Stop for founder approval.
```

---

## Phase 03 — End of Day, carry-over and next-workday integrity

### Goal

Allow a leader to close the day in under ten minutes and prepare tomorrow without re-entering work or cloning tasks.

### Deliverables

- One EOD record per workday.
- Guided EOD capture with task-backed outstanding work, Top 3, exceptions, lessons and recognition.
- Duplicate-safe carry-over to the next valid workday, including Friday-to-Monday.
- Preserved task age, carry count and movement history.

### Exit gate

An outstanding task can be selected once in EOD, carried forward exactly once, and completed from any relevant surface with synchronised status.

### Copy-paste implementation instruction

```text
Work in ~/Desktop/GitHub/TalentisOS.

Goal: implement Phase 03 — End of Day, carry-over and next-workday integrity.

Inspect the Phase 02 task engine, database schema, workday utility and existing EOD code. Preserve the single canonical task rule. Do not create task clones or a separate EOD task store.

Implement one EOD record per workday. Provide a short, guided flow for completed work, outstanding work, risks/critical concerns, blocked/waiting work, decisions, handovers, tomorrow's Top 3, recognition and lessons/improvements. Structured exceptions may be referenced where available; this phase must not recreate them as parallel text records.

Enable create, update, complete and link of canonical tasks from EOD. Implement duplicate-safe, idempotent carry-over to the next configured workday. Preserve task age, carry count and movement history. Friday, Saturday and Sunday carry to Monday. Completing a task anywhere must complete the same record everywhere.

Add acceptance tests for one EOD per workday, Friday-to-Monday carry-over, repeated carry action idempotence, Top 3 maximum/order/completion behaviour and task completion synchronisation. Run tests, checks and build. Perform a seeded manual EOD workflow at 390 px, 768 px and 1440 px.

Update data documentation, acceptance scenarios and governance records. Do not commit or push. Report changed files, evidence, limitations and proposed commit message. Stop for founder approval.
```

---

## Phase 04 — Morning Huddle, Today and the Home decision surface

### Goal

Turn yesterday’s context into a clear start of day and a calm execution surface, without introducing a dashboard that competes with action.

### Deliverables

- Morning Huddle populated from EOD, tasks and live exceptions.
- Today’s Work ordered by the leadership attention rules.
- Home as a single-next-action opening state with contextual summaries.
- One consistent action path into EOD, Huddle, Tasks and Needs attention.

### Exit gate

The leader can move EOD → Huddle → Today without manual re-entry, identify the next action immediately and complete a linked task once.

### Copy-paste implementation instruction

```text
Work in ~/Desktop/GitHub/TalentisOS.

Goal: implement Phase 04 — Morning Huddle, Today’s Work and Home as one decision surface.

Inspect the canonical task, EOD, date/workday and navigation code. Reuse existing valid data relationships. Do not add a static dashboard, generic count cards or new duplicate task records.

Implement Morning Huddle as a short review of live prior-EOD context: carry-over, Top 3, blockers, support required, decisions, commitments and recognition. It must start with relevant data, not a blank form, and its actions must link to canonical tasks.

Implement Today’s Work as the execution surface for Top 3, due/overdue, carry-over, urgent, blocked/waiting and Huddle commitments. Order attention consistently: critical continuity concern; overdue decision or blocked commitment; due-today Top 3/urgent work; then routine work.

Implement Home as Today’s opening state. It shows one next best action first, followed only by concise, actionable summaries. Every item must explain why it is visible and take the user directly to the underlying action. Do not present Home as a dense command centre or expose advanced dashboards.

Add tests for EOD-to-Huddle context, ordering, completion synchronisation and no-duplicate action linking. Run tests, checks and build. Seed a full EOD → Huddle → Today workflow at 390 px, 768 px and 1440 px, including keyboard and reduced-motion checks.

Update module requirements, acceptance scenarios and governance records. Do not commit or push. Report changed files, evidence, limitations and proposed commit message. Stop for founder approval.
```

---

## Phase 05 — Needs attention: risks, blockers, decisions and handovers

### Goal

Give new leaders one clear way to see and follow through on material exceptions while retaining correct underlying record lifecycles.

### Deliverables

- Unified Needs attention interface with type-aware risk, blocker, decision and handover records.
- Canonical task link, replace and unlink controls.
- Risk resolution, decision revision/archive and handover Draft → Ready → Acknowledged → Archived lifecycle.
- Live surfacing in Home, EOD, Huddle and Today.

### Exit gate

A seeded risk, decision and handover can be captured once, acted on through the daily loop, completed or archived, and remain historically understandable with no broken links.

### Copy-paste implementation instruction

```text
Work in ~/Desktop/GitHub/TalentisOS.

Goal: implement Phase 05 — Needs attention for risks, blockers, decisions and handovers.

Inspect existing exception services, task reference logic, EOD, Huddle, Today, Home and import/export code. Preserve valid implementation and safely migrate schemas where required.

Keep Risks, Decisions and Handovers as separate structured record types, but present them together as Needs attention whenever the leader must decide or act. Each unified item must show type, what happened, why it matters, next action, waiting/dependency, review date and linked task. A blocker may be a task state or an exception record; do not duplicate it.

Implement risk context, attention level, owner role, one active mitigation task and mandatory resolution note on closure. Implement decision context/options, status, owner role, follow-up tasks, revision history and archive. Implement handover context, owner/recipient roles, linked tasks and Draft → Ready → Acknowledged → Archived transitions. Provide duplicate-safe link, replace and unlink controls.

Surface the relevant exceptions in Home, EOD, Huddle and Today. Actions must create, link, replace or review one canonical task without forcing re-entry. Archive/delete must preserve safe history and repair references atomically.

Add tests for every lifecycle transition, required closure data, linking/replacement/unlinking, reference repair, import validation and daily-loop retrieval. Run tests, checks and build. Perform one seeded risk, decision and handover workflow across EOD, Huddle, Today and Tasks at 390 px, 768 px and 1440 px.

Update data dictionary, relationship map, acceptance scenarios and governance documentation. Do not commit or push. Report changed files, evidence, limitations and proposed commit message. Stop for founder approval.
```

---

## Phase 06 — Start Here, First 7 Days and current-stage roadmap

### Goal

Give a new leader value in minutes without forcing them to administer a large setup system.

### Deliverables

- Four-question Start Here onboarding.
- First 7 Days guide focused on listening, observation and escalation.
- Current 30-60-90 milestone with one next action.
- Privacy-safe capture of observations, role-based context and follow-up actions.

### Exit gate

A first-time leader can complete setup in five minutes or less, identify a meaningful action within two minutes and understand what not to record or manage in the app.

### Copy-paste implementation instruction

```text
Work in ~/Desktop/GitHub/TalentisOS.

Goal: implement Phase 06 — Start Here, First 7 Days and the current-stage roadmap for the New Leader Core.

Inspect existing onboarding, settings, roadmap, task and navigation code. Preserve working records and do not require an account, cloud service, employee profile or advanced setup.

Implement a five-minute Start Here flow that asks only: what the leader is responsible for; usual workdays; the most important outcome this week; and what needs attention tomorrow. It must create useful Core context and optional canonical tasks, not a large profile.

Implement First 7 Days guidance: introduction preparation, listening questions, observation priorities, stakeholder questions, daily reflection and a clear reminder to listen before deciding and verify before changing a system. Store themes, evidence, contradictions and questions to test—not names, judgements or HR commentary. Material safety, quality, customer, legal or wellbeing concerns must route to the formal escalation guidance.

Show only the current 30-60-90 stage and one next milestone action. Days 120–365 and advanced Team Takeover controls remain hidden. The user may resume or skip optional guidance without blocking daily work.

Add tests for onboarding completion, configured workdays, safe optional skipping, roadmap state and privacy-safe data validation. Run tests, checks and build. Conduct first-run tests at 390 px, 768 px and 1440 px, measuring whether a meaningful action is available within two minutes.

Update onboarding/module requirements, acceptance scenarios and governance documents. Do not commit or push. Report changed files, evidence, limitations and proposed commit message. Stop for founder approval.
```

---

## Phase 07 — conversation toolkit, Help Now and weekly review

### Goal

Help a new leader prepare for consequential conversations and review their week without creating employee files or generic leadership content.

### Deliverables

- Concise preparation flows for one-on-ones, feedback, coaching, delegation, difficult conversations and recognition.
- Help Now decision routes.
- Weekly Review with results, risks, learning, recognition and next-week priorities.
- Private How I Lead commitments and Manager-up update routine.

### Exit gate

Every tool produces a practical next action or preparation outcome, clearly states when formal escalation is required, and stores no prohibited personal information.

### Copy-paste implementation instruction

```text
Work in ~/Desktop/GitHub/TalentisOS.

Goal: implement Phase 07 — New Leader Core conversation toolkit, Help Now and weekly review.

Inspect current Core workflows, task/reference model, privacy guardrails, navigation and templates. Do not introduce employee profiles, names, performance records, confidential notes or a general notes database.

Implement concise private preparation flows using plain English: one-on-one (what is going well, difficult, support needed, agreement); feedback (situation, behaviour, impact, next step); coaching (goal, reality, options, way forward); delegation (outcome, guardrails, authority, check-in, definition of done); difficult conversation (facts, intent, opening, questions, agreement, follow-up); and recognition (observed action, why it mattered, reinforcement). Each flow must create or link a canonical follow-up task only where action is needed.

Implement Help Now with exactly these practical routes: overwhelmed; difficult conversation; safety/quality/customer concern; delegate properly; reset tomorrow. Each route must contain a short decision sequence and one clear next action. Explicitly route safety, serious quality/customer failure, legal/privacy concerns, suspected misconduct, wellbeing emergencies and formal performance/disciplinary matters to the relevant formal system.

Implement Weekly Review: results, what worked, what did not, risks, start/stop/continue learning, recognition and next week’s priorities. Include private How I Lead commitments and a recurring Manager-up update of results, decisions needed, material risks, support required and next review.

Add tests for privacy validation, task-linking, skipped optional fields and escalation messaging. Run tests, checks and build. Test every flow at 390 px, 768 px and 1440 px for a clear primary action, keyboard access, focus restoration and reduced motion.

Update templates, module requirements, acceptance scenarios and governance documentation. Do not commit or push. Report changed files, evidence, limitations and proposed commit message. Stop for founder approval.
```

---

## Phase 08 — New Leader Core hardening and launch readiness

### Goal

Prove the Core is dependable, recoverable and useful before adding broader management capability.

### Deliverables

- Full export/import validation, migration and recovery flow.
- Backup health, interruption-safe draft recovery and measurable performance evidence.
- Core end-to-end browser tests and real-device usability evidence.
- Accessibility, offline, update and performance verification.
- Release, rollback and recovery-drill evidence.

### Exit gate

The Core works for a full week on iPhone, iPad and desktop; its data can be restored safely; and representative new leaders can orient, act and follow through without coaching.

### Copy-paste implementation instruction

```text
Work in ~/Desktop/GitHub/TalentisOS.

Goal: complete Phase 08 — New Leader Core hardening and launch readiness. Do not expand product scope.

Inspect every Core workflow, export/import implementation, IndexedDB migrations, service-worker cache policy, accessibility state, automated tests and deployment process. Create a gap list first and close only Core release blockers.

Ensure exports include schema version, required stores, relationships and timestamp. Implement Backup health showing last successful export, no-export state and stale-backup prompt. Import must validate the complete envelope and every record before any local change. Unknown relationships, malformed records and unsupported schema versions must leave current data unchanged. Before destructive replacement, show the user what will change and require explicit confirmation. Provide export-first reset and clear recovery instructions.

Build or complete automated end-to-end tests for: Start Here; Quick Capture; task creation/completion; EOD → Huddle → Today; one risk, decision and handover flowing through Needs attention; conversation preparation; weekly review; interrupted-draft resume/discard; archive/restore; malformed import rejection; valid import/reload; Backup health; and offline launch. Add accessibility checks for keyboard, focus, semantics, contrast, non-colour status and reduced motion.

Verify a clean install, refresh, offline launch, service-worker update and data persistence on current supported iPhone/iPad Safari and desktop Safari, Chrome, Edge and Firefox. Demonstrate a usable shell within two seconds on a typical supported current mobile device, routine local action feedback within 100 ms where practical, and a progress state for any action exceeding 300 ms. Seed at least 5,000 tasks and 1,000 linked non-task records, or document and justify a lower supported boundary. Complete a recovery drill: export; clear local data; import; verify relationships; reload offline. Conduct moderated usability sessions with representative emerging leaders on a real iPhone or iPad, covering first-run orientation, interruption, exception follow-up, conversation preparation and Quick Capture.

Update release register, test evidence, recovery procedure, supported-browser matrix and governance documents. Do not commit or push. Report all pass/fail evidence, open launch blockers, changed files and proposed commit message. Stop for founder approval.
```

---

## Phase 09 — meetings, issue solving and improvement actions

### Goal

Add disciplined meeting and problem-solving follow-through after the Core is proven.

### Deliverables

- Meeting records with concise agendas, decisions, commitments and ratings.
- Optional plain-English Weekly Review/meeting flows before L10 terminology.
- Issue workflow: Capture → Prioritise → Identify → Discuss → Solve → Act → Verify.
- 5 Whys and PDCA linked to canonical tasks and verified outcomes.

### Exit gate

Meeting and issue actions are canonical tasks; archive preserves source history; an issue cannot be closed without verified outcome evidence.

### Copy-paste implementation instruction

```text
Work in ~/Desktop/GitHub/TalentisOS.

Goal: implement Phase 09 — meetings, issue solving and improvement actions after the New Leader Core release gate has passed.

Inspect Core data relationships, archive/reference repair, task linking and current navigation. Keep these capabilities hidden behind progressive disclosure unless the user enables them. Use plain-English labels first; L10 and IDS are optional explanations.

Implement concise meeting records with purpose, agenda, decisions, commitments, conclusion and optional rating. Meeting actions must create or link canonical tasks, never copied action items. Archive must retain task history and an understandable archived-source reference.

Implement issue solving as Capture → Prioritise → Identify → Discuss → Solve → Act → Verify. Support lightweight 5 Whys and PDCA, a root-cause hypothesis, solution, linked actions, verification evidence and optional conversion to an improvement or SOP candidate. Closing requires a verified outcome.

Add tests for canonical action linking, source archival, issue closure validation, reference repair and import/export. Run tests, checks and build. Test a meeting-to-task and issue-to-improvement workflow at 390 px, 768 px and 1440 px.

Update data model, templates, acceptance scenarios and governance records. Do not commit or push. Report changed files, evidence, limitations and proposed commit message. Stop for founder approval.
```

---

## Phase 10 — scorecards, priorities and recurring operating routines

### Goal

Connect daily work to measurable results and repeatable leadership cadence without creating a reporting suite or calendar replacement.

### Deliverables

- KPI/scorecard records, thresholds and corrective-action rule.
- Priorities (Rocks) with result, purpose, milestones and outcome confirmation.
- Daily, weekly and monthly recurring routines.

### Exit gate

An off-track KPI has one active corrective action; a priority closes only when its result is confirmed; completing recurrence produces a distinct next occurrence.

### Copy-paste implementation instruction

```text
Work in ~/Desktop/GitHub/TalentisOS.

Goal: implement Phase 10 — scorecards, priorities and recurring operating routines.

Inspect task recurrence, exception controls, Home ordering and Core navigation. Add these capabilities progressively; do not make them compulsory for a new user.

Implement KPI records with name, purpose, formula/data source, owner role/function, target, warning/off-track thresholds, frequency, trend and corrective action. Use On Track, At Risk, Off Track and Not Reported. An Off Track KPI must have exactly one active corrective task until resolved or deliberately replaced; completing that task must not silently change KPI status.

Implement Priorities using plain English, with optional Rocks explanation. Each priority requires intended result, purpose, owner role, milestone, success condition, review cadence and optional linked KPI/issue/risk/decision/tasks. Supporting tasks alone do not complete the priority; the result must be confirmed or an outcome/next decision recorded.

Implement daily, weekly and monthly recurrence with interval and optional weekday/month-day selection. Completion creates the next occurrence; skip creates a skip event; rescheduling affects only one occurrence unless the series is deliberately edited. It is not a calendar service.

Add tests for KPI corrective-action integrity, priority completion, recurrence history and Home attention ordering. Run tests, checks and build. Test at 390 px, 768 px and 1440 px.

Update data documentation, measures dictionary, acceptance scenarios and governance records. Do not commit or push. Report changed files, evidence, limitations and proposed commit message. Stop for founder approval.
```

---

## Phase 11 — SOPs, playbooks, templates and verified improvement lifecycle

### Goal

Convert verified learning into light, reusable standards without becoming a document-management product.

### Deliverables

- SOP/playbook lifecycle: Draft → Trial → Verified → Retired.
- Owner role, purpose, review date, version/history note and evidence requirements.
- Controlled templates linked to real records, not a separate notes system.

### Exit gate

A standard cannot be treated as verified without evidence; a material review needing change produces a linked action.

### Copy-paste implementation instruction

```text
Work in ~/Desktop/GitHub/TalentisOS.

Goal: implement Phase 11 — SOPs, playbooks, templates and verified improvement lifecycle.

Inspect issue/improvement, task, archive and template code. Keep this module secondary and hidden until intentionally enabled. Do not build a document repository or team knowledge base.

Implement lightweight SOP/playbook records with title, purpose, owner role, lifecycle state, review date, linked source improvement/issue, version/history note and verification evidence. Use Draft → Trial → Verified → Retired. A standard becomes Verified only when evidence is recorded. A material review requiring an update must create or link an action.

Implement the approved template catalogue as guided record creation: EOD, Huddle, Top 3, weekly/monthly review, meeting, one-on-one, praise, feedback, coaching, delegation, expectations, difficult conversation, risk, decision, handover, 5 Whys, PDCA, priority, Training 360 requirement, induction checklist and self-development plan. Each template must identify its result, purpose, next action, required/optional fields, linked records and completion condition.

Add tests for lifecycle transitions, verification requirements, linked action creation and archive/reference safety. Run tests, checks and build. Test desktop, iPad and mobile workflows.

Update template catalogue, data dictionary, acceptance scenarios and governance records. Do not commit or push. Report changed files, evidence, limitations and proposed commit message. Stop for founder approval.
```

---

## Phase 12 — extended team takeover, stakeholder and change controls

### Goal

Progress from the First 7 Days into a role-based, evidence-led operating transition without turning the app into a people database or CRM.

### Deliverables

- 30-60-90-120-180-365 roadmap extension.
- Role/accountability, stakeholder/interface and current-state maps.
- Early wins, operating agreement, manager alignment, team-health themes and change records.
- Role-based contingency and external-system reference controls.

### Exit gate

All takeover outputs identify evidence, action, review point and role-based ownership; none create employee profiles, personal judgments or shadow operational records.

### Copy-paste implementation instruction

```text
Work in ~/Desktop/GitHub/TalentisOS.

Goal: implement Phase 12 — extended Team Takeover and operating transition controls.

Inspect First 7 Days, roadmap, task links, privacy guardrails and advanced-navigation behaviour. Keep these controls hidden until the leader intentionally enters a takeover/transition plan or passes the relevant Core stage.

Implement the extended 30-60-90-120-180-365 plan as evidence-based milestones, not time-triggered completion. Each milestone records intended result, evidence, what changed, open risks, actions/owner roles and next review point. Keep active links to tasks, risks, priorities, standards and capability gaps.

Implement role-based accountability maps, stakeholder/interface maps, current-state baseline, listening/observation themes, team operating agreement, early-wins register and manager-alignment plan. Add aggregate workload/capability themes, team-health themes and change records with reversible trials, communication, adoption check and verification decision. Add external-system reference maps and role-based contingency plans without duplicating authoritative ERP, MRP, APS, quality or safety data.

Prohibit names, personal judgements, performance dossiers, protected attributes, health information and confidential HR records. Every material record must lead to a clear next action or deliberate decision.

Add tests for privacy validation, roadmap continuity, action linking, archive/reference repair and role-based visibility. Run tests, checks and build. Test progressive disclosure and complete one takeover baseline-to-early-win workflow at 390 px, 768 px and 1440 px.

Update module requirements, data documentation, acceptance scenarios and governance records. Do not commit or push. Report changed files, evidence, limitations and proposed commit message. Stop for founder approval.
```

---

## Phase 13 — Training 360 role-based capability coverage

### Goal

Make role-level capability risk visible without storing individual employee data.

### Deliverables

- Role/work-area capability requirements and criticality.
- Aggregate coverage counts using the 0–4 capability scale.
- Gap actions, review dates and single-point-of-failure alerts.
- Links to risks, tasks, improvements and standards.

### Exit gate

The module identifies critical coverage gaps and creates a mitigation path while enforcing the no-names, no-individual-ratings release-one boundary.

### Copy-paste implementation instruction

```text
Work in ~/Desktop/GitHub/TalentisOS.

Goal: implement Phase 13 — Training 360 role-based capability coverage.

Inspect privacy requirements, task/risk relationships, advanced-module gating and current schema. Phase 13 must use aggregate role/work-area data only. Do not store employee names, individual learner labels or individual ratings for other people.

Implement role/work-area requirements with required skill, criticality, current aggregate coverage at ratings 0–4, target coverage, risk threshold, owner role, evidence reference, review date and gap action. Use the common scale: 0 Not trained; 1 Aware; 2 Can perform with support; 3 Competent; 4 Can train others.

Identify a single point of failure when only one available person is represented at rating 3 or 4 for a critical skill, or coverage is below the user-defined safe threshold. Surface it as a capability risk and provide a mitigation task/risk/improvement/standard link. Development plans are permitted only for the leader’s own self-development in Release 1.

Add tests for prohibited fields, coverage calculation, risk threshold, action linking, archive/reference repair and import/export. Run tests, checks and build. Test the matrix and alert workflow at 390 px, 768 px and 1440 px.

Update data dictionary, privacy documentation, acceptance scenarios and governance records. Do not commit or push. Report changed files, evidence, limitations and proposed commit message. Stop for founder approval.
```

---

## Phase 14 — search, analytics, annual review and later advanced tools

### Goal

Add retrieval and insight only once the product has enough trustworthy history to improve decisions rather than generate administration.

### Deliverables

- Local search and standard filters.
- Defined leadership measures and Not enough data states.
- Annual review/reset and advanced calendar/contingency refinements where evidence supports them.
- Performance limits for supported record volume.

### Exit gate

Insights lead to a practical review or action, never employee scoring; search remains local, fast and understandable at the documented record volume.

### Copy-paste implementation instruction

```text
Work in ~/Desktop/GitHub/TalentisOS.

Goal: implement Phase 14 — local search, leadership analytics, annual review and remaining later capability. Begin only after the Core has sufficient validated live-use history.

Inspect data volume, performance evidence, user feedback, existing filters, measures dictionary and privacy boundary. Do not add analytics or search solely because the records exist; each element must support a concrete leadership decision.

Implement local search across approved record types with record type, status, relevant date and linked action. Add standard filters for status, due/overdue, priority, blocked/waiting, date range, role/work area and archive state. Do not transmit data.

Implement only the defined measures: Top 3 completion, carry-over rate, EOD/Huddle consistency, KPI corrective-action closure, critical-skill coverage and issue recurrence. Every measure must show period, record count, formula, action trigger and Not enough data where appropriate. Never infer employee performance or create rankings.

Implement annual review as a guided assessment of operating results, leadership rhythm, stakeholder themes, capability coverage, recurring issues, verified improvements, standards due, strategic risks and next-year priorities. It must not delete records automatically. Add advanced calendar or contingency refinements only where a repeated live-use need is evidenced.

Define and test supported local-record volume, startup time, common action response and search/filter response. Run tests, checks and build. Test on 390 px, 768 px and 1440 px with realistic seeded data.

Update measures dictionary, performance/release standards, acceptance scenarios and governance records. Do not commit or push. Report changed files, evidence, limitations and proposed commit message. Stop for founder approval.
```

## Approval and baseline protocol

After any phase passes its exit gate, provide a concise approval report containing:

1. Phase result: PASS, NOT READY or BLOCKED.
2. User problem and outcome delivered.
3. Exact files changed and data migrations performed.
4. Automated and manual validation evidence, separated clearly.
5. Known limitations and deliberately deferred work.
6. Proposed implementation commit message.
7. The next phase recommended by this roadmap.

Only after founder approval: commit the implementation with a clear message; verify the clean worktree; then request separate authorisation before pushing where required. After implementation is approved, create the separate governance baseline and record its controlling implementation SHA.
