# Phase 02 acceptance scenarios

| Scenario | Expected result | Evidence |
| --- | --- | --- |
| Quick Capture on Today or Tasks | A title creates one IndexedDB task; urgency and due date remain optional. | `phase02.test.js`; manual browser check pending founder review. |
| Detail edit and completion | Editing retains the stable ID; completion changes that same record and is visible in all task views. | Task identity/domain tests; manual browser check pending. |
| Blocked/waiting | Save is rejected without context; open/completed tasks cannot retain blocked/waiting context. | Domain test. |
| Subtasks | Completed/total is derived from the canonical subtask list. | Domain test. |
| Workday | Monday–Thursday advances one day; Friday–Sunday advances to Monday using saved timezone interpretation. | Domain test. |
| Archive/restore | Archive is reversible and restore retains task identity/history. | Domain test; manual browser check pending. |
| Deletion and links | The user is told about every linked task before deletion; repair/delete occurs in one IndexedDB transaction or fails safely. | Reference-repair and confirmation-format domain tests; final local-browser validation passed: named linked task, stable ID, `depends-on`, explicit irreversible warning, target removal, linked-reference repair and unrelated-task preservation. |
| Responsive/accessibility | 390 px, 768 px, 1440 px, keyboard, reduced motion and horizontal-overflow checks must be recorded before approval. | Pending manual validation. |
