export const DATABASE_NAME = 'talentisos'
import { archiveTask, createQuickTask, restoreTask, validateTask } from '../domain/task.js'
import { findTaskReferences, repairTaskReferences } from '../domain/references.js'
import { dateInTimezone, nextWorkday, validateTimezone } from '../domain/workday.js'
import { addEodTaskIds, carryTask, createEod, validateEod } from '../domain/eod.js'
import { addHuddleTaskIds, createHuddle, validateHuddle } from '../domain/huddle.js'

export const DATABASE_VERSION = 5
const SETTINGS_STORE = 'settings'
const DRAFTS_STORE = 'drafts'
const TASKS_STORE = 'tasks'
const EODS_STORE = 'eods'
const HUDDLES_STORE = 'huddles'
const WORKSPACE_SETTINGS_ID = 'workspace'
let databasePromise

function addStore(database, name) { if (!database.objectStoreNames.contains(name)) database.createObjectStore(name, { keyPath: 'id' }) }

export function openDatabase() {
  if (databasePromise) return databasePromise
  if (!('indexedDB' in globalThis)) return Promise.reject(new Error('IndexedDB is not supported.'))
  databasePromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)
    request.onupgradeneeded = (event) => {
      const database = request.result
      // Migrations are additive; future versions preserve existing stores and records.
      if (event.oldVersion < 1) { addStore(database, SETTINGS_STORE); addStore(database, DRAFTS_STORE) }
      // v2 repairs early v1 databases created before the stores were added.
      if (event.oldVersion < 2) { addStore(database, SETTINGS_STORE); addStore(database, DRAFTS_STORE) }
      // v3 adds the single canonical task store without changing Phase 01 records.
      if (event.oldVersion < 3) addStore(database, TASKS_STORE)
      // v4 adds End of Day records; task records remain in their original store and are never copied.
      if (event.oldVersion < 4) addStore(database, EODS_STORE)
      // v5 adds resumable Huddles. They hold task IDs only, never task copies.
      if (event.oldVersion < 5) addStore(database, HUDDLES_STORE)
    }
    request.onsuccess = () => { const database = request.result; database.onversionchange = () => database.close(); resolve(database) }
    request.onerror = () => reject(request.error || new Error('Unable to open browser storage.'))
    request.onblocked = () => reject(new Error('Close other TalentisOS tabs, then try again.'))
  })
  return databasePromise
}

