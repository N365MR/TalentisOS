# Engineering Architecture

**Status:** PROPOSED
**Authority:** Founder; engineering implementation owner.

TalentisOS uses Vite, Vanilla JavaScript ES modules, semantic HTML, modern CSS, browser IndexedDB, and static hosting. UI rendering, application coordination, persistence, domain models, and utilities are separate boundaries. UI modules do not embed complex IndexedDB operations.

The Phase 01 shell coordinates startup, routing and user interactions; `src/ui/` owns safe DOM construction; `src/state/` owns schema, IndexedDB transactions and data transfer. Future substantive modules own rendering, actions, selectors, and service integration without becoming one giant JavaScript file. Browser-native APIs are preferred; React, Vue, Angular, Svelte, backend services, cloud databases, Firebase, Supabase, third-party authentication, analytics, advertising SDKs, and unnecessary frameworks require Founder approval.

IDs are immutable unique IDs. Store instants as unambiguous ISO-8601 timestamps; model workday/due dates as local calendar `YYYY-MM-DD` values, and optional due times as separate local time values. Do not derive leadership-day behaviour solely from UTC.
