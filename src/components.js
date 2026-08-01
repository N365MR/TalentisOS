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
    prompt: 'Keep the day focused on the leadership actions that move outcomes forward.',
    action: 'Add work item',
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
    action: 'Capture improvement',
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

export function createTodayView(plan, priorities, workItems = []) {
  const focus = generateDailyFocus(priorities, plan);
  const prompt = promptLibrary[new Date(`${plan.date}T12:00:00`).getDate() % promptLibrary.length];
  const criticalRisks = workItems.filter(
    (item) => item.type === 'risk' && item.riskLevel === 'critical' && item.status !== 'complete',
  );
  const dueDecisions = workItems.filter(
    (item) =>
      item.type === 'decision' &&
      ['required', 'under-review'].includes(item.status) &&
      item.dueDate &&
      item.dueDate <= plan.date,
  );
  const overdueFollowUps = workItems.filter(
    (item) =>
      item.type === 'follow-up' &&
      item.status !== 'complete' &&
      item.dueDate &&
      item.dueDate < plan.date,
  );
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
  const signalList = (items, emptyMessage) =>
    items.length
      ? items
          .map(
            (item) =>
              `<p class="signal-item"><strong>${escapeHtml(item.title || item.outcome || item.whatNeedsToHappen)}</strong><span>${escapeHtml(item.nextAction || item.impact || item.dueDate || '')}</span></p>`,
          )
          .join('')
      : empty(emptyMessage);
  return `<section class="today-command" aria-labelledby="today-focus-title"><div class="today-greeting"><p class="eyebrow">${new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</p><h2 id="today-focus-title">Good morning.</h2><p class="secondary-text">Here is the shape of your leadership day.</p></div><section class="daily-focus"><div><p class="card-kicker">Daily focus</p><h3>${escapeHtml(focus)}</h3></div><span class="focus-card__icon" aria-hidden="true">✦</span></section><section class="today-section" aria-labelledby="priorities-title"><div class="section-heading"><div><p class="eyebrow">What matters now?</p><h2 id="priorities-title">Top three priorities</h2></div><button class="secondary-action" type="button" data-add-priority ${priorities.length >= 3 ? 'disabled' : ''}>${priorities.length >= 3 ? 'Three set' : 'Add priority'}</button></div><div class="priority-list">${priorityCards}</div></section><div class="today-grid"><section class="today-section compact-section" aria-labelledby="carryover-title"><div class="section-heading"><h2 id="carryover-title">Carryover</h2><span class="section-count">${plan.carryover?.length || 0}</span></div>${plan.carryover?.length ? plan.carryover.map((item) => `<p>${escapeHtml(item)}</p>`).join('') : empty('Nothing carried over.')}</section><section class="today-section compact-section" aria-labelledby="risk-title"><div class="section-heading"><h2 id="risk-title">At risk</h2><span class="section-count section-count--warning">${criticalRisks.length}</span></div>${signalList(criticalRisks, 'No critical risks surfaced.')}</section><section class="today-section compact-section" aria-labelledby="decision-title"><div class="section-heading"><h2 id="decision-title">Decisions</h2><span class="section-count">${dueDecisions.length}</span></div>${signalList(dueDecisions, 'No decisions due.')}</section><section class="today-section compact-section" aria-labelledby="follow-up-title"><div class="section-heading"><h2 id="follow-up-title">Follow-ups due</h2><span class="section-count">${overdueFollowUps.length}</span></div>${signalList(overdueFollowUps, 'No overdue follow-ups.')}</section></div><section class="today-section meetings-section" aria-labelledby="meetings-title"><div class="section-heading"><h2 id="meetings-title">Meetings</h2><span class="section-count">${plan.meetings?.length || 0}</span></div>${plan.meetings?.length ? plan.meetings.map((item) => `<p>${escapeHtml(item)}</p>`).join('') : empty('No meetings added.')}</section><section class="leadership-prompt" aria-labelledby="prompt-title"><p class="eyebrow">Leadership prompt</p><h2 id="prompt-title">${prompt}</h2></section><section class="end-day-status" aria-labelledby="end-day-title"><div><p class="eyebrow">End-of-day status</p><h2 id="end-day-title">${plan.endOfDayStatus === 'complete' ? 'Review complete.' : 'Not reviewed yet.'}</h2></div><span class="status-chip status-chip--${plan.endOfDayStatus === 'complete' ? 'success' : 'neutral'}">${plan.endOfDayStatus === 'complete' ? 'Complete' : 'Open'}</span></section></section>${createPrioritySheet()}`;
}

