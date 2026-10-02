import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { performance } from 'node:perf_hooks'
import { BACKUP_STORES, backupHealth, createBackupEnvelope, parseBackupText, validateBackupEnvelope } from '../src/domain/backup.js'
import { createDecision, createHandover, createRisk } from '../src/domain/attention.js'
import { createConversation, createWeeklyReview } from '../src/domain/conversation.js'
import { createEod } from '../src/domain/eod.js'
import { createHuddle } from '../src/domain/huddle.js'
import { createOrientation } from '../src/domain/orientation.js'
import { createQuickTask, validateTask } from '../src/domain/task.js'

const stamp = '2026-09-29T09:00:00.000Z'
const settings = { id: 'workspace', recordType: 'settings', lifecycleStatus: 'active', leadershipWorkdayTimezone: 'Australia/Melbourne', createdAt: stamp, updatedAt: stamp }
const task = { id: 'task_1', recordType: 'task', lifecycleStatus: 'active', title: 'Prepare handover', notes: '', status: 'open', priority: 'none', dueDate: '2026-09-30', dueTime: null, urgent: false, flagged: false, category: '', tags: [], subtasks: [], stateContext: '', createdAt: stamp, updatedAt: stamp, completedAt: null, carryHistory: [], image: null, archivedAt: null, typedLinks: [] }
const emptyStores = () => Object.fromEntries(BACKUP_STORES.map((store) => [store, []]))
const validEnvelope = () => { const stores = emptyStores(); stores.settings = [settings]; stores.tasks = [task]; return createBackupEnvelope(stores, stamp) }

test('Phase 08 export envelope contains its format, current schema, timestamp, and every required store', () => {
  const envelope = validEnvelope()
  assert.equal(envelope.format, 'talentisos-backup')
  assert.equal(envelope.schemaVersion, 9)
  assert.equal(envelope.exportedAt, stamp)
  assert.deepEqual(Object.keys(envelope.stores), BACKUP_STORES)
})

test('Phase 08 import rejects malformed envelopes, unsupported schemas, and unknown relationships before replacement can begin', () => {
  const malformed = validEnvelope(); malformed.stores.tasks[0] = { id: 'task_1' }
  assert.throws(() => validateBackupEnvelope(malformed), /invalid record type|missing/)
  const unsupported = validEnvelope(); unsupported.schemaVersion = 8
  assert.throws(() => validateBackupEnvelope(unsupported), /supports v9 only/)
  const unknown = validEnvelope(); unknown.stores.eods = [{ id: 'eod_2026-09-29', recordType: 'eod', lifecycleStatus: 'active', workday: '2026-09-29', status: 'in-progress', taskIds: ['missing-task'], top3TaskIds: [], lessons: '', recognition: '', createdAt: stamp, updatedAt: stamp, completedAt: null }]
  assert.throws(() => validateBackupEnvelope(unknown), /unknown record/)
  assert.throws(() => parseBackupText('{not json'), /Import was not started/)
})

test('Phase 08 validates task, attention, conversation, review, and huddle relationships in a complete envelope', () => {
  const envelope = validEnvelope()
  envelope.stores.risks = [{ id: 'risk_1', recordType: 'risk', lifecycleStatus: 'active', title: 'Delivery risk', context: 'Supplier delay', ownerRole: 'Leader', nextAction: 'Confirm alternate', waitingOn: 'Supplier', reviewDate: '2026-09-30', createdAt: stamp, updatedAt: stamp, severity: 'high', status: 'open', mitigationTaskId: 'task_1', resolutionNote: '', resolvedAt: null, archivedAt: null }]
  envelope.stores.conversations = [{ id: 'conversation_1', recordType: 'conversation', lifecycleStatus: 'complete', flow: 'coaching', fields: { goal: '', reality: '', options: '', wayForward: '' }, followUpTaskId: 'task_1', createdAt: stamp, updatedAt: stamp }]
  assert.doesNotThrow(() => validateBackupEnvelope(envelope))
})

test('Phase 08 reports no-export, current, and stale backup health without using colour as the only state', () => {
  assert.equal(backupHealth(null, new Date(stamp)).state, 'no-export')
  assert.equal(backupHealth(stamp, new Date('2026-10-01T09:00:00.000Z')).state, 'current')
  assert.equal(backupHealth(stamp, new Date('2026-11-01T09:00:00.000Z')).state, 'stale')
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  assert.match(source, /Backup health/); assert.match(source, /aria-live="polite"/); assert.match(source, /Type REPLACE/); assert.match(source, /Type CLEAR/)
})

