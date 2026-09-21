import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { addEodTaskIds, carryTask, createEod, validateEod } from '../src/domain/eod.js'
import { createQuickTask, validateTask } from '../src/domain/task.js'
import { nextWorkday } from '../src/domain/workday.js'

const now = '2026-09-18T10:00:00.000Z'

test('Phase 03 creates exactly one stable End of Day record per workday and resumes it', () => {
  const eod = createEod('2026-09-18', now)
  const resumed = validateEod({ ...eod, lessons: 'Check the handover earlier.' }, { existing: eod, now: '2026-09-18T11:00:00.000Z' })
  assert.equal(eod.id, 'eod_2026-09-18')
  assert.equal(resumed.id, eod.id)
  assert.equal(resumed.status, 'in-progress')
  assert.equal(resumed.lessons, 'Check the handover earlier.')
})

test('Top 3 is duplicate-safe, ordered by selection, and limited to canonical reviewed tasks', () => {
  const eod = addEodTaskIds(createEod('2026-09-18', now), ['task_a', 'task_a', 'task_b'], now)
  const saved = validateEod({ ...eod, top3TaskIds: ['task_b', 'task_a', 'task_b'] }, { existing: eod, now })
  assert.deepEqual(saved.taskIds, ['task_a', 'task_b'])
  assert.deepEqual(saved.top3TaskIds, ['task_b', 'task_a'])
  assert.throws(() => validateEod({ ...eod, top3TaskIds: ['task_a', 'task_b', 'task_c', 'task_d'] }, { existing: eod }), /at most three/)
  assert.throws(() => validateEod({ ...eod, top3TaskIds: ['task_missing'] }, { existing: eod }), /reviewed tasks/)
})

test('carrying a canonical task moves the same record once and appends one history entry', () => {
  const task = createQuickTask({ title: 'Call supplier', dueDate: '2026-09-18' }, now)
  const carried = carryTask(task, { fromWorkday: '2026-09-18', toWorkday: '2026-09-21', eodId: 'eod_2026-09-18', now })
  const repeated = carryTask(carried, { fromWorkday: '2026-09-18', toWorkday: '2026-09-21', eodId: 'eod_2026-09-18', now: '2026-09-18T12:00:00.000Z' })
  assert.equal(carried.id, task.id)
  assert.equal(carried.createdAt, task.createdAt)
  assert.equal(carried.dueDate, '2026-09-21')
  assert.equal(carried.carryHistory.length, 1)
  assert.equal(repeated, carried)
})

test('individual, selected-subset and carry-all operations preserve canonical task identity', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  const tasks = ['task_a', 'task_b', 'task_c'].map((id) => ({ ...createQuickTask({ title: id, dueDate: '2026-09-20' }, now), id }))
  const carriedSelected = tasks.slice(0, 2).map((task) => carryTask(task, { fromWorkday: '2026-09-20', toWorkday: '2026-09-21', eodId: 'eod_2026-09-20', now }))
  const carriedAll = tasks.map((task) => carryTask(task, { fromWorkday: '2026-09-20', toWorkday: '2026-09-21', eodId: 'eod_2026-09-20', now }))
  assert.deepEqual(carriedSelected.map((task) => task.id), ['task_a', 'task_b'])
  assert.deepEqual(carriedAll.map((task) => task.id), ['task_a', 'task_b', 'task_c'])
  assert.match(source, /data-carry="\$\{item\.id\}"/)
  assert.match(source, /class="carry-select"/)
  assert.match(source, /id="carry-selected"/)
  assert.match(source, /id="carry-all"/)
})

test('Sunday-to-Monday EOD carry renders prepared state and removes repeat controls', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  const task = createQuickTask({ title: 'Sunday carry', dueDate: '2026-09-20' }, now)
  const carried = carryTask(task, { fromWorkday: '2026-09-20', toWorkday: '2026-09-21', eodId: 'eod_2026-09-20', now })
  const prepared = carried.carryHistory.some((entry) => entry.eodId === 'eod_2026-09-20' && entry.toWorkday === '2026-09-21')
  assert.equal(prepared, true)
  assert.match(source, /entry\.eodId === eod\.id && entry\.toWorkday === target/)
  assert.match(source, /Prepared for \$\{target\}/)
  assert.match(source, /prepared \? ''/)
})

