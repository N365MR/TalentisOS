# Security Standard

**Status:** PROPOSED
**Authority:** Engineering implementation owner

Treat all input, including imported local JSON, as untrusted. Validate data at boundaries; parse JSON without evaluation; use text APIs/escaped rendering instead of unsafe HTML; prohibit arbitrary script evaluation and inline event handlers; and use transaction-safe IndexedDB writes.

Maintain a restrictive static-host CSP where deployment permits, avoiding `unsafe-eval` and unnecessary third-party origins. Do not add trackers, remote services, or credentials to client code. Service-worker caches contain static shell assets only and must be versioned and reviewed for stale references.
