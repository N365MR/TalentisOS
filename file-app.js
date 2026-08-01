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
      prompt: "Focused work capture will be introduced in a later phase.",
      action: "View work"
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
  function createTodayView(plan, priorities) {
    const focus = generateDailyFocus(priorities, plan);
    const prompt = promptLibrary[(/* @__PURE__ */ new Date(`${plan.date}T12:00:00`)).getDate() % promptLibrary.length];
    const empty = (message) => `<div class="section-empty"><span aria-hidden="true">\u2014</span><p>${message}</p></div>`;
    const priorityCards = priorities.length ? priorities.map(
      (priority, index) => `<article class="priority-card ${priority.status === "done" ? "priority-card--done" : ""}"><div class="priority-card__order" aria-label="Priority ${index + 1}">0${index + 1}</div><div class="priority-card__body"><div class="priority-card__top"><div><p class="card-kicker">Outcome</p><h3>${escapeHtml(priority.outcome)}</h3></div><span class="status-chip status-chip--${priority.status === "done" ? "success" : priority.status === "in-progress" ? "info" : "neutral"}">${statusLabel(priority.status)}</span></div><p class="priority-card__why">${escapeHtml(priority.why || "No why added yet.")}</p><dl class="priority-meta"><div><dt>Due point</dt><dd>${escapeHtml(priority.duePoint || "Not set")}</dd></div></dl><div class="priority-actions"><button class="text-button" type="button" data-edit-priority="${priority.id}">Edit</button><button class="text-button" type="button" data-move-priority="${priority.id}" data-direction="up" ${index === 0 ? "disabled" : ""}>Move up</button><button class="text-button" type="button" data-move-priority="${priority.id}" data-direction="down" ${index === priorities.length - 1 ? "disabled" : ""}>Move down</button><button class="text-button" type="button" data-complete-priority="${priority.id}">${priority.status === "done" ? "Reopen" : "Complete"}</button></div></div></article>`
    ).join("") : empty("No priorities yet. Start with the outcome that matters most.");
    return `<section class="today-command" aria-labelledby="today-focus-title"><div class="today-greeting"><p class="eyebrow">${new Intl.DateTimeFormat(void 0, { weekday: "long", month: "long", day: "numeric" }).format(/* @__PURE__ */ new Date())}</p><h2 id="today-focus-title">Good morning.</h2><p class="secondary-text">Here is the shape of your leadership day.</p></div><section class="daily-focus"><div><p class="card-kicker">Daily focus</p><h3>${escapeHtml(focus)}</h3></div><span class="focus-card__icon" aria-hidden="true">\u2726</span></section><section class="today-section" aria-labelledby="priorities-title"><div class="section-heading"><div><p class="eyebrow">What matters now?</p><h2 id="priorities-title">Top three priorities</h2></div><button class="secondary-action" type="button" data-add-priority ${priorities.length >= 3 ? "disabled" : ""}>${priorities.length >= 3 ? "Three set" : "Add priority"}</button></div><div class="priority-list">${priorityCards}</div></section><div class="today-grid"><section class="today-section compact-section" aria-labelledby="carryover-title"><div class="section-heading"><h2 id="carryover-title">Carryover</h2><span class="section-count">${plan.carryover?.length || 0}</span></div>${plan.carryover?.length ? plan.carryover.map((item) => `<p>${escapeHtml(item)}</p>`).join("") : empty("Nothing carried over.")}</section><section class="today-section compact-section" aria-labelledby="risk-title"><div class="section-heading"><h2 id="risk-title">At risk</h2><span class="section-count section-count--warning">${plan.risks?.length || 0}</span></div>${plan.risks?.length ? plan.risks.map((item) => `<p>${escapeHtml(item)}</p>`).join("") : empty("No risks recorded.")}</section><section class="today-section compact-section" aria-labelledby="decision-title"><div class="section-heading"><h2 id="decision-title">Decisions</h2><span class="section-count">${plan.decisions?.length || 0}</span></div>${plan.decisions?.length ? plan.decisions.map((item) => `<p>${escapeHtml(item)}</p>`).join("") : empty("No decisions waiting.")}</section><section class="today-section compact-section" aria-labelledby="follow-up-title"><div class="section-heading"><h2 id="follow-up-title">Follow-ups due</h2><span class="section-count">${plan.followUps?.length || 0}</span></div>${plan.followUps?.length ? plan.followUps.map((item) => `<p>${escapeHtml(item)}</p>`).join("") : empty("No follow-ups due.")}</section></div><section class="today-section meetings-section" aria-labelledby="meetings-title"><div class="section-heading"><h2 id="meetings-title">Meetings</h2><span class="section-count">${plan.meetings?.length || 0}</span></div>${plan.meetings?.length ? plan.meetings.map((item) => `<p>${escapeHtml(item)}</p>`).join("") : empty("No meetings added.")}</section><section class="leadership-prompt" aria-labelledby="prompt-title"><p class="eyebrow">Leadership prompt</p><h2 id="prompt-title">${prompt}</h2></section><section class="end-day-status" aria-labelledby="end-day-title"><div><p class="eyebrow">End-of-day status</p><h2 id="end-day-title">${plan.endOfDayStatus === "complete" ? "Review complete." : "Not reviewed yet."}</h2></div><span class="status-chip status-chip--${plan.endOfDayStatus === "complete" ? "success" : "neutral"}">${plan.endOfDayStatus === "complete" ? "Complete" : "Open"}</span></section></section>${createPrioritySheet()}`;
  }
  function createPrioritySheet() {
    return `<dialog id="priority-sheet" class="modal bottom-sheet-dialog" aria-labelledby="priority-sheet-title"><div class="modal__header"><div><p class="eyebrow">One clear commitment</p><h2 id="priority-sheet-title">Add a priority</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close priority editor">\xD7</button></div><form class="modal__body priority-form" data-priority-form><input type="hidden" name="id"><label>Outcome<input name="outcome" maxlength="120" required placeholder="What result matters most?"></label><label>Why it matters<textarea name="why" maxlength="220" rows="3" placeholder="What will this make possible?"></textarea></label><label>Due point<input name="duePoint" maxlength="80" placeholder="For example, before Friday's review"></label><label>Status<select name="status"><option value="not-started">Not started</option><option value="in-progress">In progress</option><option value="done">Complete</option></select></label><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Cancel</button><button type="submit" class="primary-action">Save priority</button></div></form></dialog>`;
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
  var DB_VERSION = 1;
  var stores = {
    settings: "settings",
    dailyPlans: "dailyPlans",
    priorities: "priorities",
    appMeta: "appMeta"
  };
  function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const database2 = request.result;
        const settings = database2.createObjectStore(stores.settings, { keyPath: "id" });
        settings.createIndex("updatedAt", "updatedAt");
        database2.createObjectStore(stores.dailyPlans, { keyPath: "date" });
        const priorities = database2.createObjectStore(stores.priorities, { keyPath: "id" });
        priorities.createIndex("planDate", "planDate");
        priorities.createIndex("status", "status");
        database2.createObjectStore(stores.appMeta, { keyPath: "key" });
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

  // src/main.js
  var app = document.querySelector("#app");
  var toastRegion = document.querySelector("#toast-region");
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var themeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  var database;
  var onboardingState;
  var currentPlan;
  var currentPriorities = [];
  function showToast(message) {
    toastRegion.replaceChildren();
    toastRegion.innerHTML = createToast(message);
    const toast = toastRegion.firstElementChild;
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
      const action = currentPriorities.length < 3 ? "Add a priority" : "Review priorities";
      app.innerHTML = createAppShell({ ...route, action });
      document.querySelector("#view-root").innerHTML = createTodayView(
        currentPlan,
        currentPriorities
      );
      document.title = "Today \u2014 TalentisOS";
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
    }
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
