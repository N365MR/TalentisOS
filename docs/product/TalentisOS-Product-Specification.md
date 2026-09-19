# TalentisOS Product Specification

## Product build mandate

TalentisOS must be built from first principles around one user outcome: a leader can know what matters, lead the next conversation and follow through every workday—without reconstructing context or chasing fragmented updates.

The daily leadership loop is the product. Every screen, record, automation and visual element must either strengthen **Prepare → Align → Execute → Review → Improve** or be excluded. The app must not be developed as a collection of attractive but disconnected modules.

Build order is non-negotiable: product boundary and data integrity first; then the daily loop; then exception control; then repeatable leadership systems; then insight and refinement. No later module may weaken canonical task identity, local-first privacy or the daily loop.

## New Leader Core: launch product and progressive disclosure

The full specification is the long-term product vision. The launch experience must be a smaller **New Leader Core**: calm, useful guidance for a leader taking responsibility for people and work for the first time. It must be useful with less than five minutes of setup and must never require the leader to maintain a sophisticated system before it helps them lead.

The Core contains only:

1. **Start Here** onboarding: responsibility, workdays, this week's most important outcome and what needs attention tomorrow.
2. **First 7 Days** takeover guide: introduction, listening questions, observation checklist, stakeholder questions, daily reflection and a visible reminder to verify before changing a system.
3. **Daily Leadership Loop**: Home, End of Day, Morning Huddle, Today’s Work and one canonical task record.
4. **Current-stage roadmap**: show the current 30-60-90 milestone and its next action. Days 120-365 remain available but do not compete for attention before they are relevant.
5. **Needs attention**: one unified, type-aware surface for risks, blockers, decisions and handovers, each with context, next action and review date.
6. **Conversation toolkit**: practical preparation for one-on-ones, feedback, coaching, delegation and difficult conversations.
7. **Weekly review**: results, risks, start/stop/continue learning, recognition and next week’s priorities.

Advanced capability—including Training 360, SOP lifecycle, advanced analytics, global search, full contingency planning, annual reset, detailed stakeholder health and complex archival—must remain in the product vision but be progressively disclosed after the leader has established the Core rhythm or has a clear reason to use it. Detailed Team Takeover maps, Rocks, L10/IDS, the operating calendar and scenario plans are also deferred from the first-release experience.

Plain English is the default interface language. “Priorities”, “Weekly Review” and “Solve an Issue” must be used before optional explanations of Rocks, L10 and IDS. Framework terminology must teach; it must never be a prerequisite to act.

### Four-question screen test

Every Core screen must answer at least one of these questions immediately:

- What matters now?
- What should I say or do next?
- What is at risk if I do nothing?
- How will I know this is working?

If it does not, it belongs behind progressive disclosure, in supporting guidance or outside the product.

### Essential-interaction rules

Every primary screen must have one dominant decision and one clearly identifiable primary action. It may reveal no more than three secondary actions before progressive disclosure. A field, card, button, visual treatment or navigation item is permitted only when it changes a decision, reminder, relationship or outcome.

The app must preserve context after an action: it must not return the leader to a generic list when the relevant record or next decision can remain visible. Reversible routine actions should provide immediate Undo. Confirmation is reserved for consequential actions, particularly permanent deletion, data replacement and material lifecycle transitions.

Motion is feedback, not decoration. It may confirm completion, movement, saved state or changed priority; it must never delay action, conceal information or become necessary to understand a result.

### Interruption-safe drafts

Every material guided workflow—including EOD, Needs attention records, conversation preparation, weekly review and data import—must save an interruption-safe local draft while it is being edited. The interface must show a concise saved state, allow the leader to resume or discard a draft deliberately and restore a valid draft after refresh, offline restart or accidental navigation.

When the same record is open in more than one browser tab, the app must detect a conflicting save, preserve the local draft and explain which version is current. It must never silently overwrite completed or newly saved data.

### Launch hierarchy

The launch product has five visible destinations only: **Today**, **Prepare tomorrow**, **Start the day**, **Conversations** and **Tasks**. Home is the opening state for Today, not an additional dashboard destination. Needs attention is reached contextually from Today, EOD, Huddle and Home.

Advanced modules remain available to the product vision and controlled documentation, but must be hidden from default navigation until the leader has completed the relevant Core rhythm or explicitly chooses to enable them.

### Capability-status policy

This table controls scope where another section uses broader product language. A capability may be implemented before its status is enabled, but it must not appear in default navigation or onboarding before its stated availability.

| Capability | Availability rule |
| --- | --- |
| Daily loop, Needs attention, Conversations, First 7 Days, current roadmap milestone and Weekly Review | Available immediately after Start Here. |
| Meetings, issues, KPI scorecards, priorities and recurring routines | Available only after Core orientation and explicit user enablement. |
| SOPs/playbooks, Training 360, extended Team Takeover, search, analytics, operating calendar, scenario planning and annual review | Later capability; unavailable until explicitly enabled after the Core launch has passed live-use validation. |

No capability may appear automatically merely because time has elapsed. The leader retains the option to enable an eligible advanced tool when it solves a current problem.

### Help now, recognition and escalation

The Core Home surface must include an unobtrusive **I need help now** route. It offers five direct routes: I am overwhelmed; I need to have a difficult conversation; something may affect safety, quality or a customer; I need to delegate this properly; and I need to reset tomorrow. Each route must lead to a short decision sequence and one clear next action, not a generic article or long form.

Recognition must be a deliberate daily and weekly habit. Prompts must help the leader make acknowledgement timely and specific: what was observed, why it mattered and what to reinforce. It must remain private preparation, never a people-rating system.

The PWA must clearly identify when the playbook is not the right control. Safety, serious quality/customer failures, legal/privacy concerns, suspected misconduct, wellbeing emergencies and formal performance or disciplinary matters must be directed to the relevant senior leader, HR, safety, quality, legal or formal system. TalentisOS must not attempt to manage those matters itself.

## TalentisOS leadership framework

TalentisOS operationalises a practical leadership framework. It does not present frameworks as theory; it turns them into a visible daily practice.

### RPM: Results, Purpose, Massive Action

RPM is the primary decision model for the product.

- **Results:** define the outcome that matters, the measure of success, the owner role and the review point. Rocks, Top 3, KPIs, issue resolution and improvement outcomes must be expressed as results rather than activity lists.
- **Purpose:** connect the work to the customer, team, operational or organisational reason it matters. Purpose provides context for priorities, decisions, recognition and coaching; it must be concise and practical, not a mission-statement exercise.
- **Massive Action:** turn the result into clear next actions, commitments, follow-up dates and escalation when blocked. A commitment must lead to a canonical task or a deliberately recorded decision, not an unowned note.

Every guided workflow must help the leader answer: **What result is required? Why does it matter? What is the next accountable action?**

### Daily leadership rhythm

The daily rhythm gives RPM a repeatable operating cadence:

| Stage | Leadership question | TalentisOS behaviour |
| --- | --- | --- |
| Prepare | What has changed and what needs attention? | End of Day closes the prior workday, captures exceptions and prepares selected work for the next workday. |
| Align | What outcome, support and commitments are required today? | Morning Huddle reviews carry-over, Top 3, risks, KPI exceptions, decisions and recognition. |
| Execute | What is the next right action? | Today's Work presents ordered commitments, urgent work, blockers and follow-ups. |
| Review | Did we achieve the intended result? | EOD, scorecards, meeting conclusion and completion history make results visible. |
| Improve | What must change in the system of work? | Issues/IDS, 5 Whys, PDCA, Kaizen and verified SOP/playbook updates turn lessons into a better standard. |

