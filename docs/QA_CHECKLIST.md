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
- IndexedDB version 1 persists settings, daily plans, and priorities after reload and creates no sample workspace data.

## Lighthouse documentation

Run Lighthouse against a production preview with `npm run build && npm run preview`, then record Performance, Accessibility, Best Practices, and PWA scores here. The Phase 1 implementation is structured for installability and accessibility, but scores are environment-dependent and must be captured in the target browser before release.
