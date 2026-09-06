# Phase 03 — End of Day Capture, Carry-Over & Next-Workday Engine

**Status:** IMPLEMENTED — AWAITING FOUNDER APPROVAL

This early implementation note is retained for provenance. The controlling Phase 03 implementation record is [PHASE-03-END-OF-DAY-CARRY-OVER-NEXT-WORKDAY.md](PHASE-03-END-OF-DAY-CARRY-OVER-NEXT-WORKDAY.md).

Phase 03 makes End of Day an operational close rather than a placeholder. A local record stores the date, wins, close-out reflection, selected canonical task IDs, close timestamp, and calculated next workday.

Closing the day adds an End of Day reference and a next-workday Morning Huddle reference to each selected open task. It also records carry metadata on that same task. No task is cloned, and a repeated close is idempotent for the same day and destination.

The default calendar rule is Monday–Thursday to the following day and Friday to Monday. End-of-Day records are stored in IndexedDB, migrate from schema version 4 to 5, and travel in version 2 exports. Version 1 exports remain importable with no End-of-Day records.
