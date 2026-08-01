import './styles.css';
import {
  createAppShell,
  createOnboarding,
  createToast,
  createTodayView,
  createHistoryDialog,
  createReviewView,
  createWeeklyReviewView,
  createImproveView,
  createImprovementSheet,
  createPlaybookView,
  createPlaybookDialog,
  playbookTopics,
  escapeHtml,
  createDataDialog,
  createWorkDetailSheet,
  createWorkView,
  getRoute,
  renderView,
  workStatusOptions,
  workTypeFields,
} from './components.js';
import {
  getDailyPlan,
  getDailyReview,
  getDayClosures,
  getOnboardingState,
  getPriorities,
  getAllPriorities,
  getWorkItems,
  getTomorrowPlan,
  getWeeklyReview,
  saveWeeklyReview,
  getImprovements,
  saveImprovement,
  deleteImprovement,
  getPlaybookState,
  savePlaybookState,
  openDatabase,
  putRecord,
  saveOnboardingState,
  savePriority,
  saveDailyPlan,
  saveDailyReview,
  saveDayClosure,
  saveTomorrowPlan,
  saveWorkItem,
  deleteWorkItem,
  getAll,
  getBackupSnapshots,
  saveBackupSnapshot,
  deleteBackupSnapshot,
  clearWorkspaceData,
  stores,
} from './db.js';
import {
  createBackup,
  validateBackup,
  backupCounts,
  createCsv,
  parseCsv,
  validateCsv,
  csvSchema,
  csvTemplate,
  restoreCollections,
} from './backup.js';

const app = document.querySelector('#app');
const toastRegion = document.querySelector('#toast-region');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const themeQuery = window.matchMedia('(prefers-color-scheme: dark)');
let database;
let onboardingState;
let currentPlan;
let currentPriorities = [];
let currentWorkItems = [];
let currentWorkFilter = 'all';
let currentReviewDate;
let editingHistoricalDay = false;
let currentReview;
let currentTomorrowPlan;
let currentHistory = [];
let currentReviewSuggestions = [];
let currentWeeklyReview;
let currentImprovements = [];
let currentPlaybookState = { savedTopicIds: [], recentTopicIds: [] };
let currentPlaybookQuery = '';
let currentPlaybookGroup = 'All topics';
let currentSnapshots = [];
let pendingRestore = null;
let pendingCsvImport = null;
let autosaveTimer;
let lastUndo;

function showToast(message) {
  toastRegion.replaceChildren();
  toastRegion.innerHTML = createToast(message);
  const toast = toastRegion.firstElementChild;
  if (lastUndo && (message.includes('completed') || message.includes('deleted'))) {
    const undo = document.createElement('button');
    undo.className = 'toast__action';
    undo.type = 'button';
    undo.dataset.undoWork = 'true';
    undo.textContent = 'Undo';
    toast.append(undo);
  }
  window.setTimeout(() => toast?.remove(), 3600);
}

function resolvedTheme(theme) {
  return theme === 'system' ? (themeQuery.matches ? 'dark' : 'light') : theme;
}

function applyTheme(theme, announce = false) {
  const activeTheme = resolvedTheme(theme);
  try {
    localStorage.setItem('talentisos-theme', theme);
  } catch {
    // Appearance remains available for the current session if storage is unavailable.
  }
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.resolvedTheme = activeTheme;
  themeMeta.setAttribute('content', activeTheme === 'dark' ? '#101820' : '#f5f7fa');
  document.querySelectorAll('[data-theme-choice]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme));
  });
  if (announce) showToast(`${theme[0].toUpperCase()}${theme.slice(1)} appearance selected.`);
}

function savedTheme() {
  try {
    return localStorage.getItem('talentisos-theme') || 'system';
  } catch {
    return 'system';
  }
}

async function collectBackupData() {
  const read = async (storeName) => getAll(database, storeName);
  const dailyPlans = await read(stores.dailyPlans);
  const workItems = await read(stores.workItems);
  const playbookState = await read(stores.playbookState);
  const appMeta = await read(stores.appMeta);
  return {
    settings: await read(stores.settings),
    dailyPlans,
    priorities: await read(stores.priorities),
    huddles: dailyPlans.filter((plan) => plan.huddleStatus || plan.huddleDiscussions?.length).map((plan) => ({ date: plan.date, status: plan.huddleStatus || '', discussions: plan.huddleDiscussions || [] })),
    workItems,
    risks: workItems.filter((item) => item.type === 'risk'),
    decisions: workItems.filter((item) => item.type === 'decision'),
    followUps: workItems.filter((item) => item.type === 'follow-up'),
    dailyReviews: await read(stores.dailyReviews),
    tomorrowPlans: await read(stores.tomorrowPlans),
    weeklyReviews: await read(stores.weeklyReviews),
    improvements: await read(stores.improvements),
    savedPlaybookTopics: playbookState[0]?.savedTopicIds || [],
    onboardingState: appMeta.filter((item) => item.key === 'onboarding'),
  };
}

