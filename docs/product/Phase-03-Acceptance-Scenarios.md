# Phase 03 acceptance scenarios

Controlling implementation: `cb45dfa3045791fc489974b23cae1029d7c02327` (`feat: implement Phase 03 End of Day workflow`).

| Scenario | Expected result | Evidence |
| --- | --- | --- |
| One EOD per workday | Opening Prepare tomorrow creates or resumes only `eod_YYYY-MM-DD`; saved closeout fields persist after reload. | `phase03.test.js`; Safari validation PASS at `127.0.0.1:5193`. |
| EOD completion | Completing an existing task from EOD changes its original task record and its status reflects in Tasks/Today. | `phase03.test.js`; Safari validation PASS at `127.0.0.1:5193`. |
| Carry-forward | The user can carry one outstanding task, a selected subset or all outstanding work. Each action changes the existing task due date using the shared next-workday rule and creates one idempotent history entry. | `phase03.test.js`; Safari validation confirmed individual, selected-subset and carry-all actions preserve the three original IDs and append exactly one `2026-09-20 → 2026-09-21` entry each. |
| Quick Capture to EOD | A task Quick-Captured with a committed due date on the EOD workday is eligible for the EOD review; an unselected date remains `null` and is not misrepresented as saved. | `phase02.test.js`, `phase03.test.js`; Safari validation confirmed a selected `2026-09-20` persisted and appeared in EOD. |
| Carry idempotence | Repeating the same carry request creates neither a task clone nor another history entry. | `phase03.test.js`; Safari validation confirmed one carry-history entry per original task ID. |
| Friday through Sunday | Friday, Saturday and Sunday carries resolve to Monday. | `phase03.test.js`. |
| Tomorrow's Top 3 | At most three reviewed canonical tasks are saved in selection order; no task content is copied. | `phase03.test.js`; Safari validation PASS. |
| Interrupted workflow | In-progress status, Top 3, recognition and lessons can be saved before closeout and resumed from the same EOD ID. | `phase03.test.js`; Safari validation confirmed Top 3, recognition and lesson restore after navigation. |
| Completed EOD | A completed EOD is read-only: it retains the task summary, Top 3, recognition and lesson content but exposes no carry, save, complete, archive or task-completion controls. Canonical tasks remain actionable from their normal task surfaces. | `phase03.test.js`; Safari validation PASS. |
| Responsive/accessibility | The EOD flow works at 390 px, 768 px and 1440 px with keyboard operation, reduced motion and no horizontal overflow. | Safari PASS: 390 px (`innerWidth`, document and body widths all 390), 768 px (all 768), and 1440-class (all 1439) reported no horizontal overflow; keyboard and reduced-motion checks passed. |
