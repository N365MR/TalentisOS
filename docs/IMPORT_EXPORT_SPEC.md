# Import and Export Specification

Import and export are later-phase capabilities for user-controlled backup and migration. The format should be a versioned JSON document containing only TalentisOS leadership-operating records and metadata required to validate the document.

Exports must be complete, readable, and local-only. Imports must validate schema version, reject unknown dangerous structures, report errors without partial destructive writes, and never infer or create employee profiles or HR data. A future CSV export may be limited to flat work and review records.
