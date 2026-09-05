# TalentisOS X — rebuild-from-zero playbook

This is the single copy-and-paste guide for rebuilding TalentisOS X from an empty repository. It deliberately preserves the product behaviour while replacing the old monolithic implementation with small, testable modules.

## How to use this guide

1. Create a new empty GitHub repository and clone it locally.
2. Give an AI coding agent the **master prompt** once.
3. Give it exactly one numbered phase prompt at a time, in order.
4. Require the stated exit checks before moving on. Do not ask it to “finish the whole app” in one prompt.
5. For a later change, use the **change-request prompt** and name the affected phase(s).

The product stays dependency-free: browser-native ES modules, IndexedDB, CSS, HTML, and Node's built-in test runner. No framework, build system, database, analytics, account, or backend is required for the core product.

---

## Master prompt — give this once

```text
You are rebuilding TalentisOS X, a private local-first leadership operating system, from an empty repository.

Product outcome
TalentisOS X helps a team leader run one daily and weekly operating rhythm: close the day, carry unfinished work into a morning huddle, commit it into Today’s Work, review KPI exceptions, and turn meetings/issues into owned work. It is not a generic project manager.

Non-negotiable product principles
- Local first and private: IndexedDB is primary; localStorage is the fallback. Cloud sync is optional and must never be required.
- One work record: all work, regardless of origin, is stored once in the canonical tasks collection and preserves its ID throughout transitions.
- Exception first: overdue work and non-green KPIs receive attention before healthy detail.
- Narrow daily loop: Prepare → Align → Execute → Review → Improve.
- Small public navigation: Today, Meetings, Insights, Settings. Huddle, EOD, Rocks, Scorecard, and IDS are contextual views/deep links, not top-level items.
- Calm editorial UI: dark, spacious, accessible, keyboard usable, responsive, and usable offline.

Technical constraints
- Use plain HTML, CSS, and browser-native JavaScript ES modules. Do not introduce React, Vue, a package manager, bundler, UI kit, or runtime dependency unless explicitly asked later.
- Keep domain logic separate from DOM rendering. State, task commands/selectors, views, UI helpers, and PWA code must be separate modules.
- Persist a single serializable workspace snapshot. Normalize and migrate data every time it is loaded or imported.
- Make mutations through commands only; each meaningful command appends task history and saves locally.
- Test domain logic with node:test. Test manually in a browser at each stated breakpoint. Never remove working behaviour merely to simplify code.
- Use semantic HTML, visible focus states, 44px touch targets, Escape/focus return for dialogs, aria-live for exception changes, and reduced-motion support.
- Do not commit secrets. Do not add cloud sync until the optional sync phase.

Working rules
- First inspect the current repository and keep unrelated user changes intact.
- For every phase, state the files changed, run its verification commands, and report results.
- Stop at the phase boundary. Do not begin a later phase unless asked.
- Prefer small modules and direct code over abstractions that are not yet needed.
```

---

## Product contract — stable across every phase

### Routes

```text
#today                 Today briefing
#today/work            Today’s Work
#today/huddle          Morning Huddle
#today/eod             End of Day
#today/ids             IDS context
#meetings              Meetings landing
#l10                   L10 meeting
#insights              Insights landing
#scorecard             Scorecard
#rocks                 Rocks
#management-kpis       Management KPI detail
#settings              Settings overlay
```

Compatibility aliases: `#dashboard → #today`; `#tasks` and `#work → #today/work`; `#performance → #insights`; `#ids → #today/ids` (or the contextual meeting IDS view).

### Workspace snapshot

```js
{
  schemaVersion: 1,
  tasks: [],
  eod: { completed: '', outstanding: '', risks: '', handovers: '', top3: '' },
  eodHistory: [],
  kpis: [],
  issues: [],
  l10: { section: 'segue', running: false, rating: null },
  settings: { appearance: 'system', syncApi: '' }
}
```

### Canonical task contract

```js
{
  id: 'stable-id',
  title: 'string',
  description: '',
  owner: '',
  status: 'open', // open | done
  priority: 'medium', // high | medium | low
  source: 'Manual',
  sourceId: '',
  due: '', // YYYY-MM-DD
  createdAt: 'ISO datetime',
  createdDate: 'YYYY-MM-DD',
  committedDate: '',
  completedAt: '',
  completedDate: '',
  completionNotes: '',
  movedToHuddleAt: '',
  movedToHuddleDate: '',
  movedToTodayAt: '',
  movedToTodayDate: '',
  movedToEodAt: '',
  movedToEodDate: '',
  movedToEodNotes: '',
  eodCategory: '', // outstanding | risk | handover | top-3
  carryOverCount: 0,
  relatedRockId: '',
  issueId: '',
  blockedReason: '',
  lastUpdated: 'ISO datetime',
  history: [{ at: 'ISO datetime', date: 'YYYY-MM-DD', event: 'Created', details: '' }]
}
```

