# Phase 08 release evidence

## Automated evidence — 2026-09-29

- `npm test`: **PASS** — 79 Node tests. Phase 08 now has an isolated Core workflow fixture from Start Here through Weekly Review, plus malformed/unsupported/unknown-relationship rejection, Backup health and destructive-confirmation coverage. No browser-test framework was added; approval would be required before introducing one.
- Isolated volume boundary: **PASS** — 5,000 tasks plus 1,000 linked risk/decision/handover records were constructed and fully export-envelope validated in memory in 27.8 ms on this local development host. The test requires completion under 2,000 ms.
- Isolated routine-action timing: **PASS** — 1,000 Quick Capture validations plus a small envelope validation completed in 0.9 ms on this local development host. The test requires each local fixture operation to complete under 300 ms. These are deterministic code-path timings, not a substitute for device interaction timing.
- `npm run build`: **PASS** — Vite production build completed locally.
- `node --check src/main.js src/persistence/database.js src/domain/backup.js`: **PASS**.
- `git diff --check`: **PASS**.

## Local browser evidence — 2026-09-29

At `http://127.0.0.1:5173/#/tasks`, the existing persisted workspace rendered the Backup health panel. It showed the no-export state using both text and a circle symbol, supplied secure-storage/recovery instructions, exposed an export action and file chooser, and disabled clear-data until a successful export. This is not a recovery drill because no user data was exported, cleared or replaced during the inspection.

## Founder-recorded Safari desktop responsive evidence — 2026-09-29

At `http://127.0.0.1:5174/#/tasks`, Safari desktop checks passed at 1440 × 900, 768 × 1024 and 390 × 844. At every size, the Tasks screen was readable; Backup health and recovery controls were reachable; and no console red errors were observed. At 768 px and 390 px no sideways scrolling was needed. Navigation and Quick Capture were usable at 768 px; the mobile Menu button and Quick Capture were usable at 390 px.

Safe persistence also passed: the test task “Phase 08 safe persistence test” appeared under All tasks and remained visible after refresh, with no console red errors. This is Safari desktop responsive testing only. It is not real iPhone/iPad evidence, a full export/import/reset recovery drill, or moderated usability evidence.

## Founder-recorded Firefox clean-browser evidence — 2026-09-30

At `http://127.0.0.1:5173/#/tasks`, Firefox loaded the Tasks page with an empty, browser-specific task list. Backup health was reachable, and no visible error or blank screen occurred. Safari task data did not appear in Firefox, as expected: IndexedDB is isolated by browser/profile and origin.

Safari’s visible Phase 04 validation tasks are existing Safari local test data, not evidence of stale Phase 04 source code. The local `5173` development server was independently checked and is serving the current Phase 08 source, including Backup health and recovery controls.

## Founder-recorded Safari desktop smoke check — 2026-09-30

At `http://127.0.0.1:5173/#/tasks`, the Tasks page loaded, Quick Capture was visible, and Backup health was reachable. No visible app error or blank screen occurred. Existing Safari local data was visible as Phase 04 validation tasks. Those records are browser-specific local IndexedDB data, not evidence that stale Phase 04 source is being served.

## Founder-recorded clean Safari check after website-data deletion — 2026-09-30

At `http://127.0.0.1:5173/#/tasks`, the Tasks page loaded with an empty task list. Backup health showed the no-export state, “No backup exported yet”, and visible recovery/reset guidance. No visible app error or blank screen occurred. This confirms a clean Safari local workspace after website-data deletion, with no Phase 04 records visible.

This does not replace real iPhone/iPad Safari testing, a full recovery drill, the complete browser matrix, supported-device timing evidence, moderated usability sessions, or production smoke/rollback evidence.

## Founder-recorded production-like recovery drill — 2026-09-30

The disposable workspace was built and served with `npm run build` and `npm run preview -- --host 127.0.0.1 --port 4173` at `http://127.0.0.1:4173/#/tasks`. The production-like preview and clean origin passed: Tasks loaded with an empty list, Backup health showed no-export, and no visible error or blank screen occurred.

The test created “Phase 08 recovery drill task”, confirmed it under All tasks, then exported JSON. Export passed, the file downloaded, and Backup health changed from no-export. The downloaded file identified `format: talentisos-backup`, `schemaVersion: 9`, included `settings` and `tasks` stores, and contained the task title.

