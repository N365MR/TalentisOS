# Phase 05 acceptance scenarios

Controlling implementation: `d36ebec1df0f6e25bde9896a75b548246d0e0158` (`feat: implement Phase 05 needs-attention workflows`), approved 2026-09-23.

| Scenario | Expected outcome | Evidence |
| --- | --- | --- |
| Risk closure | A risk cannot resolve without a note; one mitigation task ID remains linked. | `phase05.test.js` |
| Decision change/archive | A revision captures the prior state; archive retains history and links. | `phase05.test.js` |
| Handover lifecycle | Only Draft → Ready → Acknowledged → Archived succeeds; acknowledgement is recorded. | `phase05.test.js` |
| Task references | Replace and unlink are unique and retain the canonical task rather than copying it. | `phase05.test.js`; `database.js` repair transaction |
| Daily loop | Critical risks, decision follow-ups and ready handovers retrieve into Home, EOD, Huddle and Today with a direct record route. | `main.js` |
| Import boundary | Only valid structured Risk, Decision and Handover records pass validation. | `phase05.test.js` |

## Manual validation record — 2026-09-22

Functional Safari validation passed for disposable Risk, Handover and Decision records: canonical task link → replace → unlink preserved both original task IDs without copies; Risk resolution required and retained its note; Handover completed Draft → Ready → Acknowledged → Archived; and Decision revision/archive retained its stable ID, linked-task relationship and readable revision history. Needs attention rendering, type-aware statuses, visible contextual save feedback, stale-feedback clearing, resolution/history presentation and individual-record routes were also manually verified.

Seeded daily-loop validation also passed at 390 px, 768 px and 1440 px. The Open/Critical Risk, Open Decision with a linked follow-up task, and Ready Handover with a linked task appeared on Home, Prepare tomorrow/EOD, Start the day/Huddle and Today’s Work. Tasks retained exactly one canonical record for each linked task; no duplicates were created. No horizontal overflow, uneven form controls or missing keyboard focus was observed.

On 2026-09-23, reduced-motion behavior passed and the seeded workflow was navigated through Home, EOD, Huddle, Today’s Work, Needs attention and Tasks without a red JavaScript console error.

## Remaining approval evidence

No Phase 05 exit-gate evidence remains outstanding. Production/Pages-origin verification is not a Phase 05 exit-gate requirement; no new Pages-origin evidence has been recorded for Phase 05.