Never regenerate the ID during a transition. Preserve unknown fields during normalization/import for forward compatibility.

---

## Phase 0 — repository and quality foundation

```text
Implement Phase 0 only for TalentisOS X.

Create a dependency-free static web-app repository with this structure:
index.html, styles.css, manifest.webmanifest, sw.js, src/main.js, src/state/schema.js, src/state/storage.js, src/work/tasks.js, src/ui/router.js, src/ui/render.js, src/views/, tests/.

Set up:
1. An HTML app shell with semantic header/nav/main/toast roots and four visible navigation links: Today, Meetings, Insights, Settings.
2. Browser-native ES module bootstrapping; no bundler and no third-party dependencies.
3. node:test scripts or documented commands that run with `node --test`.
4. A README covering local startup using `python3 -m http.server 4173`, verification commands, and the local-first privacy model.
5. A minimal PWA manifest and service worker registration, but do not implement a cache strategy until Phase 7.
6. Basic dark design tokens, focus-visible styling, and reduced-motion CSS.
7. A schema module exporting an empty valid workspace snapshot and a test that validates it.

Do not build product workflows yet. Confirm that the app shell loads without console errors and that tests pass.

Exit checks:
- node --test
- node --check src/main.js
- Load from http://localhost:4173 without console errors
- Test keyboard navigation across all four visible nav links
```

## Phase 1 — state, migration, backup, and restore

```text
Implement Phase 1 only for TalentisOS X. Build the state layer before UI workflows.

Create a versioned workspace snapshot implementation:
1. IndexedDB database `talentisos`, object store `state`, key `app`.
2. localStorage fallback using key `talentisos` when IndexedDB cannot be used.
3. A pure `normalizeWorkspace(input)` migration function that supplies defaults, preserves unrecognized fields, and normalizes every task.
4. `loadWorkspace`, `saveWorkspace`, JSON `exportWorkspace`, and validated JSON `importWorkspace` APIs.
5. Load/import must never destroy data merely because an optional field is missing.
6. UI in Settings for export to JSON and restore from an explicitly selected file. Restore must show a confirmation explaining that it replaces the current local workspace.

Add node tests for an empty snapshot, legacy task normalization, malformed import rejection, fallback-safe behavior where testable, and export/import round trip.

Do not implement remote sync or task workflow UI yet.

Exit checks:
- node --test
- Export a populated fixture and restore it into an empty browser profile
- Confirm restored snapshot has the same task IDs and KPI history
```

## Phase 2 — canonical task engine and daily workflow

```text
Implement Phase 2 only for TalentisOS X. Build the daily workflow around a single canonical task collection.

Create pure task commands and selectors in `src/work/`:
- createTask, updateTask, completeTask, reopenTask
- moveTaskToHuddle, moveTaskToToday, handBackTaskToEod
- selectToday, selectUpcoming, selectOverdue, selectCompleted, selectAll

Every command must preserve task ID, update `lastUpdated`, append a dated history event, and return a new workspace state without mutating inputs. `moveTaskToToday` must reject completed tasks, tasks scheduled for a future Huddle date, and duplicate moves for the same date.

Implement contextual views inside Today:
1. Today’s Work: tabs Today, Upcoming, Overdue, Completed, All; add/edit/complete/reopen task actions; All has source and priority filters.
2. End of Day: completed work, outstanding work, risks/blockers, handovers/notes, tomorrow’s Top 3. Save a dated EOD entry.
3. Morning Huddle: import unfinished actionable EOD items without creating equivalents twice; group work, risks, handovers, and Top 3; allow committing eligible items to Today.
4. Hand back an open Today task to EOD with optional notes.

Definition of done: an item captured in EOD appears in the next Huddle and then Today’s Work as one task with one stable ID, not three copies. Completed/reopened status must update all applicable surfaces.

Add fixtures and tests for EOD → Huddle → Today, duplicate prevention, complete/reopen, handback, and every selector boundary (including dates).

Exit checks:
- node --test
- Manually run the full EOD → Huddle → Today → complete → reopen workflow
- Verify task history shows each transition and IDs never change
```

## Phase 3 — Today briefing and exception-first insights

