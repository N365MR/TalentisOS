import { validateTask } from './task.js'
import { validateEod } from './eod.js'
import { validateHuddle } from './huddle.js'
import { validateAttentionImport } from './attention.js'
import { validateOrientation, validateWorkdays } from './orientation.js'
import { validateConversation, validateHowILead, validateWeeklyReview } from './conversation.js'
import { validateTimezone } from './workday.js'

export const BACKUP_FORMAT_VERSION = 1
export const BACKUP_SCHEMA_VERSION = 9
export const BACKUP_STORES = ['settings', 'drafts', 'tasks', 'eods', 'huddles', 'risks', 'decisions', 'handovers', 'orientation', 'conversations', 'weeklyReviews', 'howILead']

const recordTypes = { settings: 'settings', drafts: 'draft', tasks: 'task', eods: 'eod', huddles: 'huddle', risks: 'risk', decisions: 'decision', handovers: 'handover', orientation: 'orientation', conversations: 'conversation', weeklyReviews: 'weekly-review', howILead: 'how-i-lead' }
const validator = { tasks: validateTask, eods: validateEod, huddles: validateHuddle, risks: validateAttentionImport, decisions: validateAttentionImport, handovers: validateAttentionImport, orientation: validateOrientation, conversations: validateConversation, weeklyReviews: validateWeeklyReview, howILead: validateHowILead }
const requiredRecordKeys = {
  tasks: ['id', 'recordType', 'lifecycleStatus', 'title', 'notes', 'status', 'priority', 'dueDate', 'dueTime', 'urgent', 'flagged', 'category', 'tags', 'subtasks', 'stateContext', 'createdAt', 'updatedAt', 'completedAt', 'carryHistory', 'image', 'archivedAt', 'typedLinks'],
  eods: ['id', 'recordType', 'lifecycleStatus', 'workday', 'status', 'taskIds', 'top3TaskIds', 'lessons', 'recognition', 'createdAt', 'updatedAt', 'completedAt'],
  huddles: ['id', 'recordType', 'lifecycleStatus', 'workday', 'status', 'sourceEodId', 'taskIds', 'top3TaskIds', 'commitmentTaskIds', 'recognition', 'createdAt', 'updatedAt', 'completedAt'],
  risks: ['id', 'recordType', 'lifecycleStatus', 'title', 'context', 'ownerRole', 'nextAction', 'waitingOn', 'reviewDate', 'createdAt', 'updatedAt', 'severity', 'status', 'mitigationTaskId', 'resolutionNote', 'resolvedAt', 'archivedAt'],
  decisions: ['id', 'recordType', 'lifecycleStatus', 'title', 'context', 'ownerRole', 'nextAction', 'waitingOn', 'reviewDate', 'createdAt', 'updatedAt', 'options', 'status', 'followUpTaskIds', 'revisionHistory', 'revisionCount', 'archivedAt'],
  handovers: ['id', 'recordType', 'lifecycleStatus', 'title', 'context', 'ownerRole', 'nextAction', 'waitingOn', 'reviewDate', 'createdAt', 'updatedAt', 'recipientRole', 'status', 'linkedTaskIds', 'acknowledgedAt', 'archivedAt'],
  orientation: ['id', 'recordType', 'lifecycleStatus', 'responsibility', 'usualWorkdays', 'weeklyOutcome', 'tomorrowAttention', 'guidanceStatus', 'observations', 'roadmapStage', 'roadmapNextAction', 'completed', 'createdAt', 'updatedAt'],
  conversations: ['id', 'recordType', 'lifecycleStatus', 'flow', 'fields', 'followUpTaskId', 'createdAt', 'updatedAt'],
  weeklyReviews: ['id', 'recordType', 'lifecycleStatus', 'reviewDate', 'fields', 'managerUp', 'nextWeekTaskId', 'createdAt', 'updatedAt'],
  howILead: ['id', 'recordType', 'lifecycleStatus', 'values', 'communicationStandards', 'nonNegotiables', 'practicesToImprove', 'createdAt', 'updatedAt'],
}
const ids = (value) => Array.isArray(value) ? value : []
const timestamp = (value, label) => { if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) throw new Error(`${label} needs a valid ISO timestamp.`) }
const requireKeys = (record, keys, label) => { if (!record || typeof record !== 'object' || Array.isArray(record)) throw new Error(`${label} must be an object.`); for (const key of keys) if (!Object.hasOwn(record, key)) throw new Error(`${label} is missing ${key}.`) }
const assertRecordIdentity = (record, type, store) => { if (typeof record.id !== 'string' || !record.id.trim()) throw new Error(`${store} records need a stable ID.`); if (record.recordType !== type) throw new Error(`${store} contains an invalid record type.`); timestamp(record.createdAt, `${store} ${record.id}`); timestamp(record.updatedAt, `${store} ${record.id}`) }

