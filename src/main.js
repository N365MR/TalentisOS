import './styles.css';
import {
  createAppShell,
  createOnboarding,
  createToast,
  createTodayView,
  createEodView,
  createJourneyView,
  createMeetingBuilderDialog,
  createMeetingScheduleCard,
  createMeetingScheduleDialog,
  createHistoryDialog,
  createReviewView,
  createWeeklyReviewView,
  createL10View,
  createL10IssueDialog,
  createL10SettingsDialog,
  createL10MeetingDetailDialog,
  createImproveView,
  createImprovementSheet,
  createPlaybookView,
  createPlaybookDialog,
  playbookTopics,
  escapeHtml,
  createDataDialog,
  createSnapshotDeleteDialog,
  createResetOnboardingDialog,
  createDeleteAllDataDialog,
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
  getJourneyState,
  getL10Settings,
  getL10Meeting,
  getL10Meetings,
  getL10Collection,
  getMeetingSchedules,
  getEodRecord,
  getEodRecords,
  saveEodRecord,
  savePlaybookState,
  saveJourneyState,
  saveL10Record,
  deleteRecord,
  saveMeetingSchedule,
  deleteMeetingSchedule,
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
import { getJourneyProgress } from './journey.js';
import { L10_AGENDA, l10WeekStart, l10WeekEnd, l10RemainingSeconds, scorecardStatus, defaultL10Meeting } from './l10.js';
import { dateOnly } from './meetings.js';

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
let currentL10Meeting;
let currentMeetingSchedules = [];
let currentEodFilter = 'all';
let currentImprovements = [];
let currentPlaybookState = { savedTopicIds: [], recentTopicIds: [] };
let currentJourneyState = { id: 'primary', completedMilestoneIds: [], meetingPreparation: {} };
let selectedJourneyMilestoneId = '';
let currentPlaybookQuery = '';
let currentPlaybookGroup = 'All topics';
let currentSnapshots = [];
let pendingRestore = null;
let pendingCsvImport = null;
let updateRequested = false;
let autosaveTimer;
let lastUndo;
let l10TimerInterval;
let journeyTouchStartX = null;

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

function showUpdateToast(registration) {
  toastRegion.replaceChildren();
  toastRegion.innerHTML = createToast('A new TalentisOS version is ready. Your saved data is safe.');
  const toast = toastRegion.firstElementChild;
  const update = document.createElement('button');
  update.className = 'toast__action';
  update.type = 'button';
  update.textContent = 'Update now';
  update.addEventListener('click', () => {
    updateRequested = true;
    registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
  });
  const later = document.createElement('button');
  later.className = 'toast__action';
  later.type = 'button';
  later.textContent = 'Later';
  later.addEventListener('click', () => toast.remove());
  toast.append(update, later);
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
    return localStorage.getItem('talentisos-theme') || 'dark';
  } catch {
    return 'dark';
  }
}