```text
Implement Phase 3 only for TalentisOS X.

Build Today as the default command centre. It must contain:
1. Time-aware cue: before 11:00 “Prepare → Align”; 11:00–15:59 “Execute With Intention”; after 16:00 “Review → Improve”.
2. Large actions for Quick Close (EOD) and Today’s Work.
3. Interactive metric tiles: Open commitments, Top 3 ready, KPI exceptions, Rhythm this week.
4. Needs Attention showing up to three overdue open tasks and three amber/red KPI exceptions; do not show the panel when no exceptions exist.
5. An Insights route that is exception-first and links into Scorecard, Rocks, and task contexts.

Use selectors/view-model functions rather than querying and sorting the raw state repeatedly during rendering. Add an aria-live polite region for exception changes. Keep healthy information quieter than exceptions.

Use placeholder KPI data only if needed for visual development; all real KPI operations arrive in Phase 4.

Exit checks:
- node --test
- Verify each metric tile navigates/scrolls to the correct context
- Verify no exception panel renders when fixture data is all on track
```

## Phase 4 — KPI scorecard and Rocks

```text
Implement Phase 4 only for TalentisOS X.

Build the KPI domain and Insights performance views.

KPI fields: id, category, name, purpose, owner, baseline, target, warning, red, unit, direction (higher|lower), actual (number|empty), linkedRoutine, routine, actions, evidence, result, history [{ date, actual }].

Implement and test `getKpiStatus(kpi)`:
- higher: actual >= target is on-track; actual >= warning is at-risk; otherwise off-track.
- lower: actual <= target is on-track; actual <= warning is at-risk; otherwise off-track.
- missing or unparseable actual is not-reported.
Document that the `red` field is stored but is not part of this algorithm unless you deliberately change the product contract and add tests.

Create:
1. Performance overview with exception-first summary.
2. Scorecard with a rolling 12 Friday periods, editable weekly actuals, status labels as well as colour, and a horizontally scrollable/sticky KPI name column on narrow screens.
3. Rocks as a projection of open high-priority canonical tasks, never a second task database.
4. Management KPI detail cards with baseline, target, actual, routine, actions, evidence, and result, plus print support.

Exit checks:
- node --test including higher/lower and missing KPI values
- Confirm a high-priority task appears both in Today’s Work and Rocks with the same ID
- Test Scorecard at 375px and 1280px wide
```

## Phase 5 — Meetings, L10, and IDS

```text
Implement Phase 5 only for TalentisOS X.

Build Meetings as the home for a weekly L10 cadence and contextual IDS issue solving.

L10 sections and durations: Segue (5), Scorecard (5), Rock Review (5), Headlines (5), To-Dos (5), IDS (60), Conclude (5). Display active section, a simple timer/start-stop control, and a 0–10 meeting-health rating. Do not rely on a background timer to persist correctness; store the current meeting state explicitly.

An issue needs id, title, source, createdDate, status (default Identify), discussion/decision fields, and optional linkedTaskIds. In IDS, users must be able to capture an issue, record a decision, and create/link a canonical task. The task must retain a provenance source such as `IDS` or `L10` and its ID must be visible/traceable from the issue.

Meetings should surface Rocks and Scorecard context but must read the shared state rather than copying records.

Add tests for issue creation, decision recording, and creating/linking a task without duplicating it.

Exit checks:
- node --test
- Create an IDS issue and a linked action, then complete the action from Today’s Work
- Verify the issue shows the same task ID and its completion state
```

## Phase 6 — visual system, accessibility, and responsive quality

```text
Implement Phase 6 only for TalentisOS X. Do not change domain rules unless required to fix a demonstrated UI defect.

Apply this visual system:
- Canvas #070A0F; surfaces #10151D and #151B24; border #263241.
- Text #F7FAFC; muted #9BA7B4 and #66737F.
- Accent teal #23E0C5; secondary blue #2F80FF; success #24D18F; warning #F5A524; danger #FF4D4F.
- Font stack: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif.
- 18px card radius, 22–26px modal radius, and at least 44px interactive targets.

Desktop uses sticky horizontal navigation at 1025px and above. Tablet/phone use a hamburger/off-canvas navigation and one-column layout. Content padding is `clamp(16px, 2.4vw, 52px)`; main presentation width is about 1600px. Today hero should be editorial rather than dashboard-like.

Implement semantic landmarks, headings, focus-visible 2px teal outlines, active route indication, keyboard-operable modal with Tab loop/Escape/focus restoration, non-colour status labels, aria-live exception updates, and `prefers-reduced-motion`. Add printer-safe styles that hide navigation/controls/overlays and retain KPI status legibility.

Perform and document manual checks at 320, 375, 390, 430, 768, 1024, 1280, and 1440px. Fix clipping, horizontal overflow outside intentional matrices, inaccessible controls, and unreadable contrast.

Exit checks:
- Keyboard test nav, task completion, modal open/close, EOD save, and print preview
- Responsive check at every stated width
- Reduced-motion check
```

