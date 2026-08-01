(() => {
  // src/components.js
  var routes = {
    today: {
      label: "Today",
      eyebrow: "Your operating view",
      title: "Make today matter.",
      description: "A calm place to see the shape of the day before the day gets noisy.",
      prompt: "Your focused view will appear here in Phase 2.",
      action: "Prepare today"
    },
    huddle: {
      label: "Huddle",
      eyebrow: "Prepare and align",
      title: "Start with alignment.",
      description: "Bring priorities, decisions, risks, and discussion into one clear moment.",
      prompt: "The morning huddle flow will be introduced in a later phase.",
      action: "Open huddle"
    },
    work: {
      label: "Work",
      eyebrow: "Execute with focus",
      title: "Keep the work moving.",
      description: "Hold attention on the commitments that need your leadership today.",
      prompt: "Keep the day focused on the leadership actions that move outcomes forward.",
      action: "Add work item"
    },
    review: {
      label: "Review",
      eyebrow: "Close and prepare",
      title: "Finish the day well.",
      description: "Make space for what carried over, what changed, and what tomorrow needs.",
      prompt: "The end-of-day review flow will be introduced in a later phase.",
      action: "Begin review"
    },
    improve: {
      label: "Improve",
      eyebrow: "Learn and refine",
      title: "Improve the rhythm.",
      description: "Turn small observations into practical changes to the way you lead.",
      prompt: "Improvement capture will be introduced in a later phase.",
      action: "See improvements"
    }
  };
  var navigation = [
    ["today", "Today", "\u25F7"],
    ["huddle", "Huddle", "\uFF0B"],
    ["work", "Work", "\u25A1"],
    ["review", "Review", "\u2713"],
    ["improve", "Improve", "\u2197"]
  ];
  var onboardingSteps = [
    {
      title: "What type of team or function do you lead?",
      explanation: "This helps shape the language of your daily playbook."
    },
    {
      title: "What are the three primary outcomes you are responsible for?",
      explanation: "Name the outcomes, not every task. You can refine them later."
    },
    {
      title: "What time does your workday normally begin?",
      explanation: "We use this only to frame your daily rhythm."
    },
    {
      title: "Do you run a morning huddle?",
      explanation: "This keeps your morning setup aligned to how you already lead."
    },
    {
      title: "What time should the end-of-day review be suggested?",
      explanation: "Choose a calm moment to close the loop and prepare tomorrow."
    }
  ];
  var functionOptions = [
    "Operations",
    "Customer success",
    "Product or technology",
    "Sales or partnerships",
    "Marketing or creative",
    "Other function"
  ];
  var outcomeOptions = [
    "A reliable operation",
    "Customer or community value",
    "Revenue or growth",
    "A strong team rhythm",
    "A clear strategic result",
    "Quality and consistency"
  ];
  var promptLibrary = [
    "Define the outcome, not only the activity.",
    "Communicate risk early.",
    "Do not leave a commitment without a next action.",
    "Remove the blocker before adding more work.",
    "Finish the day by preparing tomorrow."
  ];
  function escapeHtml(value = "") {
    return String(value).replace(
      /[&<>'"]/g,
      (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]
    );
  }
  function onboardingAnswer(state, key) {
    return escapeHtml(state.answers?.[key] || "");
  }
  function createOnboarding(state) {
    if (state.completed && !state.completionSeen) {
      return `<main class="onboarding-screen onboarding-complete" aria-labelledby="onboarding-complete-title"><div class="completion-mark" aria-hidden="true">\u2713</div><p class="eyebrow">Your playbook</p><h1 id="onboarding-complete-title">TalentisOS is ready.</h1><p>Your daily leadership playbook is now set up.</p><button class="primary-action" type="button" data-start-today>Start Today <span aria-hidden="true">\u2192</span></button></main>`;
    }
    const step = Math.max(0, Math.min(state.step || 0, onboardingSteps.length - 1));
    const current = onboardingSteps[step];
    return `<main class="onboarding-screen" aria-labelledby="onboarding-title"><div class="onboarding-top"><span class="onboarding-brand">TalentisOS</span><button class="text-button" type="button" data-onboarding-save>Save &amp; resume later</button></div><div class="onboarding-progress" aria-label="Onboarding progress"><span>Step ${step + 1} of ${onboardingSteps.length}</span><div class="progress-track"><span style="width:${(step + 1) / onboardingSteps.length * 100}%"></span></div></div><section class="onboarding-card"><p class="eyebrow">Set up your daily rhythm</p><h1 id="onboarding-title">${current.title}</h1><p class="onboarding-explanation">${current.explanation}</p><form data-onboarding-form data-step="${step}">${onboardingFields(step, state)}<div class="onboarding-actions">${step > 0 ? '<button class="secondary-action" type="button" data-onboarding-back>Back</button>' : "<span></span>"}<button class="primary-action" type="submit">${step === onboardingSteps.length - 1 ? "Finish setup" : "Continue"} <span aria-hidden="true">\u2192</span></button></div></form></section></main>`;
  }
  function onboardingFields(step, state) {
    if (step === 0)
      return `<div class="option-grid">${functionOptions.map((option) => `<label class="select-option"><input type="radio" name="functionType" value="${escapeHtml(option)}" ${state.answers?.functionType === option ? "checked" : ""} required><span>${option}</span></label>`).join("")}</div>`;
    if (step === 1)
      return `<div class="outcome-fields">${[0, 1, 2].map((index) => `<label>Outcome ${index + 1}<input name="outcome${index}" value="${onboardingAnswer(state, `outcome${index}`)}" placeholder="For example, a clear strategic result" required></label>`).join("")}</div><div class="suggestion-row" aria-label="Outcome suggestions">${outcomeOptions.slice(0, 4).map(
        (option) => `<button type="button" class="suggestion-chip" data-fill-outcome="${escapeHtml(option)}">${option}</button>`
      ).join("")}</div>`;
    if (step === 2)
      return `<label class="large-field">Workday start time<input type="time" name="startTime" value="${onboardingAnswer(state, "startTime")}" required></label>`;
    if (step === 3)
      return `<div class="option-grid option-grid--two"><label class="select-option"><input type="radio" name="morningHuddle" value="yes" ${state.answers?.morningHuddle === "yes" ? "checked" : ""} required><span>Yes, most days</span></label><label class="select-option"><input type="radio" name="morningHuddle" value="no" ${state.answers?.morningHuddle === "no" ? "checked" : ""} required><span>Not usually</span></label></div>`;
    return `<label class="large-field">Suggested review time<input type="time" name="reviewTime" value="${onboardingAnswer(state, "reviewTime")}" required></label>`;
  }
  function statusLabel(status) {
    return { "not-started": "Not started", "in-progress": "In progress", done: "Complete" }[status] || "Not started";
  }
  function generateDailyFocus(priorities, plan) {
    if (plan.risks?.length) return `Protect the day by addressing ${plan.risks[0]}.`;
    if (plan.decisions?.length) return `Make space to decide on ${plan.decisions[0]}.`;
    if (priorities.length)
      return `Move ${priorities[0].outcome.toLowerCase()} forward with intention.`;
    return "Choose the one outcome that would make today meaningful.";
  }
  function createTodayView(plan, priorities, workItems = []) {
    const focus = generateDailyFocus(priorities, plan);
    const prompt = promptLibrary[(/* @__PURE__ */ new Date(`${plan.date}T12:00:00`)).getDate() % promptLibrary.length];
    const criticalRisks = workItems.filter(
      (item) => item.type === "risk" && item.riskLevel === "critical" && item.status !== "complete"
    );
    const dueDecisions = workItems.filter(
      (item) => item.type === "decision" && ["required", "under-review"].includes(item.status) && item.dueDate && item.dueDate <= plan.date
    );
    const overdueFollowUps = workItems.filter(
      (item) => item.type === "follow-up" && item.status !== "complete" && item.dueDate && item.dueDate < plan.date
    );
    const empty = (message) => `<div class="section-empty"><span aria-hidden="true">\u2014</span><p>${message}</p></div>`;
    const priorityCards = priorities.length ? priorities.map(
      (priority, index) => `<article class="priority-card ${priority.status === "done" ? "priority-card--done" : ""}"><div class="priority-card__order" aria-label="Priority ${index + 1}">0${index + 1}</div><div class="priority-card__body"><div class="priority-card__top"><div><p class="card-kicker">Outcome</p><h3>${escapeHtml(priority.outcome)}</h3></div><span class="status-chip status-chip--${priority.status === "done" ? "success" : priority.status === "in-progress" ? "info" : "neutral"}">${statusLabel(priority.status)}</span></div><p class="priority-card__why">${escapeHtml(priority.why || "No why added yet.")}</p><dl class="priority-meta"><div><dt>Due point</dt><dd>${escapeHtml(priority.duePoint || "Not set")}</dd></div></dl><div class="priority-actions"><button class="text-button" type="button" data-edit-priority="${priority.id}">Edit</button><button class="text-button" type="button" data-move-priority="${priority.id}" data-direction="up" ${index === 0 ? "disabled" : ""}>Move up</button><button class="text-button" type="button" data-move-priority="${priority.id}" data-direction="down" ${index === priorities.length - 1 ? "disabled" : ""}>Move down</button><button class="text-button" type="button" data-complete-priority="${priority.id}">${priority.status === "done" ? "Reopen" : "Complete"}</button></div></div></article>`
    ).join("") : empty("No priorities yet. Start with the outcome that matters most.");
    const signalList = (items, emptyMessage) => items.length ? items.map(
      (item) => `<p class="signal-item"><strong>${escapeHtml(item.title || item.outcome || item.whatNeedsToHappen)}</strong><span>${escapeHtml(item.nextAction || item.impact || item.dueDate || "")}</span></p>`
    ).join("") : empty(emptyMessage);
    return `<section class="today-command" aria-labelledby="today-focus-title"><div class="today-greeting"><p class="eyebrow">${new Intl.DateTimeFormat(void 0, { weekday: "long", month: "long", day: "numeric" }).format(/* @__PURE__ */ new Date())}</p><h2 id="today-focus-title">Good morning.</h2><p class="secondary-text">Here is the shape of your leadership day.</p></div><section class="daily-focus"><div><p class="card-kicker">Daily focus</p><h3>${escapeHtml(focus)}</h3></div><span class="focus-card__icon" aria-hidden="true">\u2726</span></section><section class="today-section" aria-labelledby="priorities-title"><div class="section-heading"><div><p class="eyebrow">What matters now?</p><h2 id="priorities-title">Top three priorities</h2></div><button class="secondary-action" type="button" data-add-priority ${priorities.length >= 3 ? "disabled" : ""}>${priorities.length >= 3 ? "Three set" : "Add priority"}</button></div><div class="priority-list">${priorityCards}</div></section><div class="today-grid"><section class="today-section compact-section" aria-labelledby="carryover-title"><div class="section-heading"><h2 id="carryover-title">Carryover</h2><span class="section-count">${plan.carryover?.length || 0}</span></div>${plan.carryover?.length ? plan.carryover.map((item) => `<p>${escapeHtml(item)}</p>`).join("") : empty("Nothing carried over.")}</section><section class="today-section compact-section" aria-labelledby="risk-title"><div class="section-heading"><h2 id="risk-title">At risk</h2><span class="section-count section-count--warning">${criticalRisks.length}</span></div>${signalList(criticalRisks, "No critical risks surfaced.")}</section><section class="today-section compact-section" aria-labelledby="decision-title"><div class="section-heading"><h2 id="decision-title">Decisions</h2><span class="section-count">${dueDecisions.length}</span></div>${signalList(dueDecisions, "No decisions due.")}</section><section class="today-section compact-section" aria-labelledby="follow-up-title"><div class="section-heading"><h2 id="follow-up-title">Follow-ups due</h2><span class="section-count">${overdueFollowUps.length}</span></div>${signalList(overdueFollowUps, "No overdue follow-ups.")}</section></div><section class="today-section meetings-section" aria-labelledby="meetings-title"><div class="section-heading"><h2 id="meetings-title">Meetings</h2><span class="section-count">${plan.meetings?.length || 0}</span></div>${plan.meetings?.length ? plan.meetings.map((item) => `<p>${escapeHtml(item)}</p>`).join("") : empty("No meetings added.")}</section><section class="leadership-prompt" aria-labelledby="prompt-title"><p class="eyebrow">Leadership prompt</p><h2 id="prompt-title">${prompt}</h2></section><section class="end-day-status" aria-labelledby="end-day-title"><div><p class="eyebrow">End-of-day status</p><h2 id="end-day-title">${plan.endOfDayStatus === "complete" ? "Review complete." : "Not reviewed yet."}</h2></div><span class="status-chip status-chip--${plan.endOfDayStatus === "complete" ? "success" : "neutral"}">${plan.endOfDayStatus === "complete" ? "Complete" : "Open"}</span></section></section>${createPrioritySheet()}`;
  }
  function createPrioritySheet() {
    return `<dialog id="priority-sheet" class="modal bottom-sheet-dialog" aria-labelledby="priority-sheet-title"><div class="modal__header"><div><p class="eyebrow">One clear commitment</p><h2 id="priority-sheet-title">Add a priority</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close priority editor">\xD7</button></div><form class="modal__body priority-form" data-priority-form><input type="hidden" name="id"><label>Outcome<input name="outcome" maxlength="120" required placeholder="What result matters most?"></label><label>Why it matters<textarea name="why" maxlength="220" rows="3" placeholder="What will this make possible?"></textarea></label><label>Due point<input name="duePoint" maxlength="80" placeholder="For example, before Friday's review"></label><label>Status<select name="status"><option value="not-started">Not started</option><option value="in-progress">In progress</option><option value="done">Complete</option></select></label><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Cancel</button><button type="submit" class="primary-action">Save priority</button></div></form></dialog>`;
  }
  var workTypes = {
    priority: "Priority",
    risk: "Risk",
    decision: "Decision",
    "follow-up": "Follow-up",
    action: "Action"
  };
  var workGroups = [
    ["now", "Now", "The three leadership actions that need attention first."],
    ["next", "Next", "The next clear moves after Now."],
    ["later", "Later", "Useful work that does not need attention yet."],
    ["waiting", "Waiting", "Items waiting on a person, answer, or condition."]
  ];
  var workStatuses = [
    ["not-started", "Not started"],
    ["in-progress", "In progress"],
    ["waiting", "Waiting"],
    ["at-risk", "At risk"],
    ["complete", "Complete"]
  ];
  function workStatusLabel(status) {
    const labels = [
      ...workStatuses,
      ["required", "Required"],
      ["under-review", "Under review"],
      ["decided", "Decided"],
      ["deferred", "Deferred"]
    ];
    return labels.find(([value]) => value === status)?.[1] || status;
  }
  function workStatusOptions(type, selected = "") {
    const options = type === "decision" ? [
      ["required", "Required"],
      ["under-review", "Under review"],
      ["decided", "Decided"],
      ["deferred", "Deferred"]
    ] : workStatuses;
    return options.map(
      ([value, label]) => `<option value="${value}" ${selected === value || !selected && value === "not-started" ? "selected" : ""}>${label}</option>`
    ).join("");
  }
  function workDateLabel(date) {
    if (!date) return "No date set";
    return new Intl.DateTimeFormat(void 0, { month: "short", day: "numeric" }).format(
      /* @__PURE__ */ new Date(`${date}T12:00:00`)
    );
  }
  function followUpView(item, today) {
    if (item.status === "complete") return "complete";
    if (item.status === "waiting") return "waiting";
    if (item.dueDate === today) return "due-today";
    if (item.dueDate && item.dueDate < today) return "overdue";
    return "upcoming";
  }
  function workCard(item) {
    const statusClass = item.status === "complete" ? "success" : item.status === "at-risk" || item.riskLevel === "critical" ? "warning" : "neutral";
    return `<article class="work-card ${item.status === "complete" ? "work-card--complete" : ""}" data-work-id="${item.id}"><div class="work-card__top"><div><span class="work-type">${workTypes[item.type] || "Action"}</span><h3>${escapeHtml(item.title || item.outcome || "Untitled work item")}</h3></div><span class="status-chip status-chip--${statusClass}">${escapeHtml(workStatusLabel(item.status))}</span></div><p class="work-card__outcome">${escapeHtml(item.outcome || item.nextAction || item.impact || "No outcome added yet.")}</p><div class="work-card__meta"><span>${item.dueDate ? escapeHtml(workDateLabel(item.dueDate)) : "No due point"}</span>${item.responsible ? `<span>With ${escapeHtml(item.responsible)}</span>` : ""}${item.group === "waiting" ? `<span class="waiting-note">Awaiting ${escapeHtml(item.followedUpWith || item.responsible || "a response")} \xB7 next follow-up ${escapeHtml(workDateLabel(item.dueDate))}</span>` : ""}${item.relatedItemIds?.length ? `<span>${item.relatedItemIds.length} related</span>` : ""}</div><div class="work-card__actions"><button class="text-button" type="button" data-edit-work="${item.id}">Open details</button>${item.status === "complete" ? '<button class="text-button" type="button" data-undo-work>Undo</button>' : `<button class="text-button" type="button" data-complete-work="${item.id}">Complete</button>`}<button class="text-button text-button--quiet" type="button" data-delete-work="${item.id}">Delete</button></div></article>`;
  }
  function workFilterResults(items, filter, today) {
    const filtered = items.filter(
      (item) => item.type === "follow-up" && followUpView(item, today) === filter
    );
    return filtered.length ? filtered.map((item) => workCard(item)).join("") : `<div class="section-empty"><span aria-hidden="true">\u2014</span><p>No follow-ups in this view.</p></div>`;
  }
  function createWorkView(workItems, filter = "all") {
    const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    const quickAdds = Object.entries(workTypes).map(
      ([type, label]) => `<button type="button" class="quick-add" data-quick-add="${type}"><span aria-hidden="true">\uFF0B</span>${label}</button>`
    ).join("");
    const filters = [
      ["all", "All work"],
      ["due-today", "Due today"],
      ["upcoming", "Upcoming"],
      ["waiting", "Waiting"],
      ["overdue", "Overdue"],
      ["complete", "Complete"]
    ].map(
      ([value, label]) => `<button type="button" class="work-filter ${filter === value ? "work-filter--active" : ""}" data-work-filter="${value}" aria-pressed="${filter === value}">${label}</button>`
    ).join("");
    const grouped = workGroups.map(([key, label, description]) => {
      const items = workItems.filter((item) => (item.group || "next") === key);
      const capped = key === "now" && items.length > 3 ? items.slice(0, 3) : items;
      return `<section class="work-group" aria-labelledby="work-group-${key}"><div class="work-group__heading"><div><p class="eyebrow">${label}</p><h2 id="work-group-${key}">${label}</h2><p>${description}</p></div><span class="section-count">${items.length}</span></div>${capped.length ? `<div class="work-list">${capped.map((item) => workCard(item)).join("")}</div>` : `<div class="section-empty work-group__empty"><span aria-hidden="true">\u2014</span><p>Nothing here yet.</p></div>`}</section>`;
    }).join("");
    const filterLabels = {
      "due-today": "Due today",
      upcoming: "Upcoming",
      waiting: "Waiting",
      overdue: "Overdue",
      complete: "Complete"
    };
    const mainContent = filter === "all" ? grouped : `<section class="work-filter-results" aria-labelledby="filtered-work-title"><div class="work-group__heading"><div><p class="eyebrow">Follow-up view</p><h2 id="filtered-work-title">${filterLabels[filter] || "Follow-ups"}</h2></div></div><div class="work-list">${workFilterResults(workItems, filter, today)}</div></section>`;
    return `<section class="work-command" aria-labelledby="work-title"><div class="work-intro"><div><p class="eyebrow">Focused daily leadership work</p><h2 id="work-title">Keep the work moving.</h2><p class="secondary-text">Four simple places for the actions, risks, decisions, and follow-ups that need your leadership.</p></div><div class="quick-adds" aria-label="Quick add">${quickAdds}</div></div><div class="work-filters" role="group" aria-label="Follow-up views">${filters}</div>${mainContent}</section>${createWorkDetailSheet()}`;
  }
  function workTypeFields(type, item = {}) {
    if (type === "risk")
      return `<div class="type-fields"><label>What is at risk?<textarea name="whatAtRisk" rows="2">${escapeHtml(item.whatAtRisk || "")}</textarea></label><label>Impact<textarea name="impact" rows="2">${escapeHtml(item.impact || "")}</textarea></label><label>Immediate action<textarea name="immediateAction" rows="2">${escapeHtml(item.immediateAction || "")}</textarea></label><label>What is required?<textarea name="required" rows="2">${escapeHtml(item.required || "")}</textarea></label><label>Review date<input type="date" name="reviewDate" value="${escapeHtml(item.reviewDate || "")}"></label><label class="check-row"><input type="checkbox" name="escalationRequired" ${item.escalationRequired ? "checked" : ""}> Escalation required</label></div>`;
    if (type === "decision")
      return `<div class="type-fields"><label>Decision required<textarea name="decisionRequired" rows="2">${escapeHtml(item.decisionRequired || "")}</textarea></label><label>Why it matters<textarea name="whyMatters" rows="2">${escapeHtml(item.whyMatters || "")}</textarea></label><label>Options<textarea name="options" rows="3" placeholder="One option per line">${escapeHtml(item.options || "")}</textarea></label><label>Decision made<textarea name="decisionMade" rows="2">${escapeHtml(item.decisionMade || "")}</textarea></label><label>Resulting action<textarea name="resultingAction" rows="2">${escapeHtml(item.resultingAction || "")}</textarea></label></div>`;
    if (type === "follow-up")
      return `<div class="type-fields"><label>What needs to happen?<textarea name="whatNeedsToHappen" rows="2">${escapeHtml(item.whatNeedsToHappen || "")}</textarea></label><label>Who or what is being followed up?<input name="followedUpWith" value="${escapeHtml(item.followedUpWith || "")}"></label><label>Why?<textarea name="why" rows="2">${escapeHtml(item.why || "")}</textarea></label><label>Result<textarea name="result" rows="2">${escapeHtml(item.result || "")}</textarea></label></div>`;
    return "";
  }
  function createWorkDetailSheet(item = {}) {
    const type = item.type || "action";
    return `<dialog id="work-detail" class="modal work-detail-dialog" aria-labelledby="work-detail-title"><div class="modal__header"><div><p class="eyebrow">${item.id ? "Work item" : "Quick add"}</p><h2 id="work-detail-title">${item.id ? "Work item details" : "Add work item"}</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close work item">\xD7</button></div><form class="modal__body work-form" data-work-form><input type="hidden" name="id" value="${escapeHtml(item.id || "")}"><div class="form-two-col"><label>Type<select name="type"><option value="action" ${type === "action" ? "selected" : ""}>Action</option><option value="priority" ${type === "priority" ? "selected" : ""}>Priority</option><option value="risk" ${type === "risk" ? "selected" : ""}>Risk</option><option value="decision" ${type === "decision" ? "selected" : ""}>Decision</option><option value="follow-up" ${type === "follow-up" ? "selected" : ""}>Follow-up</option></select></label><label>Group<select name="group"><option value="now" ${item.group === "now" ? "selected" : ""}>Now</option><option value="next" ${!item.group || item.group === "next" ? "selected" : ""}>Next</option><option value="later" ${item.group === "later" ? "selected" : ""}>Later</option><option value="waiting" ${item.group === "waiting" ? "selected" : ""}>Waiting</option></select></label></div><label>Title<input name="title" maxlength="140" value="${escapeHtml(item.title || "")}" required placeholder="What needs your leadership?"></label><label>Outcome<textarea name="outcome" rows="2" placeholder="What will be different when this is done?">${escapeHtml(item.outcome || "")}</textarea></label><div class="form-two-col"><label>Responsible person or area <span class="field-hint">optional plain text</span><input name="responsible" value="${escapeHtml(item.responsible || "")}"></label><label>Due date or time<input type="date" name="dueDate" value="${escapeHtml(item.dueDate || "")}"></label></div><div class="form-two-col"><label>Status<select name="status">${workStatusOptions(type, item.status)}</select></label><label>Risk level<select name="riskLevel"><option value="monitor" ${item.riskLevel === "monitor" ? "selected" : ""}>Monitor</option><option value="at-risk" ${item.riskLevel === "at-risk" ? "selected" : ""}>At risk</option><option value="critical" ${item.riskLevel === "critical" ? "selected" : ""}>Critical</option></select></label></div><label>Next action<textarea name="nextAction" rows="2">${escapeHtml(item.nextAction || "")}</textarea></label><label>Notes<textarea name="notes" rows="3">${escapeHtml(item.notes || "")}</textarea></label><label>Related item IDs <span class="field-hint">optional, comma separated</span><input name="relatedItemIds" value="${escapeHtml((item.relatedItemIds || []).join(", "))}"></label><div data-type-fields>${workTypeFields(type, item)}</div><p class="autosave-note" data-autosave-note>Changes save automatically.</p><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Close</button><button type="submit" class="primary-action">Save item</button></div></form></dialog>`;
  }
  function getRoute() {
    const key = window.location.hash.slice(1).split("/")[0] || "today";
    return routes[key] ? { ...routes[key], key } : { ...routes.today, key: "today" };
  }
  function navItems(currentKey, className) {
    return navigation.map(
      ([key, label, icon]) => `<a class="nav-item ${className}" href="#${key}" ${currentKey === key ? 'aria-current="page"' : ""}><span class="nav-item__icon" aria-hidden="true">${icon}</span><span>${label}</span></a>`
    ).join("");
  }
  function settingsDialog() {
    return `<dialog id="settings-dialog" class="modal" aria-labelledby="settings-title">
    <div class="modal__header"><div><p class="eyebrow">Preferences</p><h2 id="settings-title">Settings</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close settings">\xD7</button></div>
    <div class="modal__body"><p class="secondary-text">Tune the interface to the way you work. Product data and leadership records are not part of this phase.</p>
      ${createSegmentedControl("Appearance", [
      ["light", "Light"],
      ["system", "System"],
      ["dark", "Dark"]
    ])}
    </div>
  </dialog>`;
  }
  function createSegmentedControl(label, options) {
    return `<fieldset class="preference-group"><legend>${label}</legend><div class="segmented-control" role="group" aria-label="${label}">${options.map(([value, text]) => `<button type="button" data-theme-choice="${value}" aria-pressed="${value === "system"}">${text}</button>`).join("")}</div></fieldset>`;
  }
  function createEmptyState(title, description) {
    return `<section class="empty-state" aria-labelledby="empty-state-title"><div class="empty-state__mark" aria-hidden="true">\u25CB</div><div><p class="eyebrow">A clear beginning</p><h2 id="empty-state-title">${title}</h2><p class="secondary-text">${description}</p></div></section>`;
  }
  function createToast(message) {
    return `<div class="toast" role="status">${message}</div>`;
  }
  function createAppShell(route) {
    return `<div class="app-layout">
    <aside class="sidebar" aria-label="Application navigation">
      <div class="sidebar__top"><a class="brand" href="#today" aria-label="TalentisOS home"><span class="brand-mark" aria-hidden="true">T</span><span class="brand-wordmark">Talentis<span>OS</span></span></a><button class="icon-button sidebar-toggle" type="button" data-toggle-sidebar aria-expanded="true" aria-label="Collapse sidebar">\u2190</button></div>
      <nav class="sidebar__nav" aria-label="Primary navigation"><p class="nav-label">Workspace</p>${navItems(route.key, "")}</nav>
      <div class="sidebar__bottom"><button class="nav-item settings-link" type="button" data-open-settings><span class="nav-item__icon" aria-hidden="true">\u2699</span><span>Settings</span></button><p class="sidebar-caption">Leadership, made clear.</p></div>
    </aside>
    <header class="mobile-header"><a class="brand" href="#today" aria-label="TalentisOS home"><span class="brand-mark" aria-hidden="true">T</span><span class="brand-wordmark">Talentis<span>OS</span></span></a><button class="icon-button" type="button" data-open-settings aria-label="Open settings">\u2699</button></header>
    <main id="main-content" class="content-area"><div class="content-inner"><header class="page-header"><div><p class="eyebrow">${route.eyebrow}</p><h1>${route.label}</h1></div><div class="page-header__meta"><span class="date-label">${new Intl.DateTimeFormat(void 0, { weekday: "long", month: "long", day: "numeric" }).format(/* @__PURE__ */ new Date())}</span><span class="status-dot" aria-label="Offline-ready shell"></span></div></header><div id="view-root"></div></div></main>
    <nav class="bottom-nav" aria-label="Primary navigation">${navItems(route.key, "")}<button class="nav-item" type="button" data-open-settings><span class="nav-item__icon" aria-hidden="true">\u2022\u2022\u2022</span><span>More</span></button></nav>
    <div class="primary-action-bar"><button class="primary-action" type="button" data-primary-action>${route.action}<span aria-hidden="true">\u2192</span></button></div>
    ${settingsDialog()}
  </div>`;
  }
  function renderView(route) {
    const viewRoot = document.querySelector("#view-root");
    viewRoot.innerHTML = `<section class="hero-section" aria-labelledby="view-title"><div class="hero-copy"><p class="eyebrow">Prepare \xB7 Align \xB7 Execute \xB7 Review \xB7 Improve</p><h2 id="view-title">${route.title}</h2><p>${route.description}</p></div><div class="focus-card"><div class="focus-card__icon" aria-hidden="true">${route.key === "today" ? "\u2726" : "\u25CB"}</div><div><p class="card-kicker">Next step</p><h3>${route.action}</h3><p class="secondary-text">${route.prompt}</p></div><span class="card-arrow" aria-hidden="true">\u2197</span></div></section><section class="status-grid" aria-label="Leadership rhythm status"><article class="status-card"><span class="status-card__label">Rhythm</span><strong>Foundation</strong><span class="status-chip status-chip--info">Phase 1</span></article><article class="status-card"><span class="status-card__label">Mode</span><strong>Local-first</strong><span class="status-chip status-chip--success">Ready</span></article><article class="status-card"><span class="status-card__label">Focus</span><strong>One clear step</strong><span class="status-chip status-chip--neutral">Intentional</span></article></section>${createEmptyState("Your workspace is ready.", "This foundation keeps the day visible without adding noise. Product workflows arrive in later phases.")}`;
    document.querySelector("[data-primary-action]").addEventListener("click", () => {
      document.querySelector("[data-primary-action]").textContent = "Coming in Phase 2";
      window.setTimeout(() => {
        document.querySelector("[data-primary-action]").innerHTML = `${route.action}<span aria-hidden="true">\u2192</span>`;
      }, 1800);
    });
  }

  // src/db.js
  var DB_NAME = "talentisos";
  var DB_VERSION = 2;
  var stores = {
    settings: "settings",
    dailyPlans: "dailyPlans",
    priorities: "priorities",
    workItems: "workItems",
    appMeta: "appMeta"
  };
  function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        request.result.onversionchange = () => request.result.close();
        resolve(request.result);
      };
      request.onerror = () => reject(request.error);
    });
  }
  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const database2 = request.result;
        if (!database2.objectStoreNames.contains(stores.settings)) {
          const settings = database2.createObjectStore(stores.settings, { keyPath: "id" });
          settings.createIndex("updatedAt", "updatedAt");
        }
        if (!database2.objectStoreNames.contains(stores.dailyPlans)) {
          database2.createObjectStore(stores.dailyPlans, { keyPath: "date" });
        }
        if (!database2.objectStoreNames.contains(stores.priorities)) {
          const priorities = database2.createObjectStore(stores.priorities, { keyPath: "id" });
          priorities.createIndex("planDate", "planDate");
          priorities.createIndex("status", "status");
        }
        if (!database2.objectStoreNames.contains(stores.workItems)) {
          const workItems = database2.createObjectStore(stores.workItems, { keyPath: "id" });
          workItems.createIndex("group", "group");
          workItems.createIndex("type", "type");
          workItems.createIndex("status", "status");
          workItems.createIndex("dueDate", "dueDate");
        }
        if (!database2.objectStoreNames.contains(stores.appMeta)) {
          database2.createObjectStore(stores.appMeta, { keyPath: "key" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  async function getRecord(database2, storeName, key) {
    return requestResult(database2.transaction(storeName, "readonly").objectStore(storeName).get(key));
  }
  async function getAll(database2, storeName) {
    return requestResult(database2.transaction(storeName, "readonly").objectStore(storeName).getAll());
  }
  async function putRecord(database2, storeName, value) {
    return requestResult(
      database2.transaction(storeName, "readwrite").objectStore(storeName).put(value)
    );
  }
  async function deleteRecord(database2, storeName, key) {
    return requestResult(
      database2.transaction(storeName, "readwrite").objectStore(storeName).delete(key)
    );
  }
  async function getOnboardingState(database2) {
    const existing = await getRecord(database2, stores.appMeta, "onboarding");
    if (existing) return existing;
    const initial = {
      key: "onboarding",
      completed: false,
      completionSeen: false,
      step: 0,
      answers: {},
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await putRecord(database2, stores.appMeta, initial);
    return initial;
  }
  async function saveOnboardingState(database2, state) {
    const next = { ...state, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    await putRecord(database2, stores.appMeta, next);
    return next;
  }
  function todayKey(date = /* @__PURE__ */ new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  async function getDailyPlan(database2, date = todayKey()) {
    const existing = await getRecord(database2, stores.dailyPlans, date);
    if (existing) return existing;
    const plan = {
      date,
      focus: "",
      carryover: [],
      risks: [],
      decisions: [],
      followUps: [],
      meetings: [],
      endOfDayStatus: "not-started",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await putRecord(database2, stores.dailyPlans, plan);
    return plan;
  }
  async function getPriorities(database2, planDate = todayKey()) {
    const records = await getAll(database2, stores.priorities);
    return records.filter((priority) => priority.planDate === planDate).sort((a, b) => a.order - b.order);
  }
  async function savePriority(database2, priority) {
    return putRecord(database2, stores.priorities, {
      ...priority,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async function getWorkItems(database2) {
    return getAll(database2, stores.workItems);
  }
  async function saveWorkItem(database2, workItem) {
    return putRecord(database2, stores.workItems, {
      ...workItem,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async function deleteWorkItem(database2, id) {
    return deleteRecord(database2, stores.workItems, id);
  }

  // src/main.js
  var app = document.querySelector("#app");
  var toastRegion = document.querySelector("#toast-region");
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var themeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  var database;
  var onboardingState;
  var currentPlan;
  var currentPriorities = [];
  var currentWorkItems = [];
  var currentWorkFilter = "all";
  var autosaveTimer;
  var lastUndo;
  function showToast(message) {
    toastRegion.replaceChildren();
    toastRegion.innerHTML = createToast(message);
    const toast = toastRegion.firstElementChild;
    if (lastUndo && (message.includes("completed") || message.includes("deleted"))) {
      const undo = document.createElement("button");
      undo.className = "toast__action";
      undo.type = "button";
      undo.dataset.undoWork = "true";
      undo.textContent = "Undo";
      toast.append(undo);
    }
    window.setTimeout(() => toast?.remove(), 3600);
  }
  function resolvedTheme(theme) {
    return theme === "system" ? themeQuery.matches ? "dark" : "light" : theme;
  }
  function applyTheme(theme, announce = false) {
    const activeTheme = resolvedTheme(theme);
    try {
      localStorage.setItem("talentisos-theme", theme);
    } catch {
    }
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.resolvedTheme = activeTheme;
    themeMeta.setAttribute("content", activeTheme === "dark" ? "#101820" : "#f5f7fa");
    document.querySelectorAll("[data-theme-choice]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.themeChoice === theme));
    });
    if (announce) showToast(`${theme[0].toUpperCase()}${theme.slice(1)} appearance selected.`);
  }
  function savedTheme() {
    try {
      return localStorage.getItem("talentisos-theme") || "system";
    } catch {
      return "system";
    }
  }
  async function render() {
    if (!onboardingState.completed || !onboardingState.completionSeen) {
      app.innerHTML = createOnboarding(onboardingState);
      applyTheme(savedTheme());
      document.title = "Set up TalentisOS";
      return;
    }
    const route = getRoute();
    if (route.key === "today") {
      currentPlan = await getDailyPlan(database);
      currentPriorities = await getPriorities(database, currentPlan.date);
      currentWorkItems = await getWorkItems(database);
      const action = currentPriorities.length < 3 ? "Add a priority" : "Review priorities";
      app.innerHTML = createAppShell({ ...route, action });
      document.querySelector("#view-root").innerHTML = createTodayView(
        currentPlan,
        currentPriorities,
        currentWorkItems
      );
      document.title = "Today \u2014 TalentisOS";
    } else if (route.key === "work") {
      currentWorkItems = await getWorkItems(database);
      app.innerHTML = createAppShell(route);
      document.querySelector("#view-root").innerHTML = createWorkView(
        currentWorkItems,
        currentWorkFilter
      );
      document.title = "Work \u2014 TalentisOS";
    } else {
      app.innerHTML = createAppShell(route);
      renderView(route);
      document.title = `${route.label} \u2014 TalentisOS`;
    }
    applyTheme(savedTheme());
  }
  function openDialog(dialog) {
    if (!dialog) return;
    dialog.showModal();
    dialog.querySelector("button, [href], input, select, textarea")?.focus();
  }
  function formValues(form) {
    return Object.fromEntries(new FormData(form).entries());
  }
  function workItemFromForm(form) {
    const values = formValues(form);
    const existing = currentWorkItems.find((item) => item.id === values.id);
    const checkbox = form.elements.escalationRequired;
    return {
      ...existing || {},
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
      relatedItemIds: values.relatedItemIds.split(",").map((id) => id.trim()).filter(Boolean),
      whatAtRisk: values.whatAtRisk?.trim() || "",
      impact: values.impact?.trim() || "",
      immediateAction: values.immediateAction?.trim() || "",
      required: values.required?.trim() || "",
      reviewDate: values.reviewDate || "",
      escalationRequired: checkbox?.checked || false,
      decisionRequired: values.decisionRequired?.trim() || "",
      whyMatters: values.whyMatters?.trim() || "",
      options: values.options?.trim() || "",
      decisionMade: values.decisionMade?.trim() || "",
      resultingAction: values.resultingAction?.trim() || "",
      whatNeedsToHappen: values.whatNeedsToHappen?.trim() || "",
      followedUpWith: values.followedUpWith?.trim() || "",
      why: values.why?.trim() || "",
      result: values.result?.trim() || ""
    };
  }
  async function persistWorkForm(form) {
    const item = workItemFromForm(form);
    if (!item.title) return;
    const activeNow = currentWorkItems.filter(
      (existing) => existing.group === "now" && existing.status !== "complete" && existing.id !== item.id
    );
    if (item.group === "now" && item.status !== "complete" && activeNow.length >= 3) {
      showToast("Now is limited to three active leadership actions.");
      return false;
    }
    if (!form.elements.id.value) form.elements.id.value = item.id;
    await saveWorkItem(database, item);
    currentWorkItems = [...currentWorkItems.filter((existing) => existing.id !== item.id), item];
    form.querySelector("[data-autosave-note]").textContent = "Saved automatically.";
    window.setTimeout(() => {
      form.querySelector("[data-autosave-note]")?.replaceChildren(document.createTextNode("Changes save automatically."));
    }, 1600);
    return true;
  }
  function openWorkEditor(item, type = "action") {
    const dialog = document.querySelector("#work-detail");
    if (!dialog) return;
    if (item) {
      dialog.outerHTML = createWorkDetailSheet(item);
    } else if (type !== "action") {
      dialog.outerHTML = createWorkDetailSheet({ type });
    }
    const nextDialog = document.querySelector("#work-detail");
    nextDialog?.showModal();
    nextDialog?.querySelector('input:not([type="hidden"]), textarea, select')?.focus();
  }
  async function completeWorkItem(id) {
    const item = currentWorkItems.find((workItem) => workItem.id === id);
    if (!item) return;
    lastUndo = { item: { ...item } };
    await saveWorkItem(database, {
      ...item,
      status: item.status === "complete" ? "in-progress" : "complete"
    });
    showToast(item.status === "complete" ? "Work item reopened." : "Work item completed.");
    await render();
  }
  async function completeOnboarding(answers) {
    await putRecord(database, stores.settings, {
      id: "primary",
      teamFunction: answers.functionType,
      outcomes: [answers.outcome0, answers.outcome1, answers.outcome2].filter(Boolean),
      workdayStart: answers.startTime,
      morningHuddle: answers.morningHuddle === "yes",
      reviewTime: answers.reviewTime,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  function openPriorityEditor(priority) {
    const dialog = document.querySelector("#priority-sheet");
    const form = dialog?.querySelector("[data-priority-form]");
    if (!dialog || !form) return;
    form.reset();
    form.elements.id.value = priority?.id || "";
    form.elements.outcome.value = priority?.outcome || "";
    form.elements.why.value = priority?.why || "";
    form.elements.duePoint.value = priority?.duePoint || "";
    form.elements.status.value = priority?.status || "not-started";
    dialog.querySelector("#priority-sheet-title").textContent = priority ? "Edit priority" : "Add a priority";
    openDialog(dialog);
  }
  async function savePriorityForm(form) {
    const values = formValues(form);
    const existing = currentPriorities.find((priority) => priority.id === values.id);
    if (!existing && currentPriorities.length >= 3) {
      showToast("Keep the day focused: three priorities is the limit.");
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
      completedAt: values.status === "done" ? (/* @__PURE__ */ new Date()).toISOString() : null
    });
    form.closest("dialog").close();
    showToast(existing ? "Priority updated." : "Priority added.");
    await render();
  }
  async function movePriority(id, direction) {
    const index = currentPriorities.findIndex((priority) => priority.id === id);
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || nextIndex < 0 || nextIndex >= currentPriorities.length) return;
    const current = currentPriorities[index];
    const next = currentPriorities[nextIndex];
    await savePriority(database, { ...current, order: next.order });
    await savePriority(database, { ...next, order: current.order });
    await render();
  }
  document.addEventListener("submit", async (event) => {
    const onboardingForm = event.target.closest("[data-onboarding-form]");
    if (onboardingForm) {
      event.preventDefault();
      const values = formValues(onboardingForm);
      onboardingState = await saveOnboardingState(database, {
        ...onboardingState,
        step: Number(onboardingForm.dataset.step) + 1,
        answers: { ...onboardingState.answers, ...values },
        completed: Number(onboardingForm.dataset.step) === 4,
        completionSeen: onboardingState.completionSeen || false
      });
      if (onboardingState.completed) await completeOnboarding(onboardingState.answers);
      showToast(onboardingState.completed ? "Your playbook is ready." : "Saved.");
      await render();
      return;
    }
    const priorityForm = event.target.closest("[data-priority-form]");
    if (priorityForm) {
      event.preventDefault();
      await savePriorityForm(priorityForm);
      return;
    }
    const workForm = event.target.closest("[data-work-form]");
    if (workForm) {
      event.preventDefault();
      const saved = await persistWorkForm(workForm);
      if (!saved) return;
      workForm.closest("dialog").close();
      showToast("Work item saved.");
      await render();
    }
  });
  document.addEventListener("input", (event) => {
    const workForm = event.target.closest("[data-work-form]");
    if (!workForm) return;
    window.clearTimeout(autosaveTimer);
    autosaveTimer = window.setTimeout(() => persistWorkForm(workForm), 600);
  });
  document.addEventListener("change", (event) => {
    const workType = event.target.closest('[data-work-form] select[name="type"]');
    if (!workType) return;
    const form = workType.closest("[data-work-form]");
    const current = workItemFromForm(form);
    form.querySelector("[data-type-fields]").innerHTML = workTypeFields(workType.value, current);
    form.querySelector('select[name="status"]').innerHTML = workStatusOptions(workType.value, "");
  });
  document.addEventListener("click", async (event) => {
    const themeButton = event.target.closest("[data-theme-choice]");
    if (themeButton) {
      applyTheme(themeButton.dataset.themeChoice, true);
      return;
    }
    const settingsButton = event.target.closest("[data-open-settings]");
    if (settingsButton) {
      openDialog(document.querySelector("#settings-dialog"));
      return;
    }
    const closeButton = event.target.closest("[data-close-dialog]");
    if (closeButton) closeButton.closest("dialog")?.close();
    const collapseButton = event.target.closest("[data-toggle-sidebar]");
    if (collapseButton) {
      const collapsed = document.body.classList.toggle("sidebar-collapsed");
      collapseButton.setAttribute("aria-expanded", String(!collapsed));
      showToast(collapsed ? "Sidebar collapsed." : "Sidebar expanded.");
      return;
    }
    const workFilter = event.target.closest("[data-work-filter]");
    if (workFilter) {
      currentWorkFilter = workFilter.dataset.workFilter;
      await render();
      return;
    }
    const quickAdd = event.target.closest("[data-quick-add]");
    if (quickAdd) {
      openWorkEditor(null, quickAdd.dataset.quickAdd);
      return;
    }
    if (event.target.closest("[data-primary-action]") && getRoute().key === "work") {
      openWorkEditor(null, "action");
      return;
    }
    const editWork = event.target.closest("[data-edit-work]");
    if (editWork) {
      openWorkEditor(currentWorkItems.find((item) => item.id === editWork.dataset.editWork));
      return;
    }
    const completeWork = event.target.closest("[data-complete-work]");
    if (completeWork) {
      await completeWorkItem(completeWork.dataset.completeWork);
      return;
    }
    if (event.target.closest("[data-undo-work]") && lastUndo) {
      await saveWorkItem(database, lastUndo.item);
      lastUndo = null;
      showToast("Work item restored.");
      await render();
      return;
    }
    const deleteWork = event.target.closest("[data-delete-work]");
    if (deleteWork) {
      const item = currentWorkItems.find((workItem) => workItem.id === deleteWork.dataset.deleteWork);
      if (item && window.confirm("Delete this work item?")) {
        lastUndo = { item: { ...item } };
        await deleteWorkItem(database, item.id);
        showToast("Work item deleted.");
        await render();
      }
      return;
    }
    if (event.target.closest("[data-onboarding-save]")) {
      onboardingState = await saveOnboardingState(database, onboardingState);
      showToast("Progress saved. You can resume here anytime.");
      return;
    }
    if (event.target.closest("[data-onboarding-back]")) {
      onboardingState = await saveOnboardingState(database, {
        ...onboardingState,
        step: Math.max(0, onboardingState.step - 1)
      });
      await render();
      return;
    }
    const suggestion = event.target.closest("[data-fill-outcome]");
    if (suggestion) {
      const firstEmpty = [...document.querySelectorAll('[name^="outcome"]')].find(
        (input) => !input.value
      );
      if (firstEmpty) firstEmpty.value = suggestion.dataset.fillOutcome;
      return;
    }
    if (event.target.closest("[data-start-today]")) {
      onboardingState = await saveOnboardingState(database, {
        ...onboardingState,
        completionSeen: true
      });
      window.location.hash = "#today";
      await render();
      return;
    }
    if (event.target.closest("[data-primary-action]") && getRoute().key === "today") {
      if (currentPriorities.length < 3) openPriorityEditor();
      else showToast("Your three priorities are set. Keep the focus clear.");
      return;
    }
    if (event.target.closest("[data-add-priority]")) {
      openPriorityEditor();
      return;
    }
    const editButton = event.target.closest("[data-edit-priority]");
    if (editButton) {
      openPriorityEditor(
        currentPriorities.find((priority) => priority.id === editButton.dataset.editPriority)
      );
      return;
    }
    const moveButton = event.target.closest("[data-move-priority]");
    if (moveButton) {
      await movePriority(moveButton.dataset.movePriority, moveButton.dataset.direction);
      return;
    }
    const completeButton = event.target.closest("[data-complete-priority]");
    if (completeButton) {
      const priority = currentPriorities.find(
        (item) => item.id === completeButton.dataset.completePriority
      );
      if (priority) {
        await savePriority(database, {
          ...priority,
          status: priority.status === "done" ? "in-progress" : "done",
          completedAt: priority.status === "done" ? null : (/* @__PURE__ */ new Date()).toISOString()
        });
        await render();
      }
    }
  });
  window.addEventListener("hashchange", () => render());
  themeQuery.addEventListener("change", () => {
    if (document.documentElement.dataset.theme === "system") applyTheme("system");
  });
  async function initialize() {
    try {
      database = await openDatabase();
      onboardingState = await getOnboardingState(database);
      document.documentElement.dataset.appReady = "true";
      await render();
    } catch {
      app.innerHTML = '<main class="error-screen"><h1>TalentisOS could not open its local workspace.</h1><p>Refresh the page and try again.</p></main>';
    }
  }
  initialize();
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register("/service-worker.js");
        registration.addEventListener("updatefound", () => showToast("A fresh version is ready."));
        navigator.serviceWorker.addEventListener(
          "controllerchange",
          () => showToast("TalentisOS is up to date.")
        );
      } catch {
        showToast("Offline support is unavailable in this browser session.");
      }
    });
  }
})();
