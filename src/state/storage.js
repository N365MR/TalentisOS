import { SCHEMA_VERSION, createMetadataRecord } from './schema.js';

export const DATABASE_NAME = 'TalentisOS';
export const DATABASE_VERSION = SCHEMA_VERSION;
export const METADATA_STORE = 'metadata';
export const METADATA_KEY = 'foundation';

export function openWorkspaceDatabase(indexedDB = globalThis.indexedDB) {
  if (!indexedDB) return Promise.reject(new Error('IndexedDB is unavailable.'));

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(METADATA_STORE)) {
        database.createObjectStore(METADATA_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Unable to open IndexedDB.'));
    request.onblocked = () => reject(new Error('IndexedDB upgrade is blocked.'));
  });
}

export async function initializeWorkspaceStorage() {
  const database = await openWorkspaceDatabase();
  const transaction = database.transaction(METADATA_STORE, 'readwrite');
  const store = transaction.objectStore(METADATA_STORE);
  const existing = await requestValue(store.get(METADATA_KEY));
  if (!existing) store.put(createMetadataRecord(), METADATA_KEY);
  await transactionComplete(transaction);
  database.close();
}

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
