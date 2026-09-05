import assert from 'node:assert/strict';
import test from 'node:test';
import { createTaskRecord } from '../src/state/schema.js';
import { parseImport } from '../src/state/transfer.js';

test('accepts a supported versioned TalentisOS backup', () => {
  const task = createTaskRecord({ title: 'Review priorities' }, { id: 'task-a', now: '2026-09-05T00:00:00.000Z' });
  const parsed = parseImport(JSON.stringify({ format: 'TalentisOS', exportVersion: 1, exportedAt: '2026-09-06T00:00:00.000Z', data: { tasks: [task], settings: [] } }));
  assert.equal(parsed.data.tasks[0].id, 'task-a');
});

test('rejects malformed, foreign and unsupported backups without mutation', () => {
  assert.throws(() => parseImport('{'), /valid JSON/);
  assert.throws(() => parseImport(JSON.stringify({ format: 'Other', exportVersion: 1, data: {} })), /supported/);
  assert.throws(() => parseImport(JSON.stringify({ format: 'TalentisOS', exportVersion: 2, data: {} })), /supported/);
});
