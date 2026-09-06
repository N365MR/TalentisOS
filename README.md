# TalentisOS

**Your Daily Leadership Playbook.** TalentisOS is a calm, local-first leadership operating system that helps a leader prepare, align, execute, review, and improve through **End of Day → Morning Huddle → Today’s Work**.

This repository is the canonical TalentisOS repository. The approved documentation in it is the authoritative product and engineering source of truth; see [document authority](docs/governance/DOCUMENT-AUTHORITY-AND-STATUS.md).

## Current state

Phase 03 delivers End of Day: a local daily close record captures wins and a close-out note, while selected open tasks are carried by canonical reference into the next workday’s Morning Huddle. The default handoff respects the Monday–Friday rhythm, moving Friday selections to Monday. The daily record is included in backup and restore; Morning Huddle and Today’s Work remain dedicated future phases.

## Run and verify

```sh
npm install
npm run dev
npm run build
npm test
npm run check
```

The project uses Vite, browser-native ES modules, semantic HTML, modern CSS, IndexedDB, a web manifest, and a service worker. It has no account, backend, analytics, or required cloud service.

Start with the [project charter](docs/PROJECT-CHARTER.md), [master product definition](docs/MASTER-PRODUCT-DEFINITION.md), [phase register](docs/MASTER-PHASE-REGISTER.md), and [Phase 00 record](docs/phases/PHASE-00-PROJECT-FOUNDATION.md).
