# Export and Import Standard

**Status:** PROPOSED
**Authority:** Founder

Exports will be JSON with an envelope containing schema version, export timestamp, product identifier, and entity payloads. Imports must parse as JSON without evaluation, validate shape/version/IDs/references, reject malformed or unsupported files with actionable errors, and run controlled migrations before persistence.

Duplicate handling must be explicit: preserve an identical existing entity, reject conflicting IDs, or require user-directed remapping; never silently overwrite. Import uses safe transaction boundaries and reports failures. Users should export before upgrades and retain offline backups. Local files are treated as untrusted input.
