import assert from 'node:assert/strict';
import test from 'node:test';
import { EXPORT_VERSION, createMetadataRecord, createRoadmapRecord, createTaskRecord } from '../src/state/schema.js';
import { backupFilename, importSummary, parseImport } from '../src/state/transfer.js';

test('accepts a supported versioned TalentisOS backup', () => {
  const task = createTaskRecord({ title: 'Review priorities' }, { id: 'task-a', now: '2026-09-05T00:00:00.000Z' });
  const parsed = parseImport(JSON.stringify({ format: 'TalentisOS', exportVersion: 1, exportedAt: '2026-09-06T00:00:00.000Z', data: { tasks: [task], settings: [] } }));
  assert.equal(parsed.data.tasks[0].id, 'task-a');
});

test('rejects malformed, foreign and unsupported backups without mutation', () => {
  assert.throws(() => parseImport('{'), /valid JSON/);
  assert.throws(() => parseImport(JSON.stringify({ format: 'Other', exportVersion: 1, data: {} })), /supported/);
  assert.throws(() => parseImport(JSON.stringify({ format: 'TalentisOS', exportVersion: EXPORT_VERSION + 1, data: {} })), /supported/);
});

test('accepts a prior Phase 05 export without roadmap data for safe initialization', () => {
  const parsed = parseImport(JSON.stringify({ format: 'TalentisOS', exportVersion: 3, exportedAt: '2026-09-06T00:00:00.000Z', data: { tasks: [], endOfDay: [], morningHuddles: [], settings: [] } }));
  assert.equal(parsed.data.roadmap.length, 1);
  assert.equal(createRoadmapRecord().milestones.length, 12);
});

test('normalizes supported legacy exports into the complete replacement shape', () => {
  const task = createTaskRecord({ title: 'Keep canonical identity' }, { id: 'task-a', now: '2026-09-05T00:00:00.000Z' });
  const parsed = parseImport(JSON.stringify({ format: 'TalentisOS', exportVersion: 1, exportedAt: '2026-09-06T00:00:00.000Z', data: { tasks: [task], settings: [] } }));
  assert.equal(parsed.data.metadata.length, 1);
  assert.equal(parsed.data.roadmap.length, 1);
  assert.equal(parsed.data.tasks[0].id, 'task-a');
});

test('rejects broken canonical references before any import write can occur', () => {
  const metadata = createMetadataRecord('2026-09-06T00:00:00.000Z');
  const envelope = { format: 'TalentisOS', exportVersion: EXPORT_VERSION, exportedAt: '2026-09-06T00:00:00.000Z', data: { metadata: [metadata], tasks: [], endOfDay: [], morningHuddles: [], roadmap: [createRoadmapRecord({}, { now: '2026-09-06T00:00:00.000Z' })], settings: [], kpis: [], kpiEntries: [] } };
  envelope.data.morningHuddles.push({ id: 'huddle-a', workDate: '2026-09-06', carryoverTaskIds: ['missing'], top3TaskIds: [], commitmentTaskIds: [], createdAt: envelope.exportedAt, updatedAt: envelope.exportedAt });
  assert.throws(() => parseImport(JSON.stringify(envelope)), /broken Morning Huddle task reference/);
});

test('provides a safe backup filename and non-sensitive import summary', () => {
  const task = createTaskRecord({ title: 'Export me' }, { id: 'task-a', now: '2026-09-05T00:00:00.000Z' });
  const parsed = parseImport(JSON.stringify({ format: 'TalentisOS', exportVersion: 1, exportedAt: '2026-09-06T01:02:03.000Z', data: { tasks: [task], settings: [] } }));
  assert.equal(backupFilename(parsed.exportedAt), 'talentisos-backup-20260906-010203.json');
  assert.deepEqual(importSummary(parsed).counts, { tasks: 1, endOfDay: 0, morningHuddles: 0, roadmap: 1, kpis: 0, kpiEntries: 0, conversations: 0, settings: 0 });
});
