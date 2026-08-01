const DB_NAME = 'talentisos';
const DB_VERSION = 3;

const stores = {
  settings: 'settings',
  dailyPlans: 'dailyPlans',
  priorities: 'priorities',
  workItems: 'workItems',
  dailyReviews: 'dailyReviews',
  tomorrowPlans: 'tomorrowPlans',
  dayClosures: 'dayClosures',
  appMeta: 'appMeta',
};

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(stores.settings)) {
        const settings = database.createObjectStore(stores.settings, { keyPath: 'id' });
        settings.createIndex('updatedAt', 'updatedAt');
      }
      if (!database.objectStoreNames.contains(stores.dailyPlans)) {
        database.createObjectStore(stores.dailyPlans, { keyPath: 'date' });
      }
      if (!database.objectStoreNames.contains(stores.priorities)) {
        const priorities = database.createObjectStore(stores.priorities, { keyPath: 'id' });
        priorities.createIndex('planDate', 'planDate');
        priorities.createIndex('status', 'status');
      }
      if (!database.objectStoreNames.contains(stores.workItems)) {
        const workItems = database.createObjectStore(stores.workItems, { keyPath: 'id' });
        workItems.createIndex('group', 'group');
        workItems.createIndex('type', 'type');
        workItems.createIndex('status', 'status');
        workItems.createIndex('dueDate', 'dueDate');
      }
      if (!database.objectStoreNames.contains(stores.dailyReviews)) {
        database.createObjectStore(stores.dailyReviews, { keyPath: 'date' });
      }
      if (!database.objectStoreNames.contains(stores.tomorrowPlans)) {
        database.createObjectStore(stores.tomorrowPlans, { keyPath: 'date' });
      }
      if (!database.objectStoreNames.contains(stores.dayClosures)) {
        database.createObjectStore(stores.dayClosures, { keyPath: 'date' });
      }
      if (!database.objectStoreNames.contains(stores.appMeta)) {
        database.createObjectStore(stores.appMeta, { keyPath: 'key' });
      }
    };
    request.onsuccess = () => {
      request.result.onversionchange = () => request.result.close();
      resolve(request.result);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function getRecord(database, storeName, key) {
  return requestResult(database.transaction(storeName, 'readonly').objectStore(storeName).get(key));
}

export async function getAll(database, storeName) {
  return requestResult(database.transaction(storeName, 'readonly').objectStore(storeName).getAll());
}

export async function putRecord(database, storeName, value) {
  return requestResult(
    database.transaction(storeName, 'readwrite').objectStore(storeName).put(value),
  );
}

export async function deleteRecord(database, storeName, key) {
  return requestResult(
    database.transaction(storeName, 'readwrite').objectStore(storeName).delete(key),
  );
}

export async function getOnboardingState(database) {
  const existing = await getRecord(database, stores.appMeta, 'onboarding');
  if (existing) return existing;
  const initial = {
    key: 'onboarding',
    completed: false,
    completionSeen: false,
    step: 0,
    answers: {},
    updatedAt: new Date().toISOString(),
  };
  await putRecord(database, stores.appMeta, initial);
  return initial;
}

export async function saveOnboardingState(database, state) {
  const next = { ...state, updatedAt: new Date().toISOString() };
  await putRecord(database, stores.appMeta, next);
  return next;
}

export function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function getDailyPlan(database, date = todayKey()) {
  const existing = await getRecord(database, stores.dailyPlans, date);
  if (existing) return existing;
  const plan = {
    date,
    focus: '',
    carryover: [],
    risks: [],
    decisions: [],
    followUps: [],
    meetings: [],
    endOfDayStatus: 'not-started',
    updatedAt: new Date().toISOString(),
  };
  await putRecord(database, stores.dailyPlans, plan);
  return plan;
}

export async function saveDailyPlan(database, plan) {
  return putRecord(database, stores.dailyPlans, { ...plan, updatedAt: new Date().toISOString() });
}

export async function getPriorities(database, planDate = todayKey()) {
  const records = await getAll(database, stores.priorities);
  return records
    .filter((priority) => priority.planDate === planDate)
    .sort((a, b) => a.order - b.order);
}

export async function savePriority(database, priority) {
  return putRecord(database, stores.priorities, {
    ...priority,
    updatedAt: new Date().toISOString(),
  });
}

export async function getWorkItems(database) {
  return getAll(database, stores.workItems);
}

export async function saveWorkItem(database, workItem) {
  return putRecord(database, stores.workItems, {
    ...workItem,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteWorkItem(database, id) {
  return deleteRecord(database, stores.workItems, id);
}

export async function getDailyReview(database, date = todayKey()) {
  const existing = await getRecord(database, stores.dailyReviews, date);
  if (existing) return existing;
  const review = {
    date,
    closed: false,
    actions: {},
    improvement: '',
    tomorrowItems: [],
    updatedAt: new Date().toISOString(),
  };
  await putRecord(database, stores.dailyReviews, review);
  return review;
}

export async function saveDailyReview(database, review) {
  return putRecord(database, stores.dailyReviews, {
    ...review,
    updatedAt: new Date().toISOString(),
  });
}

export async function getTomorrowPlan(database, date = todayKey()) {
  const existing = await getRecord(database, stores.tomorrowPlans, date);
  if (existing) return existing;
  return {
    date,
    items: [],
    meetings: [],
    risks: [],
    decisions: [],
    followUps: [],
    confirmed: false,
  };
}

export async function saveTomorrowPlan(database, plan) {
  return putRecord(database, stores.tomorrowPlans, {
    ...plan,
    updatedAt: new Date().toISOString(),
  });
}

export async function saveDayClosure(database, closure) {
  return putRecord(database, stores.dayClosures, {
    ...closure,
    updatedAt: new Date().toISOString(),
  });
}

export async function getDayClosures(database) {
  return (await getAll(database, stores.dayClosures)).sort((a, b) => b.date.localeCompare(a.date));
}

export { stores };