function dateStamp(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function downloadFile(content, filename, type) {
  const file = new File([content], filename, { type });
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    navigator.share({ files: [file], title: filename }).catch(() => {});
    return;
  }
  const url = URL.createObjectURL(file);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function exportBackup() {
  const backup = createBackup(await collectBackupData());
  downloadFile(JSON.stringify(backup, null, 2), `TalentisOS_Backup_${dateStamp()}.json`, 'application/json');
  showToast('Backup exported locally.');
}

async function saveAutomaticSnapshot(snapshotType) {
  const backup = createBackup(await collectBackupData());
  const snapshot = {
    id: `${snapshotType}-${dateStamp()}`,
    snapshotType,
    createdAt: new Date().toISOString(),
    recordCount: Object.values(backup.data).reduce((total, records) => total + (Array.isArray(records) ? records.length : 0), 0),
    backup,
  };
  await saveBackupSnapshot(database, snapshot);
  const snapshots = await getBackupSnapshots(database);
  const keep = snapshotType === 'daily' ? 7 : 4;
  for (const old of snapshots.filter((item) => item.snapshotType === snapshotType).slice(keep)) {
    await deleteBackupSnapshot(database, old.id);
  }
}

async function ensureAutomaticSnapshots() {
  const snapshots = await getBackupSnapshots(database);
  const today = dateStamp();
  if (!snapshots.some((snapshot) => snapshot.id === `daily-${today}`)) await saveAutomaticSnapshot('daily');
  const week = startOfWeek(new Date());
  if (!snapshots.some((snapshot) => snapshot.id === `weekly-${week}`)) await saveAutomaticSnapshot('weekly');
}

async function applyRestore(backup, mode = 'replace') {
  if (mode === 'replace') {
    await saveBackupSnapshot(database, { id: `pre-restore-${Date.now()}`, snapshotType: 'pre-restore', createdAt: new Date().toISOString(), recordCount: 0, backup: createBackup(await collectBackupData()) });
    await clearWorkspaceData(database, true);
  }
  const collections = restoreCollections(backup);
  for (const [storeName, records] of Object.entries(collections)) {
    for (const record of records || []) await putRecord(database, stores[storeName], record);
  }
  pendingRestore = null;
  showToast(mode === 'replace' ? 'Backup restored. Your workspace was replaced.' : 'Backup merged into your workspace.');
  await render();
}

function csvRows(type, data) {
  if (type === 'dailySummaries') return data.dailyReviews.map((item) => ({ date: item.date, summary: item.summary || item.improvement || '', closed: item.closed ? 'Yes' : 'No' }));
  if (type === 'weeklySummaries') return data.weeklyReviews.map((item) => ({ weekStart: item.weekStart, achieved: item.answers?.achieved || '', incomplete: item.answers?.incomplete || '', nextPriorities: (item.nextPriorities || []).join(' | '), operatingImprovement: item.operatingImprovement || '', leadershipFocus: item.leadershipFocus || '' }));
  return data[type] || [];
}

function csvColumns(type, data) {
  if (['dailySummaries', 'weeklySummaries'].includes(type)) return Object.keys(csvRows(type, data)[0] || (type === 'dailySummaries' ? { date: '', summary: '', closed: '' } : { weekStart: '', achieved: '', incomplete: '', nextPriorities: '', operatingImprovement: '', leadershipFocus: '' }));
  return csvSchema(type).columns;
}

async function exportCsv(type) {
  const data = await collectBackupData();
  const rows = csvRows(type, data);
  downloadFile(createCsv(rows, csvColumns(type, data)), `TalentisOS_${type[0].toUpperCase() + type.slice(1)}_${dateStamp()}.csv`, 'text/csv;charset=utf-8');
  showToast('CSV exported locally.');
}

function importedCsvRecords(type, records) {
  if (type === 'priorities') return records.map((record, index) => ({ ...record, id: record.id || crypto.randomUUID(), order: Number(record.order) || index, status: record.status || 'not-started' }));
  if (type === 'improvements') return records.map((record) => ({ ...record, id: record.id || crypto.randomUUID(), createdAt: record.createdAt || new Date().toISOString(), status: record.status || 'captured' }));
  const workType = type === 'risks' ? 'risk' : type === 'decisions' ? 'decision' : 'follow-up';
  return records.map((record) => ({ ...record, id: record.id || crypto.randomUUID(), type: workType, group: record.group || 'next', status: record.status || 'not-started', title: record.title || record.outcome || '' }));
}

function dataDialog() {
  return document.querySelector('#data-dialog');
}

function showRestorePreview(backup, source = 'file') {
  pendingRestore = backup;
  const preview = dataDialog()?.querySelector('[data-restore-preview]');
  if (!preview) return;
  const counts = backupCounts(backup);
  const rows = Object.entries(counts).filter(([, count]) => count).map(([label, count]) => `<span>${label}: <strong>${count}</strong></span>`).join('');
  preview.hidden = false;
  preview.innerHTML = `<p><strong>${source === 'snapshot' ? 'Local snapshot ready' : 'Backup ready'}</strong> · exported ${new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(backup.exportedAt))}</p><div class="data-counts">${rows || '<span>No records found.</span>'}</div><label>Restore mode<select data-restore-mode><option value="replace">Replace current data (automatic backup first)</option><option value="merge">Merge into current data</option></select></label><div class="modal__actions"><button type="button" class="secondary-action" data-restore-cancel>Cancel</button><button type="button" class="primary-action" data-restore-apply>Restore backup</button></div>`;
}

async function handleRestoreFile(file) {
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    showRestorePreview(validateBackup(parsed));
  } catch (error) {
    const preview = dataDialog()?.querySelector('[data-restore-preview]');
    if (preview) {
      preview.hidden = false;
      preview.innerHTML = `<p class="data-error">${escapeHtml(error.message || 'This backup could not be read.')}</p>`;
    }
    pendingRestore = null;
  }
}

async function handleCsvFile(file) {
  if (!file) return;
  const type = dataDialog()?.querySelector('[data-csv-type]')?.value;
  const preview = dataDialog()?.querySelector('[data-csv-preview]');
  try {
    if (!['priorities', 'risks', 'decisions', 'followUps', 'improvements'].includes(type)) throw new Error('CSV import is available for priorities, risks, decisions, follow-ups, and improvements.');
    const result = validateCsv(type, parseCsv(await file.text()));
    pendingCsvImport = { type, records: importedCsvRecords(type, result.records), errors: result.errors };
    preview.hidden = false;
    preview.innerHTML = `<p><strong>${pendingCsvImport.records.length} rows ready.</strong> ${result.errors.length ? `${result.errors.length} row error(s) need attention.` : 'No validation errors found.'}</p>${result.errors.length ? `<ul class="data-error-list">${result.errors.map((error) => `<li>${escapeHtml(error)}</li>`).join('')}</ul>` : ''}<label>Duplicate IDs<select data-csv-duplicate-mode><option value="skip">Skip existing records</option><option value="replace">Replace existing records</option></select></label><div class="modal__actions"><button type="button" class="secondary-action" data-csv-cancel>Cancel</button><button type="button" class="primary-action" data-csv-apply ${result.errors.length ? 'disabled' : ''}>Import rows</button></div>`;
  } catch (error) {
    pendingCsvImport = null;
    preview.hidden = false;
    preview.innerHTML = `<p class="data-error">${escapeHtml(error.message || 'This CSV could not be read.')}</p>`;
  }
}

async function applyCsvImport() {
  if (!pendingCsvImport) return;
  const { type, records, errors } = pendingCsvImport;
  if (errors.length) return;
  const storeName = type === 'improvements' ? stores.improvements : type === 'priorities' ? stores.priorities : stores.workItems;
  const existing = new Set((await getAll(database, storeName)).map((record) => record.id));
  const mode = dataDialog()?.querySelector('[data-csv-duplicate-mode]')?.value || 'skip';
  let imported = 0;
  let skipped = 0;
  for (const record of records) {
    if (existing.has(record.id) && mode === 'skip') {
      skipped += 1;
      continue;
    }
    await putRecord(database, storeName, record);
    imported += 1;
  }
  pendingCsvImport = null;
  dataDialog()?.querySelector('[data-csv-preview]')?.setAttribute('hidden', '');
  showToast(`${imported} CSV row(s) imported${skipped ? `; ${skipped} duplicate(s) skipped` : ''}.`);
  await render();
}

