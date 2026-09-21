import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { createEod } from '../src/domain/eod.js'
import { addHuddleTaskIds, createHuddle, validateHuddle } from '../src/domain/huddle.js'
import { createQuickTask, validateTask } from '../src/domain/task.js'
import { nextWorkday } from '../src/domain/workday.js'

const now = '2026-09-20T10:00:00.000Z'

test('EOD-to-Huddle context keeps IDs, Top 3 and recognition without task copies', () => {
  const eod = { ...createEod('2026-09-18', now), taskIds: ['task_carry', 'task_top'], top3TaskIds: ['task_top'], recognition: 'Thank the team' }
  const huddle = createHuddle(nextWorkday(eod.workday, 'Australia/Melbourne'), { sourceEodId: eod.id, taskIds: ['task_carry', ...eod.top3TaskIds], top3TaskIds: eod.top3TaskIds, recognition: eod.recognition }, now)
  assert.equal(huddle.id, 'huddle_2026-09-21')
  assert.equal(huddle.sourceEodId, eod.id)
  assert.deepEqual(huddle.taskIds, ['task_carry', 'task_top'])
  assert.deepEqual(huddle.top3TaskIds, ['task_top'])
  assert.equal(huddle.recognition, 'Thank the team')
  assert.equal('title' in huddle, false)
})

test('Huddle links commitments duplicate-safely and resumes its same workday record', () => {
  const base = createHuddle('2026-09-21', { taskIds: ['task_a'] }, now)
  const linked = addHuddleTaskIds(base, ['task_a', 'task_b', 'task_b'], now)
  const resumed = validateHuddle({ ...linked, commitmentTaskIds: ['task_b', 'task_b'] }, { existing: linked, now: '2026-09-21T11:00:00.000Z' })
  assert.equal(resumed.id, base.id)
  assert.deepEqual(resumed.taskIds, ['task_a', 'task_b'])
  assert.deepEqual(resumed.commitmentTaskIds, ['task_b'])
})

test('attention order puts blocked or overdue work ahead of Top 3, urgent, then routine', () => {
  const blocked = validateTask({ title: 'Blocked', status: 'blocked', stateContext: 'Need approval', subtasks: [], typedLinks: [] }, { now })
  const overdue = createQuickTask({ title: 'Overdue', dueDate: '2026-09-18' }, now)
  const urgent = createQuickTask({ title: 'Urgent', urgent: true, dueDate: '2026-09-21' }, now)
  const routine = createQuickTask({ title: 'Routine' }, now)
  const rank = (item) => item.status === 'blocked' || (item.dueDate && item.dueDate < '2026-09-21') ? 2 : item.urgent ? 3 : 4
  assert.deepEqual([routine, urgent, blocked, overdue].sort((a, b) => rank(a) - rank(b)).map((item) => rank(item)), [2, 2, 3, 4])
})

test('completion preserves the one canonical task identity across linked surfaces', () => {
  const original = createQuickTask({ title: 'One task' }, now)
  const completed = validateTask({ ...original, status: 'completed', stateContext: '' }, { existing: original, now: '2026-09-21T10:00:00.000Z' })
  assert.equal(completed.id, original.id)
  assert.equal(completed.status, 'completed')
  assert.equal(createHuddle('2026-09-21', { taskIds: [original.id] }, now).taskIds[0], completed.id)
})

test('Phase 04 renders Huddle, Home and Today from canonical task IDs only', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  const database = readFileSync(new URL('../src/persistence/database.js', import.meta.url), 'utf8')
  assert.match(source, /getOrCreateHuddle/)
  assert.match(source, /Continue to Today’s Work/)
  assert.match(source, /Next best action/)
  assert.match(source, /Overdue or blocked commitment/)
  assert.match(source, /setTaskCompleted/)
  assert.match(database, /HUDDLES_STORE/)
  assert.match(database, /taskIds: replace\(huddle\.taskIds\)/)
})

test('Phase 04 EOD carry feedback is persistent, live and placed after carry controls', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  assert.match(source, /Prepared \$\{result\.carried\} task/)
  assert.match(source, /No additional tasks needed preparation/)
  assert.match(source, /role="status" aria-live="polite"/)
  assert.match(source, /\$\{list\}<\/ul>\$\{carryControls\}\$\{carryFeedback\}/)
  assert.match(source, /const carryFeedback = !done/)
  assert.match(source, /carryMessage\(\[button\.dataset\.carry\]\)/)
  assert.match(source, /carryMessage\(selectedCarryIds\(\)\)/)
  assert.match(source, /carryMessage\(\[\.\.\.app\.querySelectorAll\('\.carry-select'\)\]/)
})

test('Phase 04 keeps carry and Save progress feedback independent', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  assert.match(source, /let eodMessage = ''; let eodSaveMessage = ''/)
  assert.match(source, /const carryFeedback = !done \? `<p class="form-message" role="status" aria-live="polite">\$\{escape\(eodMessage\)\}<\/p>` : ''/)
  assert.match(source, /const saveFeedback = !done \? `<p class="form-message" role="status" aria-live="polite">\$\{escape\(eodSaveMessage\)\}<\/p>` : ''/)
  assert.match(source, /eodMessage = ''; eodSaveMessage = ''; await refresh\(\)/)
})
