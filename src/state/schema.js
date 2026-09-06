export const SCHEMA_VERSION = 9;
export const EXPORT_VERSION = 5;
export const EXPORT_FORMAT = 'TalentisOS';
export const STORE_NAMES = Object.freeze({ metadata: 'metadata', tasks: 'tasks', endOfDay: 'endOfDay', morningHuddles: 'morningHuddles', roadmap: 'roadmap', settings: 'settings', kpis: 'kpis', kpiEntries: 'kpiEntries' });

export const ROADMAP_ID = 'leadership-roadmap';
export const ROADMAP_MILESTONES = Object.freeze([
  ['30-role-context', 30, 'Understand the role and operating context.', 'Build a clear view of the role, remit and environment.'],
  ['30-stakeholders', 30, 'Map key stakeholders.', 'Know who matters, what they need and how to engage them.'],
  ['30-first-one-to-ones', 30, 'Hold first 1:1 conversations.', 'Listen early and establish trusted working relationships.'],
  ['30-kpi-risk-baseline', 30, 'Establish the KPI and risk baseline.', 'Make current performance and material risks visible.'],
  ['30-daily-rhythm', 30, 'Establish the End of Day → Morning Huddle → Today’s Work rhythm.', 'Create a dependable daily leadership cadence.'],
  ['60-expectations-ownership', 60, 'Clarify team expectations and ownership.', 'Make responsibilities, standards and decisions clear.'],
  ['60-feedback-cadence', 60, 'Build a regular feedback cadence.', 'Create timely, useful feedback in both directions.'],
  ['60-coaching-delegation', 60, 'Apply coaching and deliberate delegation.', 'Grow capability while keeping accountability clear.'],
  ['60-meeting-issue-routines', 60, 'Install disciplined meeting and issue routines.', 'Turn recurring conversations into focused follow-through.'],
  ['90-operating-rhythm', 90, 'Standardise the leadership operating rhythm.', 'Make the leadership system consistent and repeatable.'],
  ['90-root-causes', 90, 'Reduce recurring issues at their root cause.', 'Replace repeat fixes with durable improvement.'],
  ['90-review-priorities', 90, 'Complete the 90-day review and set next priorities.', 'Reflect on progress and choose the next horizon.']
]);

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
export function createRoadmapRecord(input = {}, { now = nowIso() } = {}) {
  const existing = new Map(Array.isArray(input?.milestones) ? input.milestones.map(item => [item?.id, item]) : []);
  const milestones = ROADMAP_MILESTONES.map(([id, stage, title, outcome]) => {
    const prior = existing.get(id);
    const completed = prior?.status === 'completed';
    return { id, stage, title, outcome, status: completed ? 'completed' : prior?.status === 'in-progress' ? 'in-progress' : 'not-started', completedAt: completed && typeof prior?.completedAt === 'string' ? prior.completedAt : null };
  });
  return { id: ROADMAP_ID, milestones, createdAt: typeof input?.createdAt === 'string' ? input.createdAt : now, updatedAt: typeof input?.updatedAt === 'string' ? input.updatedAt : now };
}
const KPI_DIRECTIONS = new Set(['higher', 'lower', 'within-range']);
const KPI_FREQUENCIES = new Set(['daily', 'weekly', 'monthly', 'quarterly']);
const numeric = value => value === null || value === undefined || String(value).trim() === '' ? null : Number.isFinite(Number(value)) ? Number(value) : null;
const range = value => ({ min: numeric(value?.min), max: numeric(value?.max) });
export function createKpiRecord(input, { id = createId(), now = nowIso() } = {}) {
  const name = String(input?.name ?? '').trim();
  const direction = String(input?.direction ?? '').trim();
  if (!name) throw new TypeError('A KPI name is required.');
  if (!KPI_DIRECTIONS.has(direction)) throw new TypeError('A supported KPI direction is required.');
  const frequency = KPI_FREQUENCIES.has(input?.frequency) ? input.frequency : 'monthly';
  const record = { id, name, purpose: String(input?.purpose ?? '').trim(), ownerRole: String(input?.ownerRole ?? '').trim(), formula: String(input?.formula ?? '').trim(), unit: String(input?.unit ?? '').trim(), frequency, direction, target: range(input?.target), warning: range(input?.warning), offTrack: range(input?.offTrack), linkedTaskIds: [...new Set((Array.isArray(input?.linkedTaskIds) ? input.linkedTaskIds : []).filter(value => typeof value === 'string' && value))], createdAt: input?.createdAt ?? now, updatedAt: input?.updatedAt ?? now };
  if (!record.purpose || !record.ownerRole || !record.formula || !record.unit) throw new TypeError('KPI purpose, owner role, formula or data source, and unit are required.');
  return record;
}
export function createKpiEntryRecord(input, { id = createId(), now = nowIso() } = {}) {
  const kpiId = String(input?.kpiId ?? '').trim(); const periodKey = String(input?.periodKey ?? '').trim(); const actual = numeric(input?.actual);
  if (!kpiId || !/^\d{4}-(?:\d{2}|Q[1-4]|W\d{2}|\d{2}-\d{2})$/.test(periodKey) || actual === null) throw new TypeError('A KPI entry requires a KPI, valid reporting period, and numeric actual.');
  return { id, kpiId, periodKey, actual, notes: String(input?.notes ?? '').trim(), history: Array.isArray(input?.history) ? [...input.history] : [{ id: createId(), type: 'reported', timestamp: now, actual }], createdAt: input?.createdAt ?? now, updatedAt: input?.updatedAt ?? now };
}
export function isMetadataRecord(value) { return Boolean(value) && typeof value === 'object' && value.schemaVersion === SCHEMA_VERSION && typeof value.initializedAt === 'string' && typeof value.updatedAt === 'string'; }
export function isTaskRecord(value) { return Boolean(value) && typeof value === 'object' && typeof value.id === 'string' && value.id.length > 0 && typeof value.title === 'string' && value.title.trim().length > 0 && typeof value.createdAt === 'string' && typeof value.updatedAt === 'string'; }
export function isEndOfDayRecord(value) { return Boolean(value) && typeof value === 'object' && typeof value.id === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.date) && Array.isArray(value.taskIds) && typeof value.createdAt === 'string' && typeof value.updatedAt === 'string'; }
export function isMorningHuddleRecord(value) { return Boolean(value) && typeof value === 'object' && typeof value.id === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.workDate) && Array.isArray(value.carryoverTaskIds) && Array.isArray(value.top3TaskIds) && Array.isArray(value.commitmentTaskIds) && typeof value.createdAt === 'string' && typeof value.updatedAt === 'string'; }
export function isRoadmapRecord(value) { return Boolean(value) && value.id === ROADMAP_ID && Array.isArray(value.milestones) && value.milestones.length === ROADMAP_MILESTONES.length && value.milestones.every((milestone, index) => { const [id, stage, title, outcome] = ROADMAP_MILESTONES[index]; return milestone?.id === id && milestone.stage === stage && milestone.title === title && milestone.outcome === outcome && ['not-started', 'in-progress', 'completed'].includes(milestone.status) && (milestone.status !== 'completed' || typeof milestone.completedAt === 'string'); }) && typeof value.createdAt === 'string' && typeof value.updatedAt === 'string'; }
export function isKpiRecord(value) { try { const record = createKpiRecord(value, { id: value.id, now: value.createdAt }); const ranges = [record.target, record.warning, record.offTrack]; const validRanges = ranges.every(item => Number.isFinite(item.min) && Number.isFinite(item.max) && item.min <= item.max); const nested = record.direction === 'higher' ? record.target.max >= record.warning.max && record.warning.max >= record.offTrack.max : record.direction === 'lower' ? record.target.min <= record.warning.min && record.warning.min <= record.offTrack.min : record.offTrack.min <= record.warning.min && record.warning.min <= record.target.min && record.target.max <= record.warning.max && record.warning.max <= record.offTrack.max; return Boolean(value) && typeof value.id === 'string' && record.createdAt === value.createdAt && typeof value.updatedAt === 'string' && validRanges && nested; } catch { return false; } }
export function isKpiEntryRecord(value) { try { return Boolean(value) && typeof value.id === 'string' && createKpiEntryRecord(value, { id: value.id, now: value.createdAt }).createdAt === value.createdAt && typeof value.updatedAt === 'string'; } catch { return false; } }
export function isSupportedExport(value) { const legacy = value?.exportVersion === 1 || value?.exportVersion === 2; const current = value?.exportVersion === EXPORT_VERSION; return Boolean(value) && typeof value === 'object' && value.format === EXPORT_FORMAT && (current || value?.exportVersion === 4 || value?.exportVersion === 3 || legacy) && typeof value.exportedAt === 'string' && value.data && typeof value.data === 'object' && Array.isArray(value.data.tasks) && Array.isArray(value.data.settings) && (!legacy ? Array.isArray(value.data.endOfDay) && Array.isArray(value.data.morningHuddles) && value.data.endOfDay.every(isEndOfDayRecord) && value.data.morningHuddles.every(isMorningHuddleRecord) : true) && (!current || (Array.isArray(value.data.roadmap) && value.data.roadmap.every(isRoadmapRecord) && Array.isArray(value.data.kpis) && Array.isArray(value.data.kpiEntries) && value.data.kpis.every(isKpiRecord) && value.data.kpiEntries.every(isKpiEntryRecord))) && value.data.tasks.every(isTaskRecord); }
