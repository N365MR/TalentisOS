# IndexedDB and Migration Standard

**Status:** PROPOSED
**Authority:** Engineering implementation owner

The database has an explicit schema version, migration version metadata, ordered migration functions, and an upgrade transaction boundary. Each migration is additive or controlled-transformational, idempotently guarded, tested against representative prior data, and aborts on failure. A destructive migration is prohibited unless an approved change record documents the transformation, backup/recovery plan, and user impact.

Current state: database `TalentisOS`, version 7, with `metadata`, `tasks`, `endOfDay`, `morningHuddles`, `roadmap`, and `settings`. Versions 5–7 add the End of Day, Morning Huddle, and roadmap stores without removing or transforming existing user data. The roadmap store has key path `id` and holds one `leadership-roadmap` record. Tasks retain `by-status`, `by-updated-at`, `by-due-date`, `by-completed-at`, and `by-priority` indexes. Upgrade failures must preserve existing data where possible, reject clearly, and avoid partial user-visible writes.
