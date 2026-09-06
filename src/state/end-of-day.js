import { STORE_NAMES, createEndOfDayRecord, createId, nowIso } from './schema.js';
import { createRecord, getAllRecords, updateRecord } from './storage.js';
import { addTaskReference, carryTaskForward, listTasks } from './tasks.js';

export function localDate(now = new Date()) { const offset = now.getTimezoneOffset() * 60000; return new Date(now.getTime() - offset).toISOString().slice(0, 10); }
// Noon local time avoids DST boundary conversion while retaining a date-only workday identity.
export function nextWorkday(date) { const value = new Date(`${date}T12:00:00`); if (Number.isNaN(value.getTime())) throw new TypeError('A valid local date is required.'); const day = value.getDay(); value.setDate(value.getDate() + (day === 5 ? 3 : day === 6 ? 2 : day === 0 ? 1 : 1)); return localDate(value); }
export async function getEndOfDay(date) { return (await getAllRecords(STORE_NAMES.endOfDay)).find(record => record?.workDate === date || record?.date === date) || null; }
export async function getOrCreateEndOfDay(date = localDate()) { const existing = await getEndOfDay(date); return existing || saveEndOfDay({ workDate: date, status: 'not-started', nextWorkday: nextWorkday(date) }); }
export async function listEndOfDayRecords() { return (await getAllRecords(STORE_NAMES.endOfDay)).sort((a, b) => String(b.workDate || b.date).localeCompare(String(a.workDate || a.date))); }
export async function saveEndOfDay(input) {
  const date = input?.workDate || input?.date || localDate(); const existing = await getEndOfDay(date);
  const next = createEndOfDayRecord({ ...existing, ...input, date, workDate: date, id: existing?.id || createId(), status: input?.status || existing?.status || 'in-progress', nextWorkday: input?.nextWorkday || existing?.nextWorkday || nextWorkday(date), completedAt: input?.completedAt ?? existing?.completedAt ?? null }, { id: existing?.id || createId(), now: existing?.createdAt || nowIso() });
  return existing ? updateRecord(STORE_NAMES.endOfDay, next) : createRecord(STORE_NAMES.endOfDay, next);
}
export async function addEndOfDayEntry(date, section, input) {
  if (!['risks', 'customerIssues', 'decisions', 'handovers', 'improvements'].includes(section)) throw new TypeError('Unsupported End of Day section.');
  const record = await getOrCreateEndOfDay(date); const title = String(input?.title || '').trim();
  if (!title) throw new TypeError('A concise entry is required.');
  const entry = { id: createId(), title, note: String(input?.note || '').trim(), linkedTaskId: input?.linkedTaskId || null, createdAt: nowIso() };
  return saveEndOfDay({ ...record, [section]: [...(record[section] || []), entry], status: record.status === 'not-started' ? 'in-progress' : record.status });
}
export async function setTomorrowTop3(date, taskIds) {
  const record = await getOrCreateEndOfDay(date); const ids = [...new Set((taskIds || []).filter(Boolean))];
  if (ids.length > 3) throw new TypeError("Tomorrow's Top 3 can contain at most three tasks.");
  const open = new Set((await listTasks()).filter(task => task.status === 'open').map(task => task.id));
  if (ids.some(id => !open.has(id))) throw new TypeError('Only open canonical tasks can be selected.');
  return saveEndOfDay({ ...record, top3TaskIds: ids, status: record.status === 'not-started' ? 'in-progress' : record.status });
}
export function activeTop3TaskIds(taskIds, tasks) {
  const open = new Set((tasks || []).filter(task => task?.status === 'open').map(task => task.id));
  return [...new Set((taskIds || []).filter(id => open.has(id)))];
}
export async function closeEndOfDay(input) {
  const date = input?.workDate || input?.date || localDate(); const destination = nextWorkday(date); const selected = [...new Set((input?.taskIds ?? input?.outstandingTaskIds ?? []).filter(Boolean))]; const tasks = await listTasks(); const selectedOpen = tasks.filter(task => task.status === 'open' && selected.includes(task.id)).map(task => task.id);
  for (const id of selectedOpen) { await addTaskReference(id, { type: 'eod', sourceId: date, date }); await carryTaskForward(id, { type: 'huddle', sourceId: destination, date: destination, fromDate: date }); }
  const existing = await getOrCreateEndOfDay(date);
  return saveEndOfDay({ ...existing, ...input, date, workDate: date, taskIds: selectedOpen, outstandingTaskIds: selectedOpen, nextWorkday: destination, status: 'complete', completedAt: nowIso() });
}
export async function reopenEndOfDay(date) { const record = await getOrCreateEndOfDay(date); return saveEndOfDay({ ...record, status: 'in-progress', completedAt: null }); }
export async function getMorningHuddleInputs(date) { const records = await listEndOfDayRecords(); return records.find(record => record.nextWorkday === date && record.status === 'complete') || null; }