export function createPrioritySheet() {
  return `<dialog id="priority-sheet" class="modal bottom-sheet-dialog" aria-labelledby="priority-sheet-title"><div class="modal__header"><div><p class="eyebrow">One clear commitment</p><h2 id="priority-sheet-title">Add a priority</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close priority editor">×</button></div><form class="modal__body priority-form" data-priority-form><input type="hidden" name="id"><label>Outcome<input name="outcome" maxlength="120" required placeholder="What result matters most?"></label><label>Why it matters<textarea name="why" maxlength="220" rows="3" placeholder="What will this make possible?"></textarea></label><label>Due point<input name="duePoint" maxlength="80" placeholder="For example, before Friday's review"></label><label>Status<select name="status"><option value="not-started">Not started</option><option value="in-progress">In progress</option><option value="done">Complete</option></select></label><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Cancel</button><button type="submit" class="primary-action">Save priority</button></div></form></dialog>`;
}

const workTypes = {
  priority: 'Priority',
  risk: 'Risk',
  decision: 'Decision',
  'follow-up': 'Follow-up',
  action: 'Action',
};

const workGroups = [
  ['now', 'Now', 'The three leadership actions that need attention first.'],
  ['next', 'Next', 'The next clear moves after Now.'],
  ['later', 'Later', 'Useful work that does not need attention yet.'],
  ['waiting', 'Waiting', 'Items waiting on a person, answer, or condition.'],
];

const workStatuses = [
  ['not-started', 'Not started'],
  ['in-progress', 'In progress'],
  ['waiting', 'Waiting'],
  ['at-risk', 'At risk'],
  ['complete', 'Complete'],
];

function workStatusLabel(status) {
  const labels = [
    ...workStatuses,
    ['required', 'Required'],
    ['under-review', 'Under review'],
    ['decided', 'Decided'],
    ['deferred', 'Deferred'],
  ];
  return labels.find(([value]) => value === status)?.[1] || status;
}

export function workStatusOptions(type, selected = '') {
  const options =
    type === 'decision'
      ? [
          ['required', 'Required'],
          ['under-review', 'Under review'],
          ['decided', 'Decided'],
          ['deferred', 'Deferred'],
        ]
      : workStatuses;
  return options
    .map(
      ([value, label]) =>
        `<option value="${value}" ${selected === value || (!selected && value === 'not-started') ? 'selected' : ''}>${label}</option>`,
    )
    .join('');
}

function workDateLabel(date) {
  if (!date) return 'No date set';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(
    new Date(`${date}T12:00:00`),
  );
}

function followUpView(item, today) {
  if (item.status === 'complete') return 'complete';
  if (item.status === 'waiting') return 'waiting';
  if (item.dueDate === today) return 'due-today';
  if (item.dueDate && item.dueDate < today) return 'overdue';
  return 'upcoming';
}

function workCard(item) {
  const statusClass =
    item.status === 'complete'
      ? 'success'
      : item.status === 'at-risk' || item.riskLevel === 'critical'
        ? 'warning'
        : 'neutral';
  return `<article class="work-card ${item.status === 'complete' ? 'work-card--complete' : ''}" data-work-id="${item.id}"><div class="work-card__top"><div><span class="work-type">${workTypes[item.type] || 'Action'}</span><h3>${escapeHtml(item.title || item.outcome || 'Untitled work item')}</h3></div><span class="status-chip status-chip--${statusClass}">${escapeHtml(workStatusLabel(item.status))}</span></div><p class="work-card__outcome">${escapeHtml(item.outcome || item.nextAction || item.impact || 'No outcome added yet.')}</p><div class="work-card__meta"><span>${item.dueDate ? escapeHtml(workDateLabel(item.dueDate)) : 'No due point'}</span>${item.responsible ? `<span>With ${escapeHtml(item.responsible)}</span>` : ''}${item.group === 'waiting' ? `<span class="waiting-note">Awaiting ${escapeHtml(item.followedUpWith || item.responsible || 'a response')} · next follow-up ${escapeHtml(workDateLabel(item.dueDate))}</span>` : ''}${item.relatedItemIds?.length ? `<span>${item.relatedItemIds.length} related</span>` : ''}</div><div class="work-card__actions"><button class="text-button" type="button" data-edit-work="${item.id}">Open details</button>${item.status === 'complete' ? '<button class="text-button" type="button" data-undo-work>Undo</button>' : `<button class="text-button" type="button" data-complete-work="${item.id}">Complete</button>`}<button class="text-button text-button--quiet" type="button" data-delete-work="${item.id}">Delete</button></div></article>`;
}

