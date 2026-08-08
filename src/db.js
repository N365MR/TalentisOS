const DB_NAME = 'talentisos';
const DB_VERSION = 11;

const stores = {
  settings: 'settings',
  dailyPlans: 'dailyPlans',
  priorities: 'priorities',
  workItems: 'workItems',
  dailyReviews: 'dailyReviews',
  tomorrowPlans: 'tomorrowPlans',
  dayClosures: 'dayClosures',
  weeklyReviews: 'weeklyReviews',
  improvements: 'improvements',
  playbookState: 'playbookState',
  journeyState: 'journeyState',
  l10Settings: 'l10Settings',
  l10ScorecardMetrics: 'l10ScorecardMetrics',
  l10ScorecardEntries: 'l10ScorecardEntries',
  l10Rocks: 'l10Rocks',
  l10Issues: 'l10Issues',
  l10Meetings: 'l10Meetings',
  meetingSchedules: 'meetingSchedules',
  eodRecords: 'eodRecords',
  huddleItems: 'huddleItems',
  backupSnapshots: 'backupSnapshots',
  appMeta: 'appMeta',
};

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      if (request.error?.name === 'QuotaExceededError') reject(new Error('Local workspace storage is full. Export a backup and remove unused data.'));
      else reject(request.error);
    };
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
      if (!database.objectStoreNames.contains(stores.weeklyReviews)) {
        database.createObjectStore(stores.weeklyReviews, { keyPath: 'weekStart' });
      }
      if (!database.objectStoreNames.contains(stores.improvements)) {
        const improvements = database.createObjectStore(stores.improvements, { keyPath: 'id' });
        improvements.createIndex('status', 'status');
        improvements.createIndex('category', 'category');
        improvements.createIndex('createdAt', 'createdAt');
      }
      if (!database.objectStoreNames.contains(stores.playbookState)) {
        database.createObjectStore(stores.playbookState, { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains(stores.journeyState)) {
        database.createObjectStore(stores.journeyState, { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains(stores.l10Settings)) database.createObjectStore(stores.l10Settings, { keyPath: 'id' });
      if (!database.objectStoreNames.contains(stores.l10ScorecardMetrics)) database.createObjectStore(stores.l10ScorecardMetrics, { keyPath: 'id' });
      if (!database.objectStoreNames.contains(stores.l10ScorecardEntries)) {
        const entries = database.createObjectStore(stores.l10ScorecardEntries, { keyPath: 'id' });
        entries.createIndex('weekStart', 'weekStart');
        entries.createIndex('metricId', 'metricId');
      }
      if (!database.objectStoreNames.contains(stores.l10Rocks)) database.createObjectStore(stores.l10Rocks, { keyPath: 'id' });
      if (!database.objectStoreNames.contains(stores.l10Issues)) database.createObjectStore(stores.l10Issues, { keyPath: 'id' });
      if (!database.objectStoreNames.contains(stores.l10Meetings)) {
        const meetings = database.createObjectStore(stores.l10Meetings, { keyPath: 'id' });
        meetings.createIndex('weekStart', 'weekStart');
      }
      if (!database.objectStoreNames.contains(stores.meetingSchedules)) {
        const schedules = database.createObjectStore(stores.meetingSchedules, { keyPath: 'id' });
        schedules.createIndex('nextDate', 'nextDate');
        schedules.createIndex('active', 'active');
      }
      if (!database.objectStoreNames.contains(stores.backupSnapshots)) {
        const snapshots = database.createObjectStore(stores.backupSnapshots, { keyPath: 'id' });
        snapshots.createIndex('snapshotType', 'snapshotType');
        snapshots.createIndex('createdAt', 'createdAt');
      }
      if (!database.objectStoreNames.contains(stores.eodRecords)) {
        const eodRecords = database.createObjectStore(stores.eodRecords, { keyPath: 'id' });
        eodRecords.createIndex('date', 'date');
        eodRecords.createIndex('status', 'status');
      }
      if (!database.objectStoreNames.contains(stores.huddleItems)) {
        const huddleItems = database.createObjectStore(stores.huddleItems, { keyPath: 'id' });
        huddleItems.createIndex('huddleDate', 'huddleDate');
        huddleItems.createIndex('itemId', 'itemId');
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
    welcomeSeen: false,
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
  const now = new Date().toISOString();
  const completedAt = priority.status === 'done' ? (priority.completedAt || now) : '';
  return putRecord(database, stores.priorities, {
    ...priority,
    raisedDate: priority.raisedDate || priority.createdAt?.slice(0, 10) || todayKey(),
    createdAt: priority.createdAt || new Date().toISOString(),
    completedAt,
    completedDate: completedAt ? completedAt.slice(0, 10) : '',
    updatedAt: now,
  });
}

export async function getWorkItems(database) {
  return getAll(database, stores.workItems);
}

export async function getAllPriorities(database) {
  return getAll(database, stores.priorities);
}

export async function saveWorkItem(database, workItem) {
  const existing = await getRecord(database, stores.workItems, workItem.id);
  const now = new Date().toISOString();
  const createdAt = workItem.createdAt || existing?.createdAt || now;
  const raisedDate = workItem.raisedDate || existing?.raisedDate || createdAt.slice(0, 10);
  const history = [...(existing?.movementHistory || workItem.movementHistory || [])];
  const addHistory = (action, from = '', to = '', note = '') => history.push({ id: crypto.randomUUID(), timestamp: now, date: now.slice(0, 10), action, from, to, note });
  if (!existing) addHistory(workItem.type === 'risk' ? 'Risk Raised' : 'Created', workItem.source || 'Work', workItem.source || 'Work');
  if (existing && existing.status !== 'complete' && workItem.status === 'complete') addHistory('Completed', existing.status, 'complete');
  if (existing && existing.status === 'complete' && workItem.status !== 'complete') addHistory('Reopened', 'complete', workItem.status || 'in-progress');
  let completedAt = workItem.completedAt ?? existing?.completedAt ?? '';
  let completedDate = workItem.completedDate ?? existing?.completedDate ?? '';
  if (workItem.status === 'complete' && !completedAt) {
    completedAt = now;
    completedDate = now.slice(0, 10);
  }
  if (existing?.status === 'complete' && workItem.status !== 'complete') {
    completedAt = '';
    completedDate = '';
  }
  const subtasks = (workItem.subtasks || existing?.subtasks || []).map((subtask) => {
    const previous = (existing?.subtasks || []).find((item) => item.id === subtask.id || item.title === subtask.title);
    const subtaskCreatedAt = subtask.createdAt || previous?.createdAt || now;
    const subtaskRaisedDate = subtask.raisedDate || previous?.raisedDate || subtaskCreatedAt.slice(0, 10);
    const subtaskHistory = [...(previous?.movementHistory || subtask.movementHistory || [])];
    if (!previous) subtaskHistory.push({ id: crypto.randomUUID(), timestamp: now, date: now.slice(0, 10), action: 'Created', from: 'Work', to: 'Work' });
    if (previous && !previous.completed && subtask.completed) subtaskHistory.push({ id: crypto.randomUUID(), timestamp: now, date: now.slice(0, 10), action: 'Completed', from: 'open', to: 'complete' });
    if (previous?.completed && !subtask.completed) subtaskHistory.push({ id: crypto.randomUUID(), timestamp: now, date: now.slice(0, 10), action: 'Reopened', from: 'complete', to: 'open' });
    const subtaskCompletedAt = subtask.completed ? (subtask.completedAt || previous?.completedAt || now) : '';
    return { ...subtask, id: subtask.id || crypto.randomUUID(), createdAt: subtaskCreatedAt, raisedDate: subtaskRaisedDate, completedAt: subtaskCompletedAt, completedDate: subtaskCompletedAt ? subtaskCompletedAt.slice(0, 10) : '', movementHistory: subtaskHistory };
  });
  return putRecord(database, stores.workItems, {
    ...workItem,
    createdAt,
    raisedDate,
    updatedAt: now,
    completedAt,
    completedDate,
    movementHistory: history,
    subtasks,
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

export async function getWeeklyReview(database, weekStart) {
  const existing = await getRecord(database, stores.weeklyReviews, weekStart);
  if (existing) return existing;
  return {
    weekStart,
    answers: {},
    nextPriorities: ['', '', ''],
    operatingImprovement: '',
    leadershipFocus: '',
    updatedAt: new Date().toISOString(),
  };
}

export async function saveWeeklyReview(database, review) {
  return putRecord(database, stores.weeklyReviews, {
    ...review,
    updatedAt: new Date().toISOString(),
  });
}

export async function getImprovements(database) {
  return (await getAll(database, stores.improvements)).sort((a, b) =>
    (b.updatedAt || b.createdAt || '').localeCompare(a.updatedAt || a.createdAt || ''),
  );
}

export async function saveImprovement(database, improvement) {
  return putRecord(database, stores.improvements, {
    ...improvement,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteImprovement(database, id) {
  return deleteRecord(database, stores.improvements, id);
}

export async function getPlaybookState(database) {
  const existing = await getRecord(database, stores.playbookState, 'primary');
  return existing || { id: 'primary', savedTopicIds: [], recentTopicIds: [], completedTopicIds: [] };
}

export async function savePlaybookState(database, state) {
  return putRecord(database, stores.playbookState, {
    id: 'primary',
    savedTopicIds: state.savedTopicIds || [],
    recentTopicIds: state.recentTopicIds || [],
    completedTopicIds: state.completedTopicIds || [],
    updatedAt: new Date().toISOString(),
  });
}

export async function getJourneyState(database) {
  const existing = await getRecord(database, stores.journeyState, 'primary');
  return existing || { id: 'primary', startedAt: null, completedMilestoneIds: [], completedAt: {}, meetingPreparation: {} };
}

export async function saveJourneyState(database, state) {
  const next = {
    id: 'primary',
    startedAt: state.startedAt || new Date().toISOString(),
    completedMilestoneIds: state.completedMilestoneIds || [],
    completedAt: state.completedAt || {},
    meetingPreparation: state.meetingPreparation || {},
    updatedAt: new Date().toISOString(),
  };
  await putRecord(database, stores.journeyState, next);
  return next;
}

export async function getL10Settings(database) {
  return (await getRecord(database, stores.l10Settings, 'primary')) || { id: 'primary', meetingDay: 1, meetingTime: '09:00', durationMinutes: 90, teamAreas: [], facilitatorArea: '', scribeArea: '', ratingTarget: 8 };
}

export async function getL10Meeting(database, weekStart) {
  return getRecord(database, stores.l10Meetings, `l10-${weekStart}`);
}

export async function getL10Meetings(database) { return getAll(database, stores.l10Meetings); }
export async function getL10Collection(database, storeName) { return getAll(database, stores[storeName]); }
export async function saveL10Record(database, storeName, record) {
  const next = { ...record, updatedAt: new Date().toISOString() };
  await putRecord(database, stores[storeName], next);
  return next;
}

export async function getMeetingSchedules(database) { return getAll(database, stores.meetingSchedules); }
export async function saveMeetingSchedule(database, schedule) { return putRecord(database, stores.meetingSchedules, { ...schedule, updatedAt: new Date().toISOString() }); }
export async function deleteMeetingSchedule(database, id) { return deleteRecord(database, stores.meetingSchedules, id); }

export async function getEodRecord(database, date) { return (await getRecord(database, stores.eodRecords, `eod-${date}`)) || null; }
export async function getEodRecords(database) { return (await getAll(database, stores.eodRecords)).sort((a, b) => b.date.localeCompare(a.date)); }
export async function saveEodRecord(database, record) { return putRecord(database, stores.eodRecords, { ...record, updatedAt: new Date().toISOString() }); }
export async function getHuddleItems(database, huddleDate = null) {
  const records = await getAll(database, stores.huddleItems);
  return huddleDate ? records.filter((item) => item.huddleDate === huddleDate) : records;
}
export async function saveHuddleItem(database, item) { return putRecord(database, stores.huddleItems, { ...item, updatedAt: new Date().toISOString() }); }

export async function getBackupSnapshots(database) {
  return (await getAll(database, stores.backupSnapshots)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveBackupSnapshot(database, snapshot) {
  return putRecord(database, stores.backupSnapshots, snapshot);
}

export async function deleteBackupSnapshot(database, id) {
  return deleteRecord(database, stores.backupSnapshots, id);
}

export async function clearWorkspaceData(database, includeSnapshots = false) {
  const names = Object.values(stores).filter((storeName) => includeSnapshots || storeName !== stores.backupSnapshots);
  const transaction = database.transaction(names, 'readwrite');
  names.forEach((storeName) => transaction.objectStore(storeName).clear());
  return new Promise((resolve, reject) => {
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error || new Error('Workspace deletion was aborted.'));
  });
}

export { stores };
