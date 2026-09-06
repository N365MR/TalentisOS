import { STORE_NAMES, createId, createKpiEntryRecord, createKpiRecord, nowIso } from './schema.js';
import { createRecord, getAllRecords, updateRecord } from './storage.js';
import { addTaskReference, createTask, listTasks } from './tasks.js';

export const KPI_STATUSES = Object.freeze({ ON_TRACK: 'on-track', AT_RISK: 'at-risk', OFF_TRACK: 'off-track', NOT_REPORTED: 'not-reported' });
export const KPI_TEMPLATES = Object.freeze([
  { name: 'Customer response time', purpose: 'Keep customer replies timely.', ownerRole: 'Customer operations', formula: 'Average elapsed hours from customer contact to first response.', unit: 'hours', frequency: 'weekly', direction: 'lower' },
  { name: 'On-time delivery / completion', purpose: 'Keep commitments dependable.', ownerRole: 'Operations', formula: 'Completed on or before promised date ÷ total due.', unit: '%', frequency: 'weekly', direction: 'higher' },
  { name: 'Rework / error rate', purpose: 'Reduce avoidable rework.', ownerRole: 'Operations', formula: 'Rework or errors ÷ completed work.', unit: '%', frequency: 'monthly', direction: 'lower' },
  { name: 'Customer issues resolved within target', purpose: 'Resolve customer issues predictably.', ownerRole: 'Customer operations', formula: 'Issues resolved in target time ÷ resolved issues.', unit: '%', frequency: 'monthly', direction: 'higher' },
  { name: 'Plan adherence', purpose: 'Keep the operating plan credible.', ownerRole: 'Operations', formula: 'Planned work completed as planned ÷ planned work.', unit: '%', frequency: 'monthly', direction: 'higher' }
]);