function workFilterResults(items, filter, today) {
  const filtered = items.filter(
    (item) => item.type === 'follow-up' && followUpView(item, today) === filter,
  );
  return filtered.length
    ? filtered.map((item) => workCard(item)).join('')
    : `<div class="section-empty"><span aria-hidden="true">—</span><p>No follow-ups in this view.</p></div>`;
}

export function createWorkView(workItems, filter = 'all') {
  const today = new Date().toISOString().slice(0, 10);
  const quickAdds = Object.entries(workTypes)
    .map(
      ([type, label]) =>
        `<button type="button" class="quick-add" data-quick-add="${type}"><span aria-hidden="true">＋</span>${label}</button>`,
    )
    .join('');
  const filters = [
    ['all', 'All work'],
    ['due-today', 'Due today'],
    ['upcoming', 'Upcoming'],
    ['waiting', 'Waiting'],
    ['overdue', 'Overdue'],
    ['complete', 'Complete'],
  ]
    .map(
      ([value, label]) =>
        `<button type="button" class="work-filter ${filter === value ? 'work-filter--active' : ''}" data-work-filter="${value}" aria-pressed="${filter === value}">${label}</button>`,
    )
    .join('');
  const grouped = workGroups
    .map(([key, label, description]) => {
      const items = workItems.filter((item) => (item.group || 'next') === key);
      const capped = key === 'now' && items.length > 3 ? items.slice(0, 3) : items;
      return `<section class="work-group" aria-labelledby="work-group-${key}"><div class="work-group__heading"><div><p class="eyebrow">${label}</p><h2 id="work-group-${key}">${label}</h2><p>${description}</p></div><span class="section-count">${items.length}</span></div>${capped.length ? `<div class="work-list">${capped.map((item) => workCard(item)).join('')}</div>` : `<div class="section-empty work-group__empty"><span aria-hidden="true">—</span><p>Nothing here yet.</p></div>`}</section>`;
    })
    .join('');
  const filterLabels = {
    'due-today': 'Due today',
    upcoming: 'Upcoming',
    waiting: 'Waiting',
    overdue: 'Overdue',
    complete: 'Complete',
  };
  const mainContent =
    filter === 'all'
      ? grouped
      : `<section class="work-filter-results" aria-labelledby="filtered-work-title"><div class="work-group__heading"><div><p class="eyebrow">Follow-up view</p><h2 id="filtered-work-title">${filterLabels[filter] || 'Follow-ups'}</h2></div></div><div class="work-list">${workFilterResults(workItems, filter, today)}</div></section>`;
  return `<section class="work-command" aria-labelledby="work-title"><div class="work-intro"><div><p class="eyebrow">Focused daily leadership work</p><h2 id="work-title">Keep the work moving.</h2><p class="secondary-text">Four simple places for the actions, risks, decisions, and follow-ups that need your leadership.</p></div><div class="quick-adds" aria-label="Quick add">${quickAdds}</div></div><div class="work-filters" role="group" aria-label="Follow-up views">${filters}</div>${mainContent}</section>${createWorkDetailSheet()}`;
}

export function workTypeFields(type, item = {}) {
  if (type === 'risk')
    return `<div class="type-fields"><label>What is at risk?<textarea name="whatAtRisk" rows="2">${escapeHtml(item.whatAtRisk || '')}</textarea></label><label>Impact<textarea name="impact" rows="2">${escapeHtml(item.impact || '')}</textarea></label><label>Immediate action<textarea name="immediateAction" rows="2">${escapeHtml(item.immediateAction || '')}</textarea></label><label>What is required?<textarea name="required" rows="2">${escapeHtml(item.required || '')}</textarea></label><label>Review date<input type="date" name="reviewDate" value="${escapeHtml(item.reviewDate || '')}"></label><label class="check-row"><input type="checkbox" name="escalationRequired" ${item.escalationRequired ? 'checked' : ''}> Escalation required</label></div>`;
  if (type === 'decision')
    return `<div class="type-fields"><label>Decision required<textarea name="decisionRequired" rows="2">${escapeHtml(item.decisionRequired || '')}</textarea></label><label>Why it matters<textarea name="whyMatters" rows="2">${escapeHtml(item.whyMatters || '')}</textarea></label><label>Options<textarea name="options" rows="3" placeholder="One option per line">${escapeHtml(item.options || '')}</textarea></label><label>Decision made<textarea name="decisionMade" rows="2">${escapeHtml(item.decisionMade || '')}</textarea></label><label>Resulting action<textarea name="resultingAction" rows="2">${escapeHtml(item.resultingAction || '')}</textarea></label></div>`;
  if (type === 'follow-up')
    return `<div class="type-fields"><label>What needs to happen?<textarea name="whatNeedsToHappen" rows="2">${escapeHtml(item.whatNeedsToHappen || '')}</textarea></label><label>Who or what is being followed up?<input name="followedUpWith" value="${escapeHtml(item.followedUpWith || '')}"></label><label>Why?<textarea name="why" rows="2">${escapeHtml(item.why || '')}</textarea></label><label>Result<textarea name="result" rows="2">${escapeHtml(item.result || '')}</textarea></label></div>`;
  return '';
}

