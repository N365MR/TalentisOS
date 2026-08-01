const routes = {
  today: {
    label: 'Today',
    eyebrow: 'Your operating view',
    title: 'Make today matter.',
    description: 'A calm place to see the shape of the day before the day gets noisy.',
    prompt: 'Your focused view will appear here in Phase 2.',
    action: 'Prepare today',
  },
  huddle: {
    label: 'Huddle',
    eyebrow: 'Prepare and align',
    title: 'Start with alignment.',
    description: 'Bring priorities, decisions, risks, and discussion into one clear moment.',
    prompt: 'The morning huddle flow will be introduced in a later phase.',
    action: 'Open huddle',
  },
  work: {
    label: 'Work',
    eyebrow: 'Execute with focus',
    title: 'Keep the work moving.',
    description: 'Hold attention on the commitments that need your leadership today.',
    prompt: 'Focused work capture will be introduced in a later phase.',
    action: 'View work',
  },
  review: {
    label: 'Review',
    eyebrow: 'Close and prepare',
    title: 'Finish the day well.',
    description: 'Make space for what carried over, what changed, and what tomorrow needs.',
    prompt: 'The end-of-day review flow will be introduced in a later phase.',
    action: 'Begin review',
  },
  improve: {
    label: 'Improve',
    eyebrow: 'Learn and refine',
    title: 'Improve the rhythm.',
    description: 'Turn small observations into practical changes to the way you lead.',
    prompt: 'Improvement capture will be introduced in a later phase.',
    action: 'See improvements',
  },
};

const navigation = [
  ['today', 'Today', '◷'],
  ['huddle', 'Huddle', '＋'],
  ['work', 'Work', '□'],
  ['review', 'Review', '✓'],
  ['improve', 'Improve', '↗'],
];

const onboardingSteps = [
  {
    title: 'What type of team or function do you lead?',
    explanation: 'This helps shape the language of your daily playbook.',
  },
  {
    title: 'What are the three primary outcomes you are responsible for?',
    explanation: 'Name the outcomes, not every task. You can refine them later.',
  },
  {
    title: 'What time does your workday normally begin?',
    explanation: 'We use this only to frame your daily rhythm.',
  },
  {
    title: 'Do you run a morning huddle?',
    explanation: 'This keeps your morning setup aligned to how you already lead.',
  },
  {
    title: 'What time should the end-of-day review be suggested?',
    explanation: 'Choose a calm moment to close the loop and prepare tomorrow.',
  },
];

const functionOptions = [
  'Operations',
  'Customer success',
  'Product or technology',
  'Sales or partnerships',
  'Marketing or creative',
  'Other function',
];
const outcomeOptions = [
  'A reliable operation',
  'Customer or community value',
  'Revenue or growth',
  'A strong team rhythm',
  'A clear strategic result',
  'Quality and consistency',
];
const promptLibrary = [
  'Define the outcome, not only the activity.',
  'Communicate risk early.',
  'Do not leave a commitment without a next action.',
  'Remove the blocker before adding more work.',
  'Finish the day by preparing tomorrow.',
];