async function render() {
  if (!onboardingState.completed || !onboardingState.completionSeen) {
    app.innerHTML = createOnboarding(onboardingState);
    applyTheme(savedTheme());
    document.title = 'Set up TalentisOS';
    return;
  }

  const route = getRoute();
  if (route.key === 'today') {
    currentPlan = await getDailyPlan(database);
    currentPriorities = await getPriorities(database, currentPlan.date);
    currentWorkItems = await getWorkItems(database);
    await importPreparedPlanIfNeeded();
    const action = currentPriorities.length < 3 ? 'Add a priority' : 'Review priorities';
    app.innerHTML = createAppShell({ ...route, action });
    document.querySelector('#view-root').innerHTML = createTodayView(
      currentPlan,
      currentPriorities,
      currentWorkItems,
    );
    document.title = 'Today — TalentisOS';
  } else if (route.key === 'work') {
    currentWorkItems = await getWorkItems(database);
    app.innerHTML = createAppShell(route);
    document.querySelector('#view-root').innerHTML = createWorkView(
      currentWorkItems,
      currentWorkFilter,
    );
    document.title = 'Work — TalentisOS';
  } else if (route.key === 'review') {
    currentReviewDate ||= new Date().toISOString().slice(0, 10);
    currentPlan = await getDailyPlan(database, currentReviewDate);
    currentPriorities = await getPriorities(database, currentReviewDate);
    currentWorkItems = await getWorkItems(database);
    currentReview = await getDailyReview(database, currentReviewDate);
    currentTomorrowPlan = await getTomorrowPlan(database, addDays(currentReviewDate, 1));
    currentHistory = await getDayClosures(database);
    currentReviewSuggestions = createReviewSuggestions(
      currentPlan,
      currentPriorities,
      currentWorkItems,
    );
    if (!currentReview.tomorrowItems?.length && !currentTomorrowPlan.items?.length) {
      currentReview.tomorrowItems = defaultTomorrowItems(currentReviewSuggestions);
      await saveDailyReview(database, currentReview);
    }
    app.innerHTML = createAppShell({
      ...route,
      action: currentReview.closed ? 'Finish Day' : 'Finish Day',
    });
    if (route.subroute === 'weekly') {
      const weekStart = startOfWeek(new Date());
      currentWeeklyReview = await getWeeklyReview(database, weekStart);
      currentImprovements = await getImprovements(database);
      const closures = currentHistory.filter((closure) => closure.date >= weekStart && closure.date <= addDays(weekStart, 6));
      const weekPriorities = (await getAllPriorities(database)).filter((item) => item.planDate >= weekStart && item.planDate <= addDays(weekStart, 6));
      const weekWork = currentWorkItems.filter((item) => {
        const updatedDate = item.updatedAt?.slice(0, 10);
        return (updatedDate >= weekStart && updatedDate <= addDays(weekStart, 6)) ||
          (item.dueDate >= weekStart && item.dueDate <= addDays(weekStart, 6));
      });
      document.querySelector('#view-root').innerHTML = createWeeklyReviewView({
        review: currentWeeklyReview,
        summary: weeklySummary(closures, weekPriorities, weekWork, weekStart, addDays(weekStart, 6)),
        weekStart,
        weekEnd: addDays(weekStart, 6),
      }) + createImprovementSheet();
    } else {
      document.querySelector('#view-root').innerHTML = createReviewView({
        review: currentReview,
        plan: currentPlan,
        completed: completedRecords(currentPriorities, currentWorkItems),
        suggestions: currentReviewSuggestions,
        tomorrowPlan: currentTomorrowPlan,
        history: currentHistory,
        editable: editingHistoricalDay,
      });
    }
    document.title = 'Review — TalentisOS';
  } else if (route.key === 'improve') {
    currentImprovements = await getImprovements(database);
    app.innerHTML = createAppShell({ ...route, action: 'Capture improvement' });
    document.querySelector('#view-root').innerHTML = createImproveView(currentImprovements);
    document.title = 'Improve — TalentisOS';
  } else if (route.key === 'playbook') {
    currentPlaybookState = await getPlaybookState(database);
    app.innerHTML = createAppShell(route);
    document.querySelector('#view-root').innerHTML = createPlaybookView(
      playbookTopics,
      currentPlaybookState,
      currentPlaybookQuery,
      currentPlaybookGroup,
    );
    document.title = 'Playbook — TalentisOS';
  } else {
    app.innerHTML = createAppShell(route);
    renderView(route);
    document.title = `${route.label} — TalentisOS`;
  }
  applyTheme(savedTheme());
}

function startOfWeek(date) {
  const next = new Date(date);
  const day = next.getDay() || 7;
  next.setDate(next.getDate() - day + 1);
  return next.toISOString().slice(0, 10);
}

function weeklySummary(closures, priorities, workItems, weekStart, weekEnd) {
  const incomplete = priorities.filter((item) => item.status !== 'done').length;
  const risks = workItems.filter((item) => item.type === 'risk');
  const blockerCounts = new Map();
  risks.forEach((item) => {
    const blocker = (item.whatAtRisk || item.impact || item.title || 'Unspecified risk').trim();
    const key = blocker.toLowerCase();
    const existing = blockerCounts.get(key) || { label: blocker, count: 0 };
    blockerCounts.set(key, { ...existing, count: existing.count + 1 });
  });
  const repeatedBlockers = [...blockerCounts.values()].filter((item) => item.count > 1);
  const mostCommonBlocker = [...blockerCounts.values()].sort((a, b) => b.count - a.count)[0]?.label || '';
  return {
    prioritiesCompleted: priorities.filter((item) => item.status === 'done').length,
    prioritiesCarried: incomplete,
    repeatedRisks: repeatedBlockers.reduce((total, item) => total + item.count, 0),
    repeatedRiskLabels: repeatedBlockers.map((item) => item.label),
    overdueFollowUps: workItems.filter((item) => item.type === 'follow-up' && item.status !== 'complete' && item.dueDate && item.dueDate < new Date().toISOString().slice(0, 10)).length,
    decisionsCompleted: workItems.filter((item) => item.type === 'decision' && item.status === 'decided').length,
    improvementsCaptured: currentImprovements.filter((item) => {
      const createdDate = item.createdAt?.slice(0, 10);
      return createdDate >= weekStart && createdDate <= weekEnd;
    }).length,
    mostCommonBlocker,
    morningPreparations: closures.filter((closure) => closure.snapshot?.plan?.preparedPlanImported).length,
    huddlesCompleted: closures.filter((closure) => closure.snapshot?.plan?.huddleStatus === 'complete').length,
    dayReviewsCompleted: closures.length,
  };
}

