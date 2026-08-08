# QA Checklist

- `npm install` completes and creates a lockfile.
- `npm run dev` starts without console or startup errors.
- `npm test`, `npm run lint`, and `npm run format` pass.
- `npm run build` produces `dist/` successfully.
- The semantic shell renders on narrow and wide viewports.
- Primary navigation has Today, Huddle, Work, Review, and Improve.
- Each screen has one primary action when features are introduced.
- No placeholder employee data or employee profile entity exists.
- No analytics, trackers, backend, or cloud database is included.
- Service worker and manifest are present and do not erase local data.
- `service-worker.js` registers, updates, caches the shell, and serves `offline.html` for an offline navigation.
- Light, dark, and system appearance modes work; reduced motion and forced-colors fallbacks are present.
- Desktop sidebar, tablet navigation, mobile bottom navigation, sticky primary action, and safe-area insets are verified.
- Keyboard focus and skip navigation are visible and usable.
- New users receive onboarding; each of the five answers is leader/work focused and no employee data is requested.
- Onboarding progress saves, back navigation works, completion shows the confirmation screen, and Start Today opens Today.
- Returning users open directly to Today after reload.
- Today renders correctly with empty data and answers the focus, carryover, risk, decision, follow-up, meeting, prompt, and end-of-day questions.
- Priorities can be added, edited, reordered, completed, and capped at three.
- IndexedDB version 2 migrates existing data, persists settings, daily plans, priorities, and work items after reload, and creates no sample workspace data.
- Work uses only Now, Next, Later, and Waiting groups; Now never shows more than three active items.
- Priority, Risk, Decision, Follow-up, and Action quick adds open the correct minimal fields.
- Risk, decision, and follow-up type-specific fields persist, including escalation and review details.
- Follow-up Due today, Upcoming, Waiting, Overdue, and Complete views filter correctly.
- Critical risks, due decisions, and overdue follow-ups surface on Today.
- Work autosaves, completion/deletion provides undo, and deletion requires confirmation.
- Review reuses existing records, suggests incomplete/open items, and keeps the close flow concise.
- Finishing a day saves a complete read-only closure snapshot and prepares tomorrow’s plan.
- Tomorrow preview supports confirm, reorder, remove, and one-item add.
- Daily history is read-only by default and exposes an explicit Edit Day action.

## Lighthouse documentation

Run Lighthouse against a production preview with `npm run build && npm run preview`, then record Performance, Accessibility, Best Practices, and PWA scores here. The Phase 1 implementation is structured for installability and accessibility, but scores are environment-dependent and must be captured in the target browser before release.

## Phase 9 hardening results — 2026-08-01

Automated checks completed locally:

- `npm run build` — PASS
- `npm run lint` — PASS
- `npm test` — PASS (10 tests)
- `git diff --check` — PASS
- `npm run format` — FAILS on existing long-form markup/style formatting; no formatter rewrite was applied during hardening.

Automated coverage includes regression checks for fresh onboarding, returning users, priority limit, huddle generation, risk escalation, decision lifecycle, follow-up reminders, end-of-day carryover, tomorrow preparation, weekly review, improvement conversion, JSON export/restore, CSV import/export, local snapshots, offline operation, service-worker update behavior, responsive layout safeguards, dark-mode styling, accessibility safeguards, and data deletion protection.

Manual device/browser verification before release:

- [ ] Install from Safari to iPad Home Screen and reopen after force-close.
- [ ] Verify portrait, landscape, Split View, and Stage Manager layouts.
- [ ] Verify file import/export through the iPad Files picker and share sheet.
- [ ] Verify service-worker “Update now” and “Later” behavior with an unsaved draft.
- [ ] Verify VoiceOver focus order, dialog close behavior, dynamic text, contrast, and keyboard focus.
- [ ] Verify offline launch after a successful online load and reload recovery.

Security review:

- No external trackers, analytics, secrets, or network data services are present.
- Imported JSON/CSV text is sanitized before persistence; UI text uses HTML escaping.
- CSP is declared in `index.html`; production hosting should also send equivalent HTTP security headers (`Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`).
- File handling uses browser `File`, `Blob`, object URLs, and optional native share APIs; imported files are parsed as text only.

## Phase 10 deployment validation — 2026-08-01

- Vite production base is `/TalentisOS/` — PASS.
- Production build creates `dist/assets`, `dist/manifest.webmanifest`, `dist/service-worker.js`, `dist/offline.html`, and `dist/icons/` — PASS.
- Built HTML references hashed assets under `/TalentisOS/assets/` — PASS.
- Manifest uses relative start, scope, and icon paths — PASS.
- Service worker derives its cache paths from its registration scope — PASS.
- GitHub Actions workflow triggers on `main`, runs `npm ci`, tests, production build, artifact upload, and Pages deployment — PASS (workflow contract/static test).
- Live URL documented: <https://n365mr.github.io/TalentisOS/>.

The workflow must be run after this change is pushed and GitHub Pages must be enabled for the repository. Final browser/device validation remains the deployment release check across desktop Safari, desktop Chrome, iPad Safari, installed iPad PWA, iPhone Safari, and installed iPhone PWA, including online/offline startup, import/export, dark mode, portrait, and landscape.
