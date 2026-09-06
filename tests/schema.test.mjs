import assert from 'node:assert/strict';
import test from 'node:test';
import { SCHEMA_VERSION, EXPORT_VERSION, createKpiEntryRecord, createKpiRecord, createMetadataRecord, createMorningHuddleRecord, createRoadmapRecord, createTaskRecord, isMetadataRecord, isMorningHuddleRecord, isSupportedExport, isTaskRecord } from '../src/state/schema.js';

test('creates a valid metadata-only foundation record', () => {
  const metadata = createMetadataRecord('2026-09-05T00:00:00.000Z');
  assert.deepEqual(metadata, { schemaVersion: SCHEMA_VERSION, initializedAt: '2026-09-05T00:00:00.000Z', updatedAt: '2026-09-05T00:00:00.000Z' });
  assert.equal(isMetadataRecord(metadata), true);
});

test('prepares canonical task records with stable identity and timestamps', () => {
  const task = createTaskRecord({ title: 'Prepare huddle' }, { id: 'task-1', now: '2026-09-05T00:00:00.000Z' });
  assert.equal(task.id, 'task-1');
  assert.equal(task.createdAt, task.updatedAt);
  assert.equal(isTaskRecord(task), true);
  assert.throws(() => createTaskRecord({ title: ' ' }), /title/);
});

test('rejects incomplete metadata and validates a versioned export', () => {
  assert.equal(isMetadataRecord({ schemaVersion: SCHEMA_VERSION }), false);
  const task = createTaskRecord({ title: 'One task' }, { id: 'task-1', now: '2026-09-05T00:00:00.000Z' });
  assert.equal(isSupportedExport({ format: 'TalentisOS', exportVersion: 1, exportedAt: '2026-09-05T00:00:00.000Z', data: { tasks: [task], settings: [] } }), true);
  assert.equal(isSupportedExport({ format: 'Other', exportVersion: 1, exportedAt: 'now', data: { tasks: [], settings: [] } }), false);
});

test('creates one valid, deduplicated Morning Huddle model for a workday', () => {
  const huddle = createMorningHuddleRecord({ workDate: '2026-09-14', carryoverTaskIds: ['task-1', 'task-1'], top3TaskIds: ['task-2', 'task-1'], commitmentTaskIds: ['task-1', 'task-1'] }, { id: 'huddle-1', now: '2026-09-14T08:00:00.000Z' });
  assert.equal(huddle.id, 'huddle-1');
  assert.deepEqual(huddle.carryoverTaskIds, ['task-1']);
  assert.deepEqual(huddle.top3TaskIds, ['task-2', 'task-1']);
  assert.deepEqual(huddle.commitmentTaskIds, ['task-1']);
  assert.equal(isMorningHuddleRecord(huddle), true);
});

test('validates current exports containing the singleton roadmap', () => {
  const task = createTaskRecord({ title: 'One task' }, { id: 'task-1', now: '2026-09-05T00:00:00.000Z' });
  const huddle = createMorningHuddleRecord({ workDate: '2026-09-05' }, { id: 'huddle-1', now: '2026-09-05T00:00:00.000Z' });
  const kpi = createKpiRecord({ name: 'Completion', purpose: 'Keep commitments dependable.', ownerRole: 'Operations', formula: 'Completed divided by due.', unit: '%', frequency: 'monthly', direction: 'higher', target: { min: 0, max: 95 }, warning: { min: 0, max: 90 }, offTrack: { min: 0, max: 80 }, linkedTaskIds: ['task-1'] }, { id: 'kpi-1', now: '2026-09-05T00:00:00.000Z' });
  const entry = createKpiEntryRecord({ kpiId: kpi.id, periodKey: '2026-09', actual: 95 }, { id: 'entry-1', now: '2026-09-05T00:00:00.000Z' });
  assert.equal(isSupportedExport({ format: 'TalentisOS', exportVersion: EXPORT_VERSION, exportedAt: '2026-09-05T00:00:00.000Z', data: { tasks: [task], endOfDay: [], morningHuddles: [huddle], roadmap: [createRoadmapRecord()], settings: [], kpis: [kpi], kpiEntries: [entry] } }), true);
});