function addDays(date, amount) {
  const next = new Date(`${date}T12:00:00`);
  next.setDate(next.getDate() + amount);
  return next.toISOString().slice(0, 10);
}

function createReviewSuggestions(plan, priorities, workItems) {
  const suggestions = priorities
    .filter((item) => item.status !== 'done')
    .map((item) => ({
      key: `priority:${item.id}`,
      sourceType: 'priority',
      sourceId: item.id,
      category: 'Priority',
      title: item.outcome,
      detail: item.why || item.duePoint,
      nextAction: item.duePoint,
    }));
  workItems
    .filter((item) => item.status !== 'complete')
    .forEach((item) => {
      suggestions.push({
        key: `work:${item.id}`,
        sourceType: 'work',
        sourceId: item.id,
        category:
          item.type === 'follow-up' ? 'Follow-up' : item.type[0].toUpperCase() + item.type.slice(1),
        title: item.title,
        detail: item.whatAtRisk || item.decisionRequired || item.whatNeedsToHappen || item.outcome,
        nextAction: item.nextAction || item.dueDate,
      });
    });
  (plan.huddleDiscussions || []).forEach((item, index) =>
    suggestions.push({
      key: `huddle:${index}`,
      sourceType: 'huddle',
      sourceId: index,
      category: 'Huddle',
      title: item,
      detail: 'Parked discussion from today',
    }),
  );
  return suggestions;
}

function completedRecords(priorities, workItems) {
  return [
    ...priorities.filter((item) => item.status === 'done').map((item) => ({ title: item.outcome })),
    ...workItems
      .filter((item) => item.status === 'complete')
      .map((item) => ({ title: item.title })),
  ];
}

function defaultTomorrowItems(suggestions) {
  return suggestions
    .filter((item) => ['Priority', 'Risk', 'Decision', 'Follow-up'].includes(item.category))
    .slice(0, 3)
    .map((item, index) => ({
      id: crypto.randomUUID(),
      sourceId: item.sourceId,
      sourceType: item.sourceType,
      title: item.title,
      outcome: item.detail,
      type: item.category,
      order: index,
      status: 'not-started',
    }));
}

async function importPreparedPlanIfNeeded() {
  const prepared = await getTomorrowPlan(database, currentPlan.date);
  if (currentPlan.preparedPlanImported || !prepared.items?.length || currentPriorities.length)
    return;
  for (const [index, item] of prepared.items.entries()) {
    await savePriority(database, {
      id: crypto.randomUUID(),
      planDate: currentPlan.date,
      order: index,
      outcome: item.title,
      why: item.outcome || '',
      duePoint: item.dueDate || '',
      status: 'not-started',
      completedAt: null,
    });
  }
  currentPlan.preparedPlanImported = true;
  currentPlan.carryover = prepared.items.map((item) => item.title);
  await saveDailyPlan(database, currentPlan);
  currentPriorities = await getPriorities(database, currentPlan.date);
}

function openDialog(dialog) {
  if (!dialog) return;
  dialog.showModal();
  dialog.querySelector('button, [href], input, select, textarea')?.focus();
}

async function openPlaybookTopic(id) {
  const topic = playbookTopics.find((item) => item.id === id);
  if (!topic) return;
  currentPlaybookState = await getPlaybookState(database);
  currentPlaybookState.recentTopicIds = [
    topic.id,
    ...(currentPlaybookState.recentTopicIds || []).filter((topicId) => topicId !== topic.id),
  ].slice(0, 6);
  await savePlaybookState(database, currentPlaybookState);
  const existing = document.querySelector('#playbook-detail');
  existing?.remove();
  app.insertAdjacentHTML('beforeend', createPlaybookDialog(topic, currentPlaybookState.savedTopicIds?.includes(topic.id)));
  openDialog(document.querySelector('#playbook-detail'));
}

function renderPlaybookResults() {
  const viewRoot = document.querySelector('#view-root');
  if (!viewRoot) return;
  viewRoot.innerHTML = createPlaybookView(
    playbookTopics,
    currentPlaybookState,
    currentPlaybookQuery,
    currentPlaybookGroup,
  );
}

function formValues(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function workItemFromForm(form) {
  const values = formValues(form);
  const existing = currentWorkItems.find((item) => item.id === values.id);
  const checkbox = form.elements.escalationRequired;
  return {
    ...(existing || {}),
    id: values.id || crypto.randomUUID(),
    type: values.type,
    group: values.group,
    title: values.title.trim(),
    outcome: values.outcome.trim(),
    responsible: values.responsible.trim(),
    dueDate: values.dueDate,
    status: values.status,
    riskLevel: values.riskLevel,
    nextAction: values.nextAction.trim(),
    notes: values.notes.trim(),
    relatedItemIds: values.relatedItemIds
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean),
    whatAtRisk: values.whatAtRisk?.trim() || '',
    impact: values.impact?.trim() || '',
    immediateAction: values.immediateAction?.trim() || '',
    required: values.required?.trim() || '',
    reviewDate: values.reviewDate || '',
    escalationRequired: checkbox?.checked || false,
    decisionRequired: values.decisionRequired?.trim() || '',
    whyMatters: values.whyMatters?.trim() || '',
    options: values.options?.trim() || '',
    decisionMade: values.decisionMade?.trim() || '',
    resultingAction: values.resultingAction?.trim() || '',
    whatNeedsToHappen: values.whatNeedsToHappen?.trim() || '',
    followedUpWith: values.followedUpWith?.trim() || '',
    why: values.why?.trim() || '',
    result: values.result?.trim() || '',
  };
}

async function persistWorkForm(form) {
  const item = workItemFromForm(form);
  if (!item.title) return;
  const activeNow = currentWorkItems.filter(
    (existing) =>
      existing.group === 'now' && existing.status !== 'complete' && existing.id !== item.id,
  );
  if (item.group === 'now' && item.status !== 'complete' && activeNow.length >= 3) {
    showToast('Now is limited to three active leadership actions.');
    return false;
  }
  if (!form.elements.id.value) form.elements.id.value = item.id;
  await saveWorkItem(database, item);
  currentWorkItems = [...currentWorkItems.filter((existing) => existing.id !== item.id), item];
  form.querySelector('[data-autosave-note]').textContent = 'Saved automatically.';
  window.setTimeout(() => {
    form
      .querySelector('[data-autosave-note]')
      ?.replaceChildren(document.createTextNode('Changes save automatically.'));
  }, 1600);
  return true;
}

