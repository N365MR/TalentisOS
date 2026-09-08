import assert from 'node:assert/strict';
import test from 'node:test';
import { CONVERSATION_TYPES, createConversationRecord, createRoadmapRecord, isConversationRecord } from '../src/state/schema.js';
import { CONVERSATION_PROMPTS, conversationView, filterConversations, followUpState, linkedTaskState, promptsForType, templateFieldsForType } from '../src/state/conversations.js';
import { parseImport } from '../src/state/transfer.js';

const now = '2026-09-09T00:00:00.000Z';
const base = { title: 'Clarify delivery hand-off', type: 'delegation', roleReference: 'Operations lead', intendedOutcome: 'Clear ownership', conversationDate: '2026-09-09', followUpDate: '2026-09-10' };

test('creates, validates and retains a privacy-bounded conversation record', () => {
  const record = createConversationRecord(base, { id: 'conversation-1', now });
  assert.equal(record.id, 'conversation-1'); assert.equal(record.status, 'draft'); assert.equal(record.roleReference, 'Operations lead'); assert.equal(isConversationRecord(record), true);
  assert.throws(() => createConversationRecord({ ...base, title: ' ' }), /title/);
  assert.throws(() => createConversationRecord({ ...base, type: 'performance-review' }), /supported/);
});
test('exposes deterministic type-specific preparation prompts', () => {
  assert.deepEqual(promptsForType('coaching'), CONVERSATION_PROMPTS.coaching);
  assert.equal(CONVERSATION_TYPES.length, 6); assert.match(promptsForType('difficult').join(' '), /facts/i); assert.match(templateFieldsForType('delegation').join(' '), /Authority/);
});
test('retains only the selected type structured fields and filters without mutation', () => {
  const record = createConversationRecord({ ...base, templateFields: { 'Outcome required': 'Deliver safely', 'Authority or decision rights': 'Choose approach', Situation: 'Discarded' } }, { id: 'structured', now });
  assert.deepEqual(record.templateFields, { 'Outcome required': 'Deliver safely', 'Authority or decision rights': 'Choose approach' });
  assert.deepEqual(filterConversations([record], { type: 'delegation' }).map(item => item.id), ['structured']);
});
test('projects follow-up due and overdue states without mutating a conversation', () => {
  const held = createConversationRecord({ ...base, status: 'held' }, { id: 'held', now });
  assert.deepEqual(followUpState(held, '2026-09-10'), { due: true, overdue: false, date: '2026-09-10' });
  assert.equal(followUpState(held, '2026-09-11').overdue, true);
  assert.deepEqual(conversationView([held], 'follow-up', '2026-09-10').map(item => item.id), ['held']);
});
test('uses only linked canonical task identity and reflects completion or reopen state', () => {
  const record = createConversationRecord({ ...base, linkedTaskIds: ['task-1'] }, { id: 'conversation-1', now });
  assert.equal(linkedTaskState(record, [{ id: 'task-1', title: 'Follow through', status: 'completed' }])[0].status, 'completed');
  assert.equal(linkedTaskState(record, [{ id: 'task-1', title: 'Follow through', status: 'open' }])[0].status, 'open');
});
test('round-trips conversation records and safely migrates older exports without them', () => {
  const conversation = createConversationRecord({ ...base, linkedTaskIds: ['task-1'] }, { id: 'conversation-1', now });
  const modern = parseImport(JSON.stringify({ format: 'TalentisOS', exportVersion: 7, exportedAt: now, data: { metadata: [{ schemaVersion: 10, initializedAt: now, updatedAt: now }], tasks: [{ id: 'task-1', title: 'Follow through', createdAt: now, updatedAt: now }], endOfDay: [], morningHuddles: [], roadmap: [createRoadmapRecord({}, { now })], settings: [], kpis: [], kpiEntries: [], conversations: [conversation] } }));
  assert.equal(modern.data.conversations[0].id, 'conversation-1');
  const legacy = parseImport(JSON.stringify({ format: 'TalentisOS', exportVersion: 1, exportedAt: now, data: { tasks: [], settings: [] } })); assert.deepEqual(legacy.data.conversations, []);
});