### Leadership operating disciplines

The PWA must support the following disciplines without creating management theatre:

- **Clarity and accountability:** clear result, role-based ownership, next action and review date for material work.
- **Operational discipline:** visible priorities, KPI exceptions, risk controls, handovers and meeting commitments.
- **Coaching and capability:** praise, feedback, coaching, delegation, difficult conversations and expectations are prepared with practical prompts and followed through with actions where needed.
- **Continuous improvement:** recurring problems are identified, solved at the root cause where practical, verified and standardised.
- **Respectful leadership:** recognition, role clarity and support needs are part of the daily rhythm. The app does not reduce leadership to task completion or surveillance.

### Framework rules for product decisions

- A feature must identify the RPM decision or daily-rhythm stage it supports.
- A priority, KPI, issue, risk, decision, meeting action or improvement must have a clear result and accountable next action when action is required.
- Activity counts alone are not leadership measures. The product prioritises outcome, exception, follow-through and learning.
- Coaching tools must strengthen clarity, support and accountability; they must not become employee dossiers.
- The Home dashboard must show leadership attention through the framework: results at risk, purpose-relevant context and the next accountable action.

## Team Takeover workspace and leadership plan

TalentisOS must include a dedicated, time-bound Team Takeover workspace for a leader inheriting a new or returning-to team. It is a private leadership playbook, not a team database. Its job is to help the leader understand the system of work before changing it, establish trust and operating discipline, and transition into normal Leader Standard Work.

### First 7 Days: listen, observe and establish safety

The workspace must guide the leader to prepare an introduction, listening prompts, observation priorities and a short daily reflection. It must emphasise: listen before deciding, verify before changing, identify system constraints before attributing performance to people, and raise material safety, quality, customer or continuity risks promptly.

The first-seven-days workflow must create no automatic organisational changes, promises, team restructuring or new KPI commitments. Its outputs are questions, evidence, risks, stakeholder commitments and the next best action.

### Team takeover controls

The workspace must include:

- a role and accountability map: function, purpose, responsibilities, decision rights, handover inputs/outputs and escalation route;
- a stakeholder and interface map: internal/external function, expected service, operating cadence, open commitment, friction theme and escalation need;
- a current-state baseline across workflow, demand/capacity, KPI health, quality, customer impact, operational risk, skills coverage, recurring issues, systems and routines;
- a listening and observation log that records themes, evidence, contradictions and questions to test, never personal judgments or HR commentary;
- a team operating agreement covering purpose, priorities, communication rhythm, handover standard, meeting expectations, decision rights and escalation rules;
- an early-wins register: evidence, intended result, risk, reversible test, owner role, verification date and decision to adopt, adapt or stop;
- a manager-alignment plan covering the manager's success criteria, update cadence, decision boundaries and early escalation triggers; and
- aggregate workload/capability visibility by role or work area, including backlog pressure, coverage gaps, single points of failure and required support.

One-on-one, feedback, coaching and delegation templates may be used during takeover, but they must record only role-relevant preparation, themes and follow-up actions. TalentisOS must not store employee profiles or confidential individual commentary.

### 30-60-90-120-180-365 leadership plan

The extended leadership plan begins at takeover and hands progressively into the daily, weekly and monthly operating rhythm.

| Period | Leadership focus | Required outputs and exit evidence |
| --- | --- | --- |
| Days 1-30 — Learn, Listen, Stabilise | Understand work, roles, stakeholders, risks, performance signals and team rhythm. Establish EOD, Huddle, Top 3 and a reliable escalation path. | Current-state baseline; stakeholder/interface map; role/accountability map; first risks and KPI baseline; Team Takeover observations tested against evidence. |
| Days 31-60 — Align, Improve, Execute | Clarify purpose, expectations, decision rights, priorities and routines. Solve evidence-supported blockers and begin capability/support actions. | Team operating agreement; initial Rocks; agreed scorecard; issue backlog; corrective actions; early wins verified or stopped. |
| Days 61-90 — Scale, Optimise, Lead | Strengthen accountability, delegation, standard work, coaching and improvement. Reduce recurring instability. | Operating cadence embedded; SOP/playbook candidates; Training 360 gap plan; Rock review; 90-day outcome review and next-quarter priorities. |
| Days 91-120 — Embed and Predict | Make the operating system dependable without relying on the new leader's constant intervention. | Stable meeting, handover and review cadence; verified standards; repeated KPI/issue learning cycle; delegation and escalation review. |
| Days 121-180 — Lead Strategically | Shift more attention from daily intervention to capacity, cross-functional alignment, risk prevention and medium-term improvement. | Six-month operating review; trend-based priorities; stakeholder alignment plan; capability-risk mitigation; improvement portfolio with verified outcomes. |
| Days 181-365 — Scale, Mentor, Innovate | Build leadership depth, improve system resilience and create sustainable improvement capacity. | Annual review; succession/capability coverage at role level; annual improvement results; refreshed standards; next-year leadership and operating plan. |

At every milestone, the leader must record: intended result, evidence, what changed, risks still open, actions/owners and the next review point. Advancing a phase is based on evidence and operating stability, not elapsed time alone.

### Transition to normal operation

The Team Takeover workspace must be progressively reduced after Day 90, not abandoned. Active risks, Rocks, actions, standards, Training 360 gaps and stakeholder commitments remain linked to their respective ongoing modules. The Home dashboard must show the current leadership-plan stage and the next milestone only while the plan is active.

## Delegation, team health and change leadership

### Delegation control

Delegation is a leadership control, not a task assignment. A delegation record must state the intended result, why it matters, accountable role, decision rights, boundaries, support/resources, check-in date, definition of done, escalation trigger and linked canonical task(s).

The leader reviews the agreed outcome and support at check-in; the app must not treat delegation as complete because work has merely been assigned. Delegation records support coaching, capability development and workload planning without becoming employee surveillance.

### Team health and culture pulse

TalentisOS must provide a lightweight, aggregate Team Health pulse for a leader to review clarity, workload pressure, communication quality, confidence in priorities and improvement suggestions. It records only themes, evidence and leadership actions—not individual ratings, names, personal commentary or HR records.

A sustained adverse theme must prompt a review of workload, role clarity, operating routines, support, capability and escalation paths before attributing the issue to individuals.

### Change and communication plan

Material changes to standards, routines or ways of working require a compact change record: reason, intended result, affected roles/functions, stakeholder impact, communication action, trial period, feedback channel, adoption check, verification date and decision to adopt, adapt or stop.

Changes should be trialled reversibly where practical. The app must link the change to its source issue/improvement, relevant SOP/playbook and any action required to verify adoption.

### Stakeholder relationship review

The stakeholder map must support periodic review of relationship health, recurring friction, mutual commitments, next contact/review point and escalation need. This is an operational-interface control, not a CRM.

### One-on-one operating rhythm

One-on-one preparation and follow-up must support purpose, role/work themes, commitments, support required and next conversation. It must avoid names, confidential personal details, protected attributes, health information, disciplinary notes and performance dossiers. Role-based themes and follow-up actions are the default.