test('Phase 08 keeps destructive storage writes behind a completed import preflight and explicit UI confirmation', () => {
  const source = readFileSync(new URL('../src/persistence/database.js', import.meta.url), 'utf8')
  assert.match(source, /const envelope = parseBackupText\(text\)/)
  assert.match(source, /transaction\.objectStore\(name\)\.clear\(\)/)
  const ui = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  assert.match(ui, /Import preview/); assert.match(ui, /window\.prompt\('This replaces every local TalentisOS record/); assert.match(ui, /window\.prompt\('This clears every local TalentisOS record/)
})

test('Phase 08 exposes archived tasks for restore and has a visible service-worker update state', () => {
  const ui = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  assert.match(ui, /Archived tasks/); assert.match(ui, /restore-task-detail/); assert.match(ui, /id="update-notice"/)
  const worker = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8')
  assert.match(worker, /CACHE_VERSION = 'talentisos-shell-v7'/)
})

test('Phase 08 keeps native date and clear-data controls within mobile cards', () => {
  const styles = readFileSync(new URL('../src/style.css', import.meta.url), 'utf8')
  assert.match(styles, /@media \(max-width:47\.999rem\)/)
  const ui = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  assert.match(ui, /<span class="date-input-frame"><input name="dueDate" type="date" \/><\/span>/)
  assert.match(styles, /\.capture-form \.date-input-frame \{ display:block; min-width:0; max-width:100%; overflow:hidden; \}/)
  assert.match(styles, /\.capture-form \.date-input-frame input\[type="date"\] \{ display:block; width:100%; min-width:0; max-width:100%; inline-size:100%; min-inline-size:0; max-inline-size:100%; -webkit-min-logical-width:0; -webkit-appearance:none; appearance:none; \}/)
  assert.match(styles, /\.recovery-steps #clear-workspace \{ inline-size:100%; min-inline-size:0; white-space:normal; overflow-wrap:anywhere; \}/)
  assert.match(styles, /\.recovery-steps \{ padding-bottom:calc\(var\(--s4\) \+ env\(safe-area-inset-bottom\)\); \}/)
})

test('Phase 08 isolated Core workflow fixture covers orientation through review without browser storage', () => {
  const captured = createQuickTask({ title: 'Follow up on the delivery risk', dueDate: '2026-09-30' }, stamp)
  const completed = validateTask({ ...captured, status: 'completed' }, { existing: captured, now: '2026-09-29T09:01:00.000Z' })
  const orientation = createOrientation({ responsibility: 'Lead the service team', usualWorkdays: ['monday', 'tuesday'], weeklyOutcome: 'Stabilise handover', tomorrowAttention: 'Review open risk', completed: true }, stamp)
  const eod = createEod('2026-09-29', stamp)
  const huddle = createHuddle('2026-09-30', { sourceEodId: eod.id, taskIds: [captured.id], top3TaskIds: [captured.id] }, stamp)
  const shared = { title: 'Delivery risk', context: 'Supplier delay', ownerRole: 'Leader', nextAction: 'Confirm alternate', waitingOn: 'Supplier', reviewDate: '2026-09-30' }
  const risk = createRisk({ ...shared, mitigationTaskId: captured.id }, stamp)
  const decision = createDecision({ ...shared, options: 'Use alternate supplier', followUpTaskIds: [captured.id] }, stamp)
  const handover = createHandover({ ...shared, recipientRole: 'Duty leader', linkedTaskIds: [captured.id] }, stamp)
  const conversation = createConversation({ flow: 'coaching', fields: { goal: 'Agree a next action', reality: '', options: '', wayForward: '' }, followUpTaskId: captured.id }, stamp)
  const review = createWeeklyReview({ reviewDate: '2026-09-29', fields: {}, managerUp: {}, nextWeekTaskId: captured.id }, stamp)
  assert.equal(orientation.completed, true); assert.equal(completed.status, 'completed'); assert.deepEqual(huddle.taskIds, [captured.id])
  assert.deepEqual([risk.mitigationTaskId, decision.followUpTaskIds[0], handover.linkedTaskIds[0], conversation.followUpTaskId, review.nextWeekTaskId], [captured.id, captured.id, captured.id, captured.id, captured.id])
})

test('Phase 08 validates the documented 5,000 task and 1,000 linked-record boundary in isolated memory', () => {
  const started = performance.now(); const stores = emptyStores(); stores.settings = [settings]
  stores.tasks = Array.from({ length: 5000 }, (_, index) => ({ ...task, id: `task_volume_${index}`, title: `Volume task ${index}` }))
  const shared = { title: 'Volume exception', context: 'Known operational condition', ownerRole: 'Leader', nextAction: 'Review the condition', waitingOn: 'Owner', reviewDate: '2026-09-30' }
  for (let index = 0; index < 1000; index += 1) {
    const taskId = `task_volume_${index}`
    if (index % 3 === 0) stores.risks.push(createRisk({ ...shared, mitigationTaskId: taskId }, stamp))
    else if (index % 3 === 1) stores.decisions.push(createDecision({ ...shared, options: 'Proceed with the documented option', followUpTaskIds: [taskId] }, stamp))
    else stores.handovers.push(createHandover({ ...shared, recipientRole: 'Duty leader', linkedTaskIds: [taskId] }, stamp))
  }
  const envelope = createBackupEnvelope(stores, stamp); validateBackupEnvelope(envelope)
  const elapsedMs = performance.now() - started
  assert.equal(envelope.stores.tasks.length, 5000)
  assert.equal(envelope.stores.risks.length + envelope.stores.decisions.length + envelope.stores.handovers.length, 1000)
  assert.ok(elapsedMs < 2000, `6,000-record isolated validation took ${elapsedMs.toFixed(1)} ms; expected under 2,000 ms on the local development host.`)
})

test('Phase 08 measures isolated routine local actions without writing user data', () => {
  const quickCaptureStarted = performance.now()
  for (let index = 0; index < 1000; index += 1) createQuickTask({ title: `Fast local action ${index}` }, stamp)
  const quickCaptureMs = performance.now() - quickCaptureStarted
  const backupStarted = performance.now(); createBackupEnvelope(validEnvelope().stores, stamp); const backupMs = performance.now() - backupStarted
  assert.ok(quickCaptureMs < 300, `1,000 isolated Quick Capture validations took ${quickCaptureMs.toFixed(1)} ms.`)
  assert.ok(backupMs < 300, `Small isolated export-envelope validation took ${backupMs.toFixed(1)} ms.`)
})
