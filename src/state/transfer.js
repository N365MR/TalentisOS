import { EXPORT_FORMAT, EXPORT_VERSION, STORE_NAMES, createMetadataRecord, createRoadmapRecord, isConversationRecord, isEndOfDayRecord, isKpiEntryRecord, isKpiRecord, isMetadataRecord, isMorningHuddleRecord, isRoadmapRecord, isSupportedExport, isTaskRecord, nowIso } from './schema.js';
import { getAllRecords, replaceStoreRecords } from './storage.js';

const DATA_STORES = Object.values(STORE_NAMES);
const EMPTY = Object.freeze({ metadata: [], tasks: [], endOfDay: [], morningHuddles: [], roadmap: [], settings: [], kpis: [], kpiEntries: [], conversations: [] });
export async function createExportEnvelope() { const entries = await Promise.all(DATA_STORES.map(async store => [store, await getAllRecords(store)])); return { format: EXPORT_FORMAT, exportVersion: EXPORT_VERSION, exportedAt: nowIso(), data: Object.fromEntries(entries) }; }
export function backupFilename(exportedAt = nowIso()) { return `talentisos-backup-${exportedAt.replace(/[-:]/g, '').replace(/\.\d{3}Z$/, '').replace('T', '-')}.json`; }
export function parseImport(text) { let value; try { value = JSON.parse(text); } catch { throw new TypeError('That file is not valid JSON.'); } return validateImport(value); }
export function validateImport(envelope) {
  if (!isSupportedExport(envelope)) throw new TypeError('This file is not a supported TalentisOS backup.');
  const source = envelope.data;
  const data = { ...EMPTY, ...source, metadata: source.metadata || [createMetadataRecord(envelope.exportedAt)], roadmap: source.roadmap || [createRoadmapRecord({}, { now: envelope.exportedAt })], kpis: source.kpis || [], kpiEntries: source.kpiEntries || [], conversations: source.conversations || [] };
  if (envelope.exportVersion >= 3 && (!Array.isArray(data.endOfDay) || !Array.isArray(data.morningHuddles))) throw new TypeError('This backup is missing daily-rhythm records.');
  if (!DATA_STORES.every(store => Array.isArray(data[store]))) throw new TypeError('This backup has an invalid data structure.');
  if (!data.metadata.every(isMetadataRecord) || data.metadata.length !== 1 || !data.tasks.every(isTaskRecord) || !data.endOfDay.every(isEndOfDayRecord) || !data.morningHuddles.every(isMorningHuddleRecord) || !data.roadmap.every(isRoadmapRecord) || data.roadmap.length !== 1 || !data.kpis.every(isKpiRecord) || !data.kpiEntries.every(isKpiEntryRecord) || !data.conversations.every(isConversationRecord)) throw new TypeError('This backup contains invalid record data.');
  const unique = (records, label) => { const ids = records.map(record => record.id ?? record.key); if (new Set(ids).size !== ids.length) throw new TypeError(`This backup contains duplicate ${label} records.`); };
  DATA_STORES.forEach(store => unique(data[store], store));
  const taskIds = new Set(data.tasks.map(task => task.id)); const kpiIds = new Set(data.kpis.map(kpi => kpi.id));
  const referencesExist = (ids, label) => { if (!ids.every(id => taskIds.has(id))) throw new TypeError(`This backup has a broken ${label} task reference.`); };
  data.endOfDay.forEach(record => referencesExist([...(record.taskIds || []), ...(record.outstandingTaskIds || []), ...(record.top3TaskIds || [])], 'End of Day'));
  data.morningHuddles.forEach(record => referencesExist([...(record.carryoverTaskIds || []), ...(record.top3TaskIds || []), ...(record.commitmentTaskIds || [])], 'Morning Huddle'));
  data.kpis.forEach(record => referencesExist(record.linkedTaskIds || [], 'KPI'));
  data.conversations.forEach(record => referencesExist(record.linkedTaskIds || [], 'conversation'));
  if (!data.kpiEntries.every(entry => kpiIds.has(entry.kpiId))) throw new TypeError('This backup has a KPI entry without its KPI definition.');
  return { format: EXPORT_FORMAT, exportVersion: envelope.exportVersion, exportedAt: envelope.exportedAt, data };
}
export function importSummary(envelope) { const data = envelope.data; return { exportedAt: envelope.exportedAt, exportVersion: envelope.exportVersion, counts: { tasks: data.tasks.length, endOfDay: data.endOfDay.length, morningHuddles: data.morningHuddles.length, roadmap: data.roadmap.length, kpis: data.kpis.length, kpiEntries: data.kpiEntries.length, conversations: data.conversations.length, settings: data.settings.length } }; }
// Called only after validation and explicit confirmation. One multi-store transaction replaces all local data.
export async function importEnvelope(envelope) { const valid = validateImport(envelope); await replaceStoreRecords(valid.data); return valid; }