function requestResult(request) { return new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error || new Error('Browser storage operation failed.')) }) }
function defaultTimezone() { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC' }
function defaultSettings() { const now = new Date().toISOString(); return { id: WORKSPACE_SETTINGS_ID, recordType: 'settings', lifecycleStatus: 'active', leadershipWorkdayTimezone: defaultTimezone(), createdAt: now, updatedAt: now } }

export async function getSettings() {
  const database = await openDatabase()
  const store = database.transaction(SETTINGS_STORE, 'readwrite').objectStore(SETTINGS_STORE)
  const existing = await requestResult(store.get(WORKSPACE_SETTINGS_ID))
  if (existing) return existing
  const settings = defaultSettings()
  await requestResult(store.put(settings))
  return settings
}

export { validateTimezone }

export async function updateLeadershipTimezone(timezone) {
  const settings = await getSettings()
  const nextSettings = { ...settings, leadershipWorkdayTimezone: validateTimezone(timezone), updatedAt: new Date().toISOString() }
  const database = await openDatabase()
  await requestResult(database.transaction(SETTINGS_STORE, 'readwrite').objectStore(SETTINGS_STORE).put(nextSettings))
  return nextSettings
}

export async function saveDraft({ id, content, route = 'today' }) {
  if (!id || typeof content !== 'string') throw new Error('A draft needs an ID and text content.')
  const database = await openDatabase()
  const store = database.transaction(DRAFTS_STORE, 'readwrite').objectStore(DRAFTS_STORE)
  const existing = await requestResult(store.get(id))
  const now = new Date().toISOString()
  const draft = { id, recordType: 'draft', lifecycleStatus: 'active', route, content, createdAt: existing?.createdAt || now, updatedAt: now }
  await requestResult(store.put(draft))
  return draft
}

export async function getDraft(id) {
  const database = await openDatabase()
  return requestResult(database.transaction(DRAFTS_STORE, 'readonly').objectStore(DRAFTS_STORE).get(id))
}

function transactionDone(transaction) { return new Promise((resolve, reject) => { transaction.oncomplete = () => resolve(); transaction.onerror = () => reject(transaction.error || new Error('Browser storage operation failed.')); transaction.onabort = () => reject(transaction.error || new Error('Browser storage operation was cancelled.')) }) }

export async function listTasks({ includeArchived = false } = {}) {
  const database = await openDatabase()
  const tasks = await requestResult(database.transaction(TASKS_STORE, 'readonly').objectStore(TASKS_STORE).getAll())
  return tasks.filter((task) => includeArchived || !task.archivedAt).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function getTask(id) {
  const database = await openDatabase()
  return requestResult(database.transaction(TASKS_STORE, 'readonly').objectStore(TASKS_STORE).get(id))
}

export async function saveTask(input) {
  const database = await openDatabase()
  const transaction = database.transaction(TASKS_STORE, 'readwrite')
  const store = transaction.objectStore(TASKS_STORE)
  const existing = input.id ? await requestResult(store.get(input.id)) : null
  const task = validateTask(input, { existing })
  await requestResult(store.put(task))
  await transactionDone(transaction)
  return task
}

export async function quickCaptureTask(input) {
  const task = createQuickTask(input)
  const database = await openDatabase()
  const transaction = database.transaction(TASKS_STORE, 'readwrite')
  transaction.objectStore(TASKS_STORE).add(task)
  await transactionDone(transaction)
  return task
}

export async function setTaskCompleted(id, completed) {
  const existing = await getTask(id)
  if (!existing) throw new Error('This task no longer exists.')
  return saveTask({ ...existing, status: completed ? 'completed' : 'open', stateContext: '' })
}

export async function archiveCanonicalTask(id) {
  const database = await openDatabase()
  const transaction = database.transaction(TASKS_STORE, 'readwrite')
  const store = transaction.objectStore(TASKS_STORE)
  const existing = await requestResult(store.get(id))
  if (!existing) throw new Error('This task no longer exists.')
  const task = archiveTask(existing)
  store.put(task)
  await transactionDone(transaction)
  return task
}

export async function restoreCanonicalTask(id) {
  const database = await openDatabase()
  const transaction = database.transaction(TASKS_STORE, 'readwrite')
  const store = transaction.objectStore(TASKS_STORE)
  const existing = await requestResult(store.get(id))
  if (!existing) throw new Error('This task no longer exists.')
  const task = restoreTask(existing)
  store.put(task)
  await transactionDone(transaction)
  return task
}

export async function linkedTaskReferences(id) {
  return findTaskReferences(await listTasks({ includeArchived: true }), id)
}

export async function deleteCanonicalTask(id, { replacementTaskId = null } = {}) {
  const database = await openDatabase()
  const transaction = database.transaction([TASKS_STORE, EODS_STORE, HUDDLES_STORE], 'readwrite')
  const store = transaction.objectStore(TASKS_STORE)
  const tasks = await requestResult(store.getAll())
  if (!tasks.some((task) => task.id === id)) { transaction.abort(); throw new Error('This task no longer exists.') }
  if (replacementTaskId && !tasks.some((task) => task.id === replacementTaskId)) { transaction.abort(); throw new Error('Choose an existing replacement task.') }
  const references = findTaskReferences(tasks, id)
  for (const task of repairTaskReferences(tasks.filter((task) => task.id !== id), id, replacementTaskId)) store.put(task)
  const eods = await requestResult(transaction.objectStore(EODS_STORE).getAll())
  for (const eod of eods) {
    if (!eod.taskIds.includes(id)) continue
    const nextId = replacementTaskId || null
    const replace = (ids) => [...new Set(ids.flatMap((taskId) => taskId === id ? (nextId ? [nextId] : []) : [taskId]))]
    transaction.objectStore(EODS_STORE).put(validateEod({ ...eod, taskIds: replace(eod.taskIds), top3TaskIds: replace(eod.top3TaskIds) }, { existing: eod }))
  }
  const huddles = await requestResult(transaction.objectStore(HUDDLES_STORE).getAll())
  for (const huddle of huddles) {
    if (!huddle.taskIds.includes(id)) continue
    const nextId = replacementTaskId || null
    const replace = (ids) => [...new Set(ids.flatMap((taskId) => taskId === id ? (nextId ? [nextId] : []) : [taskId]))]
    transaction.objectStore(HUDDLES_STORE).put(validateHuddle({ ...huddle, taskIds: replace(huddle.taskIds), top3TaskIds: replace(huddle.top3TaskIds), commitmentTaskIds: replace(huddle.commitmentTaskIds) }, { existing: huddle }))
  }
  store.delete(id)
  await transactionDone(transaction)
  return { references, repaired: references.length }
}

export async function getOrCreateEod(workday = null) {
  const settings = await getSettings()
  const day = workday || dateInTimezone(new Date(), settings.leadershipWorkdayTimezone)
  const database = await openDatabase()
  const transaction = database.transaction(EODS_STORE, 'readwrite')
  const store = transaction.objectStore(EODS_STORE)
  const id = `eod_${day}`
  const existing = await requestResult(store.get(id))
  if (existing) { await transactionDone(transaction); return existing }
  const eod = createEod(day)
  store.add(eod)
  await transactionDone(transaction)
  return eod
}

export async function saveEod(input) {
  const database = await openDatabase()
  const transaction = database.transaction(EODS_STORE, 'readwrite')
  const store = transaction.objectStore(EODS_STORE)
  const existing = input.id ? await requestResult(store.get(input.id)) : null
  const eod = validateEod(input, { existing })
  await requestResult(store.put(eod))
  await transactionDone(transaction)
  return eod
}

export async function addTasksToEod(eodId, taskIds) {
  const database = await openDatabase()
  const transaction = database.transaction([EODS_STORE, TASKS_STORE], 'readwrite')
  const eodStore = transaction.objectStore(EODS_STORE)
  const eod = await requestResult(eodStore.get(eodId))
  if (!eod) { transaction.abort(); throw new Error('This End of Day review no longer exists.') }
  const found = await Promise.all(taskIds.map((id) => requestResult(transaction.objectStore(TASKS_STORE).get(id))))
  if (found.some((task) => !task)) { transaction.abort(); throw new Error('One of these tasks no longer exists.') }
  const next = addEodTaskIds(eod, taskIds)
  eodStore.put(next)
  await transactionDone(transaction)
  return next
}

export async function resolveEodTask(eodId, taskId, action) {
  const database = await openDatabase()
  const transaction = database.transaction([EODS_STORE, TASKS_STORE], 'readwrite')
  const eodStore = transaction.objectStore(EODS_STORE); const taskStore = transaction.objectStore(TASKS_STORE)
  const eod = await requestResult(eodStore.get(eodId)); const existing = await requestResult(taskStore.get(taskId))
  if (!eod || !existing) { transaction.abort(); throw new Error('This End of Day task is no longer available.') }
  const linked = addEodTaskIds(eod, [taskId])
  const task = action === 'complete' ? validateTask({ ...existing, status: 'completed', stateContext: '' }, { existing }) : action === 'archive' ? archiveTask(existing) : null
  if (!task) { transaction.abort(); throw new Error('Choose a valid task action.') }
  eodStore.put(linked); taskStore.put(task)
  await transactionDone(transaction)
  return { eod: linked, task }
}

export async function carryEodTasks(eodId, taskIds) {
  const settings = await getSettings()
  const database = await openDatabase()
  const transaction = database.transaction([EODS_STORE, TASKS_STORE], 'readwrite')
  const eodStore = transaction.objectStore(EODS_STORE); const taskStore = transaction.objectStore(TASKS_STORE)
  const eod = await requestResult(eodStore.get(eodId))
  if (!eod) { transaction.abort(); throw new Error('This End of Day review no longer exists.') }
  const targetWorkday = nextWorkday(eod.workday, settings.leadershipWorkdayTimezone)
  const now = new Date().toISOString(); let carried = 0
  for (const taskId of [...new Set(taskIds)]) {
    const existing = await requestResult(taskStore.get(taskId))
    if (!existing) { transaction.abort(); throw new Error('One of these tasks no longer exists.') }
    if (existing.status === 'completed' || existing.archivedAt) continue
    const moved = carryTask(existing, { fromWorkday: eod.workday, toWorkday: targetWorkday, eodId, now })
    if (moved !== existing) { taskStore.put(validateTask(moved, { existing, now })); carried += 1 }
  }
  eodStore.put(addEodTaskIds(eod, taskIds, now))
  await transactionDone(transaction)
  return { targetWorkday, carried }
}

export async function getOrCreateHuddle(workday = null) {
  const settings = await getSettings()
  const day = workday || dateInTimezone(new Date(), settings.leadershipWorkdayTimezone)
  const database = await openDatabase()
  const transaction = database.transaction([HUDDLES_STORE, EODS_STORE, TASKS_STORE], 'readwrite')
  const huddleStore = transaction.objectStore(HUDDLES_STORE)
  const existing = await requestResult(huddleStore.get(`huddle_${day}`))
  if (existing) { await transactionDone(transaction); return existing }
  const eods = await requestResult(transaction.objectStore(EODS_STORE).getAll())
  const source = eods.filter((candidate) => nextWorkday(candidate.workday, settings.leadershipWorkdayTimezone) === day).sort((a, b) => b.workday.localeCompare(a.workday))[0]
  const allTasks = await requestResult(transaction.objectStore(TASKS_STORE).getAll())
  const byId = new Map(allTasks.map((task) => [task.id, task]))
  const carriedIds = source ? source.taskIds.filter((id) => byId.get(id)?.carryHistory?.some((entry) => entry.eodId === source.id && entry.toWorkday === day)) : []
  const top3TaskIds = source ? source.top3TaskIds.filter((id) => byId.has(id)) : []
  const huddle = createHuddle(day, { sourceEodId: source?.id || null, taskIds: [...carriedIds, ...top3TaskIds], top3TaskIds, recognition: source?.recognition || '' })
  huddleStore.add(huddle)
  await transactionDone(transaction)
  return huddle
}

export async function saveHuddle(input) {
  const database = await openDatabase()
  const transaction = database.transaction(HUDDLES_STORE, 'readwrite')
  const store = transaction.objectStore(HUDDLES_STORE)
  const existing = input.id ? await requestResult(store.get(input.id)) : null
  const huddle = validateHuddle(input, { existing })
  await requestResult(store.put(huddle))
  await transactionDone(transaction)
  return huddle
}

export async function addTasksToHuddle(huddleId, taskIds) {
  const database = await openDatabase()
  const transaction = database.transaction([HUDDLES_STORE, TASKS_STORE], 'readwrite')
  const huddleStore = transaction.objectStore(HUDDLES_STORE)
  const huddle = await requestResult(huddleStore.get(huddleId))
  if (!huddle) { transaction.abort(); throw new Error('This Morning Huddle no longer exists.') }
  const found = await Promise.all(taskIds.map((id) => requestResult(transaction.objectStore(TASKS_STORE).get(id))))
  if (found.some((task) => !task)) { transaction.abort(); throw new Error('One of these tasks no longer exists.') }
  const next = addHuddleTaskIds(huddle, taskIds)
  huddleStore.put(next)
  await transactionDone(transaction)
  return next
}
