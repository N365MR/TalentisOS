import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createBackup,
  validateBackup,
  backupCounts,
  createCsv,
  parseCsv,
  validateCsv,
  migrateBackup,
  restoreCollections,
} from '../src/backup.js';

test('creates and validates a complete local backup shape', () => {
  const backup = createBackup({ settings: [{ id: 'primary', label: '<safe>' }], priorities: [{ id: 'p1' }] }, '2026-08-01T00:00:00.000Z');
  assert.equal(backup.exportVersion, 1);
  assert.equal(backup.data.settings[0].label, 'safe');
  assert.equal(backupCounts(backup).priorities, 1);
  assert.deepEqual(validateBackup(backup), backup);
});

test('rejects unsupported backup versions', () => {
  assert.throws(() => validateBackup({ format: 'TalentisOS workspace backup', exportVersion: 99, data: {} }), /Unsupported/);
  assert.throws(() => migrateBackup({ hello: 'world' }), /Unsupported/);
});

test('round trips quoted CSV values and validates dates', () => {
  const csv = createCsv([{ title: 'Risk, high', planDate: '2026-08-01', impact: 'Line one\nLine two' }], ['title', 'planDate', 'impact']);
  const parsed = parseCsv(csv);
  assert.deepEqual(parsed.rows[0], { title: 'Risk, high', planDate: '2026-08-01', impact: 'Line one\nLine two' });
  const result = validateCsv('risks', { headers: ['title', 'planDate'], rows: [{ title: 'Risk', planDate: 'not-a-date' }] });
  assert.equal(result.errors.length, 1);
});

test('reports missing required CSV columns', () => {
  assert.throws(() => validateCsv('improvements', { headers: ['title'], rows: [] }), /Missing required column/);
});

test('restores legacy split work collections into one work item collection', () => {
  const backup = createBackup({ risks: [{ id: 'r1', type: 'risk' }], decisions: [{ id: 'd1', type: 'decision' }] });
  const collections = restoreCollections(backup);
  assert.deepEqual(collections.workItems.map((item) => item.id), ['r1', 'd1']);
  assert.deepEqual(collections.playbookState[0].savedTopicIds, []);
});
