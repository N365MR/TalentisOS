# Testing Standard

**Status:** PROPOSED
**Authority:** Engineering implementation owner

Test domain rules, local-date/next-workday logic, validation, carry rules, and migrations at unit level; IndexedDB create/read/update/delete/migration/reload at persistence level; canonical references/completion/carry/session links at integration level; and navigation, dialogs, responsive layouts, keyboard, and critical daily flow at UI level.

Manual acceptance covers phone, tablet, desktop, touch, keyboard, refresh, offline, and installability where available. Regression priority is **EOD → Huddle → Today → Complete**. Every defect fix includes a proportionate regression test where feasible.
