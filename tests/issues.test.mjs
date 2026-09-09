import assert from 'node:assert/strict';
import test from 'node:test';
import { SCHEMA_VERSION, createIssueRecord, createRoadmapRecord, isIssueRecord } from '../src/state/schema.js';
import { issueProjection, issueView, linkedTaskState, validateIssue, validateIssueTransition } from '../src/state/issues.js';
import { parseImport } from '../src/state/transfer.js';

const now = '2026-09-09T00:00:00.000Z';
const base = { title: 'Delivery hand-off is repeatedly unclear', impact: 'Rework and delayed customer response', category: 'Process', priority: 'high', ownerRole: 'Operations lead', context: 'Handoffs have no shared checklist.' };

test('creates and validates a safe issue record with optional 5 Whys', () => {
  const issue = createIssueRecord({ ...base, fiveWhys: ['No checklist', 'Ownership is implicit'] }, { id: 'issue-1', now });
  assert.equal(issue.status, 'open'); assert.deepEqual(issue.fiveWhys, ['No checklist', 'Ownership is implicit']); assert.equal(isIssueRecord(issue), true);
  assert.throws(() => validateIssue({ ...base, title: ' ' }), /title/);
});
test('projects only material active issues and respects status views', () => {
  const urgent = createIssueRecord({ ...base, priority: 'urgent' }, { id: 'urgent', now });
  const waiting = createIssueRecord({ ...base, status: 'waiting' }, { id: 'waiting', now });
  const resolved = createIssueRecord({ ...base, status: 'resolved', resolutionSummary: 'Checklist released' }, { id: 'resolved', now });
  assert.deepEqual(issueView([urgent, waiting, resolved], 'attention', '2026-09-10').map(item => item.id), ['urgent', 'waiting']);
  assert.deepEqual(issueProjection([urgent, waiting, resolved], [], '2026-09-10').map(item => item.id), ['urgent', 'waiting']);
});
test('enforces lifecycle evidence for resolution, verification, and reopening', () => {
  const active = createIssueRecord({ ...base, status: 'in-progress' }, { id: 'active', now });
  assert.throws(() => validateIssueTransition(active, 'resolved'), /resolution summary/);
  assert.equal(validateIssueTransition(active, 'resolved', { resolutionSummary: 'Checklist released' }), true);
  const resolved = createIssueRecord({ ...base, status: 'resolved', resolutionSummary: 'Checklist released' }, { id: 'resolved', now });
  assert.throws(() => validateIssueTransition(resolved, 'verified'), /verification outcome/);
  assert.throws(() => validateIssueTransition(resolved, 'in-progress'), /reason/);
  assert.equal(validateIssueTransition(resolved, 'verified', { verificationOutcome: 'No repeat hand-off failures for two weeks' }), true);
});
test('linked canonical task state is read live, without a copied completion state', () => {
  const issue = createIssueRecord({ ...base, linkedTaskIds: ['task-1'] }, { id: 'issue-1', now });
  assert.equal(linkedTaskState(issue, [{ id: 'task-1', title: 'Publish checklist', status: 'completed' }])[0].status, 'completed');
  assert.equal(linkedTaskState(issue, [{ id: 'task-1', title: 'Publish checklist', status: 'open' }])[0].status, 'open');
});
test('issues round-trip in current exports and older exports migrate without them', () => {
  const issue = createIssueRecord({ ...base, linkedTaskIds: ['task-1'] }, { id: 'issue-1', now });
  const modern = parseImport(JSON.stringify({ format: 'TalentisOS', exportVersion: 8, exportedAt: now, data: { metadata: [{ schemaVersion: SCHEMA_VERSION, initializedAt: now, updatedAt: now }], tasks: [{ id: 'task-1', title: 'Publish checklist', createdAt: now, updatedAt: now }], endOfDay: [], morningHuddles: [], roadmap: [createRoadmapRecord({}, { now })], settings: [], kpis: [], kpiEntries: [], conversations: [], issues: [issue] } }));
  assert.equal(modern.data.issues[0].id, 'issue-1');
  const legacy = parseImport(JSON.stringify({ format: 'TalentisOS', exportVersion: 1, exportedAt: now, data: { tasks: [], settings: [] } })); assert.deepEqual(legacy.data.issues, []);
});