export function createWorkDetailSheet(item = {}) {
  const type = item.type || 'action';
  return `<dialog id="work-detail" class="modal work-detail-dialog" aria-labelledby="work-detail-title"><div class="modal__header"><div><p class="eyebrow">${item.id ? 'Work item' : 'Quick add'}</p><h2 id="work-detail-title">${item.id ? 'Work item details' : 'Add work item'}</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close work item">×</button></div><form class="modal__body work-form" data-work-form><input type="hidden" name="id" value="${escapeHtml(item.id || '')}"><div class="form-two-col"><label>Type<select name="type"><option value="action" ${type === 'action' ? 'selected' : ''}>Action</option><option value="priority" ${type === 'priority' ? 'selected' : ''}>Priority</option><option value="risk" ${type === 'risk' ? 'selected' : ''}>Risk</option><option value="decision" ${type === 'decision' ? 'selected' : ''}>Decision</option><option value="follow-up" ${type === 'follow-up' ? 'selected' : ''}>Follow-up</option></select></label><label>Group<select name="group"><option value="now" ${item.group === 'now' ? 'selected' : ''}>Now</option><option value="next" ${!item.group || item.group === 'next' ? 'selected' : ''}>Next</option><option value="later" ${item.group === 'later' ? 'selected' : ''}>Later</option><option value="waiting" ${item.group === 'waiting' ? 'selected' : ''}>Waiting</option></select></label></div><label>Title<input name="title" maxlength="140" value="${escapeHtml(item.title || '')}" required placeholder="What needs your leadership?"></label><label>Outcome<textarea name="outcome" rows="2" placeholder="What will be different when this is done?">${escapeHtml(item.outcome || '')}</textarea></label><div class="form-two-col"><label>Responsible person or area <span class="field-hint">optional plain text</span><input name="responsible" value="${escapeHtml(item.responsible || '')}"></label><label>Due date or time<input type="date" name="dueDate" value="${escapeHtml(item.dueDate || '')}"></label></div><div class="form-two-col"><label>Status<select name="status">${workStatusOptions(type, item.status)}</select></label><label>Risk level<select name="riskLevel"><option value="monitor" ${item.riskLevel === 'monitor' ? 'selected' : ''}>Monitor</option><option value="at-risk" ${item.riskLevel === 'at-risk' ? 'selected' : ''}>At risk</option><option value="critical" ${item.riskLevel === 'critical' ? 'selected' : ''}>Critical</option></select></label></div><label>Next action<textarea name="nextAction" rows="2">${escapeHtml(item.nextAction || '')}</textarea></label><label>Notes<textarea name="notes" rows="3">${escapeHtml(item.notes || '')}</textarea></label><label>Related item IDs <span class="field-hint">optional, comma separated</span><input name="relatedItemIds" value="${escapeHtml((item.relatedItemIds || []).join(', '))}"></label><div data-type-fields>${workTypeFields(type, item)}</div><p class="autosave-note" data-autosave-note>Changes save automatically.</p><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Close</button><button type="submit" class="primary-action">Save item</button></div></form></dialog>`;
}

const reviewActions = [
  ['carry-forward', 'Carry forward'],
  ['complete', 'Complete'],
  ['defer', 'Defer'],
  ['escalate', 'Escalate'],
  ['improve', 'Improve'],
  ['remove', 'Remove from tomorrow'],
];