The in-app clear-data flow passed: it required typed confirmation, completed, then showed an empty Tasks list and reset Backup health/no-export state without a visible error or blank screen. Import also passed: selecting the backup showed a preview of two records (one settings and one task), replacement required typed confirmation, and the restored task appeared under All tasks with no visible error or blank screen. An online reload retained both the task and Backup health’s last-export state.

Safari’s Develop menu showed Service Workers and a worker for `127.0.0.1:4173`. After the preview server was stopped, a reload still loaded Tasks, the restored task and Backup health; Safari did not show a server/error page. This is a successful localhost production-preview offline-shell recovery check.

Limitations: this was localhost production-preview evidence, not deployed production; it used disposable test data rather than real leadership data; it verified one task and workspace settings only, with no Risk, Decision or Handover relationship because the safe UI path used for this drill created only the recovery-drill task. It does not replace real iPhone/iPad Safari testing, complete browser-matrix testing, supported-device timing evidence, moderated usability sessions, or production deployment/smoke/rollback evidence.

## Founder-recorded desktop supported-browser matrix — 2026-09-30

Testing used the production-like preview at `http://127.0.0.1:4173/#/tasks`, served by Vite preview after `npm run build`, rather than Vite development mode.

| Browser | Tasks page | Quick Capture | Backup health | Visible error / blank screen | Local task state |
| --- | --- | --- | --- | --- | --- |
| Safari desktop | PASS | PASS | PASS | None | Disposable recovery-drill test data present |
| Chrome desktop | PASS | PASS | PASS | None | Disposable recovery-drill test data present |
| Firefox desktop | PASS | PASS | PASS | None | Empty, as expected for separate local browser storage |
| Edge desktop | PASS | PASS | PASS | None | Empty, as expected for separate local browser storage |

Limitations: console output was not checked in every browser. This was local production-preview desktop testing, not deployed-production testing. It does not replace real iPhone/iPad Safari testing, supported-device timing evidence, moderated usability sessions, or production smoke/rollback evidence.

## Founder-recorded Chrome desktop lifecycle check — 2026-09-30

At `http://127.0.0.1:4173/#/tasks`, served by Vite preview after `npm run build`, Chrome loaded Tasks and refreshed successfully before test-data creation. The disposable “Chrome lifecycle test task” was created, appeared under All tasks, and remained visible after a second successful refresh. Backup health was reachable; no visible app error or blank screen occurred.

Limitations: console output was not checked. This was local production-preview evidence, not deployed-production testing. It does not replace real iPhone/iPad Safari testing, supported-device timing evidence, moderated usability sessions, or production smoke/rollback evidence.

## Founder-recorded Firefox desktop lifecycle check — 2026-09-30

At `http://127.0.0.1:4173/#/tasks`, served by Vite preview after `npm run build`, Firefox loaded Tasks and refreshed successfully before test-data creation. The disposable “Firefox lifecycle test task” was created, appeared under All tasks, and remained visible after a second successful refresh. Backup health was reachable; no visible app error or blank screen occurred.

Limitations: console output was not checked. This was local production-preview evidence, not deployed-production testing. It does not replace Firefox offline-launch or service-worker-update evidence, real iPhone/iPad Safari testing, supported-device timing evidence, moderated usability sessions, or production smoke/rollback evidence.

## Microsoft Edge desktop matrix status — 2026-09-30

Microsoft Edge was not installed on this Mac, so Edge desktop lifecycle testing was **NOT TESTED**. This is not a functional failure of TalentisOS; it remains a browser-matrix evidence gap until Edge is installed and tested later.

## Founder-recorded Brave/Chromium offline-shell check — 2026-10-01

At `http://127.0.0.1:4173/#/tasks`, Brave DevTools showed the Application tab, Service Workers section, and an `sw.js` worker for the preview origin. Its client was `http://127.0.0.1:4173/#/tasks`; the worker status was activated/stopped, which is acceptable before it is needed.

With the production preview server stopped, reloading still loaded Tasks with Quick Capture visible and Backup health reachable; Brave did not show a browser server/error page. This is a successful Brave/Chromium localhost production-preview offline-shell check.

Limitations: this is Brave/Chromium evidence, not Google Chrome-specific evidence, and it is localhost production-preview evidence rather than deployed-production evidence. It does not replace real iPhone/iPad Safari testing, supported-device timing evidence, moderated usability sessions, or production smoke/rollback evidence.

## Founder-recorded Firefox offline-shell check — 2026-10-01