function validateSettings(record) {
  requireKeys(record, ['id', 'recordType', 'lifecycleStatus', 'leadershipWorkdayTimezone', 'createdAt', 'updatedAt'], 'settings record')
  assertRecordIdentity(record, 'settings', 'settings')
  if (record.id !== 'workspace' || record.lifecycleStatus !== 'active') throw new Error('The settings record is invalid.')
  validateTimezone(record.leadershipWorkdayTimezone)
  if (record.lastSuccessfulExportAt != null) timestamp(record.lastSuccessfulExportAt, 'settings backup health')
  return { ...record }
}

function validateDraft(record) {
  requireKeys(record, ['id', 'recordType', 'lifecycleStatus', 'route', 'content', 'createdAt', 'updatedAt'], 'draft record')
  assertRecordIdentity(record, 'draft', 'drafts')
  if (record.lifecycleStatus !== 'active' || typeof record.route !== 'string' || typeof record.content !== 'string') throw new Error(`Draft ${record.id} is malformed.`)
  return { ...record }
}

function validateStoreRecord(store, record) {
  if (store === 'settings') return validateSettings(record)
  if (store === 'drafts') return validateDraft(record)
  requireKeys(record, requiredRecordKeys[store], `${store} record`)
  const type = recordTypes[store]
  assertRecordIdentity(record, type, store)
  const validated = validator[store](record, { existing: record, now: record.updatedAt })
  if (validated.id !== record.id || validated.recordType !== record.recordType) throw new Error(`${store} record identity is invalid.`)
  return record
}

function assertKnown(reference, set, label) { if (reference && !set.has(reference)) throw new Error(`${label} refers to an unknown record (${reference}).`) }

function validateRelationships(stores) {
  const tasks = new Set(stores.tasks.map((record) => record.id))
  const recordsByType = new Map()
  for (const store of BACKUP_STORES) for (const record of stores[store]) recordsByType.set(`${record.recordType}:${record.id}`, true)
  for (const record of stores.tasks) for (const link of record.typedLinks) if (!recordsByType.has(`${link.recordType}:${link.recordId}`)) throw new Error(`Task ${record.id} has an unknown typed relationship.`)
  for (const record of stores.eods) for (const taskId of [...record.taskIds, ...record.top3TaskIds]) assertKnown(taskId, tasks, `End of Day ${record.id}`)
  const eods = new Set(stores.eods.map((record) => record.id))
  for (const record of stores.huddles) { assertKnown(record.sourceEodId, eods, `Morning Huddle ${record.id}`); for (const taskId of [...record.taskIds, ...record.top3TaskIds, ...record.commitmentTaskIds]) assertKnown(taskId, tasks, `Morning Huddle ${record.id}`) }
  for (const record of stores.risks) assertKnown(record.mitigationTaskId, tasks, `Risk ${record.id}`)
  for (const record of stores.decisions) for (const taskId of record.followUpTaskIds) assertKnown(taskId, tasks, `Decision ${record.id}`)
  for (const record of stores.handovers) for (const taskId of record.linkedTaskIds) assertKnown(taskId, tasks, `Handover ${record.id}`)
  for (const record of stores.conversations) assertKnown(record.followUpTaskId, tasks, `Conversation ${record.id}`)
  for (const record of stores.weeklyReviews) assertKnown(record.nextWeekTaskId, tasks, `Weekly Review ${record.id}`)
}

