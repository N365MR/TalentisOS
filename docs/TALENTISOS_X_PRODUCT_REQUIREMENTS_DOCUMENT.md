# TalentisOS X Product Requirements Document

**Product:** TalentisOS X
**Repository:** Local: `/Users/n365mr/Desktop/GitHub/TalentisOS` · GitHub: [N365MR/TalentisOS](https://github.com/N365MR/TalentisOS)
**Phase:** 00A
**Status:** IMPLEMENTED — PENDING FOUNDER APPROVAL
**Prepared:** 2026-09-05

## 1. Product definition

TalentisOS X is a private, local-first leadership operating system for running a team’s daily and weekly management rhythm. It is deliberately lightweight: a dependency-free browser application, installable as a PWA, that turns daily reflections, team priorities, KPIs, meetings, and issues into one connected stream of owned work.

The product is not a generic project manager. Its core promise is: **capture once, carry forward, and use exceptions to direct attention.** A leader closes the day, prepares the next day, executes a focused list, reviews operating signals, and turns important discussion into actions without re-keying work across separate tools.

### Intended users

- Front-line and middle managers running a small team or operational area.
- Leaders who use a daily huddle, a weekly scorecard, quarterly Rocks, and Level 10 style meetings.
- Privacy-conscious users who need their working data usable offline and stored locally by default.

### Jobs to be done

| Situation | User need | Product outcome |
| --- | --- | --- |
| Ending a workday | Record accomplishments, unresolved work, risks, handovers, and tomorrow’s priorities | A dated, reusable next-day starting point |
| Beginning a workday | Turn carry-over and top priorities into a small execution list | Clear work without re-entry or lost context |
| Managing performance | See only KPI exceptions that require action | Earlier intervention, not passive reporting |
| Running a weekly meeting | Follow a repeatable rhythm and capture issues/actions | Decisions become owned work |
| Switching device or recovering data | Back up or restore the complete workspace | Local ownership without vendor lock-in |

### Non-goals

- Multi-user real-time collaboration, chat, calendar scheduling, permissions, or enterprise administration.
- A full CRM, HRIS, document store, or general-purpose project management platform.
- Server-side analytics or mandatory cloud accounts.

## 2. Experience principles

1. **Local first and private.** IndexedDB is the primary store; cloud sync is optional.
2. **One work record.** Tasks created in EOD, Huddle, Rocks, IDS, L10, or manually must preserve their identity as they move through the workflow.
3. **Exception first.** Overdue work and non-green KPIs should surface before healthy detail.
4. **A narrow daily loop.** Prepare → Align → Execute → Review → Improve is the organising model.
5. **Progressive disclosure.** Primary navigation stays small; Huddle, EOD, Rocks, Scorecard, and IDS appear in context.
6. **Calm, editorial interface.** The interface should make a leader feel oriented, not buried in controls.

## 3. Information architecture and routes

The shipped navigation has four top-level destinations. Internal and hash-compatible routes remain to protect existing bookmarks and workflow links.

```text
TalentisOS X
├── Today (#today)
│   ├── Home / daily briefing (#today)
│   ├── Today’s Work (#today/work)
│   ├── Morning Huddle (#today/huddle)
│   ├── End of Day (#today/eod)
│   └── IDS context (#today/ids)
├── Meetings (#meetings)
│   ├── L10 (#l10)
│   ├── Rocks (legacy/deep link: #rocks)
│   └── IDS (legacy/deep link: #ids)
├── Insights (#insights)
│   ├── Performance overview (#performance)
│   ├── Scorecard (#scorecard)
│   ├── Rocks (#rocks)
│   └── Management KPIs (#management-kpis)
└── Settings (#settings)
```

Compatibility aliases: `#dashboard` resolves to Today; `#tasks` and `#work` resolve to Today’s Work. Legacy renderer names remain in code but must not be presented as competing primary navigation.

## 4. Views and required behaviour

### Today home

Today is the command centre and default landing surface. It includes an editorial hero, context-aware copy based on local time, two large actions (Quick Close and Today’s Work), four interactive metric tiles, an exception panel when needed, and the embedded work list.

| Element | Behaviour |
| --- | --- |
| Time-aware cue | Before 11:00: Prepare → Align; 11:00–15:59: Execute With Intention; 16:00+: Review → Improve |
| Open commitments | Shows items meeting the Today selector; opens/scrolls to Today’s Work |
| Top 3 ready | Opens Morning Huddle context |
| KPI exceptions | Opens Scorecard/Performance context |
| Rhythm this week | Opens L10 |
| Needs attention | Lists up to three overdue tasks and three non-on-track KPIs |

### Today’s Work

This is the sole public execution surface. It draws from the canonical task collection rather than a separate task database. Tabs are **Today, Upcoming, Overdue, Completed, All**. The All tab exposes source and priority filters. Each task can be completed/reopened and carries source, dates, priority, and history. Users can add manual work and print the current work view.

Selector contract:

- Today: open task with `committedDate === today`, `movedToTodayDate === today`, or no committed date and `due <= today`.
- Upcoming: open task with due date after today.
- Overdue: open task with due date before today.
- Completed: completed tasks, newest completion first.

### Morning Huddle

The Huddle is a dated carry-over checklist. A leader can add an item or import unfinished EOD content. It groups outstanding work, risks/blockers, handovers/notes, and Top 3. Items moved into the Huddle become eligible for Today at the appropriate date. Completed Huddle/Today tasks are rendered as a dated completion timeline, with detail and reopen actions.

### End of Day

End of Day records five fields: completed work, outstanding work, risks/customer issues/blockers, handovers/notes, and tomorrow’s Top 3. Saving stores the EOD draft/history and feeds incomplete actionable lines into the Huddle without duplicating equivalent work. Work handed back from Today appears as an EOD handback section with optional notes.

### Meetings and L10

Meetings is a contextual landing page for L10, Rocks, and IDS. The L10 view provides the 90-minute operating cadence: Segue (5), Scorecard (5), Rock Review (5), Headlines (5), To-Dos (5), IDS (60), and Conclude (5). It displays a 0–10 meeting-health rating and should be extended so meeting decisions create canonical tasks and issue records.

### Insights and Performance

Insights is exception-first: it combines overdue tasks with amber/red KPI signals and links to their appropriate workspaces. Performance provides tabs for Overview, Scorecard, Rocks, and Management.

**Scorecard:** rolling 12 Friday periods, one row per KPI, coloured cells, editable weekly actuals, and automated green/amber/red interpretation.

**Rocks:** active high-priority, incomplete task records; the product currently uses `priority === 'high'` as the Rock projection. Rocks must remain visible in Today’s Work.

**Management KPIs:** detailed evidence cards containing baseline, target, actual, linked routine, actions, evidence source, and measurable result; printable for a management conversation.

### IDS

IDS (Identify, Discuss, Solve) is a contextual issue list. An issue has at least title, source, and date; the visible status begins at Identify. The intended extension is a decision record and linked task/owner.

### Settings

Settings is a modal overlay, not a standard page. It supports light/system/dark appearance, JSON export and restore, CSV export of tasks or KPIs, Worker URL configuration, GitHub connect/disconnect, local snapshot messaging, and destructive full-data reset with warning.

## 5. Workflow engine and data model

### Canonical flow

```text
EOD text / manual work / Rock / IDS / L10
                 │
                 ▼
       state.tasks (canonical work records)
                 │
       Morning Huddle dated carry-over
                 │
                 ▼
          Today’s Work selector
                 │
       complete / reopen / hand back to EOD
                 ▼
      task history + EOD completion context
```

### Workspace snapshot

The persisted state shape is a single serializable snapshot:

```js
{
  tasks: Task[],
  eod: { completed, outstanding, risks, top3, handovers },
  eodHistory: EodEntry[],
  kpis: KPI[],
  issues: Issue[],
  l10: { section, running, rating? },
  settings: { appearance?, syncApi? }
}
```

### Task contract

The reverse-engineering target is below. Existing fields must be preserved during migration, even when a cleaner replacement exists.

```ts
type Task = {
  id: string;                         // Stable; never regenerate on transition
  title: string;
  description?: string;
  owner?: string;
  status: 'open' | 'done';
  priority: 'high' | 'medium' | 'low';
  source: 'EOD' | 'Morning Huddle' | "Today's Work" | 'Manual' | string;
  sourceId?: string;
  due?: 'YYYY-MM-DD';
  createdAt?: ISODateTime;
  createdDate: 'YYYY-MM-DD';
  committedDate?: 'YYYY-MM-DD';
  completedAt?: ISODateTime;
  completedDate?: 'YYYY-MM-DD';
  completionNotes?: string;
  movedToHuddleAt?: ISODateTime;
  movedToHuddleDate?: 'YYYY-MM-DD';
  movedToTodayAt?: ISODateTime;
  movedToTodayDate?: 'YYYY-MM-DD';
  movedToEodAt?: ISODateTime;
  movedToEodDate?: 'YYYY-MM-DD';
  movedToEodNotes?: string;
  eodCategory?: 'outstanding' | 'risk' | 'handover' | 'top-3';
  carryOverCount: number;              // legacy `carry` retained when present
  relatedRockId?: string;
  blockedReason?: string;
  lastUpdated?: ISODateTime;
  history: { at: ISODateTime; date: 'YYYY-MM-DD'; event: string; details?: string }[];
};
```

Normalization supplies defaults (`open`, `medium`, `Manual`, creation event/history), maps historical sources to canonical labels, derives `createdDate`, and ensures completed tasks have a Completed history event. `moveTaskToToday` refuses completed, future-Huddle, or already-moved records; otherwise it sets commitment/movement fields, source, and a de-duplicated `Moved to Today’s Work` event.

### KPI contract and calculation

```ts
type KPI = {
  id: string; category: string; name: string; purpose?: string; owner?: string;
  baseline?: number; target: number; warning: number; red: number;
  unit?: string; direction: 'higher' | 'lower'; actual: number | '';
  linkedRoutine?: string; routine?: string; actions?: string;
  evidence?: string; result?: string;
  history: { date: 'YYYY-MM-DD'; actual: number }[];
};
```

For `higher`, actual ≥ target is on-track, ≥ warning is at-risk, otherwise off-track. For `lower`, actual ≤ target is on-track, ≤ warning is at-risk, otherwise off-track. Empty/unparseable values are not-reported. The `red` threshold is captured but not currently used by the status algorithm; a reconstruction should decide whether to use it or remove it deliberately.

## 6. Persistence, offline, and sync engines

### Local persistence

1. On boot, open IndexedDB database `talentisos`, object store `state`, key `app`.
2. If IndexedDB is unavailable/fails, load/save the whole JSON snapshot under localStorage key `talentisos`.
3. Normalize on every load/import before rendering.
4. On meaningful mutation, clone the full state and save locally; then fire optional remote save.
5. JSON export serializes the whole state. Restore accepts JSON, normalizes it, and re-imports EOD carry-over.

The current design writes full snapshots. It is simple and offline-safe, but a rebuild for large workspaces should batch local writes, debounce remote writes, serialize cloud requests, and define history retention.

### PWA engine

`manifest.webmanifest` defines standalone display, dark theme/background (`#070A0F`), and SVG 192/512 icons. `sw.js` uses cache `talentisos-v5`, precaches HTML, CSS, JS, manifest, and icons, removes old caches on activation, and uses cache-first GET handling with runtime caching and index fallback. App boot registers the service worker from `app.js`.

### Optional GitHub sync backend

The Worker is in `worker/src/index.js` and is configured by `worker/wrangler.jsonc`. It is a Cloudflare Worker, not a required application server.

```text
Browser Settings → Worker /auth/login → GitHub OAuth
GitHub callback → encrypted HttpOnly session cookie
Browser GET/PUT /api/data (credentials included)
Worker → GitHub Contents API → private data repo
users/<github-user-id>.json
```

Required Worker secrets: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `SESSION_SECRET`. Required variables include `APP_ORIGIN` and `GITHUB_DATA_REPO`. OAuth requests `repo` scope. The token is sealed in a seven-day AES-GCM session cookie; it is never returned to frontend JavaScript. The Worker validates OAuth state using a short-lived cookie, exposes `/api/me`, and stores data via GitHub’s Contents API using the existing file SHA when present.

Security requirements for a rebuild: private data repository, HTTPS, HttpOnly/Secure/SameSite=Lax cookies, origin-restricted CORS with credentials, state validation, no committed secrets, and conflict handling for concurrent writes (the shipped Worker does not yet resolve write conflicts).

## 7. Visual and interaction specification

### Visual language

The aesthetic is a restrained, dark “leadership cockpit”: editorial typography, generous whitespace, dense but calm information surfaces, and teal as the primary action/focus signal.

| Token | Value | Use |
| --- | --- | --- |
| Background | `#070A0F` | App canvas |
| Surface / elevated | `#10151D` / `#151B24` | Cards and controls |
| Border | `#263241` | Low-contrast structure |
| Primary text | `#F7FAFC` | Main copy |
| Secondary / muted | `#9BA7B4` / `#66737F` | Supporting text |
| Accent teal | `#23E0C5` | Primary action, focus, rhythm |
| Blue | `#2F80FF` | Secondary primary state |
| Success / warning / danger | `#24D18F` / `#F5A524` / `#FF4D4F` | KPI and task state |

Typeface is `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif`. Hero type uses a tight negative letterspace (roughly `-.07em`) and 44–92px responsive scale. Labels/kickers are 11px uppercase-like with teal and wide tracking. Cards use 18px radius; modals use 22–26px radius. Buttons and main actions have a 44px minimum target.

### Layout

- Desktop: full-width sticky horizontal top navigation at ≥1025px; original sidebar model is retained for narrower widths.
- Tablet/mobile: off-canvas sidebar, hamburger trigger, one-column bento grid at ≤1024px.
- Content: max presentation canvas about 1600px; responsive horizontal padding `clamp(16px, 2.4vw, 52px)`.
- Today hero: oversized three-line headline plus two large action cards, then a four-column metric strip; it becomes a single-column experience on smaller screens.
- Performance: KPI matrix is horizontally scrollable and has a sticky KPI label column.
- Modal: centred scrim with blur, bounded height, internal scroll, Escape close, focus capture/restoration, and Tab loop.

### Motion, accessibility, and print

Use short CSS transitions only: hover lift, subtle view/card entrance, and button feedback. Respect `prefers-reduced-motion` by effectively eliminating transition/animation duration. Provide 2px teal `:focus-visible` outlines, semantic nav and active-page state, `aria-live="polite"` for Insights exceptions, dialog roles/labels, and 44px touch targets. Print hides navigation, overlays, helpers, and actions; cards/matrix are white with printer-safe borders while KPI colour cells request exact print colour.

## 8. Technical implementation map

| Path | Responsibility |
| --- | --- |
| `index.html` | Static shell: navigation, main view mount, toast, help and scroll controls |
| `TalentisOS-X.html` | Compatibility entry document |
| `app.js` | Runtime state, persistence, route aliases/deep links, views, modals, event handling, PWA registration |
| `task-engine.js` | Isolated exported `normalizeTask` and `moveTaskToToday` helpers |
| `styles.css` | All tokens, responsive layout, motion, print, appearance styling |
| `sw.js` | PWA cache lifecycle and fetch strategy |
| `manifest.webmanifest` | Install metadata and icons |
| `worker/src/index.js` | OAuth, encrypted session, GitHub read/write API |
| `worker/wrangler.jsonc` | Worker configuration |
| `tests/*.test.mjs` | Dependency-free integrity and task engine checks |

The runtime is intentionally plain browser JavaScript: no package manager, bundler, framework, or database dependency. Start locally with `python3 -m http.server 4173`. The browser must be used over HTTP(S), rather than direct `file://`, for PWA/service worker behaviour.

## 9. Reconstruction plan

For a clean rebuild, preserve user-visible behaviour but do not copy the current layering of late function reassignments. Implement these explicit modules:

```text
state/        schema, migration, IndexedDB adapter, import/export, sync queue
work/         task commands and selectors
views/        today, meetings, insights, performance, l10, settings
ui/           router, renderer, delegated events, modal, toast, print
pwa/          registration, asset cache policy
worker/       OAuth/session/GitHub storage
```

Implementation order:

1. Establish the snapshot schema, migrations, and offline adapter with import/export tests.
2. Build task commands (`create`, `update`, `complete`, `reopen`, `moveToHuddle`, `moveToToday`, `handBackToEod`) that append history and preserve IDs.
3. Implement EOD → Huddle → Today end-to-end before building secondary views.
4. Add the Today briefing and exception selectors.
5. Build KPI status/history and Scorecard; project high-priority tasks as Rocks.
6. Add Meetings/L10 and IDS, ensuring actions create canonical task records.
7. Add Settings, PWA cache policy, then optional Worker sync.
8. Apply the visual system and verify 320, 375, 390, 430, 768, 1024, 1280, and 1440px; test keyboard, reduced motion, print, offline startup, backup restore, and browser back/forward.

## 10. Acceptance criteria

- A new user can complete an EOD entry, open Huddle next day, and see the same task IDs in Today’s Work with no duplicate carry-over.
- Completing or reopening work changes every surface consistently and adds the expected history event.
- An overdue task or amber/red KPI is discoverable from Today and Insights without visiting a report first.
- KPI threshold logic is correct for both higher-is-better and lower-is-better measures, including weekly history edits.
- JSON export/import restores all workspace entities and normalizes older task forms.
- The application launches and functions offline after app-shell caching.
- GitHub connection is optional; when configured, no OAuth token is visible to frontend JavaScript.
- Primary navigation contains only Today, Meetings, Insights, and Settings; deep links remain stable.
- At all target breakpoints, no primary action or text clips; focus and modal escape/focus return work; reduced motion and print remain usable.

## 11. Known implementation boundaries and backlog

This PRD reflects both implemented capability and intended direction. The following remain deliberate reconstruction priorities:

- Replace `app.js` compatibility wrappers/late reassignments with one route map, renderer, and delegated interaction registry.
- Make all task producers use a single command API and uniform provenance fields.
- Debounce/serialize remote saves and handle GitHub write conflicts.
- Define EOD, task-history, KPI-history, and meeting-history retention policies.
- Add fixture-based browser workflow tests in addition to current static integrity tests.
- Make L10/IDS decisions create and link canonical tasks rather than remain mainly presentational.
- Review the unused KPI `red` threshold and formalize the desired status bands.
- Add PNG icons if install compatibility testing shows SVG-only limitations.

## 12. Verification commands

```sh
node --check app.js
node --check sw.js
node tests/source-integrity.test.mjs
node tests/task-engine.test.mjs
git diff --check
```

This document supersedes the fragmented product narrative across the existing audit, architecture, roadmap, and implementation-status notes as the best single reference for product reconstruction. Those documents remain useful evidence for code-cleanup history.