function escapeHtml(value = '') {
  return String(value).replace(
    /[&<>'"]/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character],
  );
}

function onboardingAnswer(state, key) {
  return escapeHtml(state.answers?.[key] || '');
}

export function createOnboarding(state) {
  if (state.completed && !state.completionSeen) {
    return `<main class="onboarding-screen onboarding-complete" aria-labelledby="onboarding-complete-title"><div class="completion-mark" aria-hidden="true">✓</div><p class="eyebrow">Your playbook</p><h1 id="onboarding-complete-title">TalentisOS is ready.</h1><p>Your daily leadership playbook is now set up.</p><button class="primary-action" type="button" data-start-today>Start Today <span aria-hidden="true">→</span></button></main>`;
  }
  const step = Math.max(0, Math.min(state.step || 0, onboardingSteps.length - 1));
  const current = onboardingSteps[step];
  return `<main class="onboarding-screen" aria-labelledby="onboarding-title"><div class="onboarding-top"><span class="onboarding-brand">TalentisOS</span><button class="text-button" type="button" data-onboarding-save>Save &amp; resume later</button></div><div class="onboarding-progress" aria-label="Onboarding progress"><span>Step ${step + 1} of ${onboardingSteps.length}</span><div class="progress-track"><span style="width:${((step + 1) / onboardingSteps.length) * 100}%"></span></div></div><section class="onboarding-card"><p class="eyebrow">Set up your daily rhythm</p><h1 id="onboarding-title">${current.title}</h1><p class="onboarding-explanation">${current.explanation}</p><form data-onboarding-form data-step="${step}">${onboardingFields(step, state)}<div class="onboarding-actions">${step > 0 ? '<button class="secondary-action" type="button" data-onboarding-back>Back</button>' : '<span></span>'}<button class="primary-action" type="submit">${step === onboardingSteps.length - 1 ? 'Finish setup' : 'Continue'} <span aria-hidden="true">→</span></button></div></form></section></main>`;
}

function onboardingFields(step, state) {
  if (step === 0)
    return `<div class="option-grid">${functionOptions.map((option) => `<label class="select-option"><input type="radio" name="functionType" value="${escapeHtml(option)}" ${state.answers?.functionType === option ? 'checked' : ''} required><span>${option}</span></label>`).join('')}</div>`;
  if (step === 1)
    return `<div class="outcome-fields">${[0, 1, 2].map((index) => `<label>Outcome ${index + 1}<input name="outcome${index}" value="${onboardingAnswer(state, `outcome${index}`)}" placeholder="For example, a clear strategic result" required></label>`).join('')}</div><div class="suggestion-row" aria-label="Outcome suggestions">${outcomeOptions
      .slice(0, 4)
      .map(
        (option) =>
          `<button type="button" class="suggestion-chip" data-fill-outcome="${escapeHtml(option)}">${option}</button>`,
      )
      .join('')}</div>`;
  if (step === 2)
    return `<label class="large-field">Workday start time<input type="time" name="startTime" value="${onboardingAnswer(state, 'startTime')}" required></label>`;
  if (step === 3)
    return `<div class="option-grid option-grid--two"><label class="select-option"><input type="radio" name="morningHuddle" value="yes" ${state.answers?.morningHuddle === 'yes' ? 'checked' : ''} required><span>Yes, most days</span></label><label class="select-option"><input type="radio" name="morningHuddle" value="no" ${state.answers?.morningHuddle === 'no' ? 'checked' : ''} required><span>Not usually</span></label></div>`;
  return `<label class="large-field">Suggested review time<input type="time" name="reviewTime" value="${onboardingAnswer(state, 'reviewTime')}" required></label>`;
}

function statusLabel(status) {
  return (
    { 'not-started': 'Not started', 'in-progress': 'In progress', done: 'Complete' }[status] ||
    'Not started'
  );
}

export function generateDailyFocus(priorities, plan) {
  if (plan.risks?.length) return `Protect the day by addressing ${plan.risks[0]}.`;
  if (plan.decisions?.length) return `Make space to decide on ${plan.decisions[0]}.`;
  if (priorities.length)
    return `Move ${priorities[0].outcome.toLowerCase()} forward with intention.`;
  return 'Choose the one outcome that would make today meaningful.';
}

export function createTodayView(plan, priorities) {
  const focus = generateDailyFocus(priorities, plan);
  const prompt = promptLibrary[new Date(`${plan.date}T12:00:00`).getDate() % promptLibrary.length];
  const empty = (message) =>
    `<div class="section-empty"><span aria-hidden="true">—</span><p>${message}</p></div>`;
  const priorityCards = priorities.length
    ? priorities
        .map(
          (priority, index) =>
            `<article class="priority-card ${priority.status === 'done' ? 'priority-card--done' : ''}"><div class="priority-card__order" aria-label="Priority ${index + 1}">0${index + 1}</div><div class="priority-card__body"><div class="priority-card__top"><div><p class="card-kicker">Outcome</p><h3>${escapeHtml(priority.outcome)}</h3></div><span class="status-chip status-chip--${priority.status === 'done' ? 'success' : priority.status === 'in-progress' ? 'info' : 'neutral'}">${statusLabel(priority.status)}</span></div><p class="priority-card__why">${escapeHtml(priority.why || 'No why added yet.')}</p><dl class="priority-meta"><div><dt>Due point</dt><dd>${escapeHtml(priority.duePoint || 'Not set')}</dd></div></dl><div class="priority-actions"><button class="text-button" type="button" data-edit-priority="${priority.id}">Edit</button><button class="text-button" type="button" data-move-priority="${priority.id}" data-direction="up" ${index === 0 ? 'disabled' : ''}>Move up</button><button class="text-button" type="button" data-move-priority="${priority.id}" data-direction="down" ${index === priorities.length - 1 ? 'disabled' : ''}>Move down</button><button class="text-button" type="button" data-complete-priority="${priority.id}">${priority.status === 'done' ? 'Reopen' : 'Complete'}</button></div></div></article>`,
        )
        .join('')
    : empty('No priorities yet. Start with the outcome that matters most.');
  return `<section class="today-command" aria-labelledby="today-focus-title"><div class="today-greeting"><p class="eyebrow">${new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</p><h2 id="today-focus-title">Good morning.</h2><p class="secondary-text">Here is the shape of your leadership day.</p></div><section class="daily-focus"><div><p class="card-kicker">Daily focus</p><h3>${escapeHtml(focus)}</h3></div><span class="focus-card__icon" aria-hidden="true">✦</span></section><section class="today-section" aria-labelledby="priorities-title"><div class="section-heading"><div><p class="eyebrow">What matters now?</p><h2 id="priorities-title">Top three priorities</h2></div><button class="secondary-action" type="button" data-add-priority ${priorities.length >= 3 ? 'disabled' : ''}>${priorities.length >= 3 ? 'Three set' : 'Add priority'}</button></div><div class="priority-list">${priorityCards}</div></section><div class="today-grid"><section class="today-section compact-section" aria-labelledby="carryover-title"><div class="section-heading"><h2 id="carryover-title">Carryover</h2><span class="section-count">${plan.carryover?.length || 0}</span></div>${plan.carryover?.length ? plan.carryover.map((item) => `<p>${escapeHtml(item)}</p>`).join('') : empty('Nothing carried over.')}</section><section class="today-section compact-section" aria-labelledby="risk-title"><div class="section-heading"><h2 id="risk-title">At risk</h2><span class="section-count section-count--warning">${plan.risks?.length || 0}</span></div>${plan.risks?.length ? plan.risks.map((item) => `<p>${escapeHtml(item)}</p>`).join('') : empty('No risks recorded.')}</section><section class="today-section compact-section" aria-labelledby="decision-title"><div class="section-heading"><h2 id="decision-title">Decisions</h2><span class="section-count">${plan.decisions?.length || 0}</span></div>${plan.decisions?.length ? plan.decisions.map((item) => `<p>${escapeHtml(item)}</p>`).join('') : empty('No decisions waiting.')}</section><section class="today-section compact-section" aria-labelledby="follow-up-title"><div class="section-heading"><h2 id="follow-up-title">Follow-ups due</h2><span class="section-count">${plan.followUps?.length || 0}</span></div>${plan.followUps?.length ? plan.followUps.map((item) => `<p>${escapeHtml(item)}</p>`).join('') : empty('No follow-ups due.')}</section></div><section class="today-section meetings-section" aria-labelledby="meetings-title"><div class="section-heading"><h2 id="meetings-title">Meetings</h2><span class="section-count">${plan.meetings?.length || 0}</span></div>${plan.meetings?.length ? plan.meetings.map((item) => `<p>${escapeHtml(item)}</p>`).join('') : empty('No meetings added.')}</section><section class="leadership-prompt" aria-labelledby="prompt-title"><p class="eyebrow">Leadership prompt</p><h2 id="prompt-title">${prompt}</h2></section><section class="end-day-status" aria-labelledby="end-day-title"><div><p class="eyebrow">End-of-day status</p><h2 id="end-day-title">${plan.endOfDayStatus === 'complete' ? 'Review complete.' : 'Not reviewed yet.'}</h2></div><span class="status-chip status-chip--${plan.endOfDayStatus === 'complete' ? 'success' : 'neutral'}">${plan.endOfDayStatus === 'complete' ? 'Complete' : 'Open'}</span></section></section>${createPrioritySheet()}`;
}

export function createPrioritySheet() {
  return `<dialog id="priority-sheet" class="modal bottom-sheet-dialog" aria-labelledby="priority-sheet-title"><div class="modal__header"><div><p class="eyebrow">One clear commitment</p><h2 id="priority-sheet-title">Add a priority</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close priority editor">×</button></div><form class="modal__body priority-form" data-priority-form><input type="hidden" name="id"><label>Outcome<input name="outcome" maxlength="120" required placeholder="What result matters most?"></label><label>Why it matters<textarea name="why" maxlength="220" rows="3" placeholder="What will this make possible?"></textarea></label><label>Due point<input name="duePoint" maxlength="80" placeholder="For example, before Friday's review"></label><label>Status<select name="status"><option value="not-started">Not started</option><option value="in-progress">In progress</option><option value="done">Complete</option></select></label><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Cancel</button><button type="submit" class="primary-action">Save priority</button></div></form></dialog>`;
}

export function getRoute() {
  const key = window.location.hash.slice(1).split('/')[0] || 'today';
  return routes[key] ? { ...routes[key], key } : { ...routes.today, key: 'today' };
}

function navItems(currentKey, className) {
  return navigation
    .map(
      ([key, label, icon]) =>
        `<a class="nav-item ${className}" href="#${key}" ${
          currentKey === key ? 'aria-current="page"' : ''
        }><span class="nav-item__icon" aria-hidden="true">${icon}</span><span>${label}</span></a>`,
    )
    .join('');
}

function settingsDialog() {
  return `<dialog id="settings-dialog" class="modal" aria-labelledby="settings-title">
    <div class="modal__header"><div><p class="eyebrow">Preferences</p><h2 id="settings-title">Settings</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close settings">×</button></div>
    <div class="modal__body"><p class="secondary-text">Tune the interface to the way you work. Product data and leadership records are not part of this phase.</p>
      ${createSegmentedControl('Appearance', [
        ['light', 'Light'],
        ['system', 'System'],
        ['dark', 'Dark'],
      ])}
    </div>
  </dialog>`;
}

export function createSegmentedControl(label, options) {
  return `<fieldset class="preference-group"><legend>${label}</legend><div class="segmented-control" role="group" aria-label="${label}">${options.map(([value, text]) => `<button type="button" data-theme-choice="${value}" aria-pressed="${value === 'system'}">${text}</button>`).join('')}</div></fieldset>`;
}

export function createEmptyState(title, description) {
  return `<section class="empty-state" aria-labelledby="empty-state-title"><div class="empty-state__mark" aria-hidden="true">○</div><div><p class="eyebrow">A clear beginning</p><h2 id="empty-state-title">${title}</h2><p class="secondary-text">${description}</p></div></section>`;
}

export function createGuidedStep(number, title, description) {
  return `<section class="guided-step" aria-labelledby="guided-title"><div class="guided-step__number" aria-hidden="true">${number}</div><div><p class="eyebrow">A quieter way to lead</p><h2 id="guided-title">${title}</h2><p class="secondary-text">${description}</p></div></section>`;
}

export function createToast(message) {
  return `<div class="toast" role="status">${message}</div>`;
}

export function createBottomSheet(content) {
  return `<section class="bottom-sheet" aria-label="Contextual actions">${content}</section>`;
}

export function createConfirmDialog(title, description) {
  return `<dialog class="modal confirm-dialog" aria-labelledby="confirm-title"><div class="modal__body"><h2 id="confirm-title">${title}</h2><p class="secondary-text">${description}</p><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Cancel</button><button type="button" class="primary-action">Confirm</button></div></div></dialog>`;
}

export function createAppShell(route) {
  return `<div class="app-layout">
    <aside class="sidebar" aria-label="Application navigation">
      <div class="sidebar__top"><a class="brand" href="#today" aria-label="TalentisOS home"><span class="brand-mark" aria-hidden="true">T</span><span class="brand-wordmark">Talentis<span>OS</span></span></a><button class="icon-button sidebar-toggle" type="button" data-toggle-sidebar aria-expanded="true" aria-label="Collapse sidebar">←</button></div>
      <nav class="sidebar__nav" aria-label="Primary navigation"><p class="nav-label">Workspace</p>${navItems(route.key, '')}</nav>
      <div class="sidebar__bottom"><button class="nav-item settings-link" type="button" data-open-settings><span class="nav-item__icon" aria-hidden="true">⚙</span><span>Settings</span></button><p class="sidebar-caption">Leadership, made clear.</p></div>
    </aside>
    <header class="mobile-header"><a class="brand" href="#today" aria-label="TalentisOS home"><span class="brand-mark" aria-hidden="true">T</span><span class="brand-wordmark">Talentis<span>OS</span></span></a><button class="icon-button" type="button" data-open-settings aria-label="Open settings">⚙</button></header>
    <main id="main-content" class="content-area"><div class="content-inner"><header class="page-header"><div><p class="eyebrow">${route.eyebrow}</p><h1>${route.label}</h1></div><div class="page-header__meta"><span class="date-label">${new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</span><span class="status-dot" aria-label="Offline-ready shell"></span></div></header><div id="view-root"></div></div></main>
    <nav class="bottom-nav" aria-label="Primary navigation">${navItems(route.key, '')}<button class="nav-item" type="button" data-open-settings><span class="nav-item__icon" aria-hidden="true">•••</span><span>More</span></button></nav>
    <div class="primary-action-bar"><button class="primary-action" type="button" data-primary-action>${route.action}<span aria-hidden="true">→</span></button></div>
    ${settingsDialog()}
  </div>`;
}

export function renderView(route) {
  const viewRoot = document.querySelector('#view-root');
  viewRoot.innerHTML = `<section class="hero-section" aria-labelledby="view-title"><div class="hero-copy"><p class="eyebrow">Prepare · Align · Execute · Review · Improve</p><h2 id="view-title">${route.title}</h2><p>${route.description}</p></div><div class="focus-card"><div class="focus-card__icon" aria-hidden="true">${route.key === 'today' ? '✦' : '○'}</div><div><p class="card-kicker">Next step</p><h3>${route.action}</h3><p class="secondary-text">${route.prompt}</p></div><span class="card-arrow" aria-hidden="true">↗</span></div></section><section class="status-grid" aria-label="Leadership rhythm status"><article class="status-card"><span class="status-card__label">Rhythm</span><strong>Foundation</strong><span class="status-chip status-chip--info">Phase 1</span></article><article class="status-card"><span class="status-card__label">Mode</span><strong>Local-first</strong><span class="status-chip status-chip--success">Ready</span></article><article class="status-card"><span class="status-card__label">Focus</span><strong>One clear step</strong><span class="status-chip status-chip--neutral">Intentional</span></article></section>${createEmptyState('Your workspace is ready.', 'This foundation keeps the day visible without adding noise. Product workflows arrive in later phases.')}`;
  document.querySelector('[data-primary-action]').addEventListener('click', () => {
    document.querySelector('[data-primary-action]').textContent = 'Coming in Phase 2';
    window.setTimeout(() => {
      document.querySelector('[data-primary-action]').innerHTML =
        `${route.action}<span aria-hidden="true">→</span>`;
    }, 1800);
  });
}
