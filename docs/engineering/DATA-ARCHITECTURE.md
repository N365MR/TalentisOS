# Data Architecture

Phase 00A opens IndexedDB database `TalentisOS`, schema version `1`, with one `metadata` object store and a `foundation` metadata key. It creates no task, KPI, EOD, huddle, meeting, coaching, rock, issue, roadmap, analytics, or other domain entities.

The `onupgradeneeded` boundary creates missing infrastructure stores only, preserving existing stores so later migrations can evolve non-destructively.
