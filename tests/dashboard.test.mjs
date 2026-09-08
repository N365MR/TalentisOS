import assert from 'node:assert/strict';
import test from 'node:test';
import { dashboardProjection } from '../src/state/dashboard.js';

const task = (id, values = {}) => ({ id, title: id, status: 'open', someday: false, dueDate: null, urgent: false, blocked: false, waiting: false, ...values });
const score = (linked = []) => [{ status: 'off-track', kpi: { name: 'Delivery' }, corrective: { linked } }];

test('Next Best Action gives an off-track KPI corrective task precedence over lower-ranked work', () => {
  const corrective = task('corrective'); const result = dashboardProjection({ tasks: [corrective, task('urgent', { urgent: true })], scorecard: score([corrective]), date: '2026-09-08' });
  assert.equal(result.action.kind, 'kpi-corrective'); assert.equal(result.action.title, 'corrective');
});
test('Next Best Action ranks overdue and urgent work before blocked or waiting work', () => {
  const result = dashboardProjection({ tasks: [task('blocked', { blocked: true }), task('urgent', { urgent: true }), task('overdue', { dueDate: '2026-09-07' })], date: '2026-09-08' });
  assert.equal(result.action.kind, 'overdue-urgent'); assert.ok(['urgent', 'overdue'].includes(result.action.title));
});
test('Next Best Action ranks blocked or waiting work before incomplete Top 3', () => {
  const blocked = task('blocked', { blocked: true }); const top = task('top'); const result = dashboardProjection({ tasks: [blocked, top], huddle: { top3TaskIds: ['top'] }, todayWork: { top: [{ task: top }], progress: { total: 2, completed: 0 } }, date: '2026-09-08' });
  assert.equal(result.action.kind, 'blocked-waiting');
});
test('Next Best Action surfaces incomplete Top 3 before daily rhythm and returns the calm state when aligned', () => {
  const top = task('top'); const focused = dashboardProjection({ tasks: [top], huddle: { top3TaskIds: ['top'], status: 'completed' }, endOfDay: { status: 'complete' }, todayWork: { top: [{ task: top }], progress: { total: 1, completed: 0 } }, date: '2026-09-08' });
  assert.equal(focused.action.kind, 'top-3'); const calm = dashboardProjection({ tasks: [], huddle: { status: 'completed', top3TaskIds: [] }, endOfDay: { status: 'complete' }, todayWork: { top: [], progress: { total: 0, completed: 0 } }, date: '2026-09-08' }); assert.equal(calm.action.kind, 'aligned');
});
test('dashboard counts are direct read-only projections of canonical tasks and KPI snapshots', () => {
  const tasks = [task('urgent', { urgent: true }), task('done', { status: 'completed', completedAt: '2026-09-08T08:00:00Z' })]; const result = dashboardProjection({ tasks, scorecard: [{ status: 'at-risk', kpi: { name: 'Quality' }, corrective: { linked: [] } }], date: '2026-09-08' });
  assert.equal(result.taskAttention.length, 1); assert.equal(result.completed.length, 1); assert.equal(result.kpiExceptions.length, 1); assert.strictEqual(result.taskAttention[0], tasks[0]);
});
