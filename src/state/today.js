import { createTask, addTaskReference, listTasks } from './tasks.js';
import { getMorningHuddle } from './morning-huddle.js';

const unique = values => [...new Set((values || []).filter(Boolean))];
const open = task => task.status === 'open';
const carriesTo = (task, date) => (task.carryHistory || []).some(entry => entry?.toDate === date);
const todayReference = (task, date) => (task.references || []).some(reference => reference?.type === 'today' && reference?.date === date);

// Pure aggregation: rendering this snapshot can never alter canonical tasks or carry history.
export function aggregateTodaysWork(tasks, huddle, date) {
  const records = Array.isArray(tasks) ? tasks : [];
  const reasons = new Map();
  const add = (id, reason) => { if (!id) return; const values = reasons.get(id) || []; if (!values.includes(reason)) values.push(reason); reasons.set(id, values); };
  const top3 = unique(huddle?.top3TaskIds);
  top3.forEach(id => add(id, 'Top 3'));
  unique(huddle?.commitmentTaskIds).forEach(id => add(id, 'Huddle'));
  records.forEach(task => {
    if (task.dueDate === date) add(task.id, 'Due today');
    if (task.dueDate && task.dueDate < date) add(task.id, 'Overdue');
    if (carriesTo(task, date)) add(task.id, `Carry ${task.carryCount || 1}`);
    if (task.urgent) add(task.id, 'Urgent');
    if (task.blocked) add(task.id, 'Blocked');
    if (task.waiting) add(task.id, 'Waiting');
    if (todayReference(task, date)) add(task.id, 'Today');
    if (/decision|follow-up/i.test(task.category || '') || (task.tags || []).some(tag => /decision|follow-up/i.test(tag))) add(task.id, 'Follow-up');
  });
  const byId = new Map(records.map(task => [task.id, task]));
  const item = id => ({ task: byId.get(id), reasons: reasons.get(id) || [], top3Order: top3.indexOf(id) });
  const all = [...reasons.keys()].map(item).filter(entry => entry.task);
  const active = all.filter(entry => open(entry.task) && !entry.task.someday);
  const rank = entry => [entry.top3Order >= 0 ? 0 : 1, entry.reasons.includes('Overdue') && entry.reasons.includes('Urgent') ? 0 : entry.reasons.includes('Overdue') ? 1 : entry.reasons.includes('Urgent') ? 2 : entry.reasons.includes('Huddle') ? 3 : entry.reasons.includes('Due today') ? 4 : entry.reasons.includes('Carry ' + entry.task.carryCount) ? 5 : 6, entry.task.dueDate || '9999-12-31', entry.task.title.toLowerCase()];
  const sort = (a, b) => { const left = rank(a); const right = rank(b); return left.findIndex((value, index) => value !== right[index]) < 0 ? 0 : left[left.findIndex((value, index) => value !== right[index])] < right[left.findIndex((value, index) => value !== right[index])] ? -1 : 1; };
  const top = active.filter(entry => entry.top3Order >= 0).sort((a, b) => a.top3Order - b.top3Order);
  const attention = active.filter(entry => entry.top3Order < 0 && entry.reasons.some(reason => ['Overdue', 'Urgent', 'Blocked', 'Waiting'].includes(reason))).sort(sort);
  const attentionIds = new Set(attention.map(entry => entry.task.id));
  const today = active.filter(entry => entry.top3Order < 0 && !attentionIds.has(entry.task.id)).sort(sort);
  const completed = records.filter(task => task.status === 'completed' && task.completedAt?.slice(0, 10) === date).map(task => ({ task, reasons: reasons.get(task.id) || [], top3Order: top3.indexOf(task.id) })).sort((a, b) => String(b.task.completedAt).localeCompare(String(a.task.completedAt)));
  const progressItems = [...active, ...completed];
  return { top, attention, today, completed, progress: { total: progressItems.length, completed: completed.length } };
}

export async function getTodaysWork(date) { const [tasks, huddle] = await Promise.all([listTasks(), getMorningHuddle(date)]); return aggregateTodaysWork(tasks, huddle, date); }
export async function addTaskToToday(taskId, date) { await addTaskReference(taskId, { type: 'today', sourceId: date, date }); return getTodaysWork(date); }
export async function createTaskForToday(input, date) { const task = await createTask(input); await addTaskToToday(task.id, date); return task; }