function reviewSuggestionCard(suggestion, review) {
  const action = review.actions?.[suggestion.key]?.action || '';
  return `<article class="review-item ${action ? 'review-item--handled' : ''}"><div class="review-item__heading"><div><span class="work-type">${escapeHtml(suggestion.category)}</span><h3>${escapeHtml(suggestion.title)}</h3></div>${action ? `<span class="status-chip status-chip--success">${escapeHtml(reviewActions.find(([value]) => value === action)?.[1] || action)}</span>` : ''}</div><p>${escapeHtml(suggestion.detail || suggestion.nextAction || 'No additional detail.')}</p><div class="review-item__actions">${reviewActions.map(([value, label]) => `<button type="button" class="text-button ${action === value ? 'text-button--selected' : ''}" data-review-action="${value}" data-review-key="${suggestion.key}">${label}</button>`).join('')}</div></article>`;
}

function reviewList(items, emptyMessage) {
  return items.length
    ? `<ul class="review-simple-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
    : `<div class="section-empty"><span aria-hidden="true">—</span><p>${emptyMessage}</p></div>`;
}

export function createReviewView({
  review,
  plan,
  completed,
  suggestions,
  tomorrowPlan,
  history,
  editable = false,
}) {
  const tomorrowItems = review.tomorrowItems?.length
    ? review.tomorrowItems
    : tomorrowPlan.items || [];
  const tomorrowCards = tomorrowItems.length
    ? tomorrowItems
        .map(
          (item, index) =>
            `<li class="tomorrow-item"><span class="tomorrow-item__order">0${index + 1}</span><span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.outcome || item.type || 'Leadership item')}</small></span><button type="button" class="text-button" data-tomorrow-move="${item.id}" data-direction="up" ${index === 0 ? 'disabled' : ''}>Up</button><button type="button" class="text-button" data-tomorrow-remove="${item.id}">Remove</button></li>`,
        )
        .join('')
    : '<li class="section-empty"><span aria-hidden="true">—</span><p>No items prepared yet.</p></li>';
  const openSuggestions = suggestions.filter(
    (suggestion) => !['complete', 'remove'].includes(review.actions?.[suggestion.key]?.action),
  );
  const completedItems = completed.map((item) => item.title || item.outcome).filter(Boolean);
  const risks = suggestions.filter((item) => item.category === 'Risk').map((item) => item.title);
  const escalations = suggestions
    .filter((item) => review.actions?.[item.key]?.action === 'escalate')
    .map((item) => item.title);
  const historyItems = history.length
    ? history
        .map(
          (closure) =>
            `<li><span><strong>${escapeHtml(new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${closure.date}T12:00:00`)))}</strong><small>${escapeHtml(closure.snapshot?.summary || 'Day closed')}</small></span><button type="button" class="text-button" data-history-open="${closure.date}">View day</button></li>`,
        )
        .join('')
    : '<li class="section-empty"><span aria-hidden="true">—</span><p>No closed days yet.</p></li>';
  if (review.closed && !editable)
    return `<section class="review-command review-closed" aria-labelledby="closed-title"><div class="completion-mark" aria-hidden="true">✓</div><p class="eyebrow">Day closure</p><h2 id="closed-title">Today is closed.</h2><p class="secondary-text">Tomorrow is prepared.</p><p class="review-closed-hint">Your complete day snapshot is saved.</p><button class="primary-action" type="button" data-review-done>Finish Day <span aria-hidden="true">→</span></button><section class="history-section"><div class="section-heading"><div><p class="eyebrow">Daily history</p><h2>Previous days</h2></div></div><ul class="history-list">${historyItems}</ul></section></section>`;
  return `<section class="review-command" aria-labelledby="review-title"><div class="review-intro"><div><p class="eyebrow">Close the loop</p><h2 id="review-title">Finish the day lightly.</h2><p class="secondary-text">Review what changed, decide what carries forward, and leave tomorrow clearer than today.</p></div><span class="review-time">Under 5 min</span></div><section class="review-section"><div class="section-heading"><div><p class="eyebrow">1 · Completed</p><h2>What was completed?</h2></div></div>${reviewList(completedItems, 'Completed work will appear here as you close items.')}</section><section class="review-section"><div class="section-heading"><div><p class="eyebrow">2–5 · Decide</p><h2>What remains open?</h2><p class="secondary-text">Use the existing items below. Nothing needs to be retyped.</p></div></div><div class="review-items">${openSuggestions.length ? openSuggestions.map((suggestion) => reviewSuggestionCard(suggestion, review)).join('') : '<div class="section-empty"><span aria-hidden="true">✓</span><p>Everything is accounted for.</p></div>'}</div></section><div class="review-grid"><section class="review-section review-mini"><p class="eyebrow">3 · At risk</p><h2>What is now at risk?</h2>${reviewList(risks, 'No open risks surfaced.')}</section><section class="review-section review-mini"><p class="eyebrow">5 · Escalate</p><h2>What requires escalation?</h2>${reviewList(escalations, 'No escalation selected.')}</section></div><section class="review-section"><div class="section-heading"><div><p class="eyebrow">6 · Improve</p><h2>What should improve?</h2></div></div><textarea class="review-improvement" data-review-improvement rows="3" placeholder="One practical change for tomorrow">${escapeHtml(review.improvement || '')}</textarea></section><section class="tomorrow-preview" aria-labelledby="tomorrow-title"><div class="section-heading"><div><p class="eyebrow">7 · Prepare tomorrow</p><h2 id="tomorrow-title">Tomorrow preview</h2><p class="secondary-text">Keep the list small and useful.</p></div><button type="button" class="secondary-action" data-tomorrow-add>Add one item</button></div><ul class="tomorrow-list">${tomorrowCards}</ul><div class="tomorrow-support"><span>Likely priorities: ${tomorrowItems.length}</span><span>Meetings: ${(tomorrowPlan.meetings || plan.meetings || []).length}</span><span>Risks to review: ${(tomorrowPlan.risks || risks).length}</span><span>Decisions due: ${(tomorrowPlan.decisions || []).length}</span><span>Follow-ups due: ${(tomorrowPlan.followUps || []).length}</span></div><button type="button" class="secondary-action" data-tomorrow-confirm>Confirm tomorrow</button></section><section class="history-section"><div class="section-heading"><div><p class="eyebrow">Daily history</p><h2>Previous days</h2></div></div><ul class="history-list">${historyItems}</ul></section><div class="review-finish"><button class="primary-action" type="button" data-review-finish>Finish Day <span aria-hidden="true">→</span></button></div></section>`;
}

