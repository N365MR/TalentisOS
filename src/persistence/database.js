export const DATABASE_NAME = 'talentisos'
export const DATABASE_VERSION = 2
const SETTINGS_STORE = 'settings'
const DRAFTS_STORE = 'drafts'
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

export function validateTimezone(timezone) {
  try { Intl.DateTimeFormat(undefined, { timeZone: timezone }); return timezone } catch { throw new Error('Choose a recognised IANA timezone, such as Australia/Melbourne.') }
}

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
