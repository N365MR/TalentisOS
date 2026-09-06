import { STORE_NAMES, createId, createMorningHuddleRecord, nowIso } from './schema.js';
import { createRecord, getAllRecords, updateRecord } from './storage.js';
import { getMorningHuddleInputs } from './end-of-day.js';
import { addTaskReference, createTask, listTasks } from './tasks.js';
import { KPI_STATUSES, scorecardSnapshot } from './kpis.js';

const uniqueIds = values => [...new Set((Array.isArray(values) ? values : []).filter(value => typeof value === 'string' && value))];
const entries = values => (Array.isArray(values) ? values : []).filter(value => value && typeof value === 'object' && typeof value.id === 'string' && typeof value.title === 'string');
const item = (title, note = '') => ({ id: createId(), title: String(title).trim(), note: String(note).trim(), createdAt: nowIso() });

export async function getMorningHuddle(workDate) { return (await getAllRecords(STORE_NAMES.morningHuddles)).find(record => record.workDate === workDate) || null; }
export async function getOrCreateMorningHuddle(workDate) {
  const existing = await getMorningHuddle(workDate); if (existing) return existing;
  const source = await getMorningHuddleInputs(workDate);
  const record = createMorningHuddleRecord({ workDate, status: 'in-progress', startedAt: nowIso(), sourceEodDate: source?.workDate || source?.date || null, sourceEodId: source?.id || null, carryoverTaskIds: source?.outstandingTaskIds || source?.taskIds || [], top3TaskIds: source?.top3TaskIds || [], risks: source?.risks || [], customerIssues: source?.customerIssues || [], decisions: source?.decisions || [] });
  try { return await createRecord(STORE_NAMES.morningHuddles, record); } catch (error) { const raced = await getMorningHuddle(workDate); if (raced) return raced; throw error; }
}
export async function saveMorningHuddle(input) {
  const existing = await getOrCreateMorningHuddle(input.workDate);
  const next = createMorningHuddleRecord({ ...existing, ...input, id: existing.id, carryoverTaskIds: input.carryoverTaskIds ?? existing.carryoverTaskIds, top3TaskIds: input.top3TaskIds ?? existing.top3TaskIds, commitmentTaskIds: input.commitmentTaskIds ?? existing.commitmentTaskIds, risks: input.risks ?? existing.risks, customerIssues: input.customerIssues ?? existing.customerIssues, decisions: input.decisions ?? existing.decisions, resourceSupportItems: input.resourceSupportItems ?? existing.resourceSupportItems, recognitionItems: input.recognitionItems ?? existing.recognitionItems, history: existing.history }, { id: existing.id, now: existing.createdAt });
  return updateRecord(STORE_NAMES.morningHuddles, next);
}
export async function assembleMorningHuddle(workDate) {
  const huddle = await getOrCreateMorningHuddle(workDate); const [tasks, scorecard] = await Promise.all([listTasks(), scorecardSnapshot(`${workDate}T12:00:00Z`)]); const byId = new Map(tasks.map(task => [task.id, task]));
  const resolve = ids => uniqueIds(ids).map(id => byId.get(id)).filter(Boolean);
  const carryovers = resolve(huddle.carryoverTaskIds); const top3 = resolve(huddle.top3TaskIds); const blockers = [...new Map([...carryovers, ...top3, ...tasks.filter(task => task.blocked || task.waiting)].filter(task => task.blocked || task.waiting).map(task => [task.id, task])).values()];
  const kpiExceptions = selectKpiExceptions(scorecard);
  return { huddle, sourceFound: Boolean(huddle.sourceEodId), carryovers, top3, blockers, commitments: resolve(huddle.commitmentTaskIds), kpiExceptions, candidates: tasks.filter(task => !task.someday).sort((a, b) => (a.status === 'completed') - (b.status === 'completed') || (a.dueDate || '9999').localeCompare(b.dueDate || '9999')) };
}
export function selectKpiExceptions(scorecard = []) { return scorecard.filter(item => [KPI_STATUSES.OFF_TRACK, KPI_STATUSES.AT_RISK].includes(item.status)); }
export async function setHuddleTop3(workDate, taskIds) { const ids = uniqueIds(taskIds); if (ids.length > 3) throw new TypeError("Today's Top 3 can contain at most three tasks."); const taskIdsPresent = new Set((await listTasks()).map(task => task.id)); if (ids.some(id => !taskIdsPresent.has(id))) throw new TypeError('Top 3 must reference canonical tasks.'); return saveMorningHuddle({ workDate, top3TaskIds: ids, status: 'in-progress' }); }
export async function addTaskToHuddle(workDate, taskId) { const huddle = await getOrCreateMorningHuddle(workDate); if (!(await listTasks()).some(task => task.id === taskId)) throw new Error('Task not found.'); await addTaskReference(taskId, { type: 'huddle', sourceId: huddle.id, date: workDate }); return saveMorningHuddle({ workDate, carryoverTaskIds: uniqueIds([...huddle.carryoverTaskIds, taskId]), status: 'in-progress' }); }
export async function removeTaskFromHuddle(workDate, taskId) { const huddle = await getOrCreateMorningHuddle(workDate); return saveMorningHuddle({ workDate, carryoverTaskIds: huddle.carryoverTaskIds.filter(id => id !== taskId), top3TaskIds: huddle.top3TaskIds.filter(id => id !== taskId), commitmentTaskIds: huddle.commitmentTaskIds.filter(id => id !== taskId) }); }
export async function addCommitment(workDate, taskId) { const huddle = await getOrCreateMorningHuddle(workDate); await addTaskReference(taskId, { type: 'huddle', sourceId: huddle.id, date: workDate }); return saveMorningHuddle({ workDate, commitmentTaskIds: uniqueIds([...huddle.commitmentTaskIds, taskId]), status: 'in-progress' }); }
export async function removeCommitment(workDate, taskId) { const huddle = await getOrCreateMorningHuddle(workDate); return saveMorningHuddle({ workDate, commitmentTaskIds: huddle.commitmentTaskIds.filter(id => id !== taskId) }); }
export async function createHuddleAction(workDate, input, commitment = true) { const task = await createTask(input); await addTaskToHuddle(workDate, task.id); if (commitment) await addCommitment(workDate, task.id); return task; }
export async function addHuddleItem(workDate, section, title, note = '') { if (!['resourceSupportItems', 'recognitionItems', 'decisions'].includes(section)) throw new TypeError('Unsupported Huddle section.'); if (!String(title).trim()) throw new TypeError('A concise entry is required.'); const huddle = await getOrCreateMorningHuddle(workDate); return saveMorningHuddle({ workDate, [section]: [...entries(huddle[section]), item(title, note)], status: 'in-progress' }); }
export async function completeMorningHuddle(workDate) { const huddle = await getOrCreateMorningHuddle(workDate); return saveMorningHuddle({ workDate, status: 'completed', completedAt: huddle.completedAt || nowIso(), history: [...huddle.history, { id: createId(), type: 'completed', timestamp: nowIso() }] }); }
export async function reopenMorningHuddle(workDate) { const huddle = await getOrCreateMorningHuddle(workDate); return saveMorningHuddle({ workDate, status: 'in-progress', completedAt: null, history: [...huddle.history, { id: createId(), type: 'reopened', timestamp: nowIso() }] }); }
export async function getAlignedCommitments(workDate) { const huddle = await getMorningHuddle(workDate); if (!huddle) return []; return (await listTasks()).filter(task => huddle.commitmentTaskIds.includes(task.id)).map(task => ({ taskId: task.id, huddleId: huddle.id, workDate, referenceType: 'commitment', state: huddle.status === 'completed' ? 'aligned' : 'in-progress', task })); }
export async function getHuddleHistory(workDate) { return (await getMorningHuddle(workDate))?.history || []; }