export function createHistoryDialog(closure, editable = false) {
  const snapshot = closure.snapshot || {};
  return `<dialog id="history-dialog" class="modal history-dialog" aria-labelledby="history-title"><div class="modal__header"><div><p class="eyebrow">Read-only day history</p><h2 id="history-title">${escapeHtml(closure.date)}</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close day history">×</button></div><div class="modal__body"><p class="secondary-text">${escapeHtml(snapshot.summary || 'Day closure snapshot')}</p><dl class="history-summary"><div><dt>Daily focus</dt><dd>${escapeHtml(snapshot.plan?.focus || 'Not set')}</dd></div><div><dt>Priorities</dt><dd>${snapshot.priorities?.length || 0}</dd></div><div><dt>Huddle status</dt><dd>${escapeHtml(snapshot.plan?.huddleStatus || 'Not recorded')}</dd></div><div><dt>Completed work</dt><dd>${snapshot.completedWork?.length || 0}</dd></div><div><dt>Carryover</dt><dd>${snapshot.tomorrow?.items?.length || 0}</dd></div><div><dt>Risks</dt><dd>${snapshot.workItems?.filter((item) => item.type === 'risk').length || 0}</dd></div><div><dt>Decisions</dt><dd>${snapshot.workItems?.filter((item) => item.type === 'decision').length || 0}</dd></div><div><dt>Follow-ups</dt><dd>${snapshot.workItems?.filter((item) => item.type === 'follow-up').length || 0}</dd></div><div><dt>End-of-day summary</dt><dd>${escapeHtml(snapshot.summary || 'Not recorded')}</dd></div></dl><button type="button" class="secondary-action" data-history-edit="${closure.date}">${editable ? 'Editing enabled' : 'Edit Day'}</button></div></dialog>`;
}