### External-system reference map

TalentisOS must document the systems that remain authoritative outside the PWA, such as ERP, MRP, APS, quality or safety systems. Each entry identifies its purpose, authoritative data, key exception signals, owner role and review cadence.

The app may link to or prompt review of those systems but must not duplicate their core records or position itself as the authoritative operational system.

### Operating calendar and contingency planning

The operating calendar must show TalentisOS routines and milestones: daily rhythm, weekly review, monthly review, Rock checkpoints, Training 360 reviews, SOP reviews, annual review and configured key operational events. It is not a replacement for a calendar service.

Contingency plans must support simple, role-based scenarios such as critical capability loss, major backlog, KPI deterioration, customer-impacting failure or system outage. Each plan states the trigger, first action, escalation route, decision owner, recovery action and verification point.

## Training 360 capability framework

Training 360 is TalentisOS's practical capability-development system. Its purpose is to make required role capability visible, close material skill gaps, reduce single points of failure and verify that learning has become reliable performance.

Training 360 applies the leadership framework directly:

- **Result:** the required capability exists at the required level for the relevant role or work area.
- **Purpose:** the leader can explain the customer, safety, quality, delivery, continuity or development reason the capability matters.
- **Massive Action:** the capability gap becomes a time-bound learning plan, an owner-role commitment and, where required, a canonical task or risk control.

### Core elements

Training 360 must include:

- a role-based training and skills matrix;
- defined role requirements and critical-skill flags;
- induction checklists;
- 30-60-90 capability plans for a new leader or role transition;
- role-based individual development plans, where the user is permitted to retain the information;
- training owner role, target date, status, supporting evidence and review date;
- a verified skill-rating scale; and
- single-point-of-failure alerts and follow-up actions.

### Capability scale

Every required skill must use the following common rating scale:

| Rating | Meaning | Capability evidence |
| --- | --- | --- |
| 0 | Not trained | No demonstrated training or ability to perform the work. |
| 1 | Aware | Understands the requirement but cannot yet perform the work reliably. |
| 2 | Can perform with support | Can perform the work under guidance or with an approved support arrangement. |
| 3 | Competent | Can perform the work reliably to the required standard without routine support. |
| 4 | Can train others | Is competent and can coach, assess or train others against the agreed standard. |

The matrix must capture the current rating, target rating, skill criticality, review date and evidence reference. A rating is a development control, not a performance or disciplinary score.

### Skills matrix and single-point-of-failure control

For each role/work area, Training 360 must show required skills, the current capability coverage, target capability, criticality, owner role, next review and open gap actions.

A critical skill is a single point of failure when only one available person is rated 3 or 4, or when the user records coverage below the defined safe threshold. The PWA must surface this as a training risk, prompt a mitigation plan and allow the action to link to a canonical task, risk, issue or improvement.

The PWA must provide practical coverage measures: critical-skill coverage, current versus target gap, induction completion, overdue training review, gap-closure progress and open single-point-of-failure risks.

### Training workflow

Training 360 must guide a leader through:

1. define the role and required skills;
2. set the required rating and criticality;
3. assess current capability against evidence;
4. identify the gap and its operational risk;
5. create a training or development plan with owner role and review date;
6. record completion evidence and reassess capability;
7. verify sustained competent performance; and
8. update the matrix, training risk, SOP or playbook where the learning changes the standard.

Induction must use a checklist with required items, due/review dates, completion evidence and a clear completion state. The 30-60-90 pathway must use the approved terminology: **30 Days — Learn, Listen, Stabilise; 60 Days — Align, Improve, Execute; 90 Days — Scale, Optimise, Lead.**

### Privacy and data boundary

TalentisOS must not become an employee training database or personnel file. The default Training 360 model is role-, skill- and coverage-based. It must not require names, personal details, protected attributes, employment records, disciplinary information or private performance commentary.

Where a leader uses a locally retained individual development plan, it must contain only the minimum work-capability information necessary for the plan, carry a prominent privacy warning and remain outside any shared or cloud workflow. A role-based or de-identified reference is the default approach.

## Foundational decisions

- **One user, one private workspace:** TalentisOS is initially for a leader's personal operating practice. It has no account, team database, live collaboration or required online service.
- **One source of truth for work:** a task has one permanent identity. Other modules store references to it, never copies of it.
- **Local-first by design:** IndexedDB is the primary store. The PWA must work after installation without a connection. JSON export/import is the user-controlled portability and recovery path.
- **Leadership-focused:** use owner, recipient and team/function roles rather than employee profiles. Do not store sensitive HR, health, disciplinary, payroll or confidential personnel information.
- **Guided but not prescriptive:** the product gives a leader useful prompts, structure and templates; it does not grade employees or impose a generic management method.
- **Progressive disclosure:** the Home dashboard, EOD, Morning Huddle and Today's Work are primary. Secondary tools appear only when they help the current decision.

## Required build sequence

### Foundation and product integrity

Before expanding feature scope, the application must have a single authoritative repository and phase register, a documented versioned data model, repeatable database migrations, a clear import/export contract, a consistent workday/date utility and a source-of-truth test suite.

The app must not expose unfinished placeholder modules in production navigation. A module is either implemented and useful, deliberately hidden, or clearly identified as a non-production preview.

### Daily leadership loop

Build and validate the canonical task engine, End of Day, carry-over, Morning Huddle, Today's Work and a live Home opening state as one coherent workflow. A user must be able to complete this end-to-end journey on phone, iPad and desktop without duplicate records or manual re-entry.

### Exception control and accountability

Build risks, decisions, handovers, KPI exceptions, issues and meetings as operational controls that link to tasks and appear where action is taken: Home, EOD, Huddle and Today.

### Reusable leadership systems

Add conversation tools, weekly review, First 7 Days and the current 30-60-90 milestone only after task and exception relationships are reliable. Add recurring routines, Rocks/priorities, L10/IDS, templates, SOPs/playbooks, Training 360 and continuous improvement only after the Core has passed live-use validation.

### Insight, hardening and release

Complete accessibility/performance hardening, backup/recovery drills, install/offline verification and release acceptance before launch. Add personal leadership analytics only after the Core has generated sufficient useful history. Analytics must reflect leadership patterns, never employee surveillance.

## Product definition

TalentisOS is a local-first progressive web app for people leaders. It gives a leader one private, practical playbook to decide what matters, prepare the next conversation, follow through on commitments and improve how work is led.

The product is built around one daily loop:

**End of Day → Morning Huddle → Today's Work**

That loop turns leadership from a collection of disconnected notes, messages and reminders into a reliable daily rhythm. TalentisOS is a leadership playbook, not a general-purpose work-management platform.

## The problems the PWA must solve

1. **Lost context between workdays.** A leader must be able to close the day, capture what remains, and return to the right context the next workday without recreating it.
2. **Reactive prioritisation.** The PWA must make the next leadership action, Top 3, urgent work, blockers and commitments easy to see before the day becomes reactive.
3. **Fragmented commitments.** Tasks, meeting actions, risks, decisions, KPI exceptions and issue actions must connect to the same underlying work rather than exist as isolated lists.
4. **Weak follow-through.** Risks, decisions, handovers and red KPI results need a clear owner, status, due follow-up and visible resolution path.
5. **Leadership habits without bureaucracy.** New leaders need guidance; experienced leaders need speed. The experience must help both without requiring a complex system or heavy administration.
6. **Privacy and control.** A leader must retain control of their data and be able to work without a cloud account, a network connection or third-party tracking.