export function createBackupEnvelope(stores, exportedAt = new Date().toISOString()) {
  timestamp(exportedAt, 'Export')
  const copy = Object.fromEntries(BACKUP_STORES.map((store) => [store, structuredClone(stores[store] || [])]))
  validateBackupEnvelope({ format: 'talentisos-backup', formatVersion: BACKUP_FORMAT_VERSION, schemaVersion: BACKUP_SCHEMA_VERSION, exportedAt, stores: copy })
  return { format: 'talentisos-backup', formatVersion: BACKUP_FORMAT_VERSION, schemaVersion: BACKUP_SCHEMA_VERSION, exportedAt, stores: copy }
}

export function validateBackupEnvelope(envelope) {
  requireKeys(envelope, ['format', 'formatVersion', 'schemaVersion', 'exportedAt', 'stores'], 'backup envelope')
  if (envelope.format !== 'talentisos-backup' || envelope.formatVersion !== BACKUP_FORMAT_VERSION) throw new Error('This is not a supported TalentisOS backup file.')
  if (envelope.schemaVersion !== BACKUP_SCHEMA_VERSION) throw new Error(`This backup uses schema v${envelope.schemaVersion}; this version supports v${BACKUP_SCHEMA_VERSION} only.`)
  timestamp(envelope.exportedAt, 'Backup export')
  if (!envelope.stores || typeof envelope.stores !== 'object' || Array.isArray(envelope.stores)) throw new Error('The backup stores are malformed.')
  const keys = Object.keys(envelope.stores)
  if (keys.length !== BACKUP_STORES.length || BACKUP_STORES.some((store) => !Object.hasOwn(envelope.stores, store)) || keys.some((store) => !BACKUP_STORES.includes(store))) throw new Error('The backup must include exactly the required stores.')
  const stores = {}
  for (const store of BACKUP_STORES) {
    if (!Array.isArray(envelope.stores[store])) throw new Error(`${store} must be a list.`)
    const seen = new Set(); stores[store] = envelope.stores[store].map((record) => { const checked = validateStoreRecord(store, record); if (seen.has(checked.id)) throw new Error(`${store} contains duplicate ID ${checked.id}.`); seen.add(checked.id); return checked })
  }
  if (stores.settings.length !== 1 || stores.settings[0].id !== 'workspace' || stores.orientation.length > 1 || stores.howILead.length > 1) throw new Error('The backup has an invalid singleton store.')
  validateRelationships(stores)
  return { ...envelope, stores }
}

export function parseBackupText(text) {
  if (typeof text !== 'string') throw new Error('Choose a JSON backup file.')
  try { return validateBackupEnvelope(JSON.parse(text)) } catch (error) { throw new Error(`Import was not started: ${error.message}`) }
}

export function backupSummary(envelope) {
  const counts = Object.fromEntries(BACKUP_STORES.map((store) => [store, envelope.stores[store].length]))
  return { exportedAt: envelope.exportedAt, counts, totalRecords: Object.values(counts).reduce((total, count) => total + count, 0) }
}

export function backupHealth(lastSuccessfulExportAt, now = new Date()) {
  if (!lastSuccessfulExportAt) return { state: 'no-export', message: 'No backup exported yet. Export a readable JSON backup after meaningful work.' }
  const ageDays = Math.floor((now.getTime() - new Date(lastSuccessfulExportAt).getTime()) / 86400000)
  return ageDays >= 30 ? { state: 'stale', ageDays, message: `Your last backup is ${ageDays} days old. Export a fresh backup now.` } : { state: 'current', ageDays, message: `Last successful export: ${new Date(lastSuccessfulExportAt).toLocaleString()}.` }
}

export { validateWorkdays }