export function createWeeklyReviewView({ review, summary, weekStart, weekEnd }) {
  const questions = [
    ['achieved', 'What was achieved?', 'Name the outcomes that moved forward.'],
    ['incomplete', 'What remained incomplete?', 'Keep this factual; it will inform next week.'],
    ['repeatedRisks', 'What risks repeated?', 'Look for patterns worth improving.'],
    ['delayedDecisions', 'What decisions were delayed?', 'Capture the decision, not the backstory.'],
    ['unnecessaryTime', 'What consumed unnecessary time?', 'One observation is enough.'],
    ['continue', 'What should continue?', 'Keep the leadership habits that helped.'],
    ['stop', 'What should stop?', 'Remove one source of avoidable noise.'],
    ['improve', 'What should improve?', 'Turn this into one practical next step.'],
  ];
  const answerFields = questions
    .map(
      ([key, title, hint]) =>
        `<label class="weekly-question"><span>${title}</span><small>${hint}</small><textarea rows="2" data-weekly-answer="${key}" placeholder="Capture a short note">${escapeHtml(review.answers?.[key] || '')}</textarea></label>`,
    )
    .join('');
  const metric = (label, value) => `<div class="summary-metric"><strong>${value}</strong><span>${label}</span></div>`;
  const repeatedRiskText = summary.repeatedRiskLabels?.length ? summary.repeatedRiskLabels.join(' · ') : 'No repeated risk pattern yet.';
  const repeatedRiskAction = summary.repeatedRiskLabels?.[0] ? `<button type="button" class="secondary-action" data-improvement-from-risk="${escapeHtml(summary.repeatedRiskLabels[0])}">Turn into improvement</button>` : '';
  return `<section class="weekly-command" aria-labelledby="weekly-title"><div class="review-intro"><div><p class="eyebrow">Review the rhythm</p><h2 id="weekly-title">Make the week useful.</h2><p class="secondary-text">${escapeHtml(weekStart)} to ${escapeHtml(weekEnd)} · A concise local summary of what your days are teaching you.</p></div><span class="review-time">10 min</span></div><div class="review-switcher" role="group" aria-label="Review period"><a href="#review" class="secondary-action">Daily review</a><a href="#review/weekly" class="secondary-action review-switcher--active">Weekly review</a></div><section class="weekly-summary" aria-labelledby="summary-title"><div class="section-heading"><div><p class="eyebrow">Automatic summary</p><h2 id="summary-title">What the week says</h2></div></div><div class="summary-metrics">${metric('priorities completed', summary.prioritiesCompleted)}${metric('carried forward', summary.prioritiesCarried)}${metric('repeated risks', summary.repeatedRisks)}${metric('overdue follow-ups', summary.overdueFollowUps)}${metric('decisions completed', summary.decisionsCompleted)}${metric('improvements captured', summary.improvementsCaptured)}${metric('morning preparations', summary.morningPreparations)}${metric('huddles completed', summary.huddlesCompleted)}${metric('day reviews completed', summary.dayReviewsCompleted)}</div><div class="summary-callout"><p><strong>Most common blocker:</strong> ${escapeHtml(summary.mostCommonBlocker || 'No repeated blocker yet.')}</p><p><strong>Repeated pattern:</strong> ${escapeHtml(repeatedRiskText)}</p>${repeatedRiskAction}</div></section><section class="weekly-questions" aria-labelledby="questions-title"><div class="section-heading"><div><p class="eyebrow">Reflect</p><h2 id="questions-title">What should change?</h2></div></div>${answerFields}</section><section class="weekly-output" aria-labelledby="next-week-title"><div class="section-heading"><div><p class="eyebrow">Prepare next week</p><h2 id="next-week-title">Three priorities, one improvement, one focus.</h2></div></div><div class="weekly-priority-fields">${[0, 1, 2].map((index) => `<label>Priority ${index + 1}<input data-weekly-priority="${index}" value="${escapeHtml(review.nextPriorities?.[index] || '')}" placeholder="A meaningful outcome"></label>`).join('')}</div><div class="form-two-col"><label>Operating improvement<textarea rows="2" data-weekly-improvement placeholder="One change to test">${escapeHtml(review.operatingImprovement || '')}</textarea></label><label>Leadership focus<textarea rows="2" data-weekly-focus placeholder="How you want to lead">${escapeHtml(review.leadershipFocus || '')}</textarea></label></div><button type="button" class="primary-action" data-weekly-save>Save weekly review <span aria-hidden="true">→</span></button></section></section>`;
}

const improvementCategories = [
  ['simplify', 'Simplify'],
  ['remove-delay', 'Remove delay'],
  ['clarity', 'Improve clarity'],
  ['reduce-error', 'Reduce error'],
  ['handover', 'Improve handover'],
  ['meeting', 'Improve meeting'],
  ['customer-outcome', 'Improve customer outcome'],
  ['workflow', 'Improve workflow'],
];

