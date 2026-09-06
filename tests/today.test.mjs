import assert from 'node:assert/strict';
import test from 'node:test';
import { aggregateTodaysWork } from '../src/state/today.js';

const task = (id, overrides = {}) => ({ id, title: id, status: 'open', dueDate: null, urgent: false, blocked: false, waiting: false, someday: false, carryCount: 0, carryHistory: [], references: [], tags: [], category: '', ...overrides });
const date = '2026-09-07';

test('Today aggregation surfaces canonical sources once with contextual reasons', () => {
  const shared = task('shared', { dueDate: '2026-09-06', urgent: true, carryCount: 2, carryHistory: [{ toDate: date }] });
  const snapshot = aggregateTodaysWork([shared, task('due', { dueDate: date }), task('waiting', { waiting: true }), task('explicit', { references: [{ type: 'today', date }] })], { top3TaskIds: ['shared'], commitmentTaskIds: ['shared'] }, date);
  assert.deepEqual(snapshot.top.map(entry => entry.task.id), ['shared']);
  assert.deepEqual(snapshot.top[0].reasons, ['Top 3', 'Huddle', 'Overdue', 'Carry 2', 'Urgent']);
  assert.deepEqual(snapshot.today.map(entry => entry.task.id), ['due', 'explicit']);
  assert.deepEqual(snapshot.attention.map(entry => entry.task.id), ['waiting']);
  assert.equal(snapshot.progress.total, 4);
});

test('Today aggregation uses canonical completion time and never mutates carry history', () => {
  const carried = task('carried', { carryCount: 1, carryHistory: [{ toDate: date }] });
  const completed = task('completed', { status: 'completed', completedAt: `${date}T10:00:00.000Z`, references: [{ type: 'today', date }] });
  const old = task('old', { status: 'completed', completedAt: '2026-09-06T10:00:00.000Z', references: [{ type: 'today', date }] });
  const before = JSON.stringify(carried);
  const snapshot = aggregateTodaysWork([carried, completed, old], null, date);
  assert.equal(JSON.stringify(carried), before);
  assert.deepEqual(snapshot.completed.map(entry => entry.task.id), ['completed']);
  assert.deepEqual(snapshot.progress, { total: 2, completed: 1 });
});
