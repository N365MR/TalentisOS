# IndexedDB and Migration Standard

**Status:** PROPOSED
**Authority:** Engineering implementation owner

The database has an explicit schema version, migration version metadata, ordered migration functions, and an upgrade transaction boundary. Each migration is additive or controlled-transformational, idempotently guarded, tested against representative prior data, and aborts on failure. A destructive migration is prohibited unless an approved change record documents the transformation, backup/recovery plan, and user impact.

Current state: database `TalentisOS`, version 1, `metadata` store, `foundation` key. This is infrastructure only. Upgrade failures must preserve the existing database where possible, reject clearly, and avoid partial user-visible writes.
