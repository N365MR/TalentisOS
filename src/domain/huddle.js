import { isDateOnly } from './workday.js'

const text = (value, fallback = '') => typeof value === 'string' ? value.trim() : fallback
const ids = (value) => Array.isArray(value) ? [...new Set(value.filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim()))] : []

export function createHuddle(workday, { sourceEodId = null, taskIds = [], top3TaskIds = [], recognition = '' } = {}, now = new Date().toISOString()) {
  if (!isDateOnly(workday) || !workday) throw new Error('A Morning Huddle needs a valid workday.')
  return {
    id: `huddle_${workday}`, recordType: 'huddle', lifecycleStatus: 'active', workday, status: 'in-progress', sourceEodId,
    taskIds: ids(taskIds), top3TaskIds: ids(top3TaskIds), commitmentTaskIds: [], recognition: text(recognition),
    createdAt: now, updatedAt: now, completedAt: null,
  }
}

export function validateHuddle(input, { existing = null, now = new Date().toISOString() } = {}) {
  const workday = text(input.workday) || existing?.workday
  if (!isDateOnly(workday) || !workday) throw new Error('A Morning Huddle needs a valid workday.')
  const taskIds = ids(input.taskIds ?? existing?.taskIds)
  const top3TaskIds = ids(input.top3TaskIds ?? existing?.top3TaskIds)
  const commitmentTaskIds = ids(input.commitmentTaskIds ?? existing?.commitmentTaskIds)
  if (top3TaskIds.length > 3) throw new Error('A Huddle can contain at most three Top 3 tasks.')
  if (top3TaskIds.some((id) => !taskIds.includes(id)) || commitmentTaskIds.some((id) => !taskIds.includes(id))) throw new Error('Huddle links must reference included canonical tasks.')
  const status = input.status || existing?.status || 'in-progress'
  if (!['in-progress', 'completed'].includes(status)) throw new Error('Choose a valid Morning Huddle status.')
  const recognition = text(input.recognition ?? existing?.recognition)
  if (recognition.length > 1000) throw new Error('Keep recognition to 1,000 characters or fewer.')
  return {
    id: existing?.id || text(input.id) || `huddle_${workday}`, recordType: 'huddle', lifecycleStatus: 'active', workday, status,
    sourceEodId: input.sourceEodId ?? existing?.sourceEodId ?? null, taskIds, top3TaskIds, commitmentTaskIds, recognition,
    createdAt: existing?.createdAt || now, updatedAt: now, completedAt: status === 'completed' ? (existing?.completedAt || now) : null,
  }
}

export function addHuddleTaskIds(huddle, taskIds, now = new Date().toISOString()) {
  return validateHuddle({ ...huddle, taskIds: [...huddle.taskIds, ...taskIds] }, { existing: huddle, now })
}
