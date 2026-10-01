# Supported-browser matrix — Phase 08

## Policy

TalentisOS supports the current and two immediately preceding major versions of Safari on iPhone and iPad, and Safari, Chrome, Edge and Firefox on desktop, subject to IndexedDB and Service Worker support. Actual tested versions must be recorded before a production release.

| Platform and browser | Required checks | Evidence status on 2026-09-29 |
| --- | --- | --- |
| iPhone Safari | clean install, refresh, offline launch, service-worker update, persistence, recovery drill, first-run usability session | **Not recorded — launch blocker** |
| iPad Safari | clean install, refresh, offline launch, service-worker update, persistence, recovery drill, first-run usability session | **Not recorded — launch blocker** |
| macOS Safari | clean install, refresh, offline launch, service-worker update, persistence, recovery drill | Prior Phase 01 evidence exists; Phase 08 recovery/update re-test not recorded |
| Desktop Chrome | clean install, refresh, offline launch, service-worker update, persistence, recovery drill | **Not recorded — launch blocker** |
| Desktop Edge | clean install, refresh, offline launch, service-worker update, persistence, recovery drill | **Not recorded — launch blocker** |
| Desktop Firefox | clean install, refresh, offline launch, service-worker update, persistence, recovery drill | **Not recorded — launch blocker** |

The local in-app browser check on 2026-09-29 is development evidence only. It does not substitute for the supported-browser matrix or real-device tests. Execute and attach results using `Phase-08-Manual-Evidence-Checklist.md`.
