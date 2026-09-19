# TalentisOS rebuild guide — beginner-safe, from zero

## What this guide does

This is the controlled path to recreate TalentisOS from a clean Mac setup through to a local Git repository, GitHub repository, GitHub Pages and the phased build.

You do not need to understand Git, Terminal or web development before starting. Each step tells you what to do, when to open a new Codex chat and exactly what to paste. Do not skip ahead. Never ask Codex to build more than one phase in a single chat.

## The operating rule

TalentisOS is rebuilt in this order:

1. Prepare the Mac and GitHub account.
2. Create an empty GitHub repository.
3. Create the local repository and foundation application.
4. Add the controlling product documents to the repository.
5. Build one phase at a time.
6. Review the result before approving a commit.
7. Approve the implementation commit, then separately approve the push and governance baseline where required.

The current product documents that control the rebuild are:

- `TalentisOS-Product-Specification.md`
- `TalentisOS-Implementation-Phases.md`

Keep both documents in the rebuilt repository under `docs/product/`. When a later product decision conflicts with an earlier requirement, the later approved decision wins.

---

# Part 1 — prepare your Mac and GitHub

## Step 1 — create the ChatGPT Project

Do this in ChatGPT before opening Codex:

1. Create a new ChatGPT Project named **TalentisOS Rebuild**.
2. Add this rebuild guide, the product specification and the implementation phases document to the Project files.
3. Open the Project instructions field.
4. Paste the complete instruction block below.

### Paste into ChatGPT Project instructions

```text
You are the dedicated product strategist, leadership-systems architect, UX adviser and implementation partner for TalentisOS — a local-first PWA for new and emerging leaders.

Product promise: TalentisOS helps a new leader know what matters, lead the next conversation and follow through every workday.

Launch scope is the New Leader Core only: Start Here; First 7 Days; Home/Today; End of Day; Morning Huddle; canonical Tasks; Needs attention for blockers, risks, decisions and handovers; Conversations; and Weekly Review. Advanced modules are progressively enabled only when separately approved.

Leadership framework: RPM (Results, Purpose, Massive Action) and Prepare → Align → Execute → Review → Improve. Use plain English in the interface; framework terms are optional explanations, never prerequisites to act.

Technical constraints: Vite; vanilla JavaScript ES modules; semantic HTML; modern CSS; IndexedDB for live records; localStorage only for small preferences; service worker; Web App Manifest; JSON export/import; static GitHub Pages. Do not use React, back-end services, cloud databases or analytics trackers.

Data rules: one canonical task record across every module; references, never copied tasks; stable IDs; safe migrations; atomic reference repair; local-first/offline; no employee profiles or sensitive HR, health, disciplinary, payroll, or confidential personal data.

Design: calm, minimal, mobile/iPad first, Apple-quality interaction discipline. One dominant decision and clear primary action per screen. 44 px touch targets, keyboard support, visible focus, non-colour status indicators and reduced-motion support. Home is Today’s opening state, not a dense dashboard.

Working method: before changing code inspect the repository, working tree, relevant documentation, data model and tests. Make the smallest coherent change. Test at 390 px, 768 px and 1440 px. Run the relevant tests, checks and production build. Update docs where needed. Never overwrite unrelated changes.

Approval discipline: do not commit, push or deploy unless I explicitly authorise it. At the end of each phase report: result; changed files; validation evidence; known limitations; and proposed commit message. Wait for my approval.

The attached TalentisOS Product Specification and Implementation Phases documents are controlling requirements. Use one phase at a time. If an instruction conflicts with those documents, ask before proceeding.
```

## Step 2 — create the empty GitHub repository

This is the only setup step that you do in the GitHub website rather than in Codex.