At `http://127.0.0.1:4173/#/tasks`, Firefox opened and refreshed Tasks. `about:debugging` showed Service Workers and a worker for `http://127.0.0.1:4173/sw.js`, with origin `http://127.0.0.1:4173`. Its stopped/listening-for-fetch-events status was acceptable before the worker was needed.

With the production preview server stopped, reloading still loaded Tasks with Quick Capture visible, Backup health reachable, and the existing Firefox lifecycle test task present; Firefox did not show a browser server/error page. This is a successful Firefox localhost production-preview offline-shell check.

Limitations: this is localhost production-preview evidence, not deployed-production evidence. It does not replace real iPhone/iPad Safari testing, supported-device timing evidence, moderated usability sessions, production smoke/rollback evidence, or Firefox service-worker update-cycle evidence.

## Founder-recorded real iPhone Safari local-network check — 2026-10-01

At `http://192.168.20.16:4173/#/tasks`, a production-like Vite preview on the same Wi-Fi network, the iPhone Safari Tasks page loaded. Mobile Menu and Quick Capture were visible, Backup health was reachable by scrolling, and no visible app error or blank screen occurred.

An open mobile layout defect was observed: the due-date field extended horizontally beyond its card, and the lower “Clear this device’s local data…” control was clipped or partly hidden near Safari’s bottom toolbar. This requires remediation before Phase 08 can pass.

## Mobile layout remediation awaiting founder re-test — 2026-10-01

The first mobile-only CSS correction below 48rem made the clear-data control fit within its recovery card, but two real-iPhone re-tests still found the native due-date input overflowing. The third correction adds a phone-only bounding wrapper and removes the control’s native visual appearance while retaining its `type="date"` behaviour. Focused automated source coverage and the production build must pass. This does not close the defect: re-test on the same real iPhone is required, including confirming that tapping the field still opens the date picker, before the evidence can be marked PASS.

## Founder-recorded real iPhone Safari layout-remediation re-test — 2026-10-01

At `http://192.168.20.16:4173/#/tasks`, the due-date control was fully inside the Quick Capture card with no visible horizontal overflow or clipping. The Add task button was fully visible, no visible app error or blank screen occurred, and tapping the due-date control opened a usable iPhone date picker. The clear-data button had already passed its earlier visibility re-test. The recorded iPhone Safari mobile layout defect is therefore remediated.

Limitation: this remains plain HTTP over a local-network IP. It proves real-device layout and control usability, not iPhone HTTPS/PWA/offline service-worker behaviour.

## Founder-recorded real iPad Safari local-network check — 2026-10-01

At `http://192.168.20.16:4173/#/tasks`, a production-like Vite preview on the same Wi-Fi network, the iPad Safari Tasks page loaded with usable navigation and visible Quick Capture. The due-date field remained inside its card, the Add task button was fully visible, and Backup health was reachable by scrolling. No visible app error or blank screen occurred.

Limitation: this was plain HTTP over a local-network IP. It is valid for real-device iPad layout, workflow, IndexedDB and usability checks, but not iPad PWA/offline/service-worker evidence because Safari will not register a service worker for this insecure origin.

## Founder-recorded Mac Safari timing check — 2026-10-01

At `http://127.0.0.1:4173/#/tasks`, served by Vite preview from the existing production build, a usable Tasks page appeared within about two seconds after reload. The disposable “Timing test task” was created and appeared quickly after Add task. No visible delay over 300 ms occurred without a progress state, and no visible app error or blank screen occurred.

Limitations: this was manual approximate timing rather than instrumented performance telemetry, and Mac Safari local production-preview evidence rather than deployed-production evidence. It does not replace iPhone/iPad timing evidence, moderated usability sessions, or production smoke/rollback evidence.

## Founder-recorded real iPhone Safari timing check — 2026-10-01

At `http://192.168.20.16:4173/#/tasks`, a usable Tasks page appeared within about two seconds after reload. The disposable “iPhone timing test task” was created and appeared quickly after Add task. No visible delay over 300 ms occurred without a progress state, and no visible app error or blank screen occurred.

Limitations: this was manual approximate timing rather than instrumented performance telemetry, and HTTP local-network preview evidence rather than HTTPS/PWA/offline evidence. It does not replace iPad timing evidence, moderated usability sessions, or production smoke/rollback evidence.

## Founder-recorded real iPad Safari timing check — 2026-10-01

