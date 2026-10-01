# Phase 08 manual release-evidence checklist

## Purpose

Use this checklist on a safe test workspace, never the only copy of real leadership data. Record the browser and operating-system version, date, tester, result and any defect for every row. A result is not a pass until the observable outcome is recorded.

## Test preparation

1. Use a fresh browser profile or a test-only workspace.
2. Create a small linked fixture: Start Here completion; one Quick Capture task; an EOD carried into a Huddle; one risk, decision and handover linked to the task; one conversation and Weekly Review linked to it; and one saved draft.
3. Keep one exported JSON backup outside that browser profile before attempting reset or import.

## Supported-browser matrix

Complete every row for the current browser version and its two preceding major versions where practicable.

| Device/browser | Install and refresh | Offline launch | Service-worker update and data persistence | Result / evidence link |
| --- | --- | --- | --- | --- |
| iPhone Safari | Install to Home Screen; close and reopen | Enable Airplane Mode; open the installed app | Deploy a safe test build with a new cache version; reload; confirm fixture remains | |
| iPad Safari | Install to Home Screen; close and reopen | Enable Airplane Mode; open the installed app | Deploy a safe test build with a new cache version; reload; confirm fixture remains | |
| macOS Safari | Fresh profile install/refresh | Disable network; open app | Update test build; reload; confirm fixture remains | |
| Desktop Chrome | Fresh profile install/refresh | Disable network; open app | Update test build; reload; confirm fixture remains | |
| Desktop Edge | Fresh profile install/refresh | Disable network; open app | Update test build; reload; confirm fixture remains | |
| Desktop Firefox | Fresh profile install/refresh | Disable network; open app | Update test build; reload; confirm fixture remains | |

For each pass, verify keyboard operation, visible focus, labels/landmarks, non-colour status cues, reduced motion and no horizontal loss at 390 px, 768 px and 1440 px.

## Recovery drill

1. Export the test fixture and confirm Backup health shows the successful export time.
2. Record the export filename, schema version and store count shown in the JSON file.
3. Clear only the test workspace after confirming the exported file is available.
4. Import the same file, inspect the replacement preview, and type `REPLACE` only when the counts are expected.
5. Verify the task’s EOD/Huddle links, risk mitigation, decision follow-up, handover link, conversation follow-up and Weekly Review next-week link.
6. Reload, then take the device offline and reload again. Confirm the restored records remain usable.
7. Separately choose a malformed/unsupported backup and confirm it is rejected with the original test fixture unchanged.

## Performance observation

On a typical supported iPhone or iPad, record a screen video or timing trace for:

- cold open to usable shell (target: within two seconds);
- Quick Capture save, completion and task-list update (target: feedback within 100 ms where practical);
- import/export and volume-heavy actions (confirm an understandable progress state when over 300 ms);
- filtering and scrolling after the documented 5,000-task / 1,000-linked-record fixture is loaded in a test-only workspace.

## Moderated emerging-leader usability sessions

Use representative emerging leaders on a real iPhone or iPad. Do not collect names, performance assessments or sensitive work details. Ask each participant to think aloud while they:

1. complete first-run orientation and identify the next useful action;
2. enter a Quick Capture task;
3. resume, then discard, an interrupted draft;
4. follow one risk, decision and handover through Needs attention;
5. prepare a conversation and link a follow-up task; and
6. explain how they would back up and recover their data.

Record task completion, observed confusion, intervention needed, time, device/browser version and follow-up defects. The Core release requires evidence that participants can orient, act and follow through without coaching.
