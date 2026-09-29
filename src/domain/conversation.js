import { createStableId, isDateOnly } from './workday.js'

export const CONVERSATION_FLOWS = {
  'one-on-one': { label: 'One-on-one', fields: [['goingWell', 'What is going well?'], ['difficult', 'What is difficult?'], ['supportNeeded', 'What support is needed?'], ['agreement', 'What will we agree?']] },
  feedback: { label: 'Feedback', fields: [['situation', 'Situation'], ['behaviour', 'Behaviour'], ['impact', 'Impact'], ['nextStep', 'Next step']] },
  coaching: { label: 'Coaching', fields: [['goal', 'Goal'], ['reality', 'Reality'], ['options', 'Options'], ['wayForward', 'Way forward']] },
  delegation: { label: 'Delegation', fields: [['outcome', 'Outcome'], ['guardrails', 'Guardrails'], ['authority', 'Authority'], ['checkIn', 'Check-in'], ['definitionOfDone', 'Definition of done']] },
  'difficult-conversation': { label: 'Difficult conversation', fields: [['facts', 'Facts'], ['intent', 'Intent'], ['opening', 'Opening'], ['questions', 'Questions'], ['agreement', 'Agreement'], ['followUp', 'Follow-up']] },
  recognition: { label: 'Recognition', fields: [['observedAction', 'Observed action'], ['whyItMattered', 'Why it mattered'], ['reinforcement', 'What to reinforce']] },
}

const prohibited = /\b(name|employee|person|performance rating|disciplinary|medical|health condition|hr case|payroll)\s*:/i
const sensitive = /\b(personal file|people file|performance dossier|medical detail|disciplinary record|confidential hr)\b/i
const text = (value) => typeof value === 'string' ? value.trim() : ''
export function safeLeadershipText(value, label, { required = false, limit = 600 } = {}) {
  const result = text(value)
  if (required && !result) throw new Error(`${label} is required.`)
  if (result.length > limit) throw new Error(`${label} must be ${limit} characters or fewer.`)
  if (prohibited.test(result) || sensitive.test(result)) throw new Error(`${label} must stay focused on work, actions and agreements—not names, personnel, health, HR or disciplinary detail.`)
  return result
}
const taskId = (value) => value ? text(value) : null

export function validateConversation(input, { existing = null, now = new Date().toISOString() } = {}) {
  const flow = text(input.flow)
  const definition = CONVERSATION_FLOWS[flow]
  if (!definition) throw new Error('Choose a valid conversation flow.')
  const fields = Object.fromEntries(definition.fields.map(([key, label]) => [key, safeLeadershipText(input.fields?.[key], label)]))
  return { id: text(input.id) || existing?.id || createStableId('conversation'), recordType: 'conversation', lifecycleStatus: 'complete', flow, fields, followUpTaskId: taskId(input.followUpTaskId), createdAt: existing?.createdAt || now, updatedAt: now }
}
export const createConversation = (input, now) => validateConversation(input, { now })

export function validateWeeklyReview(input, { existing = null, now = new Date().toISOString() } = {}) {
  const reviewDate = text(input.reviewDate)
  if (!isDateOnly(reviewDate)) throw new Error('Review date must use YYYY-MM-DD.')
  const fields = ['results', 'worked', 'didNotWork', 'risks', 'stop', 'start', 'continue', 'recognition', 'nextWeekPriorities']
  const managerUp = ['results', 'decisionsNeeded', 'materialRisks', 'supportRequired', 'nextReview']
  return {
    id: text(input.id) || existing?.id || createStableId('weekly-review'), recordType: 'weekly-review', lifecycleStatus: 'complete', reviewDate,
    fields: Object.fromEntries(fields.map((key) => [key, safeLeadershipText(input.fields?.[key], key === 'didNotWork' ? 'What did not work' : key, { limit: 600 })])),
    managerUp: Object.fromEntries(managerUp.map((key) => [key, safeLeadershipText(input.managerUp?.[key], key === 'decisionsNeeded' ? 'Decisions needed' : key, { limit: 600 })])),
    nextWeekTaskId: taskId(input.nextWeekTaskId), createdAt: existing?.createdAt || now, updatedAt: now,
  }
}
export const createWeeklyReview = (input, now) => validateWeeklyReview(input, { now })

export function validateHowILead(input, { existing = null, now = new Date().toISOString() } = {}) {
  return { id: 'how-i-lead', recordType: 'how-i-lead', lifecycleStatus: 'active', values: safeLeadershipText(input.values, 'Values'), communicationStandards: safeLeadershipText(input.communicationStandards, 'Communication standards'), nonNegotiables: safeLeadershipText(input.nonNegotiables, 'Non-negotiable behaviours'), practicesToImprove: safeLeadershipText(input.practicesToImprove, 'Practices to improve'), createdAt: existing?.createdAt || now, updatedAt: now }
}