const number = value => value === null || value === undefined || String(value).trim() === '' ? null : Number.isFinite(Number(value)) ? Number(value) : null;
const bounds = value => ({ min: number(value?.min), max: number(value?.max) });
const within = (value, range) => value >= range.min && value <= range.max;
export function periodKeyFor(frequency, date = new Date()) {
  const d = typeof date === 'string' ? new Date(date.includes('T') ? date : `${date}T12:00:00Z`) : date;
  const year = d.getUTCFullYear(); const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  if (frequency === 'daily') return `${year}-${month}-${String(d.getUTCDate()).padStart(2, '0')}`;
  if (frequency === 'monthly') return `${year}-${month}`;
  if (frequency === 'quarterly') return `${year}-Q${Math.floor(d.getUTCMonth() / 3) + 1}`;
  const start = new Date(Date.UTC(year, 0, 1)); const day = Math.floor((d - start) / 86400000) + 1; const week = Math.ceil((day + start.getUTCDay()) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}
export function validateThresholds(kpi) {
  const { direction } = kpi || {}; const target = bounds(kpi?.target); const warning = bounds(kpi?.warning); const offTrack = bounds(kpi?.offTrack);
  if (!['higher', 'lower', 'within-range'].includes(direction)) return { valid: false, message: 'Choose how this KPI should move.' };
  if (direction === 'higher' && [target.max, warning.max, offTrack.max].every(Number.isFinite) && target.max >= warning.max && warning.max >= offTrack.max) return { valid: true };
  if (direction === 'lower' && [target.min, warning.min, offTrack.min].every(Number.isFinite) && target.min <= warning.min && warning.min <= offTrack.min) return { valid: true };
  if (direction === 'within-range' && [target, warning, offTrack].every(range => Number.isFinite(range.min) && Number.isFinite(range.max) && range.min <= range.max) && offTrack.min <= warning.min && warning.min <= target.min && target.max <= warning.max && warning.max <= offTrack.max) return { valid: true };
  return { valid: false, message: direction === 'within-range' ? 'Ranges must widen from target to warning to off track.' : 'Target, warning, and off-track thresholds must move outward in the right direction.' };
}
export function evaluateStatus(kpi, actual) {
  const value = number(actual); if (value === null) return KPI_STATUSES.NOT_REPORTED;
  const validation = validateThresholds(kpi); if (!validation.valid) return KPI_STATUSES.NOT_REPORTED;
  if (kpi.direction === 'higher') return value >= kpi.target.max ? KPI_STATUSES.ON_TRACK : value >= kpi.warning.max ? KPI_STATUSES.AT_RISK : KPI_STATUSES.OFF_TRACK;
  if (kpi.direction === 'lower') return value <= kpi.target.min ? KPI_STATUSES.ON_TRACK : value <= kpi.warning.min ? KPI_STATUSES.AT_RISK : KPI_STATUSES.OFF_TRACK;
  return within(value, kpi.target) ? KPI_STATUSES.ON_TRACK : within(value, kpi.warning) ? KPI_STATUSES.AT_RISK : KPI_STATUSES.OFF_TRACK;
}
export function evaluateTrend(entries = []) { const values = entries.slice().sort((a, b) => String(a.periodKey).localeCompare(String(b.periodKey))).map(entry => number(entry.actual)).filter(value => value !== null); if (values.length < 2) return 'insufficient'; const [previous, current] = values.slice(-2); return current === previous ? 'steady' : current > previous ? 'up' : 'down'; }
export function currentReportingState(kpi, entries, date = new Date()) { const periodKey = periodKeyFor(kpi.frequency, date); const entry = (entries || []).find(item => item.kpiId === kpi.id && item.periodKey === periodKey) || null; return { periodKey, entry, status: evaluateStatus(kpi, entry?.actual), trend: evaluateTrend(entries || []) }; }
export function correctiveActionEligibility(kpi, state, tasks = []) { const linked = (kpi.linkedTaskIds || []).map(id => tasks.find(task => task.id === id)).filter(Boolean); return { required: state.status === KPI_STATUSES.OFF_TRACK, linked, actioned: state.status !== KPI_STATUSES.OFF_TRACK || linked.some(task => task.status === 'open') };
}
export async function listKpis() { return (await getAllRecords(STORE_NAMES.kpis)).sort((a, b) => a.name.localeCompare(b.name)); }
export async function listKpiEntries(kpiId = null) { const records = await getAllRecords(STORE_NAMES.kpiEntries); return records.filter(entry => !kpiId || entry.kpiId === kpiId).sort((a, b) => String(b.periodKey).localeCompare(String(a.periodKey))); }
export async function createKpi(input) { const record = createKpiRecord(input); const validation = validateThresholds(record); if (!validation.valid) throw new TypeError(validation.message); await createRecord(STORE_NAMES.kpis, record); return record; }
export async function updateKpi(id, input) { const current = (await listKpis()).find(kpi => kpi.id === id); if (!current) throw new Error('KPI not found.'); const next = createKpiRecord({ ...current, ...input, id, createdAt: current.createdAt }, { id, now: current.createdAt }); const validation = validateThresholds(next); if (!validation.valid) throw new TypeError(validation.message); return updateRecord(STORE_NAMES.kpis, next); }
export async function saveKpiActual(kpiId, periodKey, actual, notes = '') { const existing = (await listKpiEntries(kpiId)).find(entry => entry.periodKey === periodKey); if (existing) { const value = number(actual); if (value === null) throw new TypeError('Enter a numeric actual.'); return updateRecord(STORE_NAMES.kpiEntries, { ...existing, actual: value, notes: String(notes).trim(), history: [...(existing.history || []), { id: createId(), type: 'corrected', timestamp: nowIso(), actual: value }] }); }
  const entry = createKpiEntryRecord({ kpiId, periodKey, actual, notes }); await createRecord(STORE_NAMES.kpiEntries, entry); return entry;
}
export async function linkKpiTask(kpiId, taskId) { const [kpi, tasks] = await Promise.all([(await listKpis()).find(item => item.id === kpiId), listTasks()]); if (!kpi || !tasks.some(task => task.id === taskId && task.status === 'open')) throw new TypeError('Choose an existing open canonical task.'); await addTaskReference(taskId, { type: 'kpi', sourceId: kpiId }); return updateKpi(kpiId, { linkedTaskIds: [...new Set([...kpi.linkedTaskIds, taskId])] }); }
export async function createKpiCorrectiveTask(kpiId, title) { const kpi = (await listKpis()).find(item => item.id === kpiId); if (!kpi) throw new Error('KPI not found.'); const task = await createTask({ title: String(title || `Correct ${kpi.name}`).trim(), priority: 'high', category: 'KPI corrective action' }); await linkKpiTask(kpiId, task.id); return task; }
export async function scorecardSnapshot(date = new Date()) { const [kpis, entries, tasks] = await Promise.all([listKpis(), listKpiEntries(), listTasks()]); return kpis.map(kpi => { const history = entries.filter(entry => entry.kpiId === kpi.id); const state = currentReportingState(kpi, history, date); return { kpi, entries: history, ...state, corrective: correctiveActionEligibility(kpi, state, tasks) }; }); }