async function collectBackupData() {
  const read = async (storeName) => getAll(database, storeName);
  const dailyPlans = await read(stores.dailyPlans);
  const workItems = await read(stores.workItems);
  const playbookState = await read(stores.playbookState);
  const journeyState = await read(stores.journeyState);
  const l10Settings = await read(stores.l10Settings);
  const meetingSchedules = await read(stores.meetingSchedules);
  const eodRecords = await read(stores.eodRecords);
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
    completedPlaybookTopics: playbookState[0]?.completedTopicIds || [],
    journeyState,
    l10Settings,
    l10ScorecardMetrics: await read(stores.l10ScorecardMetrics),
    l10ScorecardEntries: await read(stores.l10ScorecardEntries),
    l10Rocks: await read(stores.l10Rocks),
    l10Issues: await read(stores.l10Issues),
    l10Meetings: await read(stores.l10Meetings),
    meetingSchedules,
    eodRecords,
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

function exportSnapshot(snapshot) {
  if (!snapshot?.backup) return;
  downloadFile(JSON.stringify(snapshot.backup, null, 2), `TalentisOS_Snapshot_${dateStamp()}.json`, 'application/json');
  showToast('Snapshot exported locally.');
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
  if (type === 'l10Todos') return data.l10Meetings.flatMap((meeting) => (meeting.todos || []).map((todo) => ({ ...todo, meetingId: meeting.id })));
  if (type === 'l10Meetings') return data.l10Meetings.map((meeting) => ({ id: meeting.id, weekStart: meeting.weekStart, weekEnd: meeting.weekEnd || '', meetingAt: meeting.meetingAt, rating: meeting.rating || '', completedAt: meeting.completedAt || '', meetingImprovement: meeting.meetingImprovement || '' }));
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
    currentJourneyState = await getJourneyState(database);
    currentMeetingSchedules = await getMeetingSchedules(database);
    await importPreparedPlanIfNeeded();
    const action = currentPriorities.length < 3 ? 'Add a priority' : 'Review priorities';
    app.innerHTML = createAppShell({ ...route, action });
    document.querySelector('#view-root').innerHTML = createTodayView(
      currentPlan,
      currentPriorities,
      currentWorkItems,
    );
    document.querySelector('#view-root').insertAdjacentHTML('afterbegin', `${createMeetingScheduleCard(currentMeetingSchedules)}<section class="journey-today-card" aria-labelledby="journey-today-title"><div><p class="eyebrow">Your journey</p><h2 id="journey-today-title">Continue your first 90 days</h2><p class="secondary-text">Your next leadership milestone is ready.</p></div><a class="secondary-action" href="#journey">Open journey <span aria-hidden="true">→</span></a></section>${createMeetingScheduleDialog(currentMeetingSchedules)}`);
    document.title = 'Today — TalentisOS';
  } else if (route.key === 'journey') {
    currentJourneyState = await getJourneyState(database);
    app.innerHTML = createAppShell(route);
    document.querySelector('#view-root').innerHTML = createJourneyView(currentJourneyState, selectedJourneyMilestoneId) + createMeetingBuilderDialog(currentJourneyState);
    document.title = 'Journey — TalentisOS';
  } else if (route.key === 'eod') {
    const eodDate = dateOnly();
    const existingEod = await getEodRecord(database, eodDate);
    const eod = existingEod || { id: `eod-${eodDate}`, date: eodDate, status: 'not-started', step: 0, completedTaskIds: [], outstandingTaskIds: [], riskIds: [], tomorrowPriorityIds: [], tomorrowNote: '', handoverNote: '' };
    const eodHistory = await getEodRecords(database);
    currentWorkItems = await getWorkItems(database);
    app.innerHTML = createAppShell(route);
    document.querySelector('#view-root').innerHTML = createEodView({ eod, date: eodDate, workItems: currentWorkItems, history: eodHistory.filter((item) => item.date !== eodDate), filter: currentEodFilter });
    document.title = 'End of Day — TalentisOS';
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
    if (route.subroute === 'l10') {
      const weekStart = l10WeekStart(new Date());
      const l10Settings = await getL10Settings(database);
      currentL10Meeting = await getL10Meeting(database, weekStart) || defaultL10Meeting(weekStart);
      const l10Data = {
        settings: l10Settings,
        meeting: currentL10Meeting,
        metrics: await getL10Collection(database, 'l10ScorecardMetrics'),
        entries: await getL10Collection(database, 'l10ScorecardEntries'),
        rocks: await getL10Collection(database, 'l10Rocks'),
        issues: await getL10Collection(database, 'l10Issues'),
        history: await getL10Meetings(database),
        weekStart,
      };
      app.innerHTML = createAppShell({ ...route, label: 'Review', action: 'Finish Day' });
      document.querySelector('#view-root').innerHTML = createL10View(l10Data) + l10Data.history.map((item) => createL10MeetingDetailDialog(item)).join('') + createL10IssueDialog() + createL10SettingsDialog(l10Settings) + createImprovementSheet();
      document.querySelector('#view-root').insertAdjacentHTML('afterbegin', '<button type="button" class="secondary-action l10-settings-trigger" data-open-l10-settings>Meeting setup</button>');
      const activeSection = document.querySelector('.l10-active-section');
      document.querySelector('.l10-intro')?.insertAdjacentHTML('beforeend', `<form class="l10-week-form" data-l10-week-form><label>Week ending<input type="date" name="weekEnd" value="${escapeHtml(currentL10Meeting.weekEnd || l10WeekEnd(weekStart))}" required></label><button class="secondary-action" type="submit">Save date</button></form>`);
      const timerSeconds = l10RemainingSeconds(currentL10Meeting, currentL10Meeting.currentSection);
      activeSection?.querySelector('h2')?.insertAdjacentHTML('afterend', `<div class="l10-timer" aria-live="polite"><strong data-l10-timer>${String(Math.floor(timerSeconds / 60)).padStart(2, '0')}:${String(timerSeconds % 60).padStart(2, '0')}</strong><button type="button" class="secondary-action" data-l10-timer-toggle>${currentL10Meeting.timer?.startedAt ? 'Pause timer' : currentL10Meeting.timer?.paused ? 'Resume timer' : 'Start timer'}</button></div>`);
      window.clearInterval(l10TimerInterval);
      if (currentL10Meeting.timer?.startedAt) l10TimerInterval = window.setInterval(() => { const seconds = l10RemainingSeconds(currentL10Meeting, currentL10Meeting.currentSection); const timer = document.querySelector('[data-l10-timer]'); if (timer) timer.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`; }, 1000);
      document.title = 'L10 Meeting — TalentisOS';
    } else if (route.subroute === 'weekly') {
      const weekStart = startOfWeek(new Date());
      currentWeeklyReview = await getWeeklyReview(database, weekStart);
      const l10MeetingForWeek = await getL10Meeting(database, weekStart);
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
      if (l10MeetingForWeek) document.querySelector('#view-root').insertAdjacentHTML('afterbegin', `<section class="l10-weekly-link"><div><p class="eyebrow">L10 meeting connection</p><h2>${l10MeetingForWeek.completedAt ? 'L10 completed' : 'L10 in progress'}</h2><p class="secondary-text">${l10MeetingForWeek.todos?.filter((todo) => todo.status === 'done').length || 0} To-Dos complete · ${l10MeetingForWeek.issueIds?.length || 0} linked Issues · Rating ${escapeHtml(l10MeetingForWeek.rating || 'Not rated')}</p></div><a class="secondary-action" href="#review/l10">Open L10 meeting <span aria-hidden="true">→</span></a></section>`);
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
  app.insertAdjacentHTML('beforeend', createPlaybookDialog(topic, currentPlaybookState.savedTopicIds?.includes(topic.id), currentPlaybookState.completedTopicIds?.includes(topic.id)));
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

function draftStorageKey(form) {
  return form.matches('[data-priority-form]') ? 'talentisos-draft-priority' : 'talentisos-draft-improvement';
}

function saveDraft(form) {
  try {
    localStorage.setItem(draftStorageKey(form), JSON.stringify(formValues(form)));
  } catch {
    // Draft saving is best effort when browser storage is unavailable.
  }
}

function restoreDraft(form) {
  try {
    const draft = JSON.parse(localStorage.getItem(draftStorageKey(form)) || 'null');
    if (!draft || form.elements.id?.value) return;
    Object.entries(draft).forEach(([name, value]) => {
      if (form.elements[name]) form.elements[name].value = value;
    });
  } catch {
    // Ignore malformed or unavailable browser draft storage.
  }
}

function clearDraft(form) {
  try {
    localStorage.removeItem(draftStorageKey(form));
  } catch {
    // Ignore unavailable browser draft storage.
  }
}

function workItemFromForm(form) {
  const values = formValues(form);
  const existing = currentWorkItems.find((item) => item.id === values.id);
  const checkbox = form.elements.escalationRequired;
  const subtaskTitles = values.subtasksText == null ? null : values.subtasksText.split('\n').map((title) => title.trim()).filter(Boolean);
  const subtasks = subtaskTitles == null ? (existing?.subtasks || []) : subtaskTitles.map((title) => {
    const previous = (existing?.subtasks || []).find((subtask) => subtask.title === title);
    return previous || { id: crypto.randomUUID(), title, completed: false, createdAt: new Date().toISOString() };
  });
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
    ...(subtaskTitles == null ? {} : { subtasks }),
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
    leadershipSituation: answers.leadershipSituation,
    teamFunction: answers.workType,
    guidanceLevel: answers.guidanceLevel,
    workdayStart: answers.startTime,
    reviewTime: answers.reviewTime,
    leaderRole: answers.leaderRole,
    reportingRoles: (answers.reportingRoles || '').split('\n').map((role) => role.trim()).filter(Boolean),
    teamStructure: answers.teamStructure,
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
  if (!priority) restoreDraft(form);
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
  clearDraft(form);
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

document.addEventListener('touchstart', (event) => {
  if (getRoute().key === 'journey' && event.touches.length === 1) journeyTouchStartX = event.touches[0].clientX;
}, { passive: true });

document.addEventListener('touchend', async (event) => {
  if (getRoute().key !== 'journey' || journeyTouchStartX === null) return;
  const distance = event.changedTouches[0].clientX - journeyTouchStartX;
  journeyTouchStartX = null;
  if (Math.abs(distance) < 60) return;
  const progress = getJourneyProgress(currentJourneyState);
  const currentIndex = progress.milestones.findIndex((milestone) => milestone.id === (selectedJourneyMilestoneId || progress.current.id));
  const nextIndex = Math.max(0, Math.min(progress.milestones.length - 1, currentIndex + (distance < 0 ? 1 : -1)));
  if (nextIndex !== currentIndex) {
    selectedJourneyMilestoneId = progress.milestones[nextIndex].id;
    await render();
  }
}, { passive: true });

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !document.body.classList.contains('mobile-menu-open')) return;
  document.body.classList.remove('mobile-menu-open');
  document.querySelector('[data-mobile-menu-toggle]')?.setAttribute('aria-expanded', 'false');
  document.querySelector('#mobile-menu')?.setAttribute('aria-hidden', 'true');
});

document.addEventListener('submit', async (event) => {
  const submittedForm = event.target;
  if (submittedForm.dataset.submitting === 'true') {
    event.preventDefault();
    return;
  }
  submittedForm.dataset.submitting = 'true';
  const submitButton = submittedForm.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;
  window.setTimeout(() => {
    submittedForm.dataset.submitting = 'false';
    if (submitButton) submitButton.disabled = false;
  }, 2500);
  const onboardingForm = event.target.closest('[data-onboarding-form]');
  if (onboardingForm) {
    event.preventDefault();
    const values = formValues(onboardingForm);
    onboardingState = await saveOnboardingState(database, {
      ...onboardingState,
      step: Number(onboardingForm.dataset.step) + 1,
      answers: { ...onboardingState.answers, ...values },
      completed: Number(onboardingForm.dataset.step) === 5,
      completionSeen: onboardingState.completionSeen || false,
    });
    if (onboardingState.completed) await completeOnboarding(onboardingState.answers);
    showToast(onboardingState.completed ? 'Your playbook is ready.' : 'Saved.');
    await render();
    return;
  }
  const eodTaskForm = event.target.closest('[data-eod-task-form]');
  if (eodTaskForm) {
    event.preventDefault();
    const values = formValues(eodTaskForm);
    const eodDate = dateOnly();
    const eod = (await getEodRecord(database, eodDate)) || { id: `eod-${eodDate}`, date: eodDate, status: 'in-progress', step: 0, completedTaskIds: [], outstandingTaskIds: [], riskIds: [], tomorrowPriorityIds: [], tomorrowNote: '', handoverNote: '' };
    const task = await saveWorkItem(database, { id: crypto.randomUUID(), type: 'action', group: eod.step === 0 ? 'now' : 'next', title: values.title.trim(), dueDate: values.dueDate || '', priority: values.priority || 'Normal', status: eod.step === 0 ? 'complete' : 'not-started', source: 'eod', completedAt: eod.step === 0 ? new Date().toISOString() : '' , subtasks: [] });
    await saveEodRecord(database, { ...eod, status: 'in-progress', completedTaskIds: eod.step === 0 ? [...new Set([...(eod.completedTaskIds || []), task.id])] : eod.completedTaskIds, outstandingTaskIds: eod.step === 1 ? [...new Set([...(eod.outstandingTaskIds || []), task.id])] : eod.outstandingTaskIds });
    showToast('Task saved locally.');
    await render();
    return;
  }
  const eodRiskForm = event.target.closest('[data-eod-risk-form]');
  if (eodRiskForm) {
    event.preventDefault();
    const values = formValues(eodRiskForm);
    const eodDate = dateOnly();
    const eod = (await getEodRecord(database, eodDate)) || { id: `eod-${eodDate}`, date: eodDate, status: 'in-progress', step: 2, completedTaskIds: [], outstandingTaskIds: [], riskIds: [], tomorrowPriorityIds: [], tomorrowNote: '', handoverNote: '' };
    const risk = await saveWorkItem(database, { id: crypto.randomUUID(), type: 'risk', group: 'now', title: values.title.trim(), impact: values.impact, riskLevel: values.riskLevel, nextAction: values.nextAction || '', status: 'not-started', source: 'eod', createdAt: new Date().toISOString() });
    await saveEodRecord(database, { ...eod, riskIds: [...new Set([...(eod.riskIds || []), risk.id])] });
    showToast('Risk captured locally.');
    await render();
    return;
  }
  const meetingForm = event.target.closest('[data-meeting-builder-form]');
  if (meetingForm) {
    event.preventDefault();
    const values = formValues(meetingForm);
    currentJourneyState = await saveJourneyState(database, { ...currentJourneyState, meetingPreparation: { purpose: values.purpose, introduction: values.introduction, questions: new FormData(meetingForm).getAll('questions'), expectations: values.expectations, close: values.close } });
    meetingForm.closest('dialog')?.close();
    showToast('Meeting plan saved locally.');
    await render();
    return;
  }
  const l10SegueForm = event.target.closest('[data-l10-segue-form]');
  if (l10SegueForm) {
    event.preventDefault();
    const values = formValues(l10SegueForm);
    currentL10Meeting = await saveL10Record(database, 'l10Meetings', { ...currentL10Meeting, segue: values, sectionStatus: { ...currentL10Meeting.sectionStatus, segue: true } });
    showToast('Segue saved locally.');
    await render();
    return;
  }
  const l10ScorecardForm = event.target.closest('[data-l10-scorecard-entry-form]');
  if (l10ScorecardForm) {
    event.preventDefault();
    const values = formValues(l10ScorecardForm);
    const metric = (await getL10Collection(database, 'l10ScorecardMetrics')).find((item) => item.id === values.metricId);
    await saveL10Record(database, 'l10ScorecardEntries', { id: `entry-${values.metricId}-${currentL10Meeting.weekStart}`, metricId: values.metricId, weekStart: currentL10Meeting.weekStart, goal: Number(values.goal), actual: Number(values.actual), status: scorecardStatus(values.goal, values.actual, metric?.direction), note: values.note || '', addedToIssues: false });
    showToast('Scorecard number saved.');
    await render();
    return;
  }
  const l10MetricForm = event.target.closest('[data-l10-metric-form]');
  if (l10MetricForm) {
    event.preventDefault();
    const values = formValues(l10MetricForm);
    const metricId = l10MetricForm.dataset.editMetric || crypto.randomUUID();
    const existing = l10MetricForm.dataset.editMetric ? (await getL10Collection(database, 'l10ScorecardMetrics')).find((item) => item.id === metricId) : {};
    await saveL10Record(database, 'l10ScorecardMetrics', { ...existing, id: metricId, name: values.name, area: values.area, direction: values.direction, weeklyGoal: Number(values.weeklyGoal), active: true, order: existing.order || Date.now() });
    showToast(l10MetricForm.dataset.editMetric ? 'Scorecard metric updated.' : 'Scorecard metric added.');
    await render();
    return;
  }
  const l10WeekForm = event.target.closest('[data-l10-week-form]');
  if (l10WeekForm) {
    event.preventDefault();
    const values = formValues(l10WeekForm);
    currentL10Meeting = await saveL10Record(database, 'l10Meetings', { ...currentL10Meeting, weekEnd: values.weekEnd });
    showToast('Week ending date saved.');
    await render();
    return;
  }
  const l10SettingsForm = event.target.closest('[data-l10-settings-form]');
  if (l10SettingsForm) {
    event.preventDefault();
    const values = formValues(l10SettingsForm);
    await saveL10Record(database, 'l10Settings', { id: 'primary', meetingDay: Number(values.meetingDay), meetingTime: values.meetingTime, durationMinutes: 90, teamAreas: values.teamAreas.split(',').map((item) => item.trim()).filter(Boolean), facilitatorArea: values.facilitatorArea, scribeArea: values.scribeArea, ratingTarget: Number(values.ratingTarget) || 8 });
    l10SettingsForm.closest('dialog')?.close();
    showToast('L10 setup saved locally.');
    await render();
    return;
  }
  const meetingScheduleForm = event.target.closest('[data-meeting-schedule-form]');
  if (meetingScheduleForm) {
    event.preventDefault();
    const values = formValues(meetingScheduleForm);
    const scheduleId = meetingScheduleForm.dataset.editSchedule;
    const existing = scheduleId ? currentMeetingSchedules.find((schedule) => schedule.id === scheduleId) : null;
    const updatedSchedule = { ...(existing || {}), id: scheduleId || crypto.randomUUID(), name: values.name.trim(), cadence: values.cadence, meetingTime: values.meetingTime, nextDate: values.nextDate, agenda: values.agenda || '', active: existing?.active !== false };
    await saveMeetingSchedule(database, updatedSchedule);
    showToast(scheduleId ? 'Recurring meeting updated locally.' : 'Recurring meeting added locally.');
    if (scheduleId) {
      currentMeetingSchedules = currentMeetingSchedules.map((schedule) => (schedule.id === scheduleId ? updatedSchedule : schedule));
      meetingScheduleForm.dataset.originalSchedule = JSON.stringify({ name: updatedSchedule.name, cadence: updatedSchedule.cadence, meetingTime: updatedSchedule.meetingTime, nextDate: updatedSchedule.nextDate, agenda: updatedSchedule.agenda });
      meetingScheduleForm.querySelector('.meeting-schedule-submit').disabled = true;
      return;
    }
    await render();
    return;
  }
  const l10RockForm = event.target.closest('[data-l10-rock-form]');
  if (l10RockForm) {
    event.preventDefault();
    const values = formValues(l10RockForm);
    await saveL10Record(database, 'l10Rocks', { id: crypto.randomUUID(), outcome: values.outcome, area: values.area, dueDate: values.dueDate, status: 'on-track', addedToIssues: false });
    showToast('Rock added locally.');
    await render();
    return;
  }
  const l10HeadlineForm = event.target.closest('[data-l10-headline-form]');
  if (l10HeadlineForm) {
    event.preventDefault();
    const values = formValues(l10HeadlineForm);
    currentL10Meeting = await saveL10Record(database, 'l10Meetings', { ...currentL10Meeting, headlines: [...(currentL10Meeting.headlines || []), { id: crypto.randomUUID(), type: values.type, area: values.area, text: values.text, concern: values.concern === 'on' }] });
    showToast('Headline saved locally.');
    await render();
    return;
  }
  const l10TodoForm = event.target.closest('[data-l10-todo-form]');
  if (l10TodoForm) {
    event.preventDefault();
    const values = formValues(l10TodoForm);
    currentL10Meeting = await saveL10Record(database, 'l10Meetings', { ...currentL10Meeting, todos: [...(currentL10Meeting.todos || []), { id: crypto.randomUUID(), title: values.title, area: values.area, dueDate: values.dueDate, status: 'not-done' }] });
    showToast('To-Do added locally.');
    await render();
    return;
  }
  const l10IssueForm = event.target.closest('[data-l10-issue-form]');
  if (l10IssueForm) {
    event.preventDefault();
    const values = formValues(l10IssueForm);
    await saveL10Record(database, 'l10Issues', { id: crypto.randomUUID(), title: values.title, area: values.area, source: 'manual', priorityOrder: Date.now(), status: 'open', identify: '', discuss: '', solve: '', createdAt: new Date().toISOString() });
    showToast('Issue added to IDS.');
    await render();
    return;
  }
  const l10IdsForm = event.target.closest('[data-l10-ids-form]');
  if (l10IdsForm) {
    event.preventDefault();
    const values = formValues(l10IdsForm);
    const issue = (await getL10Collection(database, 'l10Issues')).find((item) => item.id === values.id);
    const savedIssue = await saveL10Record(database, 'l10Issues', { ...issue, title: values.title, identify: values.identify, discuss: values.discuss, solve: values.solve, status: values.status, solvedAt: values.status === 'solved' ? new Date().toISOString() : issue?.solvedAt });
    if (values.conversion === 'decision') await saveWorkItem(database, { id: crypto.randomUUID(), type: 'decision', group: 'next', title: savedIssue.solve || savedIssue.title, status: 'required', sourceL10IssueId: savedIssue.id });
    if (values.conversion === 'follow-up') await saveWorkItem(database, { id: crypto.randomUUID(), type: 'follow-up', group: 'next', title: savedIssue.solve || savedIssue.title, status: 'not-started', sourceL10IssueId: savedIssue.id });
    if (values.conversion === 'improvement') await saveImprovement(database, { id: crypto.randomUUID(), notWorking: savedIssue.title, change: savedIssue.solve, why: savedIssue.discuss, nextStep: savedIssue.solve, category: 'workflow', status: 'captured', sourceL10IssueId: savedIssue.id, createdAt: new Date().toISOString() });
    if (values.conversion === 'message') currentL10Meeting = await saveL10Record(database, 'l10Meetings', { ...currentL10Meeting, cascadingMessages: [...(currentL10Meeting.cascadingMessages || []), savedIssue.solve || savedIssue.title] });
    l10IdsForm.closest('dialog')?.close();
    showToast('IDS outcome saved.');
    await render();
    return;
  }
  const l10ConcludeForm = event.target.closest('[data-l10-conclude-form]');
  if (l10ConcludeForm) {
    event.preventDefault();
    const values = formValues(l10ConcludeForm);
    currentL10Meeting = await saveL10Record(database, 'l10Meetings', { ...currentL10Meeting, rating: Number(values.rating), meetingImprovement: values.meetingImprovement, cascadingMessages: values.cascadingMessage ? [...(currentL10Meeting.cascadingMessages || []), values.cascadingMessage] : currentL10Meeting.cascadingMessages, completedAt: new Date().toISOString(), sectionStatus: { ...currentL10Meeting.sectionStatus, conclude: true } });
    showToast('L10 meeting completed locally.');
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
    clearDraft(improvementForm);
    showToast('Improvement saved.');
    await render();
  }
});

document.addEventListener('input', (event) => {
  const meetingScheduleForm = event.target.closest('[data-meeting-schedule-form]');
  if (meetingScheduleForm?.dataset.editSchedule) {
    const current = JSON.stringify({ name: meetingScheduleForm.elements.name.value, cadence: meetingScheduleForm.elements.cadence.value, meetingTime: meetingScheduleForm.elements.meetingTime.value, nextDate: meetingScheduleForm.elements.nextDate.value, agenda: meetingScheduleForm.elements.agenda.value });
    const saveButton = meetingScheduleForm.querySelector('.meeting-schedule-submit');
    if (saveButton) saveButton.disabled = current === meetingScheduleForm.dataset.originalSchedule;
  }
  const draftForm = event.target.closest('[data-priority-form], [data-improvement-form]');
  if (draftForm && !draftForm.elements.id?.value) saveDraft(draftForm);
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

document.addEventListener('focusin', (event) => {
  const outcomeInput = event.target.closest('[data-onboarding-form] input[name^="outcome"]');
  if (outcomeInput) outcomeInput.form.dataset.activeOutcome = outcomeInput.name;
});

document.addEventListener('change', (event) => {
  const tomorrowTask = event.target.closest('[data-eod-tomorrow-task]');
  if (tomorrowTask) {
    const eodDate = dateOnly();
    getEodRecord(database, eodDate).then(async (eod) => {
      if (!eod) return;
      const selected = new Set(eod.tomorrowPriorityIds || []);
      if (tomorrowTask.checked && selected.size >= 3) {
        tomorrowTask.checked = false;
        showToast('Choose up to three priorities for tomorrow.');
        return;
      }
      if (tomorrowTask.checked) selected.add(tomorrowTask.dataset.eodTomorrowTask);
      else selected.delete(tomorrowTask.dataset.eodTomorrowTask);
      await saveEodRecord(database, { ...eod, tomorrowPriorityIds: [...selected] });
      await render();
    });
    return;
  }
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
  if (event.target.closest('[data-eod-enter]')) {
    const eodDate = dateOnly();
    const existing = await getEodRecord(database, eodDate);
    if (existing?.status === 'closed') {
      showToast('Today’s EOD is already closed.');
      return;
    }
    await saveEodRecord(database, { ...(existing || {}), id: `eod-${eodDate}`, date: eodDate, status: 'in-progress', step: existing?.step || 0, completedTaskIds: existing?.completedTaskIds || [], outstandingTaskIds: existing?.outstandingTaskIds || [], riskIds: existing?.riskIds || [], tomorrowPriorityIds: existing?.tomorrowPriorityIds || [], tomorrowNote: existing?.tomorrowNote || '', handoverNote: existing?.handoverNote || '' });
    await render();
    return;
  }

  if (event.target.closest('[data-eod-next], [data-eod-back]')) {
    const eodDate = dateOnly();
    const eod = await getEodRecord(database, eodDate);
    if (!eod) return;
    const tomorrowNote = document.querySelector('[data-eod-tomorrow-note]')?.value;
    const handoverNote = document.querySelector('[data-eod-handover-note]')?.value;
    const direction = event.target.closest('[data-eod-back]') ? -1 : 1;
    await saveEodRecord(database, { ...eod, step: Math.max(0, Math.min(4, eod.step + direction)), tomorrowNote: tomorrowNote ?? eod.tomorrowNote, handoverNote: handoverNote ?? eod.handoverNote });
    await render();
    return;
  }

  if (event.target.closest('[data-eod-close]')) {
    const eodDate = dateOnly();
    const eod = await getEodRecord(database, eodDate);
    if (!eod) return;
    const risks = currentWorkItems.filter((item) => item.type === 'risk' && item.status !== 'complete');
    await saveEodRecord(database, { ...eod, status: 'closed', completedAt: new Date().toISOString(), handoverNote: document.querySelector('[data-eod-handover-note]')?.value || eod.handoverNote, riskIds: risks.map((risk) => risk.id) });
    showToast('Day closed. Tomorrow is clearer.');
    await render();
    return;
  }

  const eodFilter = event.target.closest('[data-eod-filter]');
  if (eodFilter) {
    currentEodFilter = eodFilter.dataset.eodFilter;
    await render();
    return;
  }

  const eodCompleteTask = event.target.closest('[data-eod-complete-task]');
  if (eodCompleteTask) {
    const task = currentWorkItems.find((item) => item.id === eodCompleteTask.dataset.eodCompleteTask);
    if (task) {
      await saveWorkItem(database, { ...task, status: task.status === 'complete' ? 'not-started' : 'complete', completedAt: task.status === 'complete' ? '' : new Date().toISOString() });
      await render();
    }
    return;
  }

  if (event.target.closest('[data-eod-history]')) {
    currentEodFilter = 'all';
    document.querySelector('.eod-history')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

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

  if (event.target.closest('[data-reset-onboarding]')) {
    document.body.insertAdjacentHTML('beforeend', createResetOnboardingDialog());
    openDialog(document.querySelector('#reset-onboarding-dialog'));
    return;
  }

  if (event.target.closest('[data-reset-onboarding-confirm]')) {
    onboardingState = await saveOnboardingState(database, {
      key: 'onboarding',
      completed: false,
      completionSeen: false,
      welcomeSeen: false,
      step: 0,
      answers: {},
    });
    await deleteRecord(database, stores.settings, 'primary');
    document.querySelector('#reset-onboarding-dialog')?.remove();
    document.querySelector('#settings-dialog')?.close();
    showToast('Onboarding restarted. Your workspace data is unchanged.');
    await render();
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

  const deleteSnapshot = event.target.closest('[data-delete-snapshot]');
  if (deleteSnapshot) {
    const snapshot = currentSnapshots.find((item) => item.id === deleteSnapshot.dataset.deleteSnapshot);
    if (snapshot) {
      document.body.insertAdjacentHTML('beforeend', createSnapshotDeleteDialog(snapshot));
      openDialog(document.querySelector('#snapshot-delete-dialog'));
    }
    return;
  }

  const cancelSnapshotDelete = event.target.closest('[data-snapshot-delete-cancel]');
  if (cancelSnapshotDelete) {
    cancelSnapshotDelete.closest('dialog')?.close();
    cancelSnapshotDelete.closest('dialog')?.remove();
    return;
  }

  const exportAndDeleteSnapshot = event.target.closest('[data-snapshot-export-delete]');
  if (exportAndDeleteSnapshot) {
    const snapshot = currentSnapshots.find((item) => item.id === exportAndDeleteSnapshot.dataset.snapshotExportDelete);
    if (snapshot) {
      exportSnapshot(snapshot);
      await deleteBackupSnapshot(database, snapshot.id);
      currentSnapshots = await getBackupSnapshots(database);
      exportAndDeleteSnapshot.closest('dialog')?.close();
      exportAndDeleteSnapshot.closest('dialog')?.remove();
      dataDialog()?.remove();
      document.body.insertAdjacentHTML('beforeend', createDataDialog(currentSnapshots));
      openDialog(document.querySelector('#data-dialog'));
      showToast('Snapshot exported and deleted.');
    }
    return;
  }

  const confirmSnapshotDelete = event.target.closest('[data-snapshot-delete-confirm]');
  if (confirmSnapshotDelete) {
    const snapshot = currentSnapshots.find((item) => item.id === confirmSnapshotDelete.dataset.snapshotDeleteConfirm);
    if (snapshot) {
      await deleteBackupSnapshot(database, snapshot.id);
      currentSnapshots = await getBackupSnapshots(database);
      confirmSnapshotDelete.closest('dialog')?.close();
      confirmSnapshotDelete.closest('dialog')?.remove();
      dataDialog()?.remove();
      document.body.insertAdjacentHTML('beforeend', createDataDialog(currentSnapshots));
      openDialog(document.querySelector('#data-dialog'));
      showToast('Snapshot permanently deleted.');
    }
    return;
  }

  if (event.target.closest('[data-delete-all-data]')) {
    document.body.insertAdjacentHTML('beforeend', createDeleteAllDataDialog());
    openDialog(document.querySelector('#delete-all-data-dialog'));
    return;
  }

  if (event.target.closest('[data-delete-all-export]')) {
    await exportBackup();
    return;
  }

  if (event.target.closest('[data-delete-all-confirm]')) {
    const phrase = document.querySelector('[data-delete-all-phrase]')?.value.trim();
    if (phrase !== 'DELETE ALL DATA') {
      showToast('Type DELETE ALL DATA exactly to confirm deletion.');
      document.querySelector('[data-delete-all-phrase]')?.focus();
      return;
    }
    await clearWorkspaceData(database, true);
    document.querySelector('#delete-all-data-dialog')?.remove();
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

  const playbookComplete = event.target.closest('[data-playbook-complete]');
  if (playbookComplete) {
    const topicId = playbookComplete.dataset.playbookComplete;
    const completed = new Set(currentPlaybookState.completedTopicIds || []);
    if (completed.has(topicId)) {
      completed.delete(topicId);
      showToast('Skill marked incomplete.');
    } else {
      completed.add(topicId);
      showToast('Skill marked complete locally.');
    }
    currentPlaybookState.completedTopicIds = [...completed];
    await savePlaybookState(database, currentPlaybookState);
    const dialog = playbookComplete.closest('dialog');
    if (dialog) {
      playbookComplete.setAttribute('aria-pressed', String(completed.has(topicId)));
      playbookComplete.innerHTML = completed.has(topicId) ? '✓ Completed' : 'Mark complete';
    } else {
      renderPlaybookResults();
    }
    return;
  }

  const closeButton = event.target.closest('[data-close-dialog]');
  if (closeButton) closeButton.closest('dialog')?.close();

  const mobileMenuToggle = event.target.closest('[data-mobile-menu-toggle]');
  if (mobileMenuToggle) {
    const open = document.body.classList.toggle('mobile-menu-open');
    mobileMenuToggle.setAttribute('aria-expanded', String(open));
    document.querySelector('#mobile-menu')?.setAttribute('aria-hidden', String(!open));
    return;
  }

  if (event.target.closest('[data-close-mobile-menu]') || event.target.closest('[data-mobile-menu-link]')) {
    document.body.classList.remove('mobile-menu-open');
    document.querySelector('[data-mobile-menu-toggle]')?.setAttribute('aria-expanded', 'false');
    document.querySelector('#mobile-menu')?.setAttribute('aria-hidden', 'true');
  }

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

  if (event.target.closest('[data-open-l10-settings]')) {
    document.querySelector('#l10-settings-dialog')?.showModal();
    return;
  }

  if (event.target.closest('[data-open-meeting-schedules]')) {
    document.querySelector('#meeting-schedules-dialog')?.showModal();
    return;
  }

  const editMeeting = event.target.closest('[data-edit-meeting-schedule]');
  if (editMeeting) {
    const schedule = currentMeetingSchedules.find((item) => item.id === editMeeting.dataset.editMeetingSchedule);
    const form = document.querySelector('[data-meeting-schedule-form]');
    if (schedule && form) {
      form.dataset.editSchedule = schedule.id;
      form.dataset.originalSchedule = JSON.stringify({ name: schedule.name || '', cadence: schedule.cadence || '', meetingTime: schedule.meetingTime || '', nextDate: schedule.nextDate || '', agenda: schedule.agenda || '' });
      form.elements.name.value = schedule.name || '';
      form.elements.cadence.value = schedule.cadence || 'weekly';
      form.elements.meetingTime.value = schedule.meetingTime || '09:00';
      form.elements.nextDate.value = schedule.nextDate || dateOnly();
      form.elements.agenda.value = schedule.agenda || '';
      const saveButton = form.querySelector('.meeting-schedule-submit');
      saveButton.disabled = true;
      saveButton.classList.add('meeting-schedule-save');
      saveButton.setAttribute('aria-label', 'Save meeting changes');
      saveButton.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="9"></circle><path d="m8 12 2.5 2.5L16 9"></path></svg><span>Save changes</span>';
      form.elements.name.focus();
    }
    return;
  }

  const deleteMeeting = event.target.closest('[data-delete-meeting-schedule]');
  if (deleteMeeting) {
    if (window.confirm('Delete this recurring meeting schedule?')) {
      await deleteMeetingSchedule(database, deleteMeeting.dataset.deleteMeetingSchedule);
      showToast('Recurring meeting deleted.');
      await render();
    }
    return;
  }

  const l10HistoryButton = event.target.closest('[data-l10-history-id]');
  if (l10HistoryButton) {
    document.getElementById(`l10-history-${l10HistoryButton.dataset.l10HistoryId}`)?.showModal();
    return;
  }

  const printL10History = event.target.closest('[data-print-l10-history]');
  if (printL10History) {
    document.body.classList.add('print-l10-detail');
    window.addEventListener('afterprint', () => document.body.classList.remove('print-l10-detail'), { once: true });
    window.print();
    return;
  }

  const l10Section = event.target.closest('[data-l10-section]');
  if (l10Section) {
    currentL10Meeting = await saveL10Record(database, 'l10Meetings', { ...currentL10Meeting, currentSection: l10Section.dataset.l10Section });
    await render();
    return;
  }

  if (event.target.closest('[data-l10-timer-toggle]')) {
    const current = currentL10Meeting.timer?.sectionId === currentL10Meeting.currentSection ? currentL10Meeting.timer : { sectionId: currentL10Meeting.currentSection, elapsedSeconds: 0, paused: false };
    const elapsed = current.elapsedSeconds + (current.startedAt ? Math.floor((Date.now() - Date.parse(current.startedAt)) / 1000) : 0);
    const paused = Boolean(current.startedAt);
    currentL10Meeting = await saveL10Record(database, 'l10Meetings', { ...currentL10Meeting, timer: { sectionId: currentL10Meeting.currentSection, elapsedSeconds: elapsed, startedAt: paused ? null : new Date().toISOString(), paused } });
    await render();
    return;
  }

  if (event.target.closest('[data-l10-next]')) {
    const index = Math.max(0, L10_AGENDA.findIndex((item) => item.id === currentL10Meeting.currentSection));
    const next = L10_AGENDA[Math.min(L10_AGENDA.length - 1, index + 1)];
    currentL10Meeting = await saveL10Record(database, 'l10Meetings', { ...currentL10Meeting, currentSection: next.id, sectionStatus: { ...currentL10Meeting.sectionStatus, [L10_AGENDA[index].id]: true } });
    await render();
    return;
  }

  const editMetric = event.target.closest('[data-l10-edit-metric]');
  if (editMetric) {
    const metric = (await getL10Collection(database, 'l10ScorecardMetrics')).find((item) => item.id === editMetric.dataset.l10EditMetric);
    const form = document.querySelector('[data-l10-metric-form]');
    if (metric && form) {
      form.dataset.editMetric = metric.id;
      form.elements.name.value = metric.name || '';
      form.elements.area.value = metric.area || '';
      form.elements.direction.value = metric.direction || 'at-least';
      form.elements.weeklyGoal.value = metric.weeklyGoal ?? '';
      form.querySelector('button[type="submit"]').textContent = 'Update metric';
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      form.elements.name.focus();
    }
    return;
  }

  const deleteMetric = event.target.closest('[data-l10-delete-metric]');
  if (deleteMetric) {
    const metric = (await getL10Collection(database, 'l10ScorecardMetrics')).find((item) => item.id === deleteMetric.dataset.l10DeleteMetric);
    if (metric && window.confirm(`Delete the scorecard metric “${metric.name}”?`)) {
      await deleteRecord(database, stores.l10ScorecardMetrics, metric.id);
      showToast('Scorecard metric deleted.');
      await render();
    }
    return;
  }

  const metricIssue = event.target.closest('[data-l10-metric-issue]');
  if (metricIssue) {
    const metric = (await getL10Collection(database, 'l10ScorecardMetrics')).find((item) => item.id === metricIssue.dataset.l10MetricIssue);
    const entry = (await getL10Collection(database, 'l10ScorecardEntries')).find((item) => item.metricId === metric.id && item.weekStart === currentL10Meeting.weekStart);
    await saveL10Record(database, 'l10Issues', { id: crypto.randomUUID(), title: `${metric.name} is off track`, area: metric.area, source: 'scorecard', priorityOrder: Date.now(), status: 'open', identify: entry?.note || '', discuss: '', solve: '', createdAt: new Date().toISOString() });
    showToast('Scorecard item added to Issues.');
    await render();
    return;
  }

  const rockIssue = event.target.closest('[data-l10-rock-issue]');
  if (rockIssue) {
    const rock = (await getL10Collection(database, 'l10Rocks')).find((item) => item.id === rockIssue.dataset.l10RockIssue);
    await saveL10Record(database, 'l10Issues', { id: crypto.randomUUID(), title: `${rock.outcome} needs attention`, area: rock.area, source: 'rock', priorityOrder: Date.now(), status: 'open', identify: '', discuss: '', solve: '', createdAt: new Date().toISOString() });
    showToast('Rock added to Issues.');
    await render();
    return;
  }

  const openL10Issue = event.target.closest('[data-l10-open-issue]');
  if (openL10Issue) {
    const issue = (await getL10Collection(database, 'l10Issues')).find((item) => item.id === openL10Issue.dataset.l10OpenIssue);
    const dialog = document.querySelector('#l10-issue-dialog');
    if (issue && dialog) {
      dialog.querySelector('[name="id"]').value = issue.id;
      ['title', 'identify', 'discuss', 'solve', 'status'].forEach((name) => { if (dialog.elements[name]) dialog.elements[name].value = issue[name] || ''; });
      dialog.showModal();
    }
    return;
  }

  const todoToggle = event.target.closest('[data-l10-todo-toggle]');
  if (todoToggle) {
    currentL10Meeting = await saveL10Record(database, 'l10Meetings', { ...currentL10Meeting, todos: (currentL10Meeting.todos || []).map((todo) => todo.id === todoToggle.dataset.l10TodoToggle ? { ...todo, status: todo.status === 'done' ? 'not-done' : 'done' } : todo) });
    await render();
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
    const form = dialog?.querySelector('[data-improvement-form]');
    if (form) restoreDraft(form);
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

  if (event.target.closest('[data-begin-journey], [data-explore-talentis]')) {
    onboardingState = await saveOnboardingState(database, { ...onboardingState, welcomeSeen: true, step: 0 });
    await render();
    return;
  }

  const completeMilestone = event.target.closest('[data-complete-milestone]');
  if (completeMilestone) {
    const id = completeMilestone.dataset.completeMilestone;
    if (!currentJourneyState.completedMilestoneIds.includes(id)) {
      currentJourneyState = await saveJourneyState(database, { ...currentJourneyState, completedMilestoneIds: [...currentJourneyState.completedMilestoneIds, id], completedAt: { ...(currentJourneyState.completedAt || {}), [id]: new Date().toISOString() } });
      selectedJourneyMilestoneId = '';
      showToast('Milestone complete. Keep the next step small.');
      await render();
    }
    return;
  }

  const reopenMilestone = event.target.closest('[data-reopen-milestone]');
  if (reopenMilestone) {
    const id = reopenMilestone.dataset.reopenMilestone;
    currentJourneyState = await saveJourneyState(database, {
      ...currentJourneyState,
      completedMilestoneIds: currentJourneyState.completedMilestoneIds.filter((milestoneId) => milestoneId !== id),
      completedAt: Object.fromEntries(Object.entries(currentJourneyState.completedAt || {}).filter(([milestoneId]) => milestoneId !== id)),
    });
    selectedJourneyMilestoneId = id;
    showToast('Milestone added back to your journey.');
    await render();
    return;
  }

  const selectMilestone = event.target.closest('[data-select-milestone]');
  if (selectMilestone) {
    selectedJourneyMilestoneId = selectMilestone.dataset.selectMilestone;
    await render();
    return;
  }

  if (event.target.closest('[data-print-milestone]')) {
    document.body.classList.add('print-journey-milestone');
    window.addEventListener('afterprint', () => document.body.classList.remove('print-journey-milestone'), { once: true });
    window.print();
    return;
  }

  if (event.target.closest('[data-open-meeting-builder]')) {
    const dialog = document.querySelector('#meeting-builder');
    if (dialog && !dialog.open) dialog.showModal();
    dialog?.querySelector('textarea')?.focus();
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
    const form = suggestion.closest('[data-onboarding-form]');
    const outcomeInputs = [...(form?.querySelectorAll('input[name^="outcome"]') || [])];
    const activeOutcome = form?.elements[form.dataset.activeOutcome];
    const target = activeOutcome || outcomeInputs.find((input) => !input.value);
    if (!target) {
      showToast('All three outcomes are filled. Select an outcome field to replace it.');
      return;
    }
    target.value = suggestion.dataset.fillOutcome;
    target.focus();
    form?.querySelectorAll('[data-fill-outcome]').forEach((button) => {
      const selected = outcomeInputs.some((input) => input.value === button.dataset.fillOutcome);
      button.classList.toggle('suggestion-chip--selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
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

window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault();
  const message = event.reason?.message || '';
  showToast(message.includes('storage') || message.includes('Quota')
    ? message
    : 'That local change could not be saved. Your existing data is unchanged.');
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
      const registration = await navigator.serviceWorker.register(
        new URL('./service-worker.js', document.baseURI),
      );
      const announceWaiting = () => {
        if (registration.waiting && navigator.serviceWorker.controller) showUpdateToast(registration);
      };
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed') announceWaiting();
        });
      });
      announceWaiting();
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (updateRequested) window.location.reload();
      });
    } catch {
      showToast('Offline support is unavailable in this browser session.');
    }
  });
}
