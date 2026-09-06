export const SCHEMA_VERSION = 6;
export const EXPORT_VERSION = 3;
export const EXPORT_FORMAT = 'TalentisOS';
export const STORE_NAMES = Object.freeze({ metadata: 'metadata', tasks: 'tasks', endOfDay: 'endOfDay', morningHuddles: 'morningHuddles', settings: 'settings' });

export function nowIso(now = new Date()) { return now.toISOString(); }
export function createId(randomUUID = globalThis.crypto?.randomUUID?.bind(globalThis.crypto)) {
  return randomUUID ? randomUUID() : `talentisos-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
export function createMetadataRecord(now = nowIso()) { return { schemaVersion: SCHEMA_VERSION, initializedAt: now, updatedAt: now }; }
export function createTaskRecord(input, { id = createId(), now = nowIso() } = {}) {
  const title = String(input?.title ?? '').trim();
  if (!title) throw new TypeError('A task title is required.');
  return { id, title, notes: String(input?.notes ?? ''), status: input?.status ?? 'open', priority: input?.priority ?? 'normal', urgent: Boolean(input?.urgent), flagged: Boolean(input?.flagged), tags: Array.isArray(input?.tags) ? [...input.tags] : [], category: input?.category ?? null, dueDate: input?.dueDate ?? null, dueTime: input?.dueTime ?? null, subtasks: Array.isArray(input?.subtasks) ? [...input.subtasks] : [], references: Array.isArray(input?.references) ? [...input.references] : [], history: Array.isArray(input?.history) ? [...input.history] : [], carryCount: Number(input?.carryCount ?? 0), carryHistory: Array.isArray(input?.carryHistory) ? [...input.carryHistory] : [], blocked: Boolean(input?.blocked), blockedReason: input?.blockedReason ?? '', waiting: Boolean(input?.waiting), waitingFor: input?.waitingFor ?? '', someday: Boolean(input?.someday), createdAt: now, updatedAt: now, completedAt: null };
}
export function createEndOfDayRecord(input, { id = createId(), now = nowIso() } = {}) {
  const date = String(input?.workDate ?? input?.date ?? '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new TypeError('An End of Day date is required.');
  const ids = values => [...new Set((Array.isArray(values) ? values : []).filter(value => typeof value === 'string' && value))];
  const entries = values => (Array.isArray(values) ? values : []).filter(value => value && typeof value === 'object' && typeof value.id === 'string' && typeof value.title === 'string');
  const taskIds = ids(input?.taskIds ?? input?.outstandingTaskIds);
  return {
    id, date, workDate: date, status: ['not-started', 'in-progress', 'complete'].includes(input?.status) ? input.status : 'not-started',
    wins: String(input?.wins ?? ''), reflection: String(input?.reflection ?? ''), taskIds,
    outstandingTaskIds: ids(input?.outstandingTaskIds ?? taskIds), top3TaskIds: ids(input?.top3TaskIds).slice(0, 3),
    risks: entries(input?.risks), customerIssues: entries(input?.customerIssues), decisions: entries(input?.decisions), handovers: entries(input?.handovers), improvements: entries(input?.improvements),
    nextWorkday: input?.nextWorkday ?? null, completedAt: input?.completedAt ?? null, createdAt: input?.createdAt ?? now, updatedAt: input?.updatedAt ?? now
  };
}
export function createMorningHuddleRecord(input, { id = createId(), now = nowIso() } = {}) {
  const workDate = String(input?.workDate ?? '').trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(workDate)) throw new TypeError('A Morning Huddle work date is required.');
  const ids = values => [...new Set((Array.isArray(values) ? values : []).filter(value => typeof value === 'string' && value))];
  const items = values => (Array.isArray(values) ? values : []).filter(value => value && typeof value === 'object' && typeof value.id === 'string' && typeof value.title === 'string');
  return { id, workDate, status: ['draft', 'in-progress', 'completed'].includes(input?.status) ? input.status : 'draft', sourceEodDate: input?.sourceEodDate || null, sourceEodId: input?.sourceEodId || null, carryoverTaskIds: ids(input?.carryoverTaskIds), top3TaskIds: ids(input?.top3TaskIds).slice(0, 3), commitmentTaskIds: ids(input?.commitmentTaskIds), risks: items(input?.risks), customerIssues: items(input?.customerIssues), decisions: items(input?.decisions), resourceSupportItems: items(input?.resourceSupportItems), recognitionItems: items(input?.recognitionItems), notes: String(input?.notes ?? ''), history: Array.isArray(input?.history) ? [...input.history] : [], startedAt: input?.startedAt ?? null, completedAt: input?.completedAt ?? null, createdAt: input?.createdAt ?? now, updatedAt: input?.updatedAt ?? now };
}
export function isMetadataRecord(value) { return Boolean(value) && typeof value === 'object' && value.schemaVersion === SCHEMA_VERSION && typeof value.initializedAt === 'string' && typeof value.updatedAt === 'string'; }
export function isTaskRecord(value) { return Boolean(value) && typeof value === 'object' && typeof value.id === 'string' && value.id.length > 0 && typeof value.title === 'string' && value.title.trim().length > 0 && typeof value.createdAt === 'string' && typeof value.updatedAt === 'string'; }
export function isEndOfDayRecord(value) { return Boolean(value) && typeof value === 'object' && typeof value.id === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.date) && Array.isArray(value.taskIds) && typeof value.createdAt === 'string' && typeof value.updatedAt === 'string'; }
export function isMorningHuddleRecord(value) { return Boolean(value) && typeof value === 'object' && typeof value.id === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.workDate) && Array.isArray(value.carryoverTaskIds) && Array.isArray(value.top3TaskIds) && Array.isArray(value.commitmentTaskIds) && typeof value.createdAt === 'string' && typeof value.updatedAt === 'string'; }
export function isSupportedExport(value) { const legacy = value?.exportVersion === 1 || value?.exportVersion === 2; return Boolean(value) && typeof value === 'object' && value.format === EXPORT_FORMAT && (value.exportVersion === EXPORT_VERSION || legacy) && typeof value.exportedAt === 'string' && value.data && typeof value.data === 'object' && Array.isArray(value.data.tasks) && Array.isArray(value.data.settings) && (!legacy ? Array.isArray(value.data.endOfDay) && Array.isArray(value.data.morningHuddles) && value.data.endOfDay.every(isEndOfDayRecord) && value.data.morningHuddles.every(isMorningHuddleRecord) : true) && value.data.tasks.every(isTaskRecord); }
