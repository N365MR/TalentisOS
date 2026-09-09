import { ISSUE_STATUSES, STORE_NAMES, createId, createIssueRecord, nowIso } from './schema.js';
import { createRecord, getAllRecords, getRecord, updateRecord } from './storage.js';
import { addTaskReference, createTask, getTask, listTasks } from './tasks.js';

const unique = values => [...new Set((values || []).filter(value => typeof value === 'string' && value))];
const transitions = { open: ['prioritised', 'in-progress', 'waiting'], prioritised: ['open', 'in-progress', 'waiting'], 'in-progress': ['prioritised', 'waiting', 'resolved'], waiting: ['prioritised', 'in-progress', 'resolved'], resolved: ['in-progress', 'verified'], verified: ['in-progress'] };

export function validateIssue(input) { return createIssueRecord(input); }
export function validateIssueTransition(current, status, details = {}) {
  if (!ISSUE_STATUSES.includes(status) || !transitions[current?.status]?.includes(status)) throw new TypeError(`Cannot move a ${current?.status} issue to ${status}.`);
  if (status === 'resolved' && !String(details.resolutionSummary ?? current.resolutionSummary).trim()) throw new TypeError('Add a resolution summary before resolving this issue.');
  if (status === 'verified' && !String(details.verificationOutcome ?? current.verificationOutcome).trim()) throw new TypeError('Add a verification outcome before marking this issue verified.');
  if (status === 'in-progress' && ['resolved', 'verified'].includes(current.status) && !String(details.reopenReason ?? '').trim()) throw new TypeError('Add a reason when reopening an issue.');
  return true;
}
export function issueView(records = [], view = 'attention', today = new Date().toISOString().slice(0, 10), tasks = []) {
  const byId = new Map(tasks.map(task => [task.id, task]));
  const overdueAction = issue => unique(issue.linkedTaskIds).some(id => { const task = byId.get(id); return task?.status !== 'completed' && task?.dueDate && task.dueDate < today; });
  const attention = issue => !['resolved', 'verified'].includes(issue.status) && (issue.priority === 'urgent' || issue.priority === 'high' || issue.status === 'waiting' || overdueAction(issue));
  const matches = { attention, open: issue => ['open', 'prioritised', 'in-progress'].includes(issue.status), waiting: issue => issue.status === 'waiting', resolved: issue => ['resolved', 'verified'].includes(issue.status) }[view] || (() => true);
  return records.filter(matches).sort((a, b) => Number(b.priority === 'urgent') - Number(a.priority === 'urgent') || String(b.updatedAt).localeCompare(String(a.updatedAt)));
}
export function linkedTaskState(issue, tasks = []) { const byId = new Map(tasks.map(task => [task.id, task])); return unique(issue?.linkedTaskIds).map(id => byId.get(id)).filter(Boolean); }
export function issueProjection(issues = [], tasks = [], today) { return issueView(issues, 'attention', today, tasks).filter(issue => !['resolved', 'verified'].includes(issue.status)); }
export async function listIssues() { return (await getAllRecords(STORE_NAMES.issues)).map(record => createIssueRecord(record, { id: record.id, now: record.createdAt })); }
export async function getIssue(id) { const record = await getRecord(STORE_NAMES.issues, id); return record ? createIssueRecord(record, { id: record.id, now: record.createdAt }) : null; }
export async function createIssue(input) { const record = createIssueRecord(input); await createRecord(STORE_NAMES.issues, record); return record; }
export async function updateIssue(id, changes) { const current = await getIssue(id); if (!current) throw new Error('Issue not found.'); return updateRecord(STORE_NAMES.issues, createIssueRecord({ ...current, ...changes, id, createdAt: current.createdAt, prioritisedAt: current.prioritisedAt, resolvedAt: current.resolvedAt, verifiedAt: current.verifiedAt }, { id, now: current.createdAt })); }
export async function transitionIssue(id, status, details = {}) {
  const current = await getIssue(id); if (!current) throw new Error('Issue not found.');
  validateIssueTransition(current, status, details);
  const now = nowIso(); const next = { ...current, ...details, status, prioritisedAt: status === 'prioritised' ? current.prioritisedAt || now : current.prioritisedAt, resolvedAt: status === 'resolved' ? now : current.resolvedAt, verifiedAt: status === 'verified' ? now : current.verifiedAt, reopenReason: status === 'in-progress' && ['resolved', 'verified'].includes(current.status) ? String(details.reopenReason ?? '').trim() : current.reopenReason };
  return updateRecord(STORE_NAMES.issues, createIssueRecord(next, { id, now: current.createdAt }));
}
export async function linkIssueTask(id, taskId) { const [issue, task] = await Promise.all([getIssue(id), getTask(taskId)]); if (!issue || !task) throw new TypeError('Choose an existing canonical task.'); if (!issue.linkedTaskIds.includes(taskId)) await addTaskReference(taskId, { type: 'issue', sourceId: id }); return updateIssue(id, { linkedTaskIds: unique([...issue.linkedTaskIds, taskId]) }); }
export async function createOrLinkCorrectiveTask(id, input = {}) {
  const issue = await getIssue(id); if (!issue) throw new Error('Issue not found.');
  const actionId = String(input.actionId || '').trim(); const existing = actionId && issue.correctiveActions.find(action => action.id === actionId);
  if (existing?.taskId) return getTask(existing.taskId);
  const title = String(input.title || '').trim();
  let task;
  if (input.taskId) { task = await getTask(input.taskId); if (!task) throw new TypeError('Choose an existing canonical task.'); }
  else {
    if (!title) throw new TypeError('A corrective action title is required.');
    const linked = await Promise.all(issue.linkedTaskIds.map(getTask));
    task = linked.find(candidate => candidate && candidate.title === title) || await createTask({ title, priority: issue.priority === 'urgent' ? 'high' : issue.priority, category: 'Issue corrective action' });
  }
  await linkIssueTask(id, task.id);
  const current = await getIssue(id); const actions = existing ? current.correctiveActions.map(action => action.id === actionId ? { ...action, taskId: task.id } : action) : [...current.correctiveActions, { id: createId(), title: title || task.title, taskId: task.id }];
  await updateIssue(id, { correctiveActions: actions }); return task;
}
export async function issueSnapshot(today) { const [issues, tasks] = await Promise.all([listIssues(), listTasks()]); return { issues, tasks, attention: issueProjection(issues, tasks, today) }; }