## Who it is for

TalentisOS is for individual leaders who coordinate people, priorities, delivery and improvement. The primary users are:

- new and emerging leaders building sound leadership habits;
- frontline, operations, manufacturing, service and project-adjacent managers managing daily delivery, customer commitments and operational risk; and
- experienced leaders who want a lightweight private command surface for their own leadership practice.

It must work naturally on iPhone, iPad and desktop, including during a shift, in a huddle, at a desk and at the end of the workday.

## Who it is not for

TalentisOS is not a replacement for:

- project portfolio management, Gantt planning, resource scheduling or a full collaboration workspace;
- CRM, ERP, HRIS, payroll, recruitment, time tracking or employee surveillance;
- employee files, disciplinary documentation, health information or other sensitive HR records;
- team chat, email, document management, a company knowledge base or a controlled quality-management system;
- a shared cloud database, multi-user real-time editing or enterprise reporting platform; or
- mandated safety, financial, privacy, quality or regulatory record systems.

## Product promise

At the start of a workday, the leader can see what matters, what is due, what is blocked, what needs a decision and what they have committed to do. At the end of the day, they can close the loop in minutes and reliably carry the right work forward. A first-time user must identify and complete a meaningful first action within two minutes of opening the app.

## Required PWA capabilities

### 1. Home: Today’s decision surface

Home must open as Today’s decision surface, not a control-room dashboard. It must show one next best action and a concise view of:

- today's Top 3 and their completion state;
- due, overdue, urgent, flagged and carry-over work;
- active blockers, critical risks, decision follow-ups and ready handovers as **Needs attention**;
- KPI exceptions requiring action;
- open issue and meeting-action attention; and
- quick routes into End of Day, Morning Huddle and Today's Work.

For a New Leader Core user, Home must privilege the current-stage next milestone and include the I need help now route. It must not expose advanced dashboards, empty modules or framework jargon before the associated routine is established. Cards may not compete with the primary next action; a card without an action or an explanation of why it matters is not permitted.

The dashboard must explain why an item needs attention and take the user directly to the action, not merely display counts.

### 2. Canonical task engine

The task engine is the system of record for work. A task must be created once and reused across every module. It must support:

- title, notes, status, priority, due date/time, urgent and flagged states;
- category, tags, optional local image and relevant links/references;
- subtasks, with `x of y` progress and a visible progress bar;
- created, updated and completed dates;
- blocked and waiting states with context;
- links to a meeting, KPI, issue, roadmap item, risk or decision;
- views for Inbox, Today, Upcoming, Anytime, Someday, Flagged, Urgent and Completed; and
- completion synchronisation everywhere the task appears.

The Core must provide Quick Capture from Today and Tasks. Quick Capture asks only for a title, with optional urgency and due date. Classification, links and detailed context are progressively editable later. It must never require a framework, category or long form before the leader can capture work.

It must prevent duplicate records when an action is added to EOD, a huddle, a meeting, an issue, a risk or a decision. Deleting a linked source record must not delete the task or leave broken task data.

### 3. End of Day

End of Day is the primary daily review. It must provide a short guided capture flow and tappable counts, enabling the leader to record:

- completed work and outstanding work;
- risks and critical concerns;
- customer or service issues;
- blocked or waiting work;
- decisions required or made;
- handovers;
- tomorrow's Top 3; and
- improvements and lessons.

The user must be able to create, update, complete and link canonical tasks from this view. End of Day must not require the user to re-enter information already captured elsewhere.

### 4. Carry-over and next-workday logic

Outstanding work must carry to the next applicable workday without cloning the task. The system must preserve each task's age, carry count and movement history.

- Monday to Thursday: carry forward to the next day.
- Friday to Sunday: carry forward to Monday.
- Adding a task to the target huddle must be duplicate-safe and idempotent.
- The user must be able to add individual work, selected work or all outstanding work, and review items before adding them.
- Completing work in any module must complete it everywhere.

### 5. Morning Huddle

Morning Huddle must begin with relevant End of Day context rather than a blank form. It must guide the leader through:

- carry-overs and Top 3;
- risks, blockers and customer/service issues;
- KPI exceptions and corrective actions;
- resources, support and decisions needed;
- commitments and actions linked to canonical tasks; and
- recognition.

It must enable a fast daily alignment review without re-entering yesterday's information.

### 6. Today's Work

Today's Work is the execution surface. It must make the daily plan usable by showing:

- Top 3;
- due and overdue work;
- carry-overs;
- urgent, flagged, blocked and waiting items;
- huddle commitments and meeting actions;
- decision follow-ups and exception-related work; and
- completion progress.

It must stay focused on leadership execution and not become a comprehensive project-management board.

### 7. 30-60-90 onboarding roadmap

The PWA must provide a guided first-90-days experience with milestones, progress and a next best action:

- **Days 1-30: Learn, Listen, Stabilise** — understand the role and work, map stakeholders, complete initial 1:1s, establish KPI/risk baselines and adopt EOD, Huddle and Top 3.
- **Days 31-60: Align, Improve, Execute** — clarify expectations and ownership, strengthen feedback, coaching and delegation, establish issue management and disciplined meetings, and begin improvements.
- **Days 61-90: Scale, Optimise, Lead** — standardise meetings and SOPs, reduce recurring issues, strengthen accountability and delegation, set priorities and complete the 90-day review.

The leadership maturity progression is Foundation → Relationship → Feedback → Coaching → Delegation → Accountability → Leadership Maturity.

For a team takeover, this roadmap is the first stage of the 30-60-90-120-180-365 Leadership Plan defined in the Team Takeover workspace. Its records must link to the extended-plan milestones rather than create parallel progress histories.

### 8. KPI and scorecard engine

Each KPI must include its name, purpose, formula/data source, owner role or function, target, warning and off-track thresholds, frequency, trend and corrective action.

KPI status must be: On Track, At Risk, Off Track or Not Reported. Amber and red results are exceptions. A red result must require a corrective action linked to a canonical task. The scorecard must prioritise exceptions over decorative reporting.

### 9. Issues, IDS and continuous improvement

The issue workflow must support: **Capture → Prioritise → Identify → Discuss → Solve → Act → Verify**.

It must support 5 Whys, prioritisation, discussion notes, solution/action creation, verification and conversion to a task, improvement action or SOP/playbook where appropriate. Continuous improvement must use lightweight PDCA and Lean waste identification, focused on a clear owner, due action and verified outcome.

### 10. Meetings and L10

Meetings must provide a focused record and reliable action follow-through. The PWA must support a practical L10 structure:

- Segue;
- Scorecard;
- Rocks/Priorities;
- Headlines;
- To-Dos;
- IDS;
- Conclude; and
- meeting rating.

Meeting actions must create or link to canonical tasks. Meeting deletion or archival must preserve the task and clearly handle the removed reference.

### 11. Leadership conversations

The PWA must provide concise, practical templates for praise, feedback, coaching, delegation, difficult conversations and expectations. These are private preparation and follow-up tools, not employee files. The product must discourage sensitive personal, health, disciplinary, payroll and performance-record storage.

The New Leader Core templates must use the following plain-language structures:

