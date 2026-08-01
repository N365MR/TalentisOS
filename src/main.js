import './styles.css';
import {
  createAppShell,
  createOnboarding,
  createToast,
  createTodayView,
  getRoute,
  renderView,
} from './components.js';
import {
  getDailyPlan,
  getOnboardingState,
  getPriorities,
  openDatabase,
  putRecord,
  saveOnboardingState,
  savePriority,
  stores,
} from './db.js';

const app = document.querySelector('#app');
const toastRegion = document.querySelector('#toast-region');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const themeQuery = window.matchMedia('(prefers-color-scheme: dark)');
let database;
let onboardingState;
let currentPlan;
let currentPriorities = [];

function showToast(message) {
  toastRegion.replaceChildren();
  toastRegion.innerHTML = createToast(message);
  const toast = toastRegion.firstElementChild;
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
    const action = currentPriorities.length < 3 ? 'Add a priority' : 'Review priorities';
    app.innerHTML = createAppShell({ ...route, action });
    document.querySelector('#view-root').innerHTML = createTodayView(
      currentPlan,
      currentPriorities,
    );
    document.title = 'Today — TalentisOS';
  } else {
    app.innerHTML = createAppShell(route);
    renderView(route);
    document.title = `${route.label} — TalentisOS`;
  }
  applyTheme(savedTheme());
}

function openDialog(dialog) {
  if (!dialog) return;
  dialog.showModal();
  dialog.querySelector('button, [href], input, select, textarea')?.focus();
}

function formValues(form) {
  return Object.fromEntries(new FormData(form).entries());
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
  }
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

  const closeButton = event.target.closest('[data-close-dialog]');
  if (closeButton) closeButton.closest('dialog')?.close();

  const collapseButton = event.target.closest('[data-toggle-sidebar]');
  if (collapseButton) {
    const collapsed = document.body.classList.toggle('sidebar-collapsed');
    collapseButton.setAttribute('aria-expanded', String(!collapsed));
    showToast(collapsed ? 'Sidebar collapsed.' : 'Sidebar expanded.');
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
