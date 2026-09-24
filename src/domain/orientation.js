import { createStableId } from './workday.js'

export const WORKDAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const text = (value, fallback = '') => typeof value === 'string' ? value.trim() : fallback
const safeText = (value, label, { required = false, limit = 600 } = {}) => {
  const result = text(value)
  if (required && !result) throw new Error(`${label} is required.`)
  if (result.length > limit) throw new Error(`${label} must be ${limit} characters or fewer.`)
  if (/\b(name|employee|performance rating|disciplinary|medical|health condition|hr case)\s*:/i.test(result) || /\b(personal file|people file|performance dossier)\b/i.test(result)) throw new Error(`${label} must describe work themes and evidence, not names, judgements or HR commentary.`)
  return result
}

export function validateWorkdays(value) {
  if (!Array.isArray(value)) throw new Error('Usual workdays must be a list.')
  const workdays = [...new Set(value.map((item) => text(item).toLowerCase()))]
  if (!workdays.length || workdays.some((item) => !WORKDAYS.includes(item))) throw new Error('Choose at least one valid usual workday.')
  return WORKDAYS.filter((item) => workdays.includes(item))
}

export function validateOrientation(input, { existing = null, now = new Date().toISOString() } = {}) {
  const completed = Boolean(input.completed)
  const guidanceStatus = ['not-started', 'in-progress', 'skipped', 'complete'].includes(input.guidanceStatus) ? input.guidanceStatus : 'not-started'
  return {
    id: existing?.id || text(input.id) || 'core-orientation', recordType: 'orientation', lifecycleStatus: completed ? 'active' : 'draft',
    responsibility: safeText(input.responsibility, 'Responsibility', { required: completed, limit: 240 }),
    usualWorkdays: validateWorkdays(input.usualWorkdays || existing?.usualWorkdays || ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']),
    weeklyOutcome: safeText(input.weeklyOutcome, 'This week’s outcome', { required: completed, limit: 240 }),
    tomorrowAttention: safeText(input.tomorrowAttention, 'Tomorrow’s attention', { required: completed, limit: 240 }),
    guidanceStatus,
    observations: {
      themes: safeText(input.observations?.themes ?? existing?.observations?.themes, 'Themes'),
      evidence: safeText(input.observations?.evidence ?? existing?.observations?.evidence, 'Evidence'),
      contradictions: safeText(input.observations?.contradictions ?? existing?.observations?.contradictions, 'Contradictions'),
      questionsToTest: safeText(input.observations?.questionsToTest ?? existing?.observations?.questionsToTest, 'Questions to test'),
    },
    roadmapStage: 'days-1-30', roadmapNextAction: 'Listen, observe the work, and verify evidence before changing a system.',
    completed, createdAt: existing?.createdAt || now, updatedAt: now,
  }
}

export function createOrientation(input = {}, now) { return validateOrientation({ id: createStableId('orientation'), ...input }, { now }) }