- **One-on-one:** What is going well? What is difficult? What support is needed? What will we agree?
- **Feedback:** Situation → Behaviour → Impact → Next step.
- **Coaching:** Goal → Reality → Options → Way forward.
- **Delegation:** outcome, guardrails, authority, check-in and definition of done.
- **Difficult conversation:** facts, intent, opening, questions, agreement and follow-up.

The app must include a short **How I Lead** section for the leader’s personal commitments: values, communication standards, non-negotiable behaviours and practices they intend to improve. It is private and must not be used to assess other people.

It must also provide a recurring **Manager-up update** routine: results achieved, decisions needed, material risks, support required and next review. This makes upward alignment a normal leadership habit rather than a one-off takeover activity.

### 12. Needs attention: risks, decisions and handovers

Risks, decisions and handovers remain distinct structured records and lifecycles, but the interface must present them together as **Needs attention** whenever the leader is deciding or acting. The unified view must clearly identify the record type while consistently showing: what happened, why it matters, the next action, what or who is waiting, review date and linked task.

The underlying controls are:

- **Risks:** title, context, severity/attention, owner role, status, linked task and resolution. Closing a risk must require a resolution note.
- **Decisions:** title, context/options, decision status, owner role, follow-up task, revision history/count and archive capability.
- **Handovers:** concise operational context, owner/recipient role, readiness and acknowledgement status, linked task and archive capability. The lifecycle is Draft → Ready → Acknowledged → Archived.

The home dashboard and daily workflow must surface critical risks, decision follow-ups and ready handovers. Links must support linking, replacing and unlinking a canonical task without duplication.

### 13. SOPs, playbooks, frameworks, templates and analytics

The PWA must support lightweight reusable leadership guidance rather than a document repository:

- SOP/playbook records or task-linked references created from verified improvements;
- practical frameworks and templates that reduce the effort of common leadership actions; and
- simple personal leadership analytics that show workload, carry-over, task completion, recurring issue and improvement patterns without surveillance or employee scoring.

These capabilities must remain secondary to the daily loop and must not create administration for its own sake.

### 14. Settings, backup and recovery

Settings must include data and backup, privacy/storage, application/version information, PWA installation help and a clearly separated danger zone for deliberate destructive actions.

The PWA must support user-controlled JSON export and safe import. Import must validate data, migrate known schema versions safely, avoid silent duplication and make recovery possible after device/browser loss. No essential user data may rely solely on localStorage.

Settings must show **Backup health**: the date of the last successful export; whether no export has been made; and a plain-language stale-backup prompt. Reset or clear-data actions require an export-first reminder and must explain that browser or device clearing can remove local data.

## Data and integrity requirements

- IndexedDB is the primary live-data store. LocalStorage is only for small preferences.
- Data must be local-first and usable offline after installation.
- A canonical task has one identity across EOD, Huddle, Today, meetings, issues, KPIs, risks, decisions and roadmap items.
- References are links, not copies. Source deletion must be handled safely.
- All state changes must update relevant dates and preserve meaningful history.
- The data model must be versioned and migrations must be safe, repeatable and tested.
- Export/import must include the required records, relationships and schema version.
- The PWA must avoid unnecessary personal data and never require employee profiles.

## User experience and accessibility requirements

- Calm, minimal interface with clear hierarchy, generous whitespace, restrained surfaces and concise copy. Dark appearance is the default; a system-aware light appearance is permitted only where it meets the same clarity and contrast standard.
- Mobile and iPad first; desktop must remain efficient. Primary tap targets must be at least 44 px.
- Progressive disclosure: show the next useful action before detailed configuration.
- Clear empty states, inline validation and understandable error recovery.
- Keyboard-accessible desktop interactions and usable screen-reader semantics.
- Respect reduced-motion preferences; motion must never obscure information or delay completion.
- Status must never depend on colour alone. Each meaningful status must have clear text and, where useful, an icon.
- Typography, spacing and content hierarchy must do most of the visual work. Decorative gradients, glass treatments, card grids and icons are prohibited unless they improve comprehension or action.
- Icons must have a visible label unless their meaning is universally clear in context.
- No dense forms, visual clutter, excessive navigation or decorative animation.
- A PWA install experience, service worker, manifest and offline shell must be maintained.

## Technical constraints

- Vite, vanilla JavaScript ES modules, semantic HTML and modern CSS.
- IndexedDB storage; no backend service, cloud database, tracker or third-party analytics.
- Static deployment through GitHub Pages.
- Responsive testing at desktop, iPad and iPhone widths, including 1440 px, 768 px and 390 px workflows where a feature affects the daily loop.
- JSON backup/import and service-worker cache updates must remain compatible with schema changes.

## What success looks like

Success is behavioural and operational, not a count of records created.

- A normal End of Day review and next-workday preparation can be completed in under 10 minutes.
- The Morning Huddle takes minutes because the previous day's relevant context is already available.
- The dashboard and Today's Work make the next best action, Top 3, exceptions and commitments immediately clear.
- A task completed in any view is completed everywhere, with no duplicate task records or conflicting state.
- Risks, decisions, handovers and red KPI exceptions reliably turn into owned action and visible follow-up.
- The app reduces time spent reconstructing work after interruptions and chasing updates through disconnected systems.
- A leader can use it confidently on phone, iPad and desktop without training-heavy administration.
- The user can export, restore and retain control of their data without a cloud account.

## Delivery and quality gate

Every phase must identify the user problem, the RPM/daily-rhythm stage it supports, affected records and interfaces, and the smallest coherent change. Before approval it must demonstrate:

- correct persistence, migration and relationship behaviour;
- duplicate prevention and safe deletion/archival handling;
- navigation and interaction quality on desktop, iPad and iPhone;
- no console errors in the affected workflow;
- automated tests and production build passing; and
- updated data-model and governance documentation where required.

Any proposed feature is out of scope unless it strengthens Prepare, Align, Execute, Review or Improve; reduces friction; preserves the one-source-of-truth rule; and remains within the privacy boundary.

## Mandatory improvements to the product scope

### Live daily dashboard

Home must be data-driven, not a static welcome screen or a set of generic count cards. It must prioritise the next best action, then show only the items that need leadership attention:

- ordered Top 3 with completion progress;
- overdue, due-today, urgent, blocked, waiting and carried work;
- critical risks, decision follow-ups and ready handovers;
- red and amber KPI exceptions, including their corrective action state;
- open issue and meeting-action attention; and
- clear calls to start or complete EOD and Morning Huddle.

Every summary item must explain why it appears and link directly to the underlying record or action.

### Complete task lifecycle

Task capture must be fast, but task detail must support title, context, category, tags, priority, due date/time, urgent/flagged state, blocked/waiting context, subtasks, references, age, carry history and an optional local image.

The PWA must also support simple recurring leadership routines. Examples include a weekly L10, a safety walk, a monthly operations review, a KPI review and 1:1 preparation. Recurrence creates the next occurrence; it must not mutate completed history or turn TalentisOS into a calendar product.

For material work, archive is preferred to permanent deletion. If deletion is permitted, the app must first show linked records and then either remove/repair references or preserve the task as an archived record. No action may leave an orphaned EOD, Huddle, KPI, meeting, issue, risk, decision or handover reference.

### Real exception records

Risks, decisions and handovers must be structured records, not free-text notes captured separately in EOD or Huddle. They must have a status, history, role-based ownership, context and canonical task relationship. The user must be able to link, replace or unlink a task safely.