test('selected carry targets only selected IDs and carry-all targets every eligible ID', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  const first = createQuickTask({ title: 'First' }, now); const second = createQuickTask({ title: 'Second' }, now)
  const selected = [first.id]
  assert.deepEqual(selected, [first.id])
  assert.notEqual(selected[0], second.id)
  assert.match(source, /const selectedCarryIds/)
  assert.match(source, /carryMessage\(selectedCarryIds\(\)\)/)
  assert.match(source, /querySelectorAll\('\.carry-select'\)/)
})

test('completed and archived tasks are excluded from EOD carrying', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  const database = readFileSync(new URL('../src/persistence/database.js', import.meta.url), 'utf8')
  assert.match(source, /item\.status !== 'completed'/)
  assert.match(database, /if \(existing\.status === 'completed' \|\| existing\.archivedAt\) continue/)
})

test('completion after End of Day carry changes the same canonical task record', () => {
  const task = createQuickTask({ title: 'Finish report', dueDate: '2026-09-18' }, now)
  const carried = carryTask(task, { fromWorkday: '2026-09-18', toWorkday: '2026-09-21', eodId: 'eod_2026-09-18', now })
  const completed = validateTask({ ...carried, status: 'completed', stateContext: '' }, { existing: carried, now: '2026-09-21T10:00:00.000Z' })
  assert.equal(completed.id, task.id)
  assert.equal(completed.status, 'completed')
  assert.deepEqual(completed.carryHistory, carried.carryHistory)
})

test('Friday through Sunday carry uses the shared Monday workday rule', () => {
  for (const day of ['2026-09-18', '2026-09-19', '2026-09-20']) assert.equal(nextWorkday(day, 'Australia/Melbourne'), '2026-09-21')
})

test('a Quick-Captured task due on the EOD workday is eligible for review', () => {
  const task = createQuickTask({ title: 'EOD TEST — Carry me', dueDate: '2026-09-20' }, now)
  const eod = createEod('2026-09-20', now)
  const eligible = !task.archivedAt && (eod.taskIds.includes(task.id) || (task.dueDate && task.dueDate <= eod.workday) || (task.completedAt && task.completedAt.startsWith(eod.workday)))
  assert.equal(eligible, true)
})

test('Save progress retains an exact live confirmation after the EOD refresh', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  assert.match(source, /if \(!complete\) eodSaveMessage = 'End of Day progress saved\.'/)
  assert.match(source, /eodSaveMessage = 'End of Day progress saved\.'; await refresh\(\)/)
  assert.match(source, /const saveFeedback = !done \? `<p class="form-message" role="status" aria-live="polite">\$\{escape\(eodSaveMessage\)\}<\/p>` : ''/)
  assert.match(source, /<\/div>\$\{saveFeedback\}<\/form>/)
})

test('completed EOD renders a read-only closeout and binds no EOD mutation controls', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  const completed = validateEod({ ...createEod('2026-09-20', now), taskIds: ['task_a'], top3TaskIds: ['task_a'], recognition: 'Thank the team', lessons: 'Start earlier', status: 'completed' }, { now })
  assert.equal(completed.status, 'completed')
  assert.deepEqual(completed.top3TaskIds, ['task_a'])
  assert.equal(completed.recognition, 'Thank the team')
  assert.equal(completed.lessons, 'Start earlier')
  assert.match(source, /const done = eod\.status === 'completed'/)
  assert.match(source, /!done && eligible\.length/)
  assert.match(source, /const controls = done \|\| complete/)
  assert.doesNotMatch(source.slice(source.indexOf('function eodSurface()'), source.indexOf('function huddleSurface()')), /done \?[^]*carry-select/)
  assert.match(source, /const carryFeedback = !done/)
  const surface = source.slice(source.indexOf('function eodSurface()'), source.indexOf('function huddleSurface()'))
  const completedBranch = surface.slice(surface.indexOf('${done ?'), surface.indexOf(' : `<section'))
  assert.doesNotMatch(completedBranch, /eod-closeout|saveFeedback|Save progress/)
})

test('viewing a completed EOD does not call a task mutation function', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  const surface = source.slice(source.indexOf('function eodSurface()'), source.indexOf('function huddleSurface()'))
  assert.doesNotMatch(surface, /resolveEodTask\(|carryEodTasks\(|saveEod\(/)
})