function openWorkEditor(item, type = 'action') {
  const dialog = document.querySelector('#work-detail');
  if (!dialog) return;
  if (item) {
    dialog.outerHTML = createWorkDetailSheet(item);
  } else if (type !== 'action') {
    dialog.outerHTML = createWorkDetailSheet({ type });
  }
  const nextDialog = document.querySelector('#work-detail');
  nextDialog?.showModal();
  nextDialog?.querySelector('input:not([type="hidden"]), textarea, select')?.focus();
}

async function completeWorkItem(id) {
  const item = currentWorkItems.find((workItem) => workItem.id === id);
  if (!item) return;
  lastUndo = { item: { ...item } };
  await saveWorkItem(database, {
    ...item,
    status: item.status === 'complete' ? 'in-progress' : 'complete',
  });
  showToast(item.status === 'complete' ? 'Work item reopened.' : 'Work item completed.');
  await render();
}

async function completeOnboarding(answers) {
  await putRecord(database, stores.settings, {
    id: 'primary',
    teamFunction: answers.functionType,
    outcomes: [answers.outcome0, answers.outcome1, answers.outcome2].filter(Boolean),
    workdayStart: answers.startTime,
    morningHuddle: answers.morningHuddle === 'yes',
    reviewTime: answers.reviewTime,
    updatedAt: new Date().toISOString(),
  });
}

function openPriorityEditor(priority) {
  const dialog = document.querySelector('#priority-sheet');
  const form = dialog?.querySelector('[data-priority-form]');
  if (!dialog || !form) return;
  form.reset();
  form.elements.id.value = priority?.id || '';
  form.elements.outcome.value = priority?.outcome || '';
  form.elements.why.value = priority?.why || '';
  form.elements.duePoint.value = priority?.duePoint || '';
  form.elements.status.value = priority?.status || 'not-started';
  dialog.querySelector('#priority-sheet-title').textContent = priority
    ? 'Edit priority'
    : 'Add a priority';
  openDialog(dialog);
}

async function savePriorityForm(form) {
  const values = formValues(form);
  const existing = currentPriorities.find((priority) => priority.id === values.id);
  if (!existing && currentPriorities.length >= 3) {
    showToast('Keep the day focused: three priorities is the limit.');
    return;
  }
  await savePriority(database, {
    id: values.id || crypto.randomUUID(),
    planDate: currentPlan.date,
    order: existing?.order ?? currentPriorities.length,
    outcome: values.outcome.trim(),
    why: values.why.trim(),
    duePoint: values.duePoint.trim(),
    status: values.status,
    completedAt: values.status === 'done' ? new Date().toISOString() : null,
  });
  form.closest('dialog').close();
  showToast(existing ? 'Priority updated.' : 'Priority added.');
  await render();
}

async function movePriority(id, direction) {
  const index = currentPriorities.findIndex((priority) => priority.id === id);
  const nextIndex = direction === 'up' ? index - 1 : index + 1;
  if (index < 0 || nextIndex < 0 || nextIndex >= currentPriorities.length) return;
  const current = currentPriorities[index];
  const next = currentPriorities[nextIndex];
  await savePriority(database, { ...current, order: next.order });
  await savePriority(database, { ...next, order: current.order });
  await render();
}

function tomorrowItemsFromReview() {
  return currentReview.tomorrowItems || currentTomorrowPlan.items || [];
}

async function applyReviewAction(key, action) {
  const suggestion = currentReviewSuggestions.find((item) => item.key === key);
  if (!suggestion) return;
  let reason = '';
  if (action === 'defer') {
    reason = window.prompt('Why is this being deferred?') || '';
    if (!reason) return;
  }
  currentReview.actions = { ...currentReview.actions, [key]: { action, reason } };
  let tomorrowItems = tomorrowItemsFromReview();
  if (
    ['carry-forward', 'defer', 'escalate'].includes(action) &&
    !tomorrowItems.some((item) => item.sourceId === suggestion.sourceId)
  ) {
    tomorrowItems = [
      ...tomorrowItems,
      {
        id: crypto.randomUUID(),
        sourceId: suggestion.sourceId,
        sourceType: suggestion.sourceType,
        title: suggestion.title,
        outcome: suggestion.detail,
        type: suggestion.category,
        order: tomorrowItems.length,
        status: 'not-started',
        deferReason: reason,
      },
    ];
  }
  if (['complete', 'remove', 'improve'].includes(action)) {
    tomorrowItems = tomorrowItems.filter((item) => item.sourceId !== suggestion.sourceId);
  }
  currentReview.tomorrowItems = tomorrowItems.map((item, index) => ({ ...item, order: index }));
  if (suggestion.sourceType === 'priority') {
    const source = currentPriorities.find((item) => item.id === suggestion.sourceId);
    if (source && action === 'complete')
      await savePriority(database, {
        ...source,
        status: 'done',
        completedAt: new Date().toISOString(),
      });
  }
  if (suggestion.sourceType === 'work') {
    const source = currentWorkItems.find((item) => item.id === suggestion.sourceId);
    if (source && ['complete', 'escalate'].includes(action))
      await saveWorkItem(database, {
        ...source,
        status: action === 'complete' ? 'complete' : 'at-risk',
      });
  }
  await saveDailyReview(database, currentReview);
  await render();
}

async function finishReview() {
  const tomorrowDate = addDays(currentReviewDate, 1);
  const tomorrowItems = tomorrowItemsFromReview();
  const tomorrow = {
    date: tomorrowDate,
    items: tomorrowItems,
    meetings: currentPlan.meetings || [],
    risks: currentReviewSuggestions
      .filter((item) => item.category === 'Risk')
      .map((item) => item.title),
    decisions: currentReviewSuggestions
      .filter((item) => item.category === 'Decision')
      .map((item) => item.title),
    followUps: currentReviewSuggestions
      .filter((item) => item.category === 'Follow-up')
      .map((item) => item.title),
    confirmed: true,
  };
  const review = {
    ...currentReview,
    closed: true,
    closedAt: new Date().toISOString(),
    summary: currentReview.improvement || 'Day reviewed and tomorrow prepared.',
  };
  const snapshot = {
    plan: currentPlan,
    priorities: currentPriorities,
    workItems: currentWorkItems,
    completedWork: completedRecords(currentPriorities, currentWorkItems).map((item) => item.title),
    tomorrow,
    summary: review.summary,
  };
  await saveTomorrowPlan(database, tomorrow);
  await saveDailyReview(database, review);
  await saveDayClosure(database, { date: currentReviewDate, closedAt: review.closedAt, snapshot });
  currentReview = review;
  showToast('Today is closed. Tomorrow is prepared.');
  await render();
}