Closing a risk requires a resolution note. Archiving a decision preserves its history. A handover requires the defined lifecycle and acknowledgement record. These controls must feed the daily dashboard and daily loop automatically.

### Daily loop integration

EOD, Huddle and Today must consume the same live task and exception data. Manual text may supplement context but cannot become the only record of an actionable risk, decision, handover or corrective action.

The PWA must use one workday calculation everywhere. The next-workday rule is Monday–Thursday to the following day and Friday–Sunday to Monday, with a future documented extension for jurisdiction-specific public holidays. All date display and persistence must be timezone-safe.

### Navigation and information architecture

The visible Core navigation is limited to Today/Home, Prepare tomorrow, Start the day, Conversations and Tasks. Needs attention is contextual, not another top-level destination. Secondary tools are progressively disclosed through contextual links or a concise More area once enabled. Incomplete routes must be hidden rather than represented by empty placeholder screens.

## Engineering and quality requirements

### Architecture

- Keep Vite, vanilla JavaScript ES modules, semantic HTML and modern CSS.
- Organise code by domain: each domain owns its state service, validation, view components and tests. Keep application orchestration thin; do not allow one controller file to become the source of unrelated behaviour.
- Maintain one shared utility for date/workday rules, identifiers, confirmation handling and record-reference repair.
- Use explicit schemas for every persisted record and export version. Validate inputs at service boundaries, not only in the UI.
- Use additive, tested IndexedDB migrations. A migration must preserve existing records or stop safely with a recoverable error.

### Import, export and recovery

- Export must contain the schema version, all required stores, relationships and export timestamp.
- Import must parse and validate the complete envelope and every record before changing storage.
- Import must support documented migration paths from prior supported versions.
- Before destructive replacement, show what will be replaced and require explicit confirmation.
- Import must be atomic: it either completes with validated data and relationships or leaves the current workspace unchanged.
- Settings must provide an export-first reset/clear-data path and a clearly worded recovery procedure.

### PWA resilience

- Include valid manifest metadata, appropriate icons including iOS home-screen support, service worker registration and a verified offline application shell.
- Adopt an explicit cache version and update strategy that avoids indefinitely stale application assets.
- Verify clean install, refresh, offline launch, version update and data persistence independently on iPhone, iPad and desktop.
- GitHub Pages must remain path-safe at `/TalentisOS/`; data remains device-specific and is never deployed with the static application.

### Testing and release evidence

Unit tests are necessary but insufficient. Each release candidate must include:

- service/domain tests for task identity, state transitions, workday rules, migrations, import validation and reference repair;
- browser end-to-end tests for EOD → Huddle → Today, exception-to-task follow-up, completion synchronisation, archive/delete resilience and backup/restore;
- responsive workflow checks at 390 px, 768 px and 1440 px;
- keyboard, focus, semantic and contrast checks, including reduced-motion behaviour;
- PWA install/offline/refresh checks; and
- successful production build, source checks, clean working tree and updated governance records.

The release report must distinguish automated evidence from manual evidence. No phase is approved merely because the build passes.

## Operating cadence and review system

TalentisOS must connect daily execution to weekly and monthly leadership practice. The app must provide a lightweight Leader Standard Work cadence:

| Cadence | Required review | Primary outputs |
| --- | --- | --- |
| Daily | EOD, Morning Huddle and Today's Work | Top 3, commitments, risks, decisions, handovers and completed work. |
| Weekly | Scorecard, Rocks, issues/IDS, capacity/training risks and improvement actions | Corrective actions, owned priorities, resolved issues and next-week commitments. |
| Monthly | Operating review, KPI trend, Training 360 coverage, SOP/playbook review and improvement verification | Trend decisions, capability actions, standard changes and follow-up plan. |

Each review must produce a concise decision record and canonical actions where follow-up is required. The product must not require minute-by-minute meeting administration.

The New Leader Core weekly review must work without scorecard, Rocks or IDS knowledge. Its guided prompts are: What worked? What did not? What is at risk? What should I stop, start or continue? Who should I recognise? What are next week’s priorities? Advanced review sections appear only when relevant records exist or the leader elects to enable them.

## First-run onboarding and setup

The first-run experience must be a guided setup, not an empty workspace. It must capture only the minimum local preferences needed to make the daily loop useful:

- preferred workdays and working-hours boundaries;
- leader role/function and 30-60-90 starting stage;
- a first-week Team Takeover plan where the leader is new to or returning to a team;
- optional starter routines, such as EOD, Morning Huddle, weekly review and monthly review;
- an optional first Top 3, KPI or priority;
- an explanation of local storage, backup responsibility and privacy boundary; and
- an explicit prompt to export the first backup after meaningful data has been created.

Sample data must be optional, clearly identified and removable without affecting user records.

## Rocks and priorities

Rocks are time-bound, outcome-based priorities that connect the weekly/monthly review to the daily loop. Every Rock must include a result, concise purpose, owner role, period, status, measurable success condition, review cadence and optional linked KPI, issue, risk, decision or canonical task.

The dashboard must show only active or at-risk Rocks. A Rock cannot be considered complete solely because its supporting tasks are complete; the leader must confirm the intended result was achieved or record the outcome and next decision.

## Search, filtering and retrieval

The PWA must provide fast local search across tasks, issues, meetings, risks, decisions, handovers, Rocks, SOPs/playbooks and Training 360 records. Results must identify record type, status, relevant date and linked action.

Standard filters must include status, due/overdue, priority, blocked/waiting, date range, role/work area and archived state. Search and filtering must remain local and must not transmit user data.

## Leadership attention priority rules

When multiple records need attention, Home and Today's Work must order them consistently:

1. critical risk, safety/capability continuity concern or ready handover requiring acknowledgement;
2. overdue decision, blocked commitment or red KPI corrective action;
3. due-today Top 3, urgent work and meeting commitment;
4. at-risk KPI, open issue, Training 360 gap or Rock at risk; then
5. routine due work and recurring leadership routines.

The user can always access all work, but the primary surfaces must not flatten urgency by treating every record as equally important.

## SOP, playbook and framework lifecycle

SOPs, playbooks and frameworks are lightweight standards, not a document-management system. Each record must have a title, purpose, owner role, current lifecycle state, review date, linked source improvement/issue where applicable, and version/history note.

The lifecycle is **Draft → Trial → Verified → Retired**. A standard becomes Verified only when the leader records the evidence or outcome that supports its use. A material standard review must generate an action when an update is required.

## Analytics and leadership measures

Analytics must show trends and learning, not raw activity counts or employee rankings. The specification for each measure must state its formula, time period, intended interpretation and action trigger.

Required measures are: Top 3 completion rate; EOD and Huddle consistency; carry-over count, age and trend; overdue-work trend; KPI health and corrective-action closure; issue closure and recurrence; Rock progress; Training 360 critical-skill coverage, gap closure and single-point-of-failure count; verified improvement outcomes; and leadership-rhythm consistency.

Analytics must be based on local records, explain their limitations and never infer employee performance.

## Data lifecycle and recovery rules

Every persisted record type must define active, completed/resolved, archived and deletion behaviour. Archiving preserves the record, history and safe references; deletion is permitted only where it cannot harm linked history or after a repair/confirmation flow.

