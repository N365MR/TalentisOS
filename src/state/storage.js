import { SCHEMA_VERSION, STORE_NAMES, createMetadataRecord, nowIso } from './schema.js';

export const DATABASE_NAME = 'TalentisOS';
export const DATABASE_VERSION = SCHEMA_VERSION;
export const METADATA_STORE = STORE_NAMES.metadata;
export const METADATA_KEY = 'foundation';

export function openWorkspaceDatabase(indexedDB = globalThis.indexedDB) {
  if (!indexedDB) return Promise.reject(new Error('IndexedDB is unavailable.'));

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = event => migrateDatabase(request.result, event.oldVersion, request.transaction);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open IndexedDB.'));
    request.onblocked = () => reject(new Error('IndexedDB upgrade is blocked.'));
  });
}

export async function initializeWorkspaceStorage() {
  const database = await openWorkspaceDatabase();
  try {
    const existing = await getRecordFromDatabase(database, METADATA_STORE, METADATA_KEY);
    if (!existing || existing.schemaVersion !== SCHEMA_VERSION) await putRecordInDatabase(database, METADATA_STORE, createMetadataRecord(), METADATA_KEY);
  } finally { database.close(); }
}

// Migrations are ordered and additive. Later destructive transformations require an approved backup plan.
export function migrateDatabase(database, oldVersion, transaction) {
  if (oldVersion < 1 && !database.objectStoreNames.contains(METADATA_STORE)) database.createObjectStore(METADATA_STORE);
  if (oldVersion < 2) {
    if (!database.objectStoreNames.contains(STORE_NAMES.tasks)) {
      const tasks = database.createObjectStore(STORE_NAMES.tasks, { keyPath: 'id' });
      tasks.createIndex('by-status', 'status'); tasks.createIndex('by-updated-at', 'updatedAt');
    }
    if (!database.objectStoreNames.contains(STORE_NAMES.settings)) database.createObjectStore(STORE_NAMES.settings, { keyPath: 'key' });
    transaction.objectStore(METADATA_STORE).put(createMetadataRecord(), METADATA_KEY);
  }
  if (oldVersion < 3) {
    const tasks = transaction.objectStore(STORE_NAMES.tasks);
    if (!tasks.indexNames.contains('by-due-date')) tasks.createIndex('by-due-date', 'dueDate');
    if (!tasks.indexNames.contains('by-completed-at')) tasks.createIndex('by-completed-at', 'completedAt');
  }
  if (oldVersion < 4) {
    const tasks = transaction.objectStore(STORE_NAMES.tasks);
    if (!tasks.indexNames.contains('by-priority')) tasks.createIndex('by-priority', 'priority');
  }
  if (oldVersion < 5 && !database.objectStoreNames.contains(STORE_NAMES.endOfDay)) {
    const records = database.createObjectStore(STORE_NAMES.endOfDay, { keyPath: 'id' });
    records.createIndex('by-date', 'date', { unique: true });
  }
}

const knownStores = new Set(Object.values(STORE_NAMES));
function assertStore(storeName) { if (!knownStores.has(storeName)) throw new TypeError(`Unknown TalentisOS store: ${storeName}`); }
export async function getRecord(storeName, key) { assertStore(storeName); const database = await openWorkspaceDatabase(); try { return await getRecordFromDatabase(database, storeName, key); } finally { database.close(); } }
export async function getAllRecords(storeName) { assertStore(storeName); const database = await openWorkspaceDatabase(); try { const transaction = database.transaction(storeName, 'readonly'); const records = await requestValue(transaction.objectStore(storeName).getAll()); await transactionComplete(transaction); return records; } finally { database.close(); } }
export async function createRecord(storeName, record) { assertStore(storeName); const database = await openWorkspaceDatabase(); try { const transaction = database.transaction(storeName, 'readwrite'); await requestValue(transaction.objectStore(storeName).add(record)); await transactionComplete(transaction); return record; } finally { database.close(); } }
export async function updateRecord(storeName, record) { assertStore(storeName); const database = await openWorkspaceDatabase(); try { const transaction = database.transaction(storeName, 'readwrite'); const updated = { ...record, updatedAt: nowIso() }; await requestValue(transaction.objectStore(storeName).put(updated)); await transactionComplete(transaction); return updated; } finally { database.close(); } }
export async function deleteRecord(storeName, key) { assertStore(storeName); const database = await openWorkspaceDatabase(); try { const transaction = database.transaction(storeName, 'readwrite'); await requestValue(transaction.objectStore(storeName).delete(key)); await transactionComplete(transaction); } finally { database.close(); } }
export async function replaceStoreRecords(recordsByStore) { const stores = Object.keys(recordsByStore); stores.forEach(assertStore); const database = await openWorkspaceDatabase(); try { const transaction = database.transaction(stores, 'readwrite'); for (const storeName of stores) { const store = transaction.objectStore(storeName); store.clear(); recordsByStore[storeName].forEach(record => store.put(record)); } await transactionComplete(transaction); } finally { database.close(); } }
async function getRecordFromDatabase(database, storeName, key) { const transaction = database.transaction(storeName, 'readonly'); const value = await requestValue(transaction.objectStore(storeName).get(key)); await transactionComplete(transaction); return value; }
async function putRecordInDatabase(database, storeName, value, key) { const transaction = database.transaction(storeName, 'readwrite'); await requestValue(transaction.objectStore(storeName).put(value, key)); await transactionComplete(transaction); }

function requestValue(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function transactionComplete(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error ?? new Error('IndexedDB transaction aborted.'));
  });
}
