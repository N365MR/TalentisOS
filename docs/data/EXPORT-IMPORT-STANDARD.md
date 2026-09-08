# Export and Import Standard

**Status:** PROPOSED
**Authority:** Founder

Exports will be JSON with an envelope containing schema version, export timestamp, product identifier, and entity payloads. Imports must parse as JSON without evaluation, validate shape/version/IDs/references, reject malformed or unsupported files with actionable errors, and run controlled migrations before persistence.

Current exports use `{ format: "TalentisOS", exportVersion: 6, exportedAt, data: { metadata, tasks, endOfDay, morningHuddles, roadmap, settings, kpis, kpiEntries } }`. KPI records carry canonical task IDs only. Import validates identity, version, structures, record shapes, unique IDs and all practical canonical references before a confirmed full replacement transaction. Broken references are rejected rather than removed. Versions 1–5 may be normalized only by adding later empty stores/default singleton records; newer formats are rejected. Users should export before upgrades and retain offline backups. Local files are treated as untrusted input.
