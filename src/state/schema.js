export const SCHEMA_VERSION = 3;
export const EXPORT_VERSION = 1;
export const EXPORT_FORMAT = 'TalentisOS';
export const STORE_NAMES = Object.freeze({ metadata: 'metadata', tasks: 'tasks', settings: 'settings' });

export function nowIso(now = new Date()) { return now.toISOString(); }
export function createId(randomUUID = globalThis.crypto?.randomUUID?.bind(globalThis.crypto)) {
  return randomUUID ? randomUUID() : `talentisos-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
export function createMetadataRecord(now = nowIso()) { return { schemaVersion: SCHEMA_VERSION, initializedAt: now, updatedAt: now }; }
export function createTaskRecord(input, { id = createId(), now = nowIso() } = {}) {
  const title = String(input?.title ?? '').trim();
  if (!title) throw new TypeError('A task title is required.');
  return { id, title, notes: String(input?.notes ?? ''), status: input?.status ?? 'open', priority: input?.priority ?? 'normal', urgent: Boolean(input?.urgent), flagged: Boolean(input?.flagged), tags: Array.isArray(input?.tags) ? [...input.tags] : [], category: input?.category ?? null, dueDate: input?.dueDate ?? null, dueTime: input?.dueTime ?? null, subtasks: Array.isArray(input?.subtasks) ? [...input.subtasks] : [], references: Array.isArray(input?.references) ? [...input.references] : [], history: Array.isArray(input?.history) ? [...input.history] : [], blocked: Boolean(input?.blocked), blockedReason: input?.blockedReason ?? null, waiting: Boolean(input?.waiting), waitingFor: input?.waitingFor ?? null, someday: Boolean(input?.someday), carryCount: Number(input?.carryCount ?? 0), createdAt: now, updatedAt: now, completedAt: null };
}
export function isMetadataRecord(value) { return Boolean(value) && typeof value === 'object' && value.schemaVersion === SCHEMA_VERSION && typeof value.initializedAt === 'string' && typeof value.updatedAt === 'string'; }
export function isTaskRecord(value) { return Boolean(value) && typeof value === 'object' && typeof value.id === 'string' && value.id.length > 0 && typeof value.title === 'string' && value.title.trim().length > 0 && typeof value.createdAt === 'string' && typeof value.updatedAt === 'string'; }
export function isSupportedExport(value) { return Boolean(value) && typeof value === 'object' && value.format === EXPORT_FORMAT && value.exportVersion === EXPORT_VERSION && typeof value.exportedAt === 'string' && value.data && typeof value.data === 'object' && Array.isArray(value.data.tasks) && Array.isArray(value.data.settings) && value.data.tasks.every(isTaskRecord); }
