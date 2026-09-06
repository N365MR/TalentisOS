import assert from 'node:assert/strict';
import test from 'node:test';
import { activeTop3TaskIds, localDate, nextWorkday } from '../src/state/end-of-day.js';
import { createEndOfDayRecord, isEndOfDayRecord } from '../src/state/schema.js';

test('moves every weekday to the next default workday without creating a weekend handoff', () => {
  assert.equal(nextWorkday('2026-09-07'), '2026-09-08');
  assert.equal(nextWorkday('2026-09-08'), '2026-09-09');
  assert.equal(nextWorkday('2026-09-09'), '2026-09-10');
  assert.equal(nextWorkday('2026-09-10'), '2026-09-11');
  assert.equal(nextWorkday('2026-09-11'), '2026-09-14');
  assert.equal(nextWorkday('2026-09-12'), '2026-09-14');
  assert.equal(nextWorkday('2026-09-13'), '2026-09-14');
  assert.equal(nextWorkday('2026-12-31'), '2027-01-01');
  assert.equal(nextWorkday('2026-01-30'), '2026-02-02');
});

test('formats the active local calendar date as an ISO date', () => {
  assert.match(localDate(new Date('2026-09-06T12:00:00.000Z')), /^2026-09-0[67]$/);
});

test('creates a valid persisted End of Day record with canonical task identifiers', () => {
  const record = createEndOfDayRecord({ workDate: '2026-09-11', status: 'in-progress', taskIds: ['task-1', 'task-1', 'task-2'], top3TaskIds: ['task-2', 'task-1'], wins: 'Cleared the decision log.' }, { id: 'eod-1', now: '2026-09-11T08:00:00.000Z' });
  assert.deepEqual(record.taskIds, ['task-1', 'task-2']);
  assert.equal(record.workDate, '2026-09-11');
  assert.deepEqual(record.top3TaskIds, ['task-2', 'task-1']);
  assert.equal(isEndOfDayRecord(record), true);
});

test('derives active Top 3 from canonical open task state while retaining selection order', () => {
  const active = activeTop3TaskIds(['task-2', 'task-1', 'task-3'], [
    { id: 'task-1', status: 'open' },
    { id: 'task-2', status: 'completed' },
    { id: 'task-3', status: 'open' },
  ]);
  assert.deepEqual(active, ['task-1', 'task-3']);
});
