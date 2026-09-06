import assert from 'node:assert/strict';
import test from 'node:test';
import { createMorningHuddleRecord } from '../src/state/schema.js';
import { nextWorkday } from '../src/state/end-of-day.js';

test('Friday through Sunday source workdays feed Monday without date-minus-one logic', () => {
  assert.equal(nextWorkday('2026-09-11'), '2026-09-14');
  assert.equal(nextWorkday('2026-09-12'), '2026-09-14');
  assert.equal(nextWorkday('2026-09-13'), '2026-09-14');
});

test('Morning Huddle keeps task references and alignment metadata rather than task copies', () => {
  const record = createMorningHuddleRecord({ workDate: '2026-09-14', sourceEodId: 'eod-friday', sourceEodDate: '2026-09-11', carryoverTaskIds: ['canonical-task'], top3TaskIds: ['canonical-task'], commitmentTaskIds: ['canonical-task'] });
  assert.equal(record.sourceEodId, 'eod-friday');
  assert.equal(record.carryoverTaskIds[0], 'canonical-task');
  assert.equal(record.top3TaskIds[0], 'canonical-task');
  assert.equal(record.commitmentTaskIds[0], 'canonical-task');
  assert.equal('title' in record, false);
});