export function createImproveView(improvements) {
  const cards = improvements.length
    ? improvements
        .map(
          (item) =>
            `<article class="improvement-card"><div class="improvement-card__top"><div><span class="work-type">${escapeHtml(improvementCategories.find(([value]) => value === item.category)?.[1] || 'Improvement')}</span><h3>${escapeHtml(item.notWorking)}</h3></div><span class="status-chip status-chip--${item.status === 'implemented' ? 'success' : 'neutral'}">${escapeHtml((item.status || 'captured')[0].toUpperCase() + (item.status || 'captured').slice(1))}</span></div><p>${escapeHtml(item.change || 'No change captured yet.')}</p><dl class="improvement-meta"><div><dt>Why it helps</dt><dd>${escapeHtml(item.why || 'Not captured')}</dd></div><div><dt>Next step</dt><dd>${escapeHtml(item.nextStep || 'Not captured')}</dd></div></dl><div class="work-card__actions"><button type="button" class="text-button" data-edit-improvement="${item.id}">Edit</button><button type="button" class="text-button text-button--quiet" data-delete-improvement="${item.id}">Delete</button></div></article>`,
        )
        .join('')
    : `<div class="section-empty"><span aria-hidden="true">—</span><p>No improvements captured yet. Start with one small change.</p></div>`;
  return `<section class="improve-command" aria-labelledby="improve-title"><div class="work-intro"><div><p class="eyebrow">Learn and refine</p><h2 id="improve-title">Improve the rhythm.</h2><p class="secondary-text">Keep observations small, actionable, and close to the work.</p></div><button type="button" class="primary-action" data-add-improvement>Capture improvement <span aria-hidden="true">→</span></button></div><div class="improvement-summary"><span>${improvements.length} captured</span><span>${improvements.filter((item) => item.status === 'implemented').length} implemented</span><span>Local-only</span></div><div class="improvement-list">${cards}</div></section>${createImprovementSheet()}`;
}

export function createImprovementSheet(item = {}) {
  const category = item.category || 'simplify';
  const status = item.status || 'captured';
  return `<dialog id="improvement-detail" class="modal work-detail-dialog" aria-labelledby="improvement-title"><div class="modal__header"><div><p class="eyebrow">Improve</p><h2 id="improvement-title">${item.id ? 'Edit improvement' : 'Capture improvement'}</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close improvement">×</button></div><form class="modal__body work-form" data-improvement-form><input type="hidden" name="id" value="${escapeHtml(item.id || '')}"><label>What is not working?<textarea name="notWorking" rows="2" required>${escapeHtml(item.notWorking || '')}</textarea></label><label>What should change?<textarea name="change" rows="2" required>${escapeHtml(item.change || '')}</textarea></label><label>Why would it help?<textarea name="why" rows="2">${escapeHtml(item.why || '')}</textarea></label><label>What is the next step?<textarea name="nextStep" rows="2">${escapeHtml(item.nextStep || '')}</textarea></label><div class="form-two-col"><label>Category<select name="category">${improvementCategories.map(([value, label]) => `<option value="${value}" ${category === value ? 'selected' : ''}>${label}</option>`).join('')}</select></label><label>Status<select name="status">${['captured', 'reviewing', 'testing', 'implemented', 'closed'].map((value) => `<option value="${value}" ${status === value ? 'selected' : ''}>${value[0].toUpperCase() + value.slice(1)}</option>`).join('')}</select></label></div><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Close</button><button type="submit" class="primary-action">Save improvement</button></div></form></dialog>`;
}

export function getRoute() {
  const parts = window.location.hash.slice(1).split('/');
  const key = parts[0] || 'today';
  return routes[key] ? { ...routes[key], key, subroute: parts[1] || '' } : { ...routes.today, key: 'today', subroute: '' };
}

function navItems(currentKey, className) {
  const items = navigation
    .map(
      ([key, label, icon]) =>
        `<a class="nav-item ${className}" href="#${key}" ${
          currentKey === key ? 'aria-current="page"' : ''
        }><span class="nav-item__icon" aria-hidden="true">${icon}</span><span>${label}</span></a>`,
    )
    .join('');
  return `${items}${currentKey === 'review' ? '<a class="nav-item nav-item--subtle" href="#review/weekly"><span class="nav-item__icon" aria-hidden="true">↳</span><span>Weekly review</span></a>' : ''}`;
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
    ${route.key === 'review' ? '' : `<div class="primary-action-bar"><button class="primary-action" type="button" data-primary-action>${route.action}<span aria-hidden="true">→</span></button></div>`}
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
