import { createStableId, isDateOnly } from './workday.js'

const text = (value, fallback = '') => typeof value === 'string' ? value.trim() : fallback
const ids = (value) => Array.isArray(value) ? [...new Set(value.filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim()))] : []

export function createEod(workday, now = new Date().toISOString()) {
  if (!isDateOnly(workday) || !workday) throw new Error('An End of Day record needs a valid workday.')
  return {
    id: `eod_${workday}`, recordType: 'eod', lifecycleStatus: 'active', workday,
    status: 'in-progress', taskIds: [], top3TaskIds: [], lessons: '', recognition: '',
    createdAt: now, updatedAt: now, completedAt: null,
  }
}

export function validateEod(input, { existing = null, now = new Date().toISOString() } = {}) {
  const workday = text(input.workday) || existing?.workday
  if (!isDateOnly(workday) || !workday) throw new Error('An End of Day record needs a valid workday.')
  const taskIds = ids(input.taskIds ?? existing?.taskIds)
  const top3TaskIds = ids(input.top3TaskIds ?? existing?.top3TaskIds)
  if (top3TaskIds.length > 3) throw new Error("Tomorrow's Top 3 can contain at most three tasks.")
  if (top3TaskIds.some((id) => !taskIds.includes(id))) throw new Error("Tomorrow's Top 3 must reference reviewed tasks.")
  const status = input.status || existing?.status || 'in-progress'
  if (!['in-progress', 'completed'].includes(status)) throw new Error('Choose a valid End of Day status.')
  const lessons = text(input.lessons ?? existing?.lessons)
  const recognition = text(input.recognition ?? existing?.recognition)
  if (lessons.length > 1000 || recognition.length > 1000) throw new Error('Keep recognition and lessons to 1,000 characters or fewer.')
  return {
    id: existing?.id || text(input.id) || `eod_${workday}`, recordType: 'eod', lifecycleStatus: 'active', workday, status,
    taskIds, top3TaskIds, lessons, recognition, createdAt: existing?.createdAt || now, updatedAt: now,
    completedAt: status === 'completed' ? (existing?.completedAt || now) : null,
  }
}

export function addEodTaskIds(eod, taskIds, now = new Date().toISOString()) {
  return validateEod({ ...eod, taskIds: [...eod.taskIds, ...taskIds] }, { existing: eod, now })
}

export function carryTask(task, { fromWorkday, toWorkday, eodId, now = new Date().toISOString() }) {
  const alreadyCarried = (task.carryHistory || []).some((entry) => entry.fromWorkday === fromWorkday && entry.toWorkday === toWorkday && entry.eodId === eodId)
  if (alreadyCarried) return task
  return {
    ...task, dueDate: toWorkday,
    carryHistory: [...(task.carryHistory || []), { id: createStableId('carry'), fromWorkday, toWorkday, eodId, carriedAt: now }],
  }
}
