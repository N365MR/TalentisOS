# Export and Import Standard

**Status:** PROPOSED
**Authority:** Founder

Exports will be JSON with an envelope containing schema version, export timestamp, product identifier, and entity payloads. Imports must parse as JSON without evaluation, validate shape/version/IDs/references, reject malformed or unsupported files with actionable errors, and run controlled migrations before persistence.

Current exports use `{ format: "TalentisOS", exportVersion: 4, exportedAt, data: { tasks, endOfDay, morningHuddles, roadmap, settings } }`. The singleton roadmap is exported separately from canonical tasks. Imports validate JSON and record shapes before any write and remain compatible with versions 1–3; older exports without roadmap data receive a safe untouched roadmap on import. Import is a confirmed full replacement of the supported stores in one transaction; it never occurs silently. Users should export before upgrades and retain offline backups. Local files are treated as untrusted input.
