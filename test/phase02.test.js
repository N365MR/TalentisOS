import assert from 'node:assert/strict'
import test from 'node:test'
import { archiveTask, createQuickTask, restoreTask, subtaskProgress, validateTask } from '../src/domain/task.js'
import { repairTaskReferences, taskDeletionConfirmation } from '../src/domain/references.js'
import { confirmationRequired, dateInTimezone, nextWorkday } from '../src/domain/workday.js'

const fixedNow = '2026-09-20T10:00:00.000Z'

test('Phase 02 validates the canonical task schema and preserves identity', () => {
  const task = validateTask({ title: 'Call supplier', status: 'open', priority: 'high', tags: ['operations', 'operations'], subtasks: [], typedLinks: [] }, { now: fixedNow })
  const updated = validateTask({ ...task, title: 'Call the supplier' }, { existing: task, now: '2026-09-21T10:00:00.000Z' })
  assert.match(task.id, /^task_/)
  assert.equal(updated.id, task.id)
  assert.equal(updated.createdAt, fixedNow)
  assert.deepEqual(task.tags, ['operations'])
  assert.throws(() => validateTask({ title: '', subtasks: [], typedLinks: [] }), /title is required/)
  assert.throws(() => validateTask({ title: 'Invalid due date', dueDate: '20-09-2026', subtasks: [], typedLinks: [] }), /Due date/)
})

test('quick capture accepts only its small required shape and prevents duplicate IDs', () => {
  const first = createQuickTask({ title: 'Prepare notes', urgent: true, dueDate: '2026-09-21' }, fixedNow)
  const second = createQuickTask({ title: 'Prepare notes', urgent: true, dueDate: '2026-09-21' }, fixedNow)
  assert.notEqual(first.id, second.id)
  assert.equal(first.status, 'open')
  assert.equal(first.category, '')
  assert.throws(() => validateTask({ ...first, typedLinks: [{ recordType: 'risk', recordId: 'r1', relationship: 'mitigates' }, { recordType: 'risk', recordId: 'r1', relationship: 'mitigates' }] }), /Duplicate typed links/)
})

test('subtask progress and blocked or waiting context rules are enforced', () => {
  const task = validateTask({ title: 'Run review', subtasks: [{ title: 'Read report', completed: true }, { title: 'Write summary', completed: false }], typedLinks: [] }, { now: fixedNow })
  assert.deepEqual(subtaskProgress(task), { completed: 1, total: 2 })
  assert.throws(() => validateTask({ title: 'Await approval', status: 'waiting', subtasks: [], typedLinks: [] }), /need context/)
  assert.throws(() => validateTask({ title: 'Ordinary task', stateContext: 'Should not be here', subtasks: [], typedLinks: [] }), /only used/)
  assert.equal(validateTask({ title: 'Await approval', status: 'waiting', stateContext: 'Waiting for supplier', subtasks: [], typedLinks: [] }).stateContext, 'Waiting for supplier')
})

test('workday calculations are timezone-safe and follow Friday through Sunday to Monday', () => {
  assert.equal(dateInTimezone('2026-09-20T00:30:00.000Z', 'Australia/Melbourne'), '2026-09-20')
  assert.equal(nextWorkday('2026-09-17', 'Australia/Melbourne'), '2026-09-18')
  assert.equal(nextWorkday('2026-09-18', 'Australia/Melbourne'), '2026-09-21')
  assert.equal(nextWorkday('2026-09-20', 'Australia/Melbourne'), '2026-09-21')
})

test('archive and restore preserve a canonical task identity', () => {
  const task = createQuickTask({ title: 'Keep history' }, fixedNow)
  const archived = archiveTask(task, '2026-09-21T10:00:00.000Z')
  const restored = restoreTask(archived, '2026-09-22T10:00:00.000Z')
  assert.equal(archived.archivedAt, '2026-09-21T10:00:00.000Z')
  assert.equal(restored.archivedAt, null)
  assert.equal(restored.id, task.id)
  assert.equal(confirmationRequired({ material: true }), true)
})

test('reference repair removes or replaces links without changing unrelated references', () => {
  const records = [{ id: 'task_a', recordType: 'task', typedLinks: [{ recordType: 'task', recordId: 'task_old', relationship: 'depends-on' }, { recordType: 'risk', recordId: 'risk_1', relationship: 'context' }] }]
  assert.deepEqual(repairTaskReferences(records, 'task_old', 'task_new')[0].typedLinks, [{ recordType: 'task', recordId: 'task_new', relationship: 'depends-on' }, { recordType: 'risk', recordId: 'risk_1', relationship: 'context' }])
  assert.deepEqual(repairTaskReferences(records, 'task_old')[0].typedLinks, [{ recordType: 'risk', recordId: 'risk_1', relationship: 'context' }])
})

test('permanent deletion confirmation names every linked task and stable ID', () => {
  const message = taskDeletionConfirmation([
    { sourceTitle: 'DELETE TEST — Linked', sourceId: 'task_linked', relationship: 'depends-on' },
    { sourceTitle: 'Follow supplier', sourceId: 'task_follow', relationship: 'blocks' },
  ])
  assert.equal(message, 'This will repair 2 linked task references:\n• DELETE TEST — Linked (task_linked) — depends-on\n• Follow supplier (task_follow) — blocks\n\nPermanent deletion cannot be undone. Continue?')
  assert.equal(taskDeletionConfirmation([{ sourceTitle: 'DELETE TEST — Linked', sourceId: 'task_linked', relationship: 'depends-on' }]), 'This will repair 1 linked task reference:\n• DELETE TEST — Linked (task_linked) — depends-on\n\nPermanent deletion cannot be undone. Continue?')
  assert.equal(taskDeletionConfirmation([]), 'This task has no linked records.\n\nPermanent deletion cannot be undone. Continue?')
})
