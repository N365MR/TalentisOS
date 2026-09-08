import { CONVERSATION_STATUSES, CONVERSATION_TEMPLATE_FIELDS, CONVERSATION_TYPES, STORE_NAMES, createConversationRecord, createId, nowIso } from './schema.js';
import { createRecord, deleteRecord, getAllRecords, getRecord, updateRecord } from './storage.js';
import { addTaskReference, createTask, getTask, listTasks } from './tasks.js';

export const CONVERSATION_PROMPTS = Object.freeze({
  praise: ['What was observed?', 'Why did it matter?', 'What recognition will you give?'],
  feedback: ['What observable situation or behaviour occurred?', 'What was the impact?', 'What is the desired next step?'],
  coaching: ['What is the goal?', 'What is the current reality?', 'What options are available?', 'What is the commitment?'],
  delegation: ['What is the outcome?', 'What authority is delegated?', 'What are the boundaries?', 'What support and check-in are needed?'],
  expectations: ['What outcome is required?', 'What standards and measures apply?', 'What is the timing?', 'What support is available?'],
  difficult: ['What are the facts?', 'What is the impact?', 'What outcome is needed?', 'What questions and boundaries matter?', 'What follow-up is needed?']
});
const unique = values => [...new Set((values || []).filter(value => typeof value === 'string' && value))];
const dateOnly = value => typeof value === 'string' ? value.slice(0, 10) : '';
const allowedTransitions = { draft: ['prepared'], prepared: ['draft', 'held'], held: ['prepared', 'follow_up_due', 'closed'], follow_up_due: ['held', 'closed'], closed: ['held'] };

export function promptsForType(type) { return CONVERSATION_PROMPTS[type] || []; }
export function templateFieldsForType(type) { return CONVERSATION_TEMPLATE_FIELDS[type] || []; }
export function validateConversation(input) { return createConversationRecord(input); }
export function followUpState(conversation, today = dateOnly(new Date().toISOString())) {
  const due = conversation?.followUpDate;
  const active = ['held', 'follow_up_due'].includes(conversation?.status);
  return { due: Boolean(active && due && due <= today), overdue: Boolean(active && due && due < today), date: due || null };
}
export function conversationView(records = [], view = 'open', today) {
  return records.filter(record => view === 'closed' ? record.status === 'closed' : view === 'held' ? ['held', 'follow_up_due'].includes(record.status) : view === 'follow-up' ? followUpState(record, today).due : !['closed', 'held', 'follow_up_due'].includes(record.status)).sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)));
}
export function filterConversations(records = [], { type = '', status = '', followUp = '' } = {}, today) { return records.filter(record => (!type || record.type === type) && (!status || record.status === status) && (!followUp || (followUp === 'due' && followUpState(record, today).due) || (followUp === 'overdue' && followUpState(record, today).overdue))); }
export function linkedTaskState(conversation, tasks = []) { const byId = new Map(tasks.map(task => [task.id, task])); return unique(conversation?.linkedTaskIds).map(id => byId.get(id)).filter(Boolean); }
export async function listConversations() { return (await getAllRecords(STORE_NAMES.conversations)).map(record => createConversationRecord(record, { id: record.id, now: record.createdAt })); }
export async function getConversation(id) { const record = await getRecord(STORE_NAMES.conversations, id); return record ? createConversationRecord(record, { id: record.id, now: record.createdAt }) : null; }
export async function createConversation(input) { const record = createConversationRecord(input); await createRecord(STORE_NAMES.conversations, record); return record; }
export async function updateConversation(id, changes) { const current = await getConversation(id); if (!current) throw new Error('Conversation not found.'); const next = createConversationRecord({ ...current, ...changes, id, createdAt: current.createdAt, heldAt: current.heldAt, closedAt: current.closedAt }, { id, now: current.createdAt }); return updateRecord(STORE_NAMES.conversations, next); }
export async function deleteConversation(id) { await deleteRecord(STORE_NAMES.conversations, id); }
export async function transitionConversation(id, status) { const current = await getConversation(id); if (!current) throw new Error('Conversation not found.'); if (!CONVERSATION_STATUSES.includes(status) || !allowedTransitions[current.status]?.includes(status)) throw new TypeError(`Cannot move a ${current.status} conversation to ${status}.`); const timestamp = nowIso(); return updateRecord(STORE_NAMES.conversations, { ...current, status, heldAt: status === 'held' || status === 'follow_up_due' || status === 'closed' ? current.heldAt || timestamp : current.heldAt, closedAt: status === 'closed' ? timestamp : null }); }
export async function linkConversationTask(id, taskId) { const [conversation, task] = await Promise.all([getConversation(id), getTask(taskId)]); if (!conversation || !task) throw new TypeError('Choose an existing canonical task.'); if (!conversation.linkedTaskIds.includes(taskId)) await addTaskReference(taskId, { type: 'conversation', sourceId: id, date: conversation.conversationDate }); return updateConversation(id, { linkedTaskIds: unique([...conversation.linkedTaskIds, taskId]) }); }
export async function unlinkConversationTask(id, taskId) { const conversation = await getConversation(id); if (!conversation) throw new Error('Conversation not found.'); return updateConversation(id, { linkedTaskIds: conversation.linkedTaskIds.filter(linkedId => linkedId !== taskId), agreedActions: conversation.agreedActions.map(action => action.taskId === taskId ? { ...action, taskId: null } : action) }); }
export async function createOrLinkFollowUpTask(id, input = {}) {
  const conversation = await getConversation(id); if (!conversation) throw new Error('Conversation not found.');
  const actionId = String(input.actionId || '').trim();
  const existingAction = actionId && conversation.agreedActions.find(action => action.id === actionId);
  if (existingAction?.taskId) return getTask(existingAction.taskId);
  let task;
  if (input.taskId) { task = await getTask(input.taskId); if (!task) throw new TypeError('Choose an existing canonical task.'); }
  else { const title = String(input.title || '').trim(); if (!title) throw new TypeError('A follow-up action title is required.'); task = await createTask({ title, dueDate: input.dueDate || conversation.followUpDate || null, category: 'Conversation follow-up' }); }
  await linkConversationTask(id, task.id);
  const current = await getConversation(id);
  const actions = existingAction ? current.agreedActions.map(action => action.id === actionId ? { ...action, taskId: task.id } : action) : [...current.agreedActions, { id: createId(), title: String(input.title || task.title).trim(), taskId: task.id }];
  await updateConversation(id, { agreedActions: actions }); return task;
}
export async function conversationSnapshot(today) { const [conversations, tasks] = await Promise.all([listConversations(), listTasks()]); const due = conversations.filter(conversation => followUpState(conversation, today).due); return { conversations, tasks, due, linked: new Map(conversations.map(conversation => [conversation.id, linkedTaskState(conversation, tasks)])) }; }
export { CONVERSATION_TYPES, CONVERSATION_TEMPLATE_FIELDS };
