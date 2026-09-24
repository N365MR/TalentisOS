# Phase 06 acceptance scenarios — Start Here, First 7 Days and roadmap

Controlling implementation: `46920f25637406fcff0e5133c0dc34e4f4544d29` (`feat: implement Phase 06 new leader orientation`), approved 2026-09-24.

| Scenario | Expected result | Evidence |
| --- | --- | --- |
| Four-question Start Here | Responsibility, workdays, weekly outcome and tomorrow attention save in one local orientation record; no account or profile is required. | `phase06.test.js`; manual Safari check pending |
| Workday boundary | One or more usual workdays validate, while the existing saved timezone and EOD/Huddle workday rules remain unchanged. | `phase06.test.js`; migration inspection |
| Optional canonical actions | A task is created only when its checkbox is selected; it is a normal canonical task, not an orientation copy or reference. | `main.js`; manual Safari check pending |
| First 7 Days privacy | Themes, evidence, contradictions and questions to test save; labelled names and HR/personal-file commentary are rejected. | `phase06.test.js` |
| Guidance interruption and skip | Local drafts resume after refresh; guidance may be saved, skipped and resumed without blocking Today. | `main.js`; manual Safari check pending |
| Current roadmap | Only Days 1–30 and one next listening/verification action are visible; Days 120–365 and advanced controls remain hidden. | `phase06.test.js`; manual Safari check pending |
| Contextual access | Start Here and First 7 Days are reached from Today; the five approved primary destinations remain unchanged. | `phase01.test.js`; `phase06.test.js` |

## Required manual Safari evidence

Validate a first-run flow at 390 px, 768 px and 1440 px: meaningful action within two minutes, form draft/resume, privacy validation, optional-task choice, skip/resume, current-stage-only roadmap, keyboard focus, reduced motion and no horizontal overflow.

## Manual validation record — 2026-09-23

At `http://localhost:5186/TalentisOS/`, fresh-origin Safari Responsive Design Mode validation passed at `window.innerWidth = 390`. Start Here saved responsibility `Operations leadership`, Monday–Friday usual workdays, weekly outcome `Stabilise daily operations` and tomorrow attention `Review the first operational risks`. Both optional task choices remained unticked; after refresh Today was usable, Home showed only Days 1–30 with one next roadmap action, and IndexedDB `orientation/core-orientation` retained the saved answers and First 7 Days guidance. The IndexedDB `tasks` store remained empty, confirming no optional task was created. Privacy-safe themes, evidence, contradictions and questions to test also saved.

Safari reported a service-worker registration warning because `sw.js` was unavailable on this temporary port. This is temporary dev-origin behaviour and is not console-cleanliness evidence for the normal validation origin.

At 390 px, First 7 Days draft/skip validation passed. A partial privacy-safe Themes draft (`Partial draft — handover pattern still being checked`) restored after Safari refresh without being saved. Selecting **Skip guidance for now** displayed `Guidance skipped. You can return whenever it is useful.`; returning to Today remained usable and showed only Days 1–30 with exactly one next roadmap action.

At 390 px, privacy-safe First 7 Days validation passed. Saving Themes value `Name: Alex is unreliable.` was rejected with `Themes must describe work themes and evidence, not names, judgements or HR commentary.` IndexedDB `orientation/core-orientation` did not store the unsafe text and retained the earlier safe theme `Shift handovers are inconsistent`. Today remained usable, with only Days 1–30 and exactly one next roadmap action visible.

At 390 px, optional canonical task creation passed through the supported Start Here edit route (`#/today/start-here`). Existing answers loaded, both optional task choices were selected, and save succeeded. Tasks showed exactly two canonical records—`Stabilise daily operations` and `Review the first operational risks`—which remained the same two after Safari refresh, with no duplicate copies.

At 390 px, optional First 7 Days task creation passed. The saved privacy-safe guidance remained present; selecting the optional action created one additional canonical task, `Listen, observe the work, and verify evidence before changing a system.` The two Start Here tasks remained unchanged. After Safari refresh, all three tasks existed exactly once, with no duplicate.

At 768 px, the initial keyboard check found that Safari did not visibly render focus on **Back to Today** when relying on the global `:focus-visible` rule. Phase 06 now adds a scoped `:focus` outline fallback for orientation links, buttons and fields; manual Safari revalidation is required.

At 768 × 900, Safari keyboard-only revalidation passed with **Press Tab to highlight each item on a webpage** enabled. Skip to content, Menu, Back to Today, all four First 7 Days observation fields, optional-task checkbox, Save guidance and Skip guidance for now received visible focus; Back to Today visibly used the scoped yellow focus fallback. No horizontal overflow was present (`innerWidth` 767, `documentWidth` 767).

At 1440 × 900, desktop validation passed. Primary navigation showed exactly Today, Prepare tomorrow, Start the day, Conversations and Tasks; Start Here and First 7 Days remained contextual. Home showed only Days 1–30 with exactly one next roadmap action. No horizontal overflow was present (`innerWidth` 1440, `documentWidth` 1440).

Reduced-motion manual validation is **not completed**. Phase 06 must remain validation-pending until that evidence is supplied or the acceptance requirement is explicitly changed.

The current macOS/Safari validation environment has no available Reduce Motion toggle or Safari emulation control. This is an **environment limitation, not a product defect**: the shared stylesheet implements `@media (prefers-reduced-motion: reduce)` by disabling smooth scrolling and reducing transition/animation duration. Focused Phase 06 automated coverage now asserts that contract; manual toggle evidence is not required to close this environment limitation.

At the normal validation origin `http://localhost:5185/TalentisOS/`, Safari Console was cleared before navigating Today/Home, Start Here, First 7 Days and Back to Today. No red application-console errors appeared.

At fresh local origin `http://localhost:5187/TalentisOS/`, timed first-run validation passed. A leader opened Today, completed Start Here with default workdays and no optional task choices, returned to Home and reached the visible roadmap next action in **1 minute 10 seconds**, within the required two minutes.