async function reorderTomorrow(id, direction) {
  const items = [...tomorrowItemsFromReview()];
  const index = items.findIndex((item) => item.id === id);
  const nextIndex = direction === 'up' ? index - 1 : index + 1;
  if (index < 0 || nextIndex < 0 || nextIndex >= items.length) return;
  [items[index], items[nextIndex]] = [items[nextIndex], items[index]];
  currentReview.tomorrowItems = items.map((item, itemIndex) => ({ ...item, order: itemIndex }));
  await saveDailyReview(database, currentReview);
  await render();
}

document.addEventListener('submit', async (event) => {
  const onboardingForm = event.target.closest('[data-onboarding-form]');
  if (onboardingForm) {
    event.preventDefault();
    const values = formValues(onboardingForm);
    onboardingState = await saveOnboardingState(database, {
      ...onboardingState,
      step: Number(onboardingForm.dataset.step) + 1,
      answers: { ...onboardingState.answers, ...values },
      completed: Number(onboardingForm.dataset.step) === 4,
      completionSeen: onboardingState.completionSeen || false,
    });
    if (onboardingState.completed) await completeOnboarding(onboardingState.answers);
    showToast(onboardingState.completed ? 'Your playbook is ready.' : 'Saved.');
    await render();
    return;
  }
  const priorityForm = event.target.closest('[data-priority-form]');
  if (priorityForm) {
    event.preventDefault();
    await savePriorityForm(priorityForm);
    return;
  }
  const workForm = event.target.closest('[data-work-form]');
  if (workForm) {
    event.preventDefault();
    const saved = await persistWorkForm(workForm);
    if (!saved) return;
    workForm.closest('dialog').close();
    showToast('Work item saved.');
    await render();
    return;
  }
  const improvementForm = event.target.closest('[data-improvement-form]');
  if (improvementForm) {
    event.preventDefault();
    const values = formValues(improvementForm);
    await saveImprovement(database, {
      id: values.id || crypto.randomUUID(),
      notWorking: values.notWorking.trim(),
      change: values.change.trim(),
      why: values.why.trim(),
      nextStep: values.nextStep.trim(),
      category: values.category,
      status: values.status,
      createdAt: values.id ? currentImprovements.find((item) => item.id === values.id)?.createdAt : new Date().toISOString(),
    });
    improvementForm.closest('dialog').close();
    showToast('Improvement saved.');
    await render();
  }
});

document.addEventListener('input', (event) => {
  const playbookSearch = event.target.closest('[data-playbook-search]');
  if (playbookSearch) {
    currentPlaybookQuery = playbookSearch.value;
    renderPlaybookResults();
    const nextSearch = document.querySelector('[data-playbook-search]');
    nextSearch?.focus();
    nextSearch?.setSelectionRange(currentPlaybookQuery.length, currentPlaybookQuery.length);
    return;
  }
  const reviewImprovement = event.target.closest('[data-review-improvement]');
  if (reviewImprovement) {
    window.clearTimeout(autosaveTimer);
    autosaveTimer = window.setTimeout(async () => {
      currentReview.improvement = reviewImprovement.value;
      await saveDailyReview(database, currentReview);
    }, 500);
    return;
  }
  const weeklyAnswer = event.target.closest('[data-weekly-answer]');
  if (weeklyAnswer && currentWeeklyReview) {
    window.clearTimeout(autosaveTimer);
    autosaveTimer = window.setTimeout(async () => {
      currentWeeklyReview.answers = { ...currentWeeklyReview.answers, [weeklyAnswer.dataset.weeklyAnswer]: weeklyAnswer.value };
      await saveWeeklyReview(database, currentWeeklyReview);
    }, 500);
    return;
  }
  const weeklyPriority = event.target.closest('[data-weekly-priority]');
  if (weeklyPriority && currentWeeklyReview) {
    window.clearTimeout(autosaveTimer);
    autosaveTimer = window.setTimeout(async () => {
      const priorities = [...(currentWeeklyReview.nextPriorities || ['', '', ''])];
      priorities[Number(weeklyPriority.dataset.weeklyPriority)] = weeklyPriority.value;
      currentWeeklyReview.nextPriorities = priorities;
      await saveWeeklyReview(database, currentWeeklyReview);
    }, 500);
    return;
  }
  const weeklyImprovement = event.target.closest('[data-weekly-improvement]');
  const weeklyFocus = event.target.closest('[data-weekly-focus]');
  if ((weeklyImprovement || weeklyFocus) && currentWeeklyReview) {
    window.clearTimeout(autosaveTimer);
    autosaveTimer = window.setTimeout(async () => {
      if (weeklyImprovement) currentWeeklyReview.operatingImprovement = weeklyImprovement.value;
      if (weeklyFocus) currentWeeklyReview.leadershipFocus = weeklyFocus.value;
      await saveWeeklyReview(database, currentWeeklyReview);
    }, 500);
    return;
  }
  const workForm = event.target.closest('[data-work-form]');
  if (!workForm) return;
  window.clearTimeout(autosaveTimer);
  autosaveTimer = window.setTimeout(() => persistWorkForm(workForm), 600);
});

document.addEventListener('change', (event) => {
  const restoreFile = event.target.closest('[data-restore-file]');
  if (restoreFile) {
    handleRestoreFile(restoreFile.files?.[0]);
    return;
  }
  const csvFile = event.target.closest('[data-csv-file]');
  if (csvFile) {
    handleCsvFile(csvFile.files?.[0]);
    return;
  }
  const workType = event.target.closest('[data-work-form] select[name="type"]');
  if (!workType) return;
  const form = workType.closest('[data-work-form]');
  const current = workItemFromForm(form);
  form.querySelector('[data-type-fields]').innerHTML = workTypeFields(workType.value, current);
  form.querySelector('select[name="status"]').innerHTML = workStatusOptions(workType.value, '');
});

