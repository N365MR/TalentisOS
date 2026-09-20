import { createStableId, isDateOnly } from './workday.js'

export const TASK_STATUSES = ['open', 'blocked', 'waiting', 'completed']
export const TASK_PRIORITIES = ['none', 'low', 'medium', 'high']
export const TASK_VIEWS = ['inbox', 'today', 'upcoming', 'anytime', 'someday', 'flagged', 'urgent', 'completed']
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const IMAGE_LIMIT_BYTES = 2 * 1024 * 1024

const text = (value, fallback = '') => typeof value === 'string' ? value.trim() : fallback
const arrayOfText = (value) => Array.isArray(value) ? [...new Set(value.map((item) => text(item)).filter(Boolean))] : []

function validateImage(image) {
  if (image == null) return null
  if (!IMAGE_TYPES.includes(image.type) || !Number.isInteger(image.size) || image.size < 0 || image.size > IMAGE_LIMIT_BYTES || !text(image.name)) throw new Error('Images must be JPEG, PNG or WebP and no larger than 2 MB.')
  return { name: text(image.name), type: image.type, size: image.size, localKey: text(image.localKey) || null }
}

function validateSubtasks(subtasks) {
  if (!Array.isArray(subtasks)) throw new Error('Subtasks must be a list.')
  return subtasks.map((subtask) => {
    const title = text(subtask?.title)
    if (!title) throw new Error('Each subtask needs a title.')
    return { id: text(subtask.id) || createStableId('subtask'), title, completed: Boolean(subtask.completed) }
  })
}

function validateLinks(links) {
  if (!Array.isArray(links)) throw new Error('Typed links must be a list.')
  const seen = new Set()
  return links.map((link) => {
    const recordType = text(link?.recordType)
    const recordId = text(link?.recordId)
    const relationship = text(link?.relationship)
    if (!recordType || !recordId || !relationship) throw new Error('Each typed link needs a record type, record ID and relationship.')
    const key = `${recordType}:${recordId}:${relationship}`
    if (seen.has(key)) throw new Error('Duplicate typed links are not allowed.')
    seen.add(key)
    return { recordType, recordId, relationship }
  })
}

export function subtaskProgress(task) {
  const total = task.subtasks.length
  return { completed: task.subtasks.filter((subtask) => subtask.completed).length, total }
}

export function validateTask(input, { existing = null, now = new Date().toISOString() } = {}) {
  const title = text(input.title)
  if (!title) throw new Error('A task title is required.')
  if (title.length > 240) throw new Error('A task title must be 240 characters or fewer.')
  const status = text(input.status, 'open')
  if (!TASK_STATUSES.includes(status)) throw new Error('Choose a valid task status.')
  const priority = text(input.priority, 'none')
  if (!TASK_PRIORITIES.includes(priority)) throw new Error('Choose a valid priority.')
  const dueDate = input.dueDate || null
  if (!isDateOnly(dueDate)) throw new Error('Due date must use YYYY-MM-DD.')
  const dueTime = input.dueTime || null
  if (dueTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(dueTime)) throw new Error('Due time must use HH:MM.')
  const stateContext = text(input.stateContext)
  if ((status === 'blocked' || status === 'waiting') && !stateContext) throw new Error('Blocked or waiting tasks need context.')
  if ((status !== 'blocked' && status !== 'waiting') && stateContext) throw new Error('Context is only used for blocked or waiting tasks.')
  const completedAt = status === 'completed' ? (existing?.completedAt || now) : null
  const subtasks = validateSubtasks(input.subtasks || [])
  return {
    id: text(input.id) || existing?.id || createStableId('task'), recordType: 'task', lifecycleStatus: input.archivedAt ? 'archived' : (status === 'completed' ? 'completed' : 'active'),
    title, notes: text(input.notes), status, priority, dueDate, dueTime, urgent: Boolean(input.urgent), flagged: Boolean(input.flagged),
    category: text(input.category), tags: arrayOfText(input.tags), subtasks, stateContext, createdAt: existing?.createdAt || now, updatedAt: now,
    completedAt, carryHistory: Array.isArray(input.carryHistory) ? input.carryHistory : (existing?.carryHistory || []), image: validateImage(input.image),
    archivedAt: input.archivedAt || null, typedLinks: validateLinks(input.typedLinks || []),
  }
}

export function createQuickTask({ title, urgent = false, dueDate = null }, now) {
  return validateTask({ title, urgent, dueDate, status: 'open', priority: 'none', subtasks: [], typedLinks: [] }, { now })
}

export function archiveTask(task, now = new Date().toISOString()) { return validateTask({ ...task, archivedAt: now }, { existing: task, now }) }
export function restoreTask(task, now = new Date().toISOString()) { return validateTask({ ...task, archivedAt: null }, { existing: task, now }) }
