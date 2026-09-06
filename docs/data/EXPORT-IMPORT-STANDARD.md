# Export and Import Standard

**Status:** PROPOSED
**Authority:** Founder

Exports will be JSON with an envelope containing schema version, export timestamp, product identifier, and entity payloads. Imports must parse as JSON without evaluation, validate shape/version/IDs/references, reject malformed or unsupported files with actionable errors, and run controlled migrations before persistence.

Current exports use `{ format: "TalentisOS", exportVersion: 5, exportedAt, data: { tasks, endOfDay, morningHuddles, roadmap, settings, kpis, kpiEntries } }`. KPI records carry task IDs only; import validates KPI/entry shapes and safely removes task references that do not resolve in the incoming canonical task set. Imports remain compatible with versions 1–4; older exports receive empty KPI stores. Import is a confirmed full replacement of the supported stores in one transaction; it never occurs silently. Users should export before upgrades and retain offline backups. Local files are treated as untrusted input.