At `http://192.168.20.16:4173/#/tasks`, a usable Tasks page appeared within about two seconds after reload. The disposable “iPad timing test task” was created and appeared quickly after Add task. No visible delay over 300 ms occurred without a progress state, and no visible app error or blank screen occurred.

Limitations: this was manual approximate timing rather than instrumented performance telemetry, and HTTP local-network preview evidence rather than HTTPS/PWA/offline evidence. It does not replace moderated usability sessions or production smoke/rollback evidence.

Limitation: this was plain HTTP over a local-network IP. It is valid for real-device layout, workflow, IndexedDB and usability checks, but not iPhone PWA/offline/service-worker evidence because Safari will not register a service worker for this insecure origin.

## Open evidence gates

- G-010 is resolved: existing installed iPad and iPhone PWAs updated to the temporary HTTPS v7 artifact and each retained its disposable task through an offline launch. This remains temporary test-origin evidence, not production evidence.
- Google Chrome-specific offline/service-worker-update evidence, Firefox update-cycle evidence, and all Edge lifecycle evidence remain open.
- No measured two-second mobile shell, routine-action latency, or progress-state timing evidence is recorded.
- No moderated sessions with representative emerging leaders on a real iPhone or iPad are recorded.
- Production smoke-test, deployment record and rollback evidence are not recorded.

These are launch blockers. Phase 08 is therefore **NOT READY** pending founder-approved evidence collection; no deployment should be performed from this state.

The exact remaining device, recovery, performance and usability steps are in `Phase-08-Manual-Evidence-Checklist.md`.

## Founder-recorded iPhone HTTPS PWA install and offline check — 2026-10-02

At the temporary HTTPS test origin, `https://talentisos-phase08-test.github.io/`, the app loaded, installed to the iPhone Home Screen, and opened as an installed PWA. The disposable “iPhone HTTPS PWA offline test task” persisted after closing and reopening the installed app. With Airplane Mode on and Wi-Fi off, the installed app launched offline and the task remained visible without a Safari or network error. The iPhone was returned online after the test.

Limitations: this is a temporary public HTTPS test origin, not production, and used disposable data only. It does not complete iPad HTTPS PWA evidence, service-worker update-cycle evidence, the accessibility matrix, moderated usability sessions, production smoke testing, or rollback evidence.

## Founder-recorded iPad HTTPS PWA offline-launch check — 2026-10-02

At the temporary HTTPS test origin, `https://talentisos-phase08-test.github.io/`, the app loaded, installed to the iPad Home Screen, and opened as an installed PWA while online. The disposable “iPad HTTPS PWA offline test task” persisted after closing and reopening the installed app while online.

With Airplane Mode on and Wi-Fi off, installed-PWA launch was **FAIL / DEGRADED**: the iPad showed a white blank screen for a long time, was not promptly usable, and did not promptly show the task. After waiting and/or returning online, the installed app opened again. The user-observed detail was: “it took a long time to open from a blank screen”. This is a Phase 08 launch blocker until diagnosed and remediated.

Limitation: this is temporary public HTTPS test-origin evidence using disposable data only, not production evidence.

## G-010 iPad installed-PWA offline remediation re-test — 2026-10-02

The temporary HTTPS v7 artifact (`talentisos-shell-v7`) updated and reopened in the existing installed iPad PWA while online. The existing disposable “iPad HTTPS PWA offline test task” remained visible online. With Airplane Mode on and Wi-Fi off, installed-PWA launch passed: no prolonged white blank screen was observed and the task was visible offline. The iPad was returned online and the task remained visible.

This remediates the original G-010 functional defect on the temporary HTTPS test origin. It is temporary public HTTPS evidence with disposable data only, not production evidence. Phase 08 remains **NOT READY** pending its separate evidence gates: complete supported-browser lifecycle/update coverage, moderated usability sessions, and production smoke/rollback evidence.

## Founder-recorded iPhone v7 installed-PWA update and offline regression — 2026-10-02

At the temporary HTTPS test origin, `https://talentisos-phase08-test.github.io/`, the existing installed iPhone PWA updated and reopened online. Its existing disposable “iPhone HTTPS PWA offline test task” remained visible online. With Airplane Mode on and Wi-Fi off, v7 installed-PWA launch passed: no prolonged white blank screen was observed and the task was visible offline. The iPhone was returned online and the task remained visible.

This completes the iPhone v7 installed-PWA update/offline regression evidence. It preserves G-010 as resolved on the temporary v7 artifact and remains temporary public HTTPS evidence using disposable data only, not production evidence.
