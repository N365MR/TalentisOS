# Export and Import Standard

**Status:** PROPOSED
**Authority:** Founder

Exports will be JSON with an envelope containing schema version, export timestamp, product identifier, and entity payloads. Imports must parse as JSON without evaluation, validate shape/version/IDs/references, reject malformed or unsupported files with actionable errors, and run controlled migrations before persistence.

Phase 01 implements envelope `{ format: "TalentisOS", exportVersion: 1, exportedAt, data: { tasks, settings } }`. It validates JSON, format/version and canonical task shapes before any write. Import is a confirmed full replacement of Phase 01 stores in one transaction; it never occurs silently. Later versions may introduce controlled merge/remapping. Users should export before upgrades and retain offline backups. Local files are treated as untrusted input.
