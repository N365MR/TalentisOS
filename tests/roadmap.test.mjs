import assert from 'node:assert/strict';
import test from 'node:test';
import { ROADMAP_ID, ROADMAP_MILESTONES, createRoadmapRecord, isRoadmapRecord } from '../src/state/schema.js';
import { nextBestAction, roadmapProgress, stageProgress } from '../src/state/roadmap.js';

test('creates one valid singleton leadership roadmap with the fixed milestone structure', () => {
  const roadmap = createRoadmapRecord({}, { now: '2026-09-06T00:00:00.000Z' });
  assert.equal(roadmap.id, ROADMAP_ID);
  assert.equal(roadmap.milestones.length, 12);
  assert.deepEqual(roadmap.milestones.map(milestone => milestone.id), ROADMAP_MILESTONES.map(([id]) => id));
  assert.equal(isRoadmapRecord(roadmap), true);
});

test('calculates progress and selects the first incomplete milestone as Next Best Action', () => {
  const roadmap = createRoadmapRecord({ milestones: [{ id: '30-role-context', status: 'completed', completedAt: '2026-09-06T00:00:00.000Z' }, { id: '30-stakeholders', status: 'in-progress' }] });
  assert.deepEqual(roadmapProgress(roadmap), { total: 12, completed: 1, percent: 8 });
  assert.equal(nextBestAction(roadmap).id, '30-stakeholders');
  assert.deepEqual(stageProgress(roadmap, 30), { total: 5, completed: 1 });
});

test('completion and reopen model states preserve the fixed roadmap and timestamps', () => {
  const completed = createRoadmapRecord({ milestones: [{ id: '30-role-context', status: 'completed', completedAt: '2026-09-06T00:00:00.000Z' }] });
  assert.equal(completed.milestones[0].status, 'completed');
  assert.equal(completed.milestones[0].completedAt, '2026-09-06T00:00:00.000Z');
  const reopened = createRoadmapRecord({ milestones: [{ id: '30-role-context', status: 'not-started', completedAt: '2026-09-06T00:00:00.000Z' }] });
  assert.equal(reopened.milestones[0].status, 'not-started');
  assert.equal(reopened.milestones[0].completedAt, null);
});