## Phase 7 — offline PWA and optional GitHub sync

```text
Implement Phase 7 only for TalentisOS X. First finish the offline PWA; treat GitHub sync as an independent optional feature.

PWA requirements:
1. Precache the versioned app shell: HTML, CSS, all JS modules, manifest, and icons.
2. Remove obsolete caches on service-worker activation.
3. Serve cached app shell for offline navigation without masking a new deployment forever.
4. Add a clear non-intrusive update/reload notice when a newer service worker is waiting.
5. Verify a previously loaded app starts and can create/edit tasks offline.

Optional sync requirements, only if explicitly configured:
1. Create a separate Cloudflare Worker in `worker/`; it is not needed for local use.
2. Browser Settings configures a Worker URL. OAuth login goes to `/auth/login`; the worker uses GitHub OAuth and stores an encrypted HttpOnly, Secure, SameSite=Lax session cookie. Never expose a GitHub token to browser JavaScript.
3. Browser syncs snapshot using credentialed GET/PUT `/api/data`; worker stores `users/<github-user-id>.json` in a private GitHub data repository through the Contents API.
4. Require secrets `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `SESSION_SECRET`; variables `APP_ORIGIN`, `GITHUB_DATA_REPO`; never commit them.
5. Restrict CORS to APP_ORIGIN with credentials, validate OAuth state, and serialize/debounce client remote writes. Detect GitHub SHA conflicts and show a recoverable conflict choice rather than silently overwriting.

Exit checks:
- Install/reload and offline-start test after app shell has been cached
- Offline create/edit/export test
- If sync is built: verify OAuth token is absent from browser storage/network-visible app state and conflict is recoverable
```

## Phase 8 — release verification

```text
Implement Phase 8 only for TalentisOS X. Do not add features. Audit, test, and fix verified defects.

Create a release checklist and test the following:
1. First-run workspace starts empty and usable.
2. EOD → next-day Huddle → Today uses one task ID with no duplicate carry-over.
3. Complete/reopen and handback are consistent across Today, Rocks, Meetings, and issue links.
4. Overdue tasks and amber/red KPIs are discoverable from Today and Insights.
5. JSON backup/restore preserves all entities, history, and stable IDs, including normalized older task shapes.
6. Hash deep links and browser back/forward work for every documented route/alias.
7. App is offline-capable after first successful load.
8. Keyboard, reduced-motion, responsive, and print checks pass.
9. There are no console errors during these workflows.

Run all automated tests, syntax checks for every JavaScript module, and `git diff --check`. Give a concise release report with known limitations only when reproduced.
```

---

## Change-request prompt — use after a phase is complete

```text
Make the following change to TalentisOS X: [DESCRIBE THE CHANGE].

Relevant completed phase(s): [PHASE NUMBERS]. Preserve the product contract: local-first behaviour, one canonical task collection with stable IDs, four-item public navigation, route compatibility aliases, accessibility, and offline support.

Before editing, identify the affected state contract, task command/selector, view, and tests. Implement the smallest coherent change. Add or update tests for changed domain behaviour, run the relevant verification, and report changed files plus any migration impact. Do not rewrite unrelated modules or add dependencies.
```

## Useful feature prompts

### Add a new work source

```text
Add [SOURCE NAME] as a producer of canonical TalentisOS X tasks. It must use the existing createTask command, set source/sourceId provenance, append history, preserve the task ID across views, appear in Today’s Work according to selector rules, and never create a parallel task store. Add domain and UI tests.
```

### Change the data schema safely

```text
Add [FIELD OR ENTITY] to the TalentisOS X workspace schema. Bump schemaVersion, implement a forward migration in normalizeWorkspace, preserve backward compatibility for prior exports, define defaults and validation, update export/import tests, and do not discard unknown fields.
```

### Add a KPI rule

```text
Change the KPI status rule as follows: [RULE]. Update the explicit product contract, pure status function, every boundary test for higher/lower measures, visible labels, and exception selectors. Explain any migration impact before implementation.
```

---

## Final release definition

The rebuild is ready when a leader can use it entirely offline to close a day, carry real work forward without duplicates, execute and complete it, identify KPI exceptions, run an L10/IDS meeting that produces linked actions, and export/import the complete workspace. The app should remain understandable to change because each behaviour has a clear module, command, state contract, and test.
