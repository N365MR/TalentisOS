import assert from 'node:assert/strict';
import test from 'node:test';
import { createKpiEntryRecord, createKpiRecord } from '../src/state/schema.js';
import { KPI_STATUSES, correctiveActionEligibility, currentReportingState, evaluateStatus, evaluateTrend, periodKeyFor, validateThresholds } from '../src/state/kpis.js';
import { selectKpiExceptions } from '../src/state/morning-huddle.js';

const higher = createKpiRecord({ name: 'Completion', purpose: 'Keep delivery dependable.', ownerRole: 'Operations', formula: 'Completed divided by due.', unit: '%', frequency: 'monthly', direction: 'higher', target: { min: 0, max: 95 }, warning: { min: 0, max: 90 }, offTrack: { min: 0, max: 80 } }, { id: 'higher', now: '2026-01-01T00:00:00.000Z' });
const lower = createKpiRecord({ ...higher, name: 'Response time', direction: 'lower', unit: 'hours', target: { min: 4, max: 100 }, warning: { min: 8, max: 100 }, offTrack: { min: 12, max: 100 } }, { id: 'lower', now: '2026-01-01T00:00:00.000Z' });
const range = createKpiRecord({ ...higher, name: 'Capacity', direction: 'within-range', target: { min: 70, max: 85 }, warning: { min: 65, max: 90 }, offTrack: { min: 50, max: 100 } }, { id: 'range', now: '2026-01-01T00:00:00.000Z' });

test('evaluates higher, lower, and within-range KPI boundaries deterministically', () => {
  assert.equal(evaluateStatus(higher, 95), KPI_STATUSES.ON_TRACK); assert.equal(evaluateStatus(higher, 90), KPI_STATUSES.AT_RISK); assert.equal(evaluateStatus(higher, 89.9), KPI_STATUSES.OFF_TRACK);
  assert.equal(evaluateStatus(lower, 4), KPI_STATUSES.ON_TRACK); assert.equal(evaluateStatus(lower, 8), KPI_STATUSES.AT_RISK); assert.equal(evaluateStatus(lower, 12.1), KPI_STATUSES.OFF_TRACK);
  assert.equal(evaluateStatus(range, 70), KPI_STATUSES.ON_TRACK); assert.equal(evaluateStatus(range, 90), KPI_STATUSES.AT_RISK); assert.equal(evaluateStatus(range, 49), KPI_STATUSES.OFF_TRACK);
});
test('reports missing actuals and invalid thresholds safely', () => { assert.equal(evaluateStatus(higher, null), KPI_STATUSES.NOT_REPORTED); assert.equal(validateThresholds({ ...higher, warning: { min: 0, max: 99 } }).valid, false); });
test('generates stable reporting periods and trends from ordered history', () => { assert.equal(periodKeyFor('monthly', '2026-09-06'), '2026-09'); assert.equal(periodKeyFor('quarterly', '2026-09-06'), '2026-Q3'); assert.equal(periodKeyFor('daily', '2026-09-06'), '2026-09-06'); assert.equal(evaluateTrend([{ periodKey: '2026-01', actual: 3 }, { periodKey: '2026-02', actual: 4 }]), 'up'); assert.equal(evaluateTrend([{ periodKey: '2026-01', actual: 3 }]), 'insufficient'); });
test('uses one current-period entry and requires an open task for red actioning', () => { const entry = createKpiEntryRecord({ kpiId: higher.id, periodKey: '2026-09', actual: 70 }, { id: 'entry', now: '2026-09-01T00:00:00.000Z' }); const state = currentReportingState(higher, [entry], '2026-09-06'); assert.equal(state.status, KPI_STATUSES.OFF_TRACK); assert.equal(correctiveActionEligibility({ ...higher, linkedTaskIds: ['task-1'] }, state, [{ id: 'task-1', status: 'open' }]).actioned, true); assert.equal(correctiveActionEligibility(higher, state, []).actioned, false); });
test('selects only current amber and red KPI exceptions for the Huddle projection', () => { assert.deepEqual(selectKpiExceptions([{ status: KPI_STATUSES.ON_TRACK }, { status: KPI_STATUSES.AT_RISK }, { status: KPI_STATUSES.OFF_TRACK }, { status: KPI_STATUSES.NOT_REPORTED }]).map(item => item.status), [KPI_STATUSES.AT_RISK, KPI_STATUSES.OFF_TRACK]); });