The app must offer a restore path for recently archived records. It must disclose storage limitations, handle quota or IndexedDB failures without silently losing data, and show plain-language recovery steps.

Standard JSON exports are readable files. The initial product must warn the user to store them securely. Passphrase-protected exports are a later privacy enhancement and must use browser-native cryptography with no password recovery or server dependency.

## Platform, performance and accessibility baseline

TalentisOS supports current Safari on iPhone/iPad and current Safari, Chrome, Edge and Firefox on desktop. The app must state when a browser lacks required IndexedDB, storage or PWA support and provide an export/recovery path where possible.

The release baseline is WCAG 2.2 AA for supported workflows: keyboard operation, visible focus, semantic landmarks, correctly labelled controls, live status messaging, sufficient contrast, non-colour status cues, 44 px touch targets and reduced-motion support.

On a typical current device, the installed app must open to a usable shell promptly, routine local actions must feel immediate, and search/list filtering must remain responsive at the supported local record volume. The performance budget and tested volume must be documented before release.

The Core release baseline is: usable Home shell within two seconds on a typical supported current mobile device; feedback for a routine local action within 100 ms where practical; and no visible action delay over 300 ms without a progress state. Later search/filtering must return results within 300 ms at the documented supported volume. Release evidence must include a realistic seeded data volume of at least 5,000 tasks and 1,000 linked non-task records, or a documented lower limit with a clear user-facing storage boundary.

## Notification decision

Release 1 does not depend on browser or push notifications. Home, Today and recurring routines provide in-app attention and review cues. Any later on-device reminder feature must be opt-in, work without a server, respect quiet hours and identify its unsupported-platform behaviour before it is introduced.

## Training 360 privacy clarification

Anonymous learner labels are permitted only where they are necessary to understand capability coverage and do not identify a person outside the leader's local workspace. Names, contact details, protected attributes, pay/employment records, disciplinary notes and private performance commentary remain prohibited.

## Future integration boundary

Calendar, email, HRIS, LMS, cloud sync and external data integrations are excluded from the initial product. They may be reconsidered only through a separate approved product and privacy assessment that preserves local-first control, data minimisation and the one-source-of-truth rule.

## Implementation contract

### Canonical data dictionary and relationships

Every persisted record must include a stable ID, created/updated timestamps, lifecycle status and history where a material decision or state transition occurs. Required record types are Task, EOD, Morning Huddle, KPI, Rock, Issue, Meeting, Risk, Decision, Handover, Improvement, SOP/Playbook, Training 360 requirement/coverage record and Settings.

Tasks are the only general actionable-work record. Other records may create, link, replace or unlink a task; they must never embed a copied task. A record may contain a typed reference to another record, but the referenced record remains independently valid if its source is archived or deleted.

| Record type | Required relationship rule |
| --- | --- |
| KPI | An off-track KPI has exactly one active corrective-action task until resolved or deliberately replaced. |
| Issue | May link to tasks, a decision, an improvement and a verified SOP/playbook; closing requires a verified outcome. |
| Meeting | Actions link to canonical tasks; archival retains the task and replaces the meeting reference with an archived-source reference. |
| Risk | May link to one active mitigation task; closing requires a resolution record. |
| Decision | May link to follow-up task(s); archival preserves the decision, revision history and task relationship. |
| Handover | May link to one or more tasks and has Draft, Ready, Acknowledged and Archived states. |
| Rock | Links to supporting tasks and relevant KPI/issue/risk records, but is completed only after the intended result is confirmed. |
| Training 360 | Links role/skill coverage gaps to training tasks, risks, improvements or SOPs without creating employee profiles. |

Reference repair is mandatory. Archive/delete operations must run in one transaction or fail safely; the app must never leave a reference to a non-existent record.

### Acceptance scenarios

Each module must maintain executable acceptance scenarios. The following are release-blocking examples:

1. Completing a task from Tasks, EOD, Huddle, Today, Home or a linked record updates the same task everywhere without creating another task.
2. An EOD carried over on Friday appears in Monday's Huddle only once, with one carry-history entry for that movement.
3. A red KPI cannot be saved without an active corrective action; completing the action does not silently change the KPI status.
4. Closing a risk without a resolution note is rejected; its linked mitigation task remains historically connected.
5. Archiving a meeting, issue, decision or handover preserves linked tasks and makes the source-history state understandable.
6. An import with malformed records, unknown required relationships or unsupported schema version changes no local data.
7. A successful import reproduces all valid linked records, then makes the workspace usable offline after reload.
8. A critical Training 360 capability gap produces a visible risk/mitigation path without storing prohibited personal information.
9. The same full daily workflow works at 390 px, 768 px and 1440 px without horizontal loss, inaccessible controls or duplicate actions.
10. The app can be installed, refreshed and opened offline without losing previously stored records.

### Task recurrence, priority and escalation rules

Release 1 supports daily, weekly and monthly recurrence, with an interval and optional weekday/month-day selection. Completing an occurrence creates the next scheduled occurrence; skipping records a skip event and schedules the next occurrence; rescheduling changes only the selected occurrence unless the user deliberately edits the series.

Recurring tasks are ordinary canonical tasks once created. They can enter Top 3, EOD, Huddle and Today, but a completed occurrence is never reopened or overwritten by a future occurrence.

| State | Meaning and required behaviour |
| --- | --- |
| Critical | Immediate continuity, safety or material delivery concern. It ranks first on Home and requires a risk/decision/mitigation path. |
| Urgent | Requires attention today. It ranks above normal due work but does not replace a critical item. |
| High priority | Important planned work. It informs ordering but is not an escalation by itself. |
| Blocked | Progress cannot continue. Context and the next owner/action are required. |
| Waiting | Progress depends on an external response or event. Context and next review date are required. |

An open task carried over three times, a blocked task past its review date, or a waiting task past its review date must prompt the leader to review, reschedule, escalate or close it. Prompts do not alter task status automatically.

### Training 360 identity decision

Release 1 uses role- and skill-based coverage counts only. It does not store employee names, individual learner labels or individual ratings for other people. A leader may use the individual development-plan workflow only for their own self-development.

Team capability is represented by role/work-area requirements, aggregate coverage at each rating level, current gap, target coverage and risk threshold. This resolves the privacy boundary while preserving skills-matrix and single-point-of-failure control.

### Initial template catalogue

The initial guided templates are: EOD; Morning Huddle; Today's Top 3; weekly review; monthly operating review; L10; 1:1 preparation; praise; feedback; coaching; delegation; expectations; difficult conversation; risk; decision; handover; 5 Whys; PDCA; Rock; Training 360 requirement; induction checklist; and development plan.

Each template must state its RPM result/purpose/action prompt, required fields, optional fields, linked record types and completion condition. Templates create records or guide existing records; they do not create a separate notes system.

### Analytics measure dictionary

| Measure | Formula | Action trigger |
| --- | --- | --- |
| Top 3 completion | Completed selected Top 3 ÷ selected Top 3 for the period | Sustained decline prompts a weekly priority review. |
| Carry-over rate | Open tasks carried forward ÷ open tasks selected for EOD | Sustained increase prompts scope, delegation or blocker review. |
| EOD/Huddle consistency | Completed daily records ÷ configured workdays | Missed pattern prompts routine review, not punitive scoring. |
| KPI corrective-action closure | Closed corrective actions ÷ required corrective actions | Open overdue actions surface on Home and weekly review. |
| Critical-skill coverage | Critical skill requirements meeting target coverage ÷ total critical requirements | Any gap creates or updates a capability risk. |
| Issue recurrence | Reopened or repeated issue pattern ÷ closed issues for the period | Recurrence prompts root-cause and SOP/playbook review. |

