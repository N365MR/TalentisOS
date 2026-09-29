import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { CONVERSATION_FLOWS, createConversation, createWeeklyReview, safeLeadershipText, validateConversation, validateHowILead, validateWeeklyReview } from '../src/domain/conversation.js'

const safeFields = (flow) => Object.fromEntries(CONVERSATION_FLOWS[flow].fields.map(([key]) => [key, `Work-focused ${key} agreement`]))

test('all six Phase 07 conversation flows save only named work-focused prompts', () => {
  assert.deepEqual(Object.keys(CONVERSATION_FLOWS), ['one-on-one', 'feedback', 'coaching', 'delegation', 'difficult-conversation', 'recognition'])
  for (const flow of Object.keys(CONVERSATION_FLOWS)) {
    const record = createConversation({ flow, fields: safeFields(flow) }, '2026-09-24T00:00:00.000Z')
    assert.equal(record.recordType, 'conversation'); assert.equal(record.flow, flow); assert.equal(record.followUpTaskId, null)
  }
})

test('conversation privacy validation rejects prohibited personnel and HR commentary', () => {
  assert.throws(() => validateConversation({ flow: 'feedback', fields: { ...safeFields('feedback'), impact: 'Name: Alex has a performance rating.' } }), /work, actions and agreements/)
  assert.throws(() => safeLeadershipText('Confidential HR record', 'Context'), /work, actions and agreements/)
})

test('conversation follow-up is an optional canonical task reference, not a copied task', () => {
  const record = validateConversation({ flow: 'delegation', fields: safeFields('delegation'), followUpTaskId: 'task_123' })
  assert.equal(record.followUpTaskId, 'task_123'); assert.deepEqual(Object.keys(record), ['id', 'recordType', 'lifecycleStatus', 'flow', 'fields', 'followUpTaskId', 'createdAt', 'updatedAt'])
})

test('Weekly Review persists Decisions needed in the dedicated Manager-up object while optional review prompts remain blank', () => {
  const review = createWeeklyReview({ reviewDate: '2026-09-25', fields: { results: 'Reduced handover delay.' }, managerUp: { decisionsNeeded: 'Confirm operating boundary.' } }, '2026-09-25T00:00:00.000Z')
  assert.deepEqual(review.fields, { results: 'Reduced handover delay.', worked: '', didNotWork: '', risks: '', stop: '', start: '', continue: '', recognition: '', nextWeekPriorities: '' })
  assert.deepEqual(review.managerUp, { results: '', decisionsNeeded: 'Confirm operating boundary.', materialRisks: '', supportRequired: '', nextReview: '' })
  assert.equal(review.nextWeekTaskId, null)
  assert.throws(() => validateWeeklyReview({ reviewDate: '25-09-2026', fields: {}, managerUp: {} }), /Review date/)
})

test('How I Lead is one private leader commitment record, never a people assessment', () => {
  const record = validateHowILead({ values: 'Be clear and respectful.', communicationStandards: 'Confirm agreements.', nonNegotiables: 'Act safely.', practicesToImprove: 'Listen before deciding.' })
  assert.equal(record.id, 'how-i-lead'); assert.equal(record.recordType, 'how-i-lead')
  assert.throws(() => validateHowILead({ values: 'Name: Jordan needs coaching.' }), /work, actions and agreements/)
})

test('Phase 07 source preserves the five primary destinations and implements exact Help Now routes', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  assert.match(source, /id: 'conversations'.*Prepare the next conversation/)
  for (const route of ['overwhelmed', 'difficult-conversation', 'concern', 'delegate', 'reset']) assert.match(source, new RegExp(`'?${route}'?\\s*:`))
  assert.match(source, /I need help now/); assert.match(source, /discard-conversation-draft/); assert.match(source, /discard-weekly-review-draft/)
  assert.doesNotMatch(source, /id: 'weekly-review'/); assert.doesNotMatch(source, /id: 'help-now'/)
})

test('schema v9 is additive and canonical task deletion repairs Phase 07 references in its transaction', () => {
  const source = readFileSync(new URL('../src/persistence/database.js', import.meta.url), 'utf8')
  assert.match(source, /DATABASE_VERSION = 9/); assert.match(source, /CONVERSATIONS_STORE/); assert.match(source, /WEEKLY_REVIEWS_STORE/); assert.match(source, /HOW_I_LEAD_STORE/)
  assert.match(source, /event\.oldVersion < 9/); assert.match(source, /validateConversation, 'followUpTaskId'/); assert.match(source, /validateWeeklyReview, 'nextWeekTaskId'/)
  assert.match(source, /discardDraft/)
})

test('Phase 07 retains scoped keyboard focus and shared reduced-motion behavior', () => {
  const styles = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8')
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  assert.match(styles, /\.conversation-workspace :is\(a,button,input,textarea,select\):focus/)
  assert.match(styles, /\.conversation-workspace \.dialog-actions button:focus \{ outline:3px solid var\(--focus\) !important; outline-offset:3px; box-shadow:0 0 0 6px rgb\(248 212 135 \/ 25%\); \}/)
  assert.match(styles, /@media \(prefers-reduced-motion:reduce\)/)
  assert.match(styles, /scroll-behavior:auto !important/)
  assert.match(styles, /transition-duration:\.01ms !important/)
  assert.match(styles, /animation-duration:\.01ms !important/)
  assert.match(styles, /animation-iteration-count:1 !important/)
  assert.match(source, /conversationMessage = 'Weekly Review saved\. Existing work was kept unchanged\.'/)
  assert.match(source, /<p class="form-message" role="status" aria-live="polite">\$\{escape\(conversationMessage\)\}<\/p>/)
})