document.addEventListener('click', async (event) => {
  const themeButton = event.target.closest('[data-theme-choice]');
  if (themeButton) {
    applyTheme(themeButton.dataset.themeChoice, true);
    return;
  }

  const settingsButton = event.target.closest('[data-open-settings]');
  if (settingsButton) {
    openDialog(document.querySelector('#settings-dialog'));
    return;
  }

  if (event.target.closest('[data-open-data]')) {
    currentSnapshots = await getBackupSnapshots(database);
    document.body.insertAdjacentHTML('beforeend', createDataDialog(currentSnapshots));
    openDialog(document.querySelector('#data-dialog'));
    return;
  }

  if (event.target.closest('[data-export-backup]')) {
    await exportBackup();
    return;
  }

  if (event.target.closest('[data-export-csv]')) {
    await exportCsv(dataDialog()?.querySelector('[data-csv-type]')?.value || 'priorities');
    return;
  }

  if (event.target.closest('[data-download-csv-template]')) {
    const type = dataDialog()?.querySelector('[data-csv-type]')?.value || 'priorities';
    if (['priorities', 'risks', 'decisions', 'followUps', 'improvements'].includes(type)) {
      downloadFile(csvTemplate(type), `TalentisOS_${type}_template.csv`, 'text/csv;charset=utf-8');
      showToast('CSV template downloaded.');
    } else {
      showToast('Templates are available for importable CSV datasets.');
    }
    return;
  }

  if (event.target.closest('[data-restore-apply]') && pendingRestore) {
    const mode = dataDialog()?.querySelector('[data-restore-mode]')?.value || 'replace';
    await applyRestore(pendingRestore, mode);
    document.querySelector('#data-dialog')?.remove();
    return;
  }

  if (event.target.closest('[data-restore-cancel]')) {
    pendingRestore = null;
    dataDialog()?.querySelector('[data-restore-preview]')?.setAttribute('hidden', '');
    return;
  }

  if (event.target.closest('[data-csv-apply]')) {
    await applyCsvImport();
    return;
  }

  if (event.target.closest('[data-csv-cancel]')) {
    pendingCsvImport = null;
    dataDialog()?.querySelector('[data-csv-preview]')?.setAttribute('hidden', '');
    return;
  }

  const restoreSnapshot = event.target.closest('[data-restore-snapshot]');
  if (restoreSnapshot) {
    const snapshot = currentSnapshots.find((item) => item.id === restoreSnapshot.dataset.restoreSnapshot);
    if (snapshot) showRestorePreview(snapshot.backup, 'snapshot');
    return;
  }

  if (event.target.closest('[data-delete-all-data]')) {
    const confirmed = window.confirm('This will permanently delete all workspace records. Export a backup now?');
    if (!confirmed) return;
    await exportBackup();
    const phrase = window.prompt('Type DELETE ALL DATA to confirm permanent deletion.');
    if (phrase !== 'DELETE ALL DATA') {
      showToast('Deletion cancelled.');
      return;
    }
    await clearWorkspaceData(database);
    document.querySelector('#data-dialog')?.remove();
    onboardingState = await getOnboardingState(database);
    showToast('All workspace data was deleted.');
    await render();
    return;
  }

  const playbookTopicButton = event.target.closest('[data-open-playbook-topic]');
  if (playbookTopicButton) {
    await openPlaybookTopic(playbookTopicButton.dataset.openPlaybookTopic);
    return;
  }

  const playbookGroup = event.target.closest('[data-playbook-group]');
  if (playbookGroup) {
    currentPlaybookGroup = playbookGroup.dataset.playbookGroup;
    renderPlaybookResults();
    return;
  }

  const playbookSave = event.target.closest('[data-playbook-save]');
  if (playbookSave) {
    const topicId = playbookSave.dataset.playbookSave;
    const saved = new Set(currentPlaybookState.savedTopicIds || []);
    if (saved.has(topicId)) {
      saved.delete(topicId);
      playbookSave.textContent = 'Save topic';
      showToast('Topic removed from saved.');
    } else {
      saved.add(topicId);
      playbookSave.textContent = 'Remove from saved';
      showToast('Topic saved locally.');
    }
    currentPlaybookState.savedTopicIds = [...saved];
    await savePlaybookState(database, currentPlaybookState);
    return;
  }

  const closeButton = event.target.closest('[data-close-dialog]');
  if (closeButton) closeButton.closest('dialog')?.close();

  const collapseButton = event.target.closest('[data-toggle-sidebar]');
  if (collapseButton) {
    const collapsed = document.body.classList.toggle('sidebar-collapsed');
    collapseButton.setAttribute('aria-expanded', String(!collapsed));
    showToast(collapsed ? 'Sidebar collapsed.' : 'Sidebar expanded.');
    return;
  }

  const reviewAction = event.target.closest('[data-review-action]');
  if (reviewAction) {
    await applyReviewAction(reviewAction.dataset.reviewKey, reviewAction.dataset.reviewAction);
    return;
  }

  if (event.target.closest('[data-weekly-save]')) {
    await saveWeeklyReview(database, currentWeeklyReview);
    showToast('Weekly review saved locally.');
    return;
  }

  const repeatedRiskButton = event.target.closest('[data-improvement-from-risk]');
  if (repeatedRiskButton) {
    const dialog = document.querySelector('#improvement-detail');
    if (dialog) {
      dialog.outerHTML = createImprovementSheet({
        notWorking: repeatedRiskButton.dataset.improvementFromRisk,
        change: 'Define and test a small change that prevents this risk from repeating.',
        why: 'Reduce a recurring blocker in the operating rhythm.',
        category: 'workflow',
        status: 'captured',
      });
      document.querySelector('#improvement-detail')?.showModal();
      document.querySelector('#improvement-detail textarea')?.focus();
    }
    return;
  }

  if (event.target.closest('[data-add-improvement]') || (event.target.closest('[data-primary-action]') && getRoute().key === 'improve')) {
    const dialog = document.querySelector('#improvement-detail');
    dialog?.showModal();
    dialog?.querySelector('textarea')?.focus();
    return;
  }

  const editImprovement = event.target.closest('[data-edit-improvement]');
  if (editImprovement) {
    const item = currentImprovements.find((improvement) => improvement.id === editImprovement.dataset.editImprovement);
    const dialog = document.querySelector('#improvement-detail');
    if (dialog && item) {
      dialog.outerHTML = createImprovementSheet(item);
      document.querySelector('#improvement-detail')?.showModal();
      document.querySelector('#improvement-detail textarea')?.focus();
    }
    return;
  }

  const deleteImprovementButton = event.target.closest('[data-delete-improvement]');
  if (deleteImprovementButton) {
    if (window.confirm('Delete this improvement?')) {
      await deleteImprovement(database, deleteImprovementButton.dataset.deleteImprovement);
      showToast('Improvement deleted.');
      await render();
    }
    return;
  }

  if (event.target.closest('[data-review-finish]')) {
    await finishReview();
    return;
  }

  if (event.target.closest('[data-review-done]')) {
    window.location.hash = '#today';
    currentReviewDate = undefined;
    editingHistoricalDay = false;
    await render();
    return;
  }

  if (event.target.closest('[data-tomorrow-confirm]')) {
    await saveTomorrowPlan(database, {
      ...currentTomorrowPlan,
      date: addDays(currentReviewDate, 1),
      items: tomorrowItemsFromReview(),
      confirmed: true,
    });
    showToast('Tomorrow is prepared.');
    return;
  }

  const tomorrowAdd = event.target.closest('[data-tomorrow-add]');
  if (tomorrowAdd) {
    const title = window.prompt('What is the one item to add for tomorrow?');
    if (title?.trim()) {
      currentReview.tomorrowItems = [
        ...tomorrowItemsFromReview(),
        {
          id: crypto.randomUUID(),
          title: title.trim(),
          outcome: '',
          type: 'Action',
          order: tomorrowItemsFromReview().length,
          status: 'not-started',
        },
      ];
      await saveDailyReview(database, currentReview);
      await render();
    }
    return;
  }

  const tomorrowMove = event.target.closest('[data-tomorrow-move]');
  if (tomorrowMove) {
    await reorderTomorrow(tomorrowMove.dataset.tomorrowMove, tomorrowMove.dataset.direction);
    return;
  }

  const tomorrowRemove = event.target.closest('[data-tomorrow-remove]');
  if (tomorrowRemove) {
    currentReview.tomorrowItems = tomorrowItemsFromReview()
      .filter((item) => item.id !== tomorrowRemove.dataset.tomorrowRemove)
      .map((item, index) => ({ ...item, order: index }));
    await saveDailyReview(database, currentReview);
    await render();
    return;
  }

  const historyOpen = event.target.closest('[data-history-open]');
  if (historyOpen) {
    const closure = currentHistory.find((item) => item.date === historyOpen.dataset.historyOpen);
    if (closure) {
      document.body.insertAdjacentHTML('beforeend', createHistoryDialog(closure));
      openDialog(document.querySelector('#history-dialog'));
    }
    return;
  }

  const historyEdit = event.target.closest('[data-history-edit]');
  if (historyEdit) {
    document.querySelector('#history-dialog')?.close();
    currentReviewDate = historyEdit.dataset.historyEdit;
    editingHistoricalDay = true;
    await render();
    return;
  }

  const workFilter = event.target.closest('[data-work-filter]');
  if (workFilter) {
    currentWorkFilter = workFilter.dataset.workFilter;
    await render();
    return;
  }

  const quickAdd = event.target.closest('[data-quick-add]');
  if (quickAdd) {
    openWorkEditor(null, quickAdd.dataset.quickAdd);
    return;
  }

  if (event.target.closest('[data-primary-action]') && getRoute().key === 'work') {
    openWorkEditor(null, 'action');
    return;
  }

  if (event.target.closest('[data-primary-action]') && getRoute().key === 'review') {
    if (currentReview.closed) {
      window.location.hash = '#today';
      currentReviewDate = undefined;
      await render();
    } else {
      await finishReview();
    }
    return;
  }

  const editWork = event.target.closest('[data-edit-work]');
  if (editWork) {
    openWorkEditor(currentWorkItems.find((item) => item.id === editWork.dataset.editWork));
    return;
  }

  const completeWork = event.target.closest('[data-complete-work]');
  if (completeWork) {
    await completeWorkItem(completeWork.dataset.completeWork);
    return;
  }

  if (event.target.closest('[data-undo-work]') && lastUndo) {
    await saveWorkItem(database, lastUndo.item);
    lastUndo = null;
    showToast('Work item restored.');
    await render();
    return;
  }

  const deleteWork = event.target.closest('[data-delete-work]');
  if (deleteWork) {
    const item = currentWorkItems.find((workItem) => workItem.id === deleteWork.dataset.deleteWork);
    if (item && window.confirm('Delete this work item?')) {
      lastUndo = { item: { ...item } };
      await deleteWorkItem(database, item.id);
      showToast('Work item deleted.');
      await render();
    }
    return;
  }

  if (event.target.closest('[data-onboarding-save]')) {
    onboardingState = await saveOnboardingState(database, onboardingState);
    showToast('Progress saved. You can resume here anytime.');
    return;
  }

  if (event.target.closest('[data-onboarding-back]')) {
    onboardingState = await saveOnboardingState(database, {
      ...onboardingState,
      step: Math.max(0, onboardingState.step - 1),
    });
    await render();
    return;
  }

  const suggestion = event.target.closest('[data-fill-outcome]');
  if (suggestion) {
    const firstEmpty = [...document.querySelectorAll('[name^="outcome"]')].find(
      (input) => !input.value,
    );
    if (firstEmpty) firstEmpty.value = suggestion.dataset.fillOutcome;
    return;
  }

  if (event.target.closest('[data-start-today]')) {
    onboardingState = await saveOnboardingState(database, {
      ...onboardingState,
      completionSeen: true,
    });
    window.location.hash = '#today';
    await render();
    return;
  }

  if (event.target.closest('[data-primary-action]') && getRoute().key === 'today') {
    if (currentPriorities.length < 3) openPriorityEditor();
    else showToast('Your three priorities are set. Keep the focus clear.');
    return;
  }

  if (event.target.closest('[data-add-priority]')) {
    openPriorityEditor();
    return;
  }

  const editButton = event.target.closest('[data-edit-priority]');
  if (editButton) {
    openPriorityEditor(
      currentPriorities.find((priority) => priority.id === editButton.dataset.editPriority),
    );
    return;
  }

  const moveButton = event.target.closest('[data-move-priority]');
  if (moveButton) {
    await movePriority(moveButton.dataset.movePriority, moveButton.dataset.direction);
    return;
  }

  const completeButton = event.target.closest('[data-complete-priority]');
  if (completeButton) {
    const priority = currentPriorities.find(
      (item) => item.id === completeButton.dataset.completePriority,
    );
    if (priority) {
      await savePriority(database, {
        ...priority,
        status: priority.status === 'done' ? 'in-progress' : 'done',
        completedAt: priority.status === 'done' ? null : new Date().toISOString(),
      });
      await render();
    }
  }
});

window.addEventListener('hashchange', () => render());
themeQuery.addEventListener('change', () => {
  if (document.documentElement.dataset.theme === 'system') applyTheme('system');
});

async function initialize() {
  try {
    database = await openDatabase();
    onboardingState = await getOnboardingState(database);
    try {
      await ensureAutomaticSnapshots();
    } catch {
      // Snapshot creation is best-effort and must never block the local workspace.
    }
    document.documentElement.dataset.appReady = 'true';
    await render();
  } catch {
    app.innerHTML =
      '<main class="error-screen"><h1>TalentisOS could not open its local workspace.</h1><p>Refresh the page and try again.</p></main>';
  }
}

initialize();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      registration.addEventListener('updatefound', () => showToast('A fresh version is ready.'));
      navigator.serviceWorker.addEventListener('controllerchange', () =>
        showToast('TalentisOS is up to date.'),
      );
    } catch {
      showToast('Offline support is unavailable in this browser session.');
    }
  });
}
