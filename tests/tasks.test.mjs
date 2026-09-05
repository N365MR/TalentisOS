import assert from 'node:assert/strict';
import test from 'node:test';
import { normaliseTask, subtaskProgress, taskView } from '../src/state/tasks.js';

const task = (overrides = {}) => ({ id: 'task-1', title: 'Confirm capacity', status: 'open', dueDate: null, urgent: false, flagged: false, someday: false, updatedAt: '2026-09-06T00:00:00.000Z', subtasks: [], ...overrides });

test('derives subtask progress without completing the canonical parent task', () => {
  const parent = task({ subtasks: [{ id: 'a', completed: true }, { id: 'b', completed: true }, { id: 'c', completed: false }] });
  assert.deepEqual(subtaskProgress(parent), { total: 3, completed: 2, percent: 67 });
  assert.equal(parent.status, 'open');
});

test('derives operational views from one canonical collection', () => {
  const tasks = [task({ id: 'today', dueDate: '2026-09-06' }), task({ id: 'urgent', urgent: true }), task({ id: 'complete', status: 'completed', completedAt: '2026-09-06T01:00:00.000Z' })];
  assert.deepEqual(taskView(tasks, 'today', '2026-09-06').map(item => item.id), ['today']);
  assert.deepEqual(taskView(tasks, 'urgent', '2026-09-06').map(item => item.id), ['urgent']);
  assert.deepEqual(taskView(tasks, 'completed', '2026-09-06').map(item => item.id), ['complete']);
});

test('normalises a Phase 01 record with missing Phase 02 fields without changing identity', () => {
  const legacy = { id: 'phase-01-task', title: 'Review priorities', createdAt: '2026-09-05T00:00:00.000Z', updatedAt: '2026-09-05T00:00:00.000Z' };
  const normalised = normaliseTask(legacy);
  assert.equal(normalised.id, legacy.id);
  assert.deepEqual(normalised.subtasks, []);
  assert.deepEqual(normalised.references, []);
  assert.deepEqual(normalised.history, []);
  assert.equal(normalised.carryCount, 0);
  assert.equal(normalised.status, 'open');
  assert.deepEqual(taskView([legacy], 'inbox', '2026-09-06').map(item => item.id), ['phase-01-task']);
});