Every analytic must show its selected period and record count. Where data is insufficient, the app must display Not enough data rather than imply a trend.

### Security, retention and user control

The web app must use a restrictive Content Security Policy compatible with static GitHub Pages, avoid unsafe HTML injection, validate/sanitise user-generated display content and keep dependencies minimal and reviewed. Local image attachments must have explicit supported file types, size limits and storage-quota handling.

The Settings screen must explain active, completed/resolved, archived, restore and permanent-deletion behaviour for each record type. Reversible actions should provide an immediate Undo affordance; irreversible deletion must identify linked history and require clear confirmation.

### Regional, platform and release operations

Settings must support locale-aware date/time display, first day of week, configured workdays and one leadership workday timezone. Stored timestamps remain historically accurate when the device timezone changes. Workday assignment and due-date-only tasks use the configured leadership timezone; changing it affects future workday calculations only and must not silently move existing work between days. Workday calculation must not assume a public-holiday calendar; a future public-holiday feature requires a separate local configuration and validation design.

The supported-browser policy is the current and two immediately preceding major versions of Safari, Chrome, Edge and Firefox, subject to IndexedDB and required Web Platform support. The release register must record the actual tested versions.

Each production release requires a versioned deployment record, production smoke test, service-worker update check, rollback instructions and data-safety confirmation. A recovery drill must prove export, clear/reset, import, linked-record validation and offline reload before a release containing a schema migration is approved.

## Pilot, content and annual review

### Personal pilot and learning loop

The first live use of TalentisOS must be an intentional six-to-eight-week personal pilot. The leader uses the app in normal work, records friction, missed decisions, duplicated capture and unclear prompts, then reviews findings weekly. A product change is approved only when it resolves a repeated problem and improves a defined leadership outcome.

The pilot must not be used to create a shadow system for the team or replace mandated organisational records.

### Pilot review log

| Review date | Evidence | Finding | Approved improvement | Next action | Success measure |
| --- | --- | --- | --- | --- | --- |
| 18 September 2026 | Phase 13 remediation status: exception retrieval and lifecycle controls were implemented, but the required End of Day, Morning Huddle, Today’s Work, Meetings and Issues exception-context integrations—and the seeded browser workflow at 1440 px, 768 px and 390 px—were not completed. | An open risk, decision or handover can be technically valid yet remain outside the daily leadership loop where the leader chooses and completes work. This risks a second capture or an overlooked follow-up. No live-use evidence yet supports changing prompt wording or adding features. | **Exception-to-action continuity:** surface the relevant exception in each daily context and provide one clear, duplicate-safe action to create, link, replace or review its canonical task without leaving the workflow. | Complete the seeded cross-device workflow for one risk, decision and handover: capture it once; link its task; review it in EOD, Huddle, Today, Meetings and Issues; complete or archive it; then verify the linked state and history remain correct everywhere. Record any actual user friction separately before changing copy or adding controls. | On all three target widths, the workflow is completed without a duplicate task, manual re-entry, broken link or unclear next action. |

This review does not authorise broader scope. The next pilot change, if any, must be based on repeated live-use evidence after this continuity path is proven.

### Content and template standards

All prompts, templates and framework guidance must be concise, specific, practical and non-judgmental. They must state the decision or action expected, use familiar language, avoid generic motivational copy and respect the privacy boundary.

Guidance must help the leader think and act; it must not present a script as a substitute for judgment or legal, HR, safety or professional advice.

### Local-data threat model

The security model must state clearly that TalentisOS data is protected primarily by the user's device, operating-system account and browser profile. Anyone with access to that browser profile may be able to access local app data. Standard JSON exports are readable and must be stored securely.

The app must not claim encrypted local storage unless that capability is actually implemented and verified. Passphrase-protected exports remain a separately approved future enhancement using browser-native cryptography only.

### Annual review and reset

The annual review must assess operating results, leadership-rhythm consistency, stakeholder relationship themes, critical-skill coverage, recurring issues, verified improvements, standards due for review and open strategic risks.

It must produce the next-year leadership plan, annual Rocks/priorities, capability-risk plan, review calendar and a deliberate archive/retention review. No record is deleted automatically by the annual reset.

## Specification architecture

This master specification remains the product decision authority and index. Before implementation expands materially, its detailed requirements must be maintained in controlled supporting documents:

- product definition, scope and exclusions;
- TalentisOS leadership framework, Team Takeover plan and Training 360 framework;
- canonical data dictionary, relationship map and migration rules;
- module requirements and template catalogue;
- acceptance scenarios and test evidence; and
- engineering, privacy, security, release and recovery standards.

Each supporting document must identify its authority, version, relevant master-specification sections and superseded decisions. The master specification must link to them and resolve conflicts; later approved decisions take precedence.

## Explicit exclusions and removal rules

Do not introduce chat, email, team collaboration, employee directories, employee performance scoring, HR records, CRM, calendar synchronisation, Gantt charts, resource scheduling, timesheets, payroll, surveillance or enterprise BI.

Remove static attention tiles, generic empty-state claims and visible placeholder modules as each live workflow is introduced. The product should never imply that a leadership control is working when it is not.

### Removal gate

Before a feature is released, the product owner must ask: **If this feature disappeared, would a new leader be less able to decide, act, communicate or follow through this week?** If the answer is no, the feature must be deferred, simplified or removed from the launch experience.

No feature may be retained merely because it is comprehensive, visually attractive, aligned to a named framework or useful to an experienced manager. Launch value is measured by clearer decisions and better follow-through in ordinary leadership moments.

## Release readiness gates

### New Leader Core ready

The New Leader Core is ready for release when a leader can use it for a full workweek and reliably:

1. capture and complete work once;
2. finish EOD in under ten minutes;
3. begin each day with a useful, live Huddle and Top 3;
4. act from Today and Home without searching across disconnected screens;
5. turn a blocker, risk, decision or handover into owned follow-up through Needs attention;
6. preserve the history and relationship of that follow-up through completion, archive or recovery;
7. export, restore and retain data control; and
8. use the same dependable workflow on an iPhone, iPad and desktop.

It also requires that a first-time leader can complete Start Here in five minutes or less, identify a useful next action without learning product terminology, prepare an appropriate conversation, understand when an issue must be escalated outside the app, resume an interrupted draft and understand their Backup health state.

Core-release evidence must include moderated usability sessions with representative first-time or emerging leaders on a real iPhone or iPad. The sessions must test first-run orientation, an interrupted daily loop, an exception requiring follow-up, a conversation-preparation task, Quick Capture and recovery of an unfinished draft. Functional browser testing alone is insufficient.

### Full TalentisOS ready

The wider TalentisOS product is ready only after each deliberately enabled advanced capability has passed its own acceptance scenarios, relationship integrity, accessibility, local-data recovery and real-use validation. Meetings, issues, KPI exceptions, priorities, Training 360, extended Team Takeover, analytics and annual review must not delay the New Leader Core release merely because they remain in the long-term product vision.

If a proposed feature does not improve one of these outcomes, it should not be built.
