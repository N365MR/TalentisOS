# Phase 04 acceptance scenarios

Controlling implementation commit: `322601deda92397febc44e55df50aa2883fc4d88` (`feat: implement Phase 04 daily decision surface`).

| Scenario | Expected result | Evidence |
| --- | --- | --- |
| EOD to Huddle | A prior EOD's carry-over IDs, Top 3 and recognition populate the target-workday Huddle without re-entry. | `phase04.test.js`. |
| Huddle linking/resume | Adding an existing task as a commitment creates a duplicate-safe reference; reopening uses the same `huddle_YYYY-MM-DD`. | `phase04.test.js`. |
| Decision order | Blocked/waiting and overdue canonical tasks appear before Top 3/urgent work, then routine work. | `phase04.test.js`. |
| Completion synchronisation | Completing a task from Home, Huddle, Today or Tasks updates the same canonical task ID. | `phase04.test.js`; seeded Safari workflow passed. |
| Workday boundary | Friday-through-Sunday carry context resolves into Monday's Huddle through the shared utility. | `phase03.test.js`, `phase04.test.js`. |
| EOD carry-state regression | Individual, selected and all carry preserve canonical IDs, mark carried tasks “Prepared for YYYY-MM-DD”, remove repeat carry controls, and show one persistent live success message immediately after the carry controls. | `phase03.test.js`, `phase04.test.js`; seeded Safari revalidation passed. |
| EOD save confirmation | Saving in-progress Top 3 or closeout text shows “End of Day progress saved.” immediately below the save controls, with polite live-status semantics. Carry and save feedback remain distinct; completed EOD remains read-only. | `phase03.test.js`, `phase04.test.js`; seeded Safari revalidation passed. |
| Responsive/accessibility | Seeded EOD → Huddle → Today at 390, 768 and 1440 px has keyboard access, reduced motion and no horizontal overflow. | Seeded Safari validation passed. |
