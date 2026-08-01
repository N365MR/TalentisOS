# TalentisOS

TalentisOS is a responsive, local-first Progressive Web Application and daily leadership operating system for new and emerging leaders.

Its core rhythm is **End of Day → Morning Huddle → Today’s Work** and its leadership cycle is **Prepare → Align → Execute → Review → Improve**.

## Status

Phase 2 is complete. The shell contains the five primary navigation areas, responsive navigation, appearance controls, accessible reusable UI primitives, PWA foundations, minimal onboarding, and the Today command centre. Later huddle, work, review, and improve workflows remain intentionally out of scope.

## Local development

```bash
npm install
npm run dev
```

Quality and production commands: `npm test`, `npm run lint`, `npm run format`, `npm run build`, and `npm run preview`.

## Product boundaries

TalentisOS does not contain employee profiles, personal information, HR records, performance reviews, payroll, recruitment, skills matrices, surveillance, time tracking, CRM, ERP, full project management, chat, email, or complex workflow builders. There is no employee profile entity in the data model.

See `docs/` for the product, design, architecture, data, offline, import/export, accessibility, privacy, build, QA, and iPad guidance.
