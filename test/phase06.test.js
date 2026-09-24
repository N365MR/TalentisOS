import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { createOrientation, validateOrientation, validateWorkdays } from '../src/domain/orientation.js'

const complete = { responsibility: 'Service delivery for the evening operation', usualWorkdays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], weeklyOutcome: 'Confirm a safe handover rhythm', tomorrowAttention: 'Observe the shift handover', completed: true }

test('Start Here stores only four useful Core answers and configured workdays', () => {
  const orientation = createOrientation(complete, '2026-09-23T00:00:00.000Z')
  assert.equal(orientation.recordType, 'orientation'); assert.deepEqual(orientation.usualWorkdays, complete.usualWorkdays)
  assert.equal(orientation.roadmapStage, 'days-1-30'); assert.match(orientation.roadmapNextAction, /Listen, observe/)
})

test('orientation requires the four answers only when setup is completed', () => {
  assert.doesNotThrow(() => validateOrientation({ usualWorkdays: ['monday'], completed: false }))
  assert.throws(() => validateOrientation({ ...complete, responsibility: '' }), /Responsibility is required/)
  assert.throws(() => validateWorkdays([]), /at least one valid usual workday/)
})

test('First 7 Days accepts safe operational observations and rejects prohibited commentary', () => {
  const saved = validateOrientation({ ...complete, guidanceStatus: 'in-progress', observations: { themes: 'Handover timing varies by shift.', evidence: 'Three observed handovers started late.', contradictions: 'The written standard says on time.', questionsToTest: 'What changes at peak demand?' } })
  assert.equal(saved.observations.evidence, 'Three observed handovers started late.')
  assert.throws(() => validateOrientation({ ...complete, observations: { themes: 'Name: Alex is unreliable.' } }), /not names, judgements or HR commentary/)
})

test('optional guidance can be skipped or resumed without changing the roadmap state', () => {
  const skipped = validateOrientation({ ...complete, guidanceStatus: 'skipped' })
  const resumed = validateOrientation({ ...skipped, guidanceStatus: 'in-progress' }, { existing: skipped })
  assert.equal(resumed.guidanceStatus, 'in-progress'); assert.equal(resumed.roadmapStage, 'days-1-30')
})

test('Phase 06 remains contextual and creates optional canonical tasks only on request', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  assert.match(source, /href="#\/today\/start-here"/)
  assert.match(source, /First 7 Days/)
  assert.match(source, /Days 1–30/)
  assert.match(source, /quickCaptureTask\(\{ title: orientation/)
  assert.doesNotMatch(source, /id: 'start-here'/)
})

test('First 7 Days has a Safari-safe, Phase-06-scoped visible keyboard focus fallback', () => {
  const styles = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8')
  assert.match(styles, /\.orientation-workspace :is\(a,button,input,textarea\):focus \{ outline:3px solid var\(--focus\); outline-offset:3px; \}/)
})

test('Phase 06 retains the shared reduced-motion accessibility contract', () => {
  const styles = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8')
  assert.match(styles, /@media \(prefers-reduced-motion:reduce\)/)
  assert.match(styles, /scroll-behavior:auto !important/)
  assert.match(styles, /transition-duration:\.01ms !important/)
  assert.match(styles, /animation-duration:\.01ms !important/)
  assert.match(styles, /animation-iteration-count:1 !important/)
})
