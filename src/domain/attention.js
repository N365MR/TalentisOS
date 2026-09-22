import { createStableId, isDateOnly } from './workday.js'

const text = (value, fallback = '') => typeof value === 'string' ? value.trim() : fallback
const taskIds = (value) => Array.isArray(value) ? [...new Set(value.filter((id) => typeof id === 'string' && id.trim()).map((id) => id.trim()))] : []
const date = (value) => value || null
function shared(input, existing, now) {
  const title = text(input.title ?? existing?.title)
  const context = text(input.context ?? existing?.context)
  const ownerRole = text(input.ownerRole ?? existing?.ownerRole)
  const nextAction = text(input.nextAction ?? existing?.nextAction)
  const waitingOn = text(input.waitingOn ?? existing?.waitingOn)
  const reviewDate = date(input.reviewDate ?? existing?.reviewDate)
  if (!title || !context || !ownerRole || !nextAction || !waitingOn || !reviewDate || !isDateOnly(reviewDate)) throw new Error('Title, context, owner role, next action, waiting on and a valid review date are required.')
  return { title, context, ownerRole, nextAction, waitingOn, reviewDate, createdAt: existing?.createdAt || now, updatedAt: now }
}

export function createRisk(input, now = new Date().toISOString()) { return validateRisk(input, { now }) }
export function validateRisk(input, { existing = null, now = new Date().toISOString() } = {}) {
  const base = shared(input, existing, now); const severity = text(input.severity ?? existing?.severity, 'medium'); const status = text(input.status ?? existing?.status, 'open')
  if (!['low', 'medium', 'high', 'critical'].includes(severity)) throw new Error('Choose a valid risk attention level.')
  if (!['open', 'monitoring', 'resolved', 'archived'].includes(status)) throw new Error('Choose a valid risk status.')
  const mitigationTaskId = text(Object.hasOwn(input, 'mitigationTaskId') ? input.mitigationTaskId : existing?.mitigationTaskId) || null; const resolutionNote = text(input.resolutionNote ?? existing?.resolutionNote)
  if (status === 'resolved' && !resolutionNote) throw new Error('A resolution note is required before closing a risk.')
  return { id: existing?.id || text(input.id) || createStableId('risk'), recordType: 'risk', lifecycleStatus: status === 'archived' ? 'archived' : 'active', ...base, severity, status, mitigationTaskId, resolutionNote, resolvedAt: status === 'resolved' ? (existing?.resolvedAt || now) : null, archivedAt: status === 'archived' ? (existing?.archivedAt || now) : null }
}

export function createDecision(input, now = new Date().toISOString()) { return validateDecision(input, { now }) }
export function validateDecision(input, { existing = null, now = new Date().toISOString() } = {}) {
  const base = shared(input, existing, now); const options = text(input.options ?? existing?.options); const status = text(input.status ?? existing?.status, 'open')
  if (!options) throw new Error('Decision options are required.')
  if (!['open', 'decided', 'deferred', 'archived'].includes(status)) throw new Error('Choose a valid decision status.')
  const followUpTaskIds = taskIds(input.followUpTaskIds ?? existing?.followUpTaskIds); const revisionHistory = Array.isArray(existing?.revisionHistory) ? existing.revisionHistory : []
  const changed = existing && ['title', 'context', 'options', 'status', 'ownerRole', 'nextAction', 'waitingOn', 'reviewDate', 'followUpTaskIds'].some((key) => JSON.stringify(input[key] ?? existing[key]) !== JSON.stringify(existing[key]))
  const history = changed ? [...revisionHistory, { id: createStableId('decision-revision'), revisedAt: now, from: { title: existing.title, context: existing.context, options: existing.options, status: existing.status, followUpTaskIds: existing.followUpTaskIds } }] : revisionHistory
  return { id: existing?.id || text(input.id) || createStableId('decision'), recordType: 'decision', lifecycleStatus: status === 'archived' ? 'archived' : 'active', ...base, options, status, followUpTaskIds, revisionHistory: history, revisionCount: history.length, archivedAt: status === 'archived' ? (existing?.archivedAt || now) : null }
}

export function createHandover(input, now = new Date().toISOString()) { return validateHandover(input, { now }) }
export function validateHandover(input, { existing = null, now = new Date().toISOString() } = {}) {
  const base = shared(input, existing, now); const recipientRole = text(input.recipientRole ?? existing?.recipientRole); const status = text(input.status ?? existing?.status, 'draft'); const linkedTaskIds = taskIds(input.linkedTaskIds ?? existing?.linkedTaskIds)
  if (!recipientRole) throw new Error('A recipient role is required.')
  if (!['draft', 'ready', 'acknowledged', 'archived'].includes(status)) throw new Error('Choose a valid handover status.')
  const allowed = { draft: ['draft', 'ready'], ready: ['ready', 'acknowledged'], acknowledged: ['acknowledged', 'archived'], archived: ['archived'] }
  if (existing && !allowed[existing.status].includes(status)) throw new Error(`A handover cannot move from ${existing.status} to ${status}.`)
  const acknowledgedAt = status === 'acknowledged' || status === 'archived' ? (existing?.acknowledgedAt || now) : null
  if (status === 'archived' && !acknowledgedAt) throw new Error('A handover must be acknowledged before archive.')
  return { id: existing?.id || text(input.id) || createStableId('handover'), recordType: 'handover', lifecycleStatus: status === 'archived' ? 'archived' : 'active', ...base, recipientRole, status, linkedTaskIds, acknowledgedAt, archivedAt: status === 'archived' ? (existing?.archivedAt || now) : null }
}

export function replaceTaskId(ids, oldId, replacementId = null) { return [...new Set(ids.flatMap((id) => id === oldId ? (replacementId ? [replacementId] : []) : [id]))] }
export function validateAttentionImport(record) {
  if (!record || !['risk', 'decision', 'handover'].includes(record.recordType)) throw new Error('Unsupported Needs attention record type.')
  return record.recordType === 'risk' ? validateRisk(record, { existing: record }) : record.recordType === 'decision' ? validateDecision(record, { existing: record }) : validateHandover(record, { existing: record })
}
