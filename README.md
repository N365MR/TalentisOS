# TalentisOS

TalentisOS is a responsive, local-first Progressive Web Application and daily leadership operating system for new and emerging leaders.

Its core rhythm is **End of Day → Morning Huddle → Today’s Work** and its leadership cycle is **Prepare → Align → Execute → Review → Improve**.

## Status

Phase 10 is complete. TalentisOS includes local-first leadership workflows, an offline Playbook, backup/import/export, PWA hardening, and GitHub Pages deployment.

## Live app

Open TalentisOS at [https://n365mr.github.io/TalentisOS/](https://n365mr.github.io/TalentisOS/).

GitHub Pages deploys from `main` through [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml). The production Vite base path is `/TalentisOS/`, including manifest, icon, and service-worker resolution.

## Local development

```bash
npm install
npm run dev
```

You can also open `index.html` directly from Finder or your file manager. The repository includes a local browser bundle for `file://` mode; IndexedDB-backed onboarding and Today data continue to work locally. After source changes, `npm run build` refreshes both the production build and the direct-open bundle.

Quality and production commands: `npm test`, `npm run lint`, `npm run format`, `npm run build`, and `npm run preview`.

## Product boundaries

TalentisOS does not contain employee profiles, personal information, HR records, performance reviews, payroll, recruitment, skills matrices, surveillance, time tracking, CRM, ERP, full project management, chat, email, or complex workflow builders. There is no employee profile entity in the data model.

See `docs/` for the product, design, architecture, data, offline, import/export, accessibility, privacy, build, QA, and iPad guidance.
