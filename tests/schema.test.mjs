import assert from 'node:assert/strict';
import test from 'node:test';
import { SCHEMA_VERSION, createMetadataRecord, isMetadataRecord } from '../src/state/schema.js';

test('creates a valid metadata-only foundation record', () => {
  const metadata = createMetadataRecord('2026-09-05T00:00:00.000Z');
  assert.deepEqual(metadata, {
    schemaVersion: SCHEMA_VERSION,
    initializedAt: '2026-09-05T00:00:00.000Z'
  });
  assert.equal(isMetadataRecord(metadata), true);
});

test('does not accept a premature domain model as metadata', () => {
  assert.equal(isMetadataRecord({ schemaVersion: SCHEMA_VERSION, initializedAt: 'now', tasks: [] }), true);
  assert.equal(isMetadataRecord({ schemaVersion: SCHEMA_VERSION }), false);
});
