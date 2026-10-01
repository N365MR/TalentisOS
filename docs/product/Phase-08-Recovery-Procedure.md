# Phase 08 recovery procedure

## Authority

This procedure implements the import, export and recovery rules in the TalentisOS Product Specification, sections “Import, export and recovery” and “Data lifecycle and recovery rules”. It applies to the New Leader Core only.

## Export

1. Open **Tasks** and find **Backup health**.
2. Select **Export backup** and save the downloaded JSON file in a secure location outside the browser profile.
3. Confirm that Backup health shows a successful export date. The file is readable JSON and is not encrypted.

An export includes format version, IndexedDB schema version, export timestamp, every required store, and every persisted relationship. It is device-specific data; it is never deployed with the static application.

## Restore safely

1. Open **Tasks → Backup health** and choose the JSON backup file.
2. Read the import preview. It lists the record count and states that replacement affects all local records on this device.
3. Only if that change is intended, choose **Replace local workspace…** and type `REPLACE`.
4. Reload TalentisOS, then reload again while offline. Check representative linked records (for example, a task, an EOD/Huddle reference and a Needs attention follow-up).

The app parses the complete JSON file and validates its format, schema version, required stores, record shapes, timestamps, duplicate IDs and relationships before it begins the IndexedDB transaction. Unsupported schemas, malformed records and unknown relationships leave the current workspace unchanged. A valid replacement clears and writes all stores in one IndexedDB transaction.

## Reset this device

1. Export and retain a backup first; the clear action is unavailable until the device has a recorded successful export.
2. Select **Clear this device’s local data…** and type `CLEAR`.
3. To recover, follow Restore safely using the exported file.

If browser storage fails, do not keep retrying destructive actions. Preserve the downloaded backup, close other TalentisOS tabs, and retry after reopening the browser. If the backup is rejected, retain the file and current workspace; do not clear data.

## Recovery drill status

Automated envelope rejection, valid-envelope relationship and 6,000-record isolated volume tests passed on 2026-09-29. A full browser/device drill (export → clear → import → verify links → offline reload) remains required before launch approval; it has not been claimed as complete in this repository. Use `Phase-08-Manual-Evidence-Checklist.md` on a test workspace.