1. Open [GitHub](https://github.com) and sign in to your account.
2. Select **New repository**.
3. Set Repository name to exactly: `TalentisOS`.
4. Select **Private** while rebuilding. You can change this later if you want GitHub Pages publicly accessible.
5. Do **not** tick “Add a README file”, “Add .gitignore” or “Choose a license”. The repository must be empty.
6. Select **Create repository**.
7. On the next page, copy the HTTPS repository URL. It looks like:

   `https://github.com/YOUR-GITHUB-USERNAME/TalentisOS.git`

Keep this URL ready. Do not close the page.

## Step 3 — open your first Codex chat

Open a **new Codex chat inside the TalentisOS Rebuild Project**.

Name it: **TalentisOS — setup and repository**.

Replace `PASTE_YOUR_GITHUB_URL_HERE` below with the URL you copied from GitHub. Then paste the whole block into Codex.

### Paste into Codex

```text
I am rebuilding TalentisOS from scratch and I am an inexperienced Mac user. Guide me in plain English and perform safe actions only after inspecting first.

Repository location must be: ~/Desktop/GitHub/TalentisOS
GitHub remote URL: PASTE_YOUR_GITHUB_URL_HERE

First, inspect whether Git, Node.js, npm and the GitHub CLI are available. Also inspect whether ~/Desktop/GitHub exists. Do not install anything, create anything, or modify any repository yet.

Report only:
1. what is already installed and its version;
2. what is missing;
3. the single next action I should take; and
4. whether you can safely complete that action in this Codex environment.

Wait for my confirmation before installing tools or creating files.
```

## Step 4 — complete the pre-flight conversation

Codex will tell you what is installed. Reply using one of these exact responses:

### If Codex says everything is available

```text
Proceed with creating the local TalentisOS repository and the initial Vite application. Follow the setup plan you described. Do not commit, push, deploy or create extra product features. Stop after the application runs locally and report the result.
```

### If Codex says a tool is missing

```text
I authorise you to install the missing required development tool using the safest standard Mac approach. Explain the action in one sentence before starting. Do not create the repository or app yet. Stop after installation and re-check the required versions.
```

If macOS asks for your password or a permission prompt, enter it yourself. Do not share passwords, access tokens or recovery codes in Codex.

## Step 5 — create and verify the local project

When Codex reports that the local app runs, paste this into the **same Codex chat**.

```text
Now perform the local repository foundation only.

Requirements:
- Create ~/Desktop/GitHub/TalentisOS if it does not exist.
- Initialise a Vite vanilla JavaScript app in that exact directory.
- Initialise Git on branch main.
- Add the GitHub remote URL already provided.
- Create an intentionally minimal README with local run instructions only.
- Add a conservative .gitignore suitable for Node/Vite and macOS.
- Do not add React, TypeScript, a backend, a UI library, analytics, sample leadership data or advanced routes.
- Install only the minimal dependencies needed for Vite.
- Run npm install, npm run build and the local development server long enough to verify it starts.

Do not commit or push. Report the exact local path, Git status, remote URL, commands I will use later to run the app, and validation results. Stop for my review.
```

## Step 6 — first local check

When Codex says the development server has started, it will give you a localhost address such as `http://localhost:5173`.

1. Open that address in Safari.
2. Confirm that you can see the default Vite page.
3. Return to the same Codex chat and paste:

```text
I have opened the local app successfully. Do not change anything. Give me a short readiness summary and the exact proposed first commit message. Then wait for my approval.
```

## Step 7 — approve the first commit, then push separately

Only if the summary is correct, paste:

```text
APPROVE INITIAL FOUNDATION COMMIT. Commit only the inspected repository foundation using the proposed commit message. Do not push. After committing, report the full commit SHA and confirm whether the working tree is clean.
```

After Codex confirms the commit and clean working tree, paste:

```text
AUTHORISE PUSH OF INITIAL FOUNDATION. Push main to origin. If GitHub authentication is required, pause and tell me exactly what I need to approve or sign in to. After the push, report the origin/main SHA and whether local main matches origin/main.
```

---

# Part 2 — add the controlling documents to the repository

## Step 8 — open a new Codex chat

Open a **new Codex chat** in the same Project.

Name it: **TalentisOS — product documents**.

Attach these three files from the Project files to the chat:

1. `TalentisOS-Product-Specification.md`
2. `TalentisOS-Implementation-Phases.md`
3. `TalentisOS-Rebuild-Guide.md`

Then paste this instruction.

### Paste into Codex

```text
Work in ~/Desktop/GitHub/TalentisOS.

The attached documents are the controlling product specification, implementation-phase roadmap and rebuild guide for TalentisOS. Inspect the repository first, including git status, current branch, README and existing docs.

Create the following documentation structure if it does not already exist:
- docs/product/TalentisOS-Product-Specification.md
- docs/product/TalentisOS-Implementation-Phases.md
- docs/product/TalentisOS-Rebuild-Guide.md

Copy the attached documents into those exact paths without changing their meaning. Add a short docs index that identifies the product specification as the controlling product document and the implementation phases document as the build order.

Do not alter application code. Do not commit or push. Validate that the documents exist, Markdown links are valid where local links are used, and the working tree contains only the intended documentation changes. Report the changed files and proposed commit message, then wait for approval.
```

When Codex reports the result, approve and push using this two-step pattern:

```text
APPROVE PRODUCT DOCUMENTS COMMIT. Commit only the documented changes using the proposed commit message. Do not push. Report the full commit SHA and clean working-tree result.
```

Then:

```text
AUTHORISE PUSH OF PRODUCT DOCUMENTS. Push main to origin and report the resulting origin/main SHA and branch parity.
```

---

# Part 3 — build the New Leader Core

## How every build phase works

For each phase:

1. Open a **new Codex chat** in the TalentisOS Rebuild Project.
2. Name it using the phase number and name, for example **TalentisOS — Phase 01 App Shell**.
3. Attach the current product specification and implementation-phases document.
4. Copy the matching prompt from the implementation-phases document into Codex.
5. Let Codex inspect and implement the phase.
6. Test the result yourself in Safari at the link Codex provides.
7. Read Codex’s report. If it is not a clear PASS, do not approve it—ask Codex to remedy only the listed failure.
8. When it passes, use the approval prompts below.

Do not continue to another phase until the current phase has been committed, pushed and its governance documents are up to date.

## The build sequence

Follow the prompts in `docs/product/TalentisOS-Implementation-Phases.md` exactly in this order:

| Build chat | Use this phase | Do not begin until |
| --- | --- | --- |
| 00 | Repository, governance and product-contract reconciliation | Product documents are pushed |
| 01 | App shell, design system, PWA and persistence baseline | Phase 00 passes |
| 02 | Canonical task engine, workday utility and relationships | Phase 01 passes |
| 03 | End of Day, carry-over and next-workday integrity | Phase 02 passes |
| 04 | Morning Huddle, Today and Home decision surface | Phase 03 passes |
| 05 | Needs attention: risks, blockers, decisions and handovers | Phase 04 passes |
| 06 | Start Here, First 7 Days and current-stage roadmap | Phase 05 passes |
| 07 | Conversation toolkit, Help Now and weekly review | Phase 06 passes |
| 08 | New Leader Core hardening and launch readiness | Phase 07 passes |

**Stop after Phase 08.** That is the first usable product release. Use it in your real leadership work for six to eight weeks before enabling later capabilities.

## The standard phase instruction

The implementation phases document contains a complete copy-paste instruction for each phase. Before pasting it, paste this short context block into the new chat:

```text
I am an inexperienced Mac user. Work only in ~/Desktop/GitHub/TalentisOS. The attached product specification and implementation-phases document control this work.

This chat is for one phase only. Inspect before changing anything, preserve unrelated work, explain any material decision in plain English, and do not commit, push or deploy without my explicit approval.

At the end, give me a PASS, NOT READY or BLOCKED result; the exact changed files; test, check and build results; manual-browser evidence; known limitations; and a proposed commit message. Then wait.
```

Immediately after that block, paste the full **Copy-paste implementation instruction** for the selected phase from the implementation-phases document.

## Standard approval prompts

When Codex reports **PASS** and you have tested the app yourself, paste:

```text
APPROVE THIS PHASE IMPLEMENTATION. Commit only the approved in-scope changes with the proposed commit message. Do not push. Then report the full implementation commit SHA and clean working-tree status.
```

After it confirms the commit, paste:

```text
AUTHORISE PUSH OF THIS PHASE IMPLEMENTATION. Push main to origin. Report the origin/main SHA, local/remote branch parity and GitHub Pages deployment result if a deployment is configured. Do not make a separate governance commit yet.
```

After the push passes, paste:

```text
APPROVE THIS PHASE GOVERNANCE BASELINE. Update only the phase register, project status register, decision log and changelog with the controlling implementation SHA and validation evidence. Commit the governance changes locally. Do not push. Report the governance commit SHA and working-tree status.
```

Then, if that report is correct, paste:

```text
AUTHORISE PUSH OF THIS PHASE GOVERNANCE BASELINE. Push main to origin and report the final origin/main SHA and branch parity.
```

---

# Part 4 — run and test the app on your Mac

## Start the local app later

Whenever you want to run the app on your Mac, open a new Codex chat in the Project and paste:

```text
Work in ~/Desktop/GitHub/TalentisOS. Do not change code. Inspect git status first, then start the local development server and tell me the exact Safari URL to open. Also tell me whether the working tree is clean. Keep the server running until I tell you to stop it.
```

Open the URL Codex gives you in Safari. It will normally be `http://localhost:5173`.

## Test after every phase

Use this simple test checklist after Codex reports PASS:

- Open the app in Safari on your Mac.
- Make the browser narrow, roughly phone width, then medium iPad width, then full desktop width.
- Create one safe test record only.
- Refresh the page and confirm it remains.
- Navigate away and back.
- Check that the primary action is obvious.
- If the phase involves tasks, complete it once and confirm it does not duplicate.
- If the phase involves a form, interrupt it by refreshing and check the expected draft/recovery behaviour.

Report a failure to Codex exactly as you see it. For example:

```text
Phase testing found a failure. At narrow browser width, the Save button is cut off. Do not start another phase. Diagnose and fix only this Phase [NUMBER] issue, then rerun the affected tests and report the result.
```

---

# Part 5 — publish GitHub Pages only after Core release readiness

Do not publish a public production version before Phase 08 passes the New Leader Core release gate.

When Phase 08 has passed, open a **new Codex chat** named **TalentisOS — production release** and attach the product specification. Paste:

```text
Work in ~/Desktop/GitHub/TalentisOS.

Phase 08 has passed the New Leader Core release gate. Inspect git status, branch parity, package scripts, GitHub Actions, service-worker configuration, manifest and current GitHub Pages settings. Do not change code or deploy yet.

Give me a production-release readiness report covering: current commit; required GitHub Pages configuration; build command; expected deployment URL; offline/update checks; rollback approach; and any blockers. Explain any GitHub website action I must perform in simple numbered steps. Wait for my approval.
```

Only after Codex’s readiness report is satisfactory, paste:

```text
I approve the production release preparation and deployment. Make only the necessary GitHub Pages configuration and deployment changes. Preserve local user data behaviour. After deployment, verify the live site, base path, manifest, service worker and offline shell. Report the live URL, deployment commit SHA, checks completed and rollback steps.
```

---

# Part 6 — use the Core before adding advanced modules

For six to eight weeks, use only:

- Today/Home
- Prepare tomorrow (EOD)
- Start the day (Morning Huddle)
- Tasks and Needs attention
- Conversations
- Weekly Review

Each Friday, open a new Codex chat named **TalentisOS — pilot review** and paste:

```text
I am running the New Leader Core pilot. Do not change the application. Help me record one weekly pilot review using this structure:
1. What helped me decide, act, communicate or follow through?
2. Where did I re-enter information, lose context or avoid the app?
3. What was unclear, slow or unnecessary?
4. What evidence shows this happened more than once?
5. What is the smallest product change worth considering?

Keep the review specific and do not recommend new features without repeated live-use evidence.
```

Only consider Phase 09 and later after the pilot has produced a repeated, evidenced need.

---

# Simple recovery rules

- If Codex says the working tree is dirty and you do not recognise the files, stop and ask it to explain them. Do not approve a commit.
- If a test fails, do not proceed to the next phase. Ask Codex to fix only the failure in the current phase.
- If you accidentally close a Codex chat, open a new Project chat, attach the product specification and implementation phases document, then say: “Resume Phase [NUMBER]. Inspect the repository and tell me the exact current state before changing anything.”
- If GitHub asks for sign-in or authentication, complete it in the browser yourself. Never provide a password or token in chat.
- If a build is confusing, ask Codex: “Explain this in plain English and give me one next step only.”

# Milestones

| Milestone | Evidence of completion |
| --- | --- |
| Local foundation | Local Vite app runs; Git repository exists; first commit pushed |
| Controlling documents | Product specification and phase roadmap are committed under `docs/product/` |
| Daily loop | Phases 02–04 pass with canonical task identity and EOD → Huddle → Today flow |
| New Leader Core complete | Phases 05–07 pass |
| Core release ready | Phase 08 passes recovery, offline, accessibility, performance and real-device usability gates |
| Production release | GitHub Pages deployment is verified after Phase 08 approval |
| Advanced capability | Any Phase 09–14 starts only from a repeated, documented pilot need |
