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
      action: "Capture improvement"
    },
    playbook: {
      label: "Playbook",
      eyebrow: "Guidance when it matters",
      title: "Lead with a clear next move.",
      description: "Short, practical guidance for the moments that shape the day.",
      prompt: "Search for a topic or open guidance from the workflow you are in.",
      action: "Open Playbook"
    }
  };
  var navigation = [
    ["today", "Today", "\u25F7"],
    ["huddle", "Huddle", "\uFF0B"],
    ["work", "Work", "\u25A1"],
    ["review", "Review", "\u2713"],
    ["improve", "Improve", "\u2197"],
    ["playbook", "Playbook", "?"]
  ];
  var playbookTopics = [
    ["new-leader", "Starting as a new leader", "Start well", "Set expectations, learn the work, and make the first commitments visible.", "When you are new to a team or role.", "Listen first. Name what you are learning. Agree the few outcomes that matter now.", "I am here to understand the work, support the team, and make our priorities clear.", "Avoid changing everything before you understand the system.", "People know what matters, what to expect from you, and how to raise concerns."],
    ["prepare-day", "Preparing the day", "Plan the day", "Create a small, useful shape for the day before interruptions arrive.", "At the start of each workday.", "Choose up to three outcomes. Surface risks, decisions, and follow-ups. Protect time for the most important one.", "By the end of today, what result must be different?", "Avoid turning the plan into a complete task list.", "The team can see the focus, the risks, and the next actions."],
    ["morning-huddle", "Running a morning huddle", "Align quickly", "Use a short huddle to align action, ownership, and risk.", "At the start of a shared workday or shift.", "Confirm the priority, ask what is blocked, assign the next action, and record the due point.", "What needs to move today, who owns the next action, and what could get in the way?", "Avoid solving every issue in the huddle.", "People leave knowing the action, responsible area, and due point."],
    ["set-priorities", "Setting priorities", "Choose what matters", "Make the outcome visible so activity does not become the goal.", "When work is competing for attention.", "Define the result, why it matters, and the due point. Keep the list to the few outcomes you can actively lead.", "The outcome I need by [due point] is ____. It matters because ____.", "Avoid describing only the activity.", "The priority can be understood and checked without extra explanation."],
    ["delegate-clearly", "Delegating clearly", "Create ownership", "Transfer a clear outcome with enough context and authority to act.", "When another person or area will carry the work.", "State the outcome, decision boundaries, support available, and check-in point. Confirm understanding.", "Please own [outcome] by [due point]. You can decide ____. Let us check in at ____.", "Avoid handing over a task without an outcome or authority.", "The owner can explain what good looks like and what happens next."],
    ["following-up", "Following up", "Close the loop", "Follow up on commitments without creating unnecessary chasing.", "When an action is due, waiting, or at risk of slipping.", "Reference the commitment, ask for the current position, and agree the next step and date.", "Checking in on [commitment]. What is the current position and next date?", "Avoid vague reminders with no specific ask.", "The commitment has a clear status and next action."],
    ["managing-risk", "Managing risk", "Make risk actionable", "Turn a concern into an impact and an immediate action.", "When something could affect an outcome, customer, team, or deadline.", "State what is at risk, the impact if it happens, the risk level, and the immediate action.", "The risk is ____. The impact would be ____. The immediate action is ____.", "Avoid recording a risk without an owner or action.", "The risk is visible early and someone knows what to do next."],
    ["escalate-early", "Escalating early", "Raise the right signal", "Escalate while there are still useful options.", "When impact, authority, timing, or capability exceeds the current team.", "State the situation, impact, action already taken, options, and the decision or support needed.", "Here is the situation, the impact, what we have tried, and the support needed now.", "Avoid escalating only the problem or waiting for certainty.", "The right person can make a timely decision with enough context."],
    ["make-decisions", "Making decisions", "Decide with clarity", "Make the decision, the reason, and the resulting action visible.", "When work is waiting on a choice or trade-off.", "Clarify the decision required, options, criteria, owner, due point, and next action. If deferring, record why and the next review date.", "The decision is ____. We chose it because ____. The next action is ____ by ____.", "Avoid leaving a decision in discussion without a date.", "People know what was decided, why, and what happens next."],
    ["remove-blockers", "Removing blockers", "Restore movement", "Focus on the constraint that is stopping useful work.", "When progress has stopped or a team is repeatedly waiting.", "Name the blocker, who can remove it, the smallest action to unlock movement, and when to check again.", "What is the smallest thing we can remove to let this move?", "Avoid adding more work around the blocker.", "The work is moving again or the constraint is escalated with a clear ask."],
    ["lead-meetings", "Leading meetings", "Make the time useful", "Give every meeting a purpose, decision path, and close.", "Before and during a meeting.", "State the outcome needed, keep discussion on that outcome, capture decisions and actions, and close with owners and dates.", "By the end of this meeting we need to ____.", "Avoid meetings with no outcome or undocumented actions.", "The meeting ends with fewer open questions and visible commitments."],
    ["competing-priorities", "Handling competing priorities", "Make the trade-off", "Choose deliberately when everything appears urgent.", "When two or more important outcomes compete for the same time or people.", "Compare impact, timing, risk, and reversibility. Choose what moves first and name what will wait.", "If we do this first, [other outcome] will move to ____. Is that the right trade-off?", "Avoid silently accepting every priority.", "The trade-off is explicit and stakeholders know what changes."],
    ["close-day", "Closing the day", "Leave tomorrow clearer", "Close commitments, capture learning, and prepare the next useful step.", "At the end of the workday.", "Review what was completed, what remains open, what changed, and the small set of items for tomorrow.", "What changed today, what carries forward, and what does tomorrow need first?", "Avoid carrying work forward without a next action.", "Tomorrow starts with fewer surprises and a clear first move."],
    ["weekly-review", "Running a weekly review", "Learn from the rhythm", "Use the week to identify patterns and choose the next three priorities.", "At the end of the week or start of the next one.", "Review achievements, carryover, repeated risks, delayed decisions, wasted time, and one change to test.", "What did the week teach us, and what will we do differently next week?", "Avoid turning the review into a large report.", "Next week has three priorities, one operating improvement, and one leadership focus."],
    ["capture-improvement", "Capturing improvements", "Make one change testable", "Turn a practical observation into a small next step.", "When a workflow, handover, meeting, or customer outcome is not working well.", "Describe what is not working, what should change, why it helps, and the next step. Choose one category and status.", "The small change we will test is ____. We expect it to help by ____.", "Avoid capturing an improvement without a next step.", "The change is small enough to test and has a clear owner or next action."]
  ].map(([id, title, group, summary, when, what, say, avoid, success]) => ({ id, title, group, summary, when, what, say, avoid, success }));
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
    return `<dialog id="priority-sheet" class="modal bottom-sheet-dialog" aria-labelledby="priority-sheet-title"><div class="modal__header"><div><p class="eyebrow">One clear commitment</p><h2 id="priority-sheet-title">Add a priority</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close priority editor">\xD7</button></div><form class="modal__body priority-form" data-priority-form><input type="hidden" name="id"><label>Outcome<input name="outcome" maxlength="120" required placeholder="What result matters most?"></label>${createContextualGuidance("set-priorities", "See how to set priorities")}<label>Why it matters<textarea name="why" maxlength="220" rows="3" placeholder="What will this make possible?"></textarea></label><label>Due point<input name="duePoint" maxlength="80" placeholder="For example, before Friday's review"></label><label>Status<select name="status"><option value="not-started">Not started</option><option value="in-progress">In progress</option><option value="done">Complete</option></select></label><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Cancel</button><button type="submit" class="primary-action">Save priority</button></div></form></dialog>`;
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
      return `<div class="type-fields">${createContextualGuidance("managing-risk")}<label>What is at risk?<textarea name="whatAtRisk" rows="2">${escapeHtml(item.whatAtRisk || "")}</textarea></label><label>Impact<textarea name="impact" rows="2">${escapeHtml(item.impact || "")}</textarea></label><label>Immediate action<textarea name="immediateAction" rows="2">${escapeHtml(item.immediateAction || "")}</textarea></label><label>What is required?<textarea name="required" rows="2">${escapeHtml(item.required || "")}</textarea></label><label>Review date<input type="date" name="reviewDate" value="${escapeHtml(item.reviewDate || "")}"></label><label class="check-row"><input type="checkbox" name="escalationRequired" ${item.escalationRequired ? "checked" : ""}> Escalation required</label></div>`;
    if (type === "decision")
      return `<div class="type-fields">${createContextualGuidance("make-decisions")}<label>Decision required<textarea name="decisionRequired" rows="2">${escapeHtml(item.decisionRequired || "")}</textarea></label><label>Why it matters<textarea name="whyMatters" rows="2">${escapeHtml(item.whyMatters || "")}</textarea></label><label>Options<textarea name="options" rows="3" placeholder="One option per line">${escapeHtml(item.options || "")}</textarea></label><label>Decision made<textarea name="decisionMade" rows="2">${escapeHtml(item.decisionMade || "")}</textarea></label><label>Resulting action<textarea name="resultingAction" rows="2">${escapeHtml(item.resultingAction || "")}</textarea></label></div>`;
    if (type === "follow-up")
      return `<div class="type-fields">${createContextualGuidance("following-up")}<label>What needs to happen?<textarea name="whatNeedsToHappen" rows="2">${escapeHtml(item.whatNeedsToHappen || "")}</textarea></label><label>Who or what is being followed up?<input name="followedUpWith" value="${escapeHtml(item.followedUpWith || "")}"></label><label>Why?<textarea name="why" rows="2">${escapeHtml(item.why || "")}</textarea></label><label>Result<textarea name="result" rows="2">${escapeHtml(item.result || "")}</textarea></label></div>`;
    return "";
  }
  function createWorkDetailSheet(item = {}) {
    const type = item.type || "action";
    return `<dialog id="work-detail" class="modal work-detail-dialog" aria-labelledby="work-detail-title"><div class="modal__header"><div><p class="eyebrow">${item.id ? "Work item" : "Quick add"}</p><h2 id="work-detail-title">${item.id ? "Work item details" : "Add work item"}</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close work item">\xD7</button></div><form class="modal__body work-form" data-work-form><input type="hidden" name="id" value="${escapeHtml(item.id || "")}"><div class="form-two-col"><label>Type<select name="type"><option value="action" ${type === "action" ? "selected" : ""}>Action</option><option value="priority" ${type === "priority" ? "selected" : ""}>Priority</option><option value="risk" ${type === "risk" ? "selected" : ""}>Risk</option><option value="decision" ${type === "decision" ? "selected" : ""}>Decision</option><option value="follow-up" ${type === "follow-up" ? "selected" : ""}>Follow-up</option></select></label><label>Group<select name="group"><option value="now" ${item.group === "now" ? "selected" : ""}>Now</option><option value="next" ${!item.group || item.group === "next" ? "selected" : ""}>Next</option><option value="later" ${item.group === "later" ? "selected" : ""}>Later</option><option value="waiting" ${item.group === "waiting" ? "selected" : ""}>Waiting</option></select></label></div><label>Title<input name="title" maxlength="140" value="${escapeHtml(item.title || "")}" required placeholder="What needs your leadership?"></label><label>Outcome<textarea name="outcome" rows="2" placeholder="What will be different when this is done?">${escapeHtml(item.outcome || "")}</textarea></label><div class="form-two-col"><label>Responsible person or area <span class="field-hint">optional plain text</span><input name="responsible" value="${escapeHtml(item.responsible || "")}"></label><label>Due date or time<input type="date" name="dueDate" value="${escapeHtml(item.dueDate || "")}"></label></div><div class="form-two-col"><label>Status<select name="status">${workStatusOptions(type, item.status)}</select></label><label>Risk level<select name="riskLevel"><option value="monitor" ${item.riskLevel === "monitor" ? "selected" : ""}>Monitor</option><option value="at-risk" ${item.riskLevel === "at-risk" ? "selected" : ""}>At risk</option><option value="critical" ${item.riskLevel === "critical" ? "selected" : ""}>Critical</option></select></label></div><label>Next action<textarea name="nextAction" rows="2">${escapeHtml(item.nextAction || "")}</textarea></label><label>Notes<textarea name="notes" rows="3">${escapeHtml(item.notes || "")}</textarea></label><label>Related item IDs <span class="field-hint">optional, comma separated</span><input name="relatedItemIds" value="${escapeHtml((item.relatedItemIds || []).join(", "))}"></label><div data-type-fields>${workTypeFields(type, item)}</div><p class="autosave-note" data-autosave-note>Changes save automatically.</p><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Close</button><button type="submit" class="primary-action">Save item</button></div></form></dialog>`;
  }
  var reviewActions = [
    ["carry-forward", "Carry forward"],
    ["complete", "Complete"],
    ["defer", "Defer"],
    ["escalate", "Escalate"],
    ["improve", "Improve"],
    ["remove", "Remove from tomorrow"]
  ];
  function reviewSuggestionCard(suggestion, review) {
    const action = review.actions?.[suggestion.key]?.action || "";
    return `<article class="review-item ${action ? "review-item--handled" : ""}"><div class="review-item__heading"><div><span class="work-type">${escapeHtml(suggestion.category)}</span><h3>${escapeHtml(suggestion.title)}</h3></div>${action ? `<span class="status-chip status-chip--success">${escapeHtml(reviewActions.find(([value]) => value === action)?.[1] || action)}</span>` : ""}</div><p>${escapeHtml(suggestion.detail || suggestion.nextAction || "No additional detail.")}</p><div class="review-item__actions">${reviewActions.map(([value, label]) => `<button type="button" class="text-button ${action === value ? "text-button--selected" : ""}" data-review-action="${value}" data-review-key="${suggestion.key}">${label}</button>`).join("")}</div></article>`;
  }
  function reviewList(items, emptyMessage) {
    return items.length ? `<ul class="review-simple-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : `<div class="section-empty"><span aria-hidden="true">\u2014</span><p>${emptyMessage}</p></div>`;
  }
  function createReviewView({
    review,
    plan,
    completed,
    suggestions,
    tomorrowPlan,
    history,
    editable = false
  }) {
    const tomorrowItems = review.tomorrowItems?.length ? review.tomorrowItems : tomorrowPlan.items || [];
    const tomorrowCards = tomorrowItems.length ? tomorrowItems.map(
      (item, index) => `<li class="tomorrow-item"><span class="tomorrow-item__order">0${index + 1}</span><span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.outcome || item.type || "Leadership item")}</small></span><button type="button" class="text-button" data-tomorrow-move="${item.id}" data-direction="up" ${index === 0 ? "disabled" : ""}>Up</button><button type="button" class="text-button" data-tomorrow-remove="${item.id}">Remove</button></li>`
    ).join("") : '<li class="section-empty"><span aria-hidden="true">\u2014</span><p>No items prepared yet.</p></li>';
    const openSuggestions = suggestions.filter(
      (suggestion) => !["complete", "remove"].includes(review.actions?.[suggestion.key]?.action)
    );
    const completedItems = completed.map((item) => item.title || item.outcome).filter(Boolean);
    const risks = suggestions.filter((item) => item.category === "Risk").map((item) => item.title);
    const escalations = suggestions.filter((item) => review.actions?.[item.key]?.action === "escalate").map((item) => item.title);
    const historyItems = history.length ? history.map(
      (closure) => `<li><span><strong>${escapeHtml(new Intl.DateTimeFormat(void 0, { weekday: "short", month: "short", day: "numeric" }).format(/* @__PURE__ */ new Date(`${closure.date}T12:00:00`)))}</strong><small>${escapeHtml(closure.snapshot?.summary || "Day closed")}</small></span><button type="button" class="text-button" data-history-open="${closure.date}">View day</button></li>`
    ).join("") : '<li class="section-empty"><span aria-hidden="true">\u2014</span><p>No closed days yet.</p></li>';
    if (review.closed && !editable)
      return `<section class="review-command review-closed" aria-labelledby="closed-title"><div class="completion-mark" aria-hidden="true">\u2713</div><p class="eyebrow">Day closure</p><h2 id="closed-title">Today is closed.</h2><p class="secondary-text">Tomorrow is prepared.</p><p class="review-closed-hint">Your complete day snapshot is saved.</p><button class="primary-action" type="button" data-review-done>Finish Day <span aria-hidden="true">\u2192</span></button><section class="history-section"><div class="section-heading"><div><p class="eyebrow">Daily history</p><h2>Previous days</h2></div></div><ul class="history-list">${historyItems}</ul></section></section>`;
    return `<section class="review-command" aria-labelledby="review-title"><div class="review-intro"><div><p class="eyebrow">Close the loop</p><h2 id="review-title">Finish the day lightly.</h2><p class="secondary-text">Review what changed, decide what carries forward, and leave tomorrow clearer than today.</p></div><span class="review-time">Under 5 min</span></div><section class="review-section"><div class="section-heading"><div><p class="eyebrow">1 \xB7 Completed</p><h2>What was completed?</h2></div></div>${reviewList(completedItems, "Completed work will appear here as you close items.")}</section><section class="review-section"><div class="section-heading"><div><p class="eyebrow">2\u20135 \xB7 Decide</p><h2>What remains open?</h2><p class="secondary-text">Use the existing items below. Nothing needs to be retyped.</p></div></div><div class="review-items">${openSuggestions.length ? openSuggestions.map((suggestion) => reviewSuggestionCard(suggestion, review)).join("") : '<div class="section-empty"><span aria-hidden="true">\u2713</span><p>Everything is accounted for.</p></div>'}</div></section><div class="review-grid"><section class="review-section review-mini"><p class="eyebrow">3 \xB7 At risk</p><h2>What is now at risk?</h2>${reviewList(risks, "No open risks surfaced.")}</section><section class="review-section review-mini"><p class="eyebrow">5 \xB7 Escalate</p><h2>What requires escalation?</h2>${reviewList(escalations, "No escalation selected.")}</section></div><section class="review-section"><div class="section-heading"><div><p class="eyebrow">6 \xB7 Improve</p><h2>What should improve?</h2></div></div><textarea class="review-improvement" data-review-improvement rows="3" placeholder="One practical change for tomorrow">${escapeHtml(review.improvement || "")}</textarea></section><section class="tomorrow-preview" aria-labelledby="tomorrow-title"><div class="section-heading"><div><p class="eyebrow">7 \xB7 Prepare tomorrow</p><h2 id="tomorrow-title">Tomorrow preview</h2><p class="secondary-text">Keep the list small and useful.</p></div><button type="button" class="secondary-action" data-tomorrow-add>Add one item</button></div><ul class="tomorrow-list">${tomorrowCards}</ul><div class="tomorrow-support"><span>Likely priorities: ${tomorrowItems.length}</span><span>Meetings: ${(tomorrowPlan.meetings || plan.meetings || []).length}</span><span>Risks to review: ${(tomorrowPlan.risks || risks).length}</span><span>Decisions due: ${(tomorrowPlan.decisions || []).length}</span><span>Follow-ups due: ${(tomorrowPlan.followUps || []).length}</span></div><button type="button" class="secondary-action" data-tomorrow-confirm>Confirm tomorrow</button></section><section class="history-section"><div class="section-heading"><div><p class="eyebrow">Daily history</p><h2>Previous days</h2></div></div><ul class="history-list">${historyItems}</ul></section><div class="review-finish"><button class="primary-action" type="button" data-review-finish>Finish Day <span aria-hidden="true">\u2192</span></button></div></section>`;
  }
  function createHistoryDialog(closure, editable = false) {
    const snapshot = closure.snapshot || {};
    return `<dialog id="history-dialog" class="modal history-dialog" aria-labelledby="history-title"><div class="modal__header"><div><p class="eyebrow">Read-only day history</p><h2 id="history-title">${escapeHtml(closure.date)}</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close day history">\xD7</button></div><div class="modal__body"><p class="secondary-text">${escapeHtml(snapshot.summary || "Day closure snapshot")}</p><dl class="history-summary"><div><dt>Daily focus</dt><dd>${escapeHtml(snapshot.plan?.focus || "Not set")}</dd></div><div><dt>Priorities</dt><dd>${snapshot.priorities?.length || 0}</dd></div><div><dt>Huddle status</dt><dd>${escapeHtml(snapshot.plan?.huddleStatus || "Not recorded")}</dd></div><div><dt>Completed work</dt><dd>${snapshot.completedWork?.length || 0}</dd></div><div><dt>Carryover</dt><dd>${snapshot.tomorrow?.items?.length || 0}</dd></div><div><dt>Risks</dt><dd>${snapshot.workItems?.filter((item) => item.type === "risk").length || 0}</dd></div><div><dt>Decisions</dt><dd>${snapshot.workItems?.filter((item) => item.type === "decision").length || 0}</dd></div><div><dt>Follow-ups</dt><dd>${snapshot.workItems?.filter((item) => item.type === "follow-up").length || 0}</dd></div><div><dt>End-of-day summary</dt><dd>${escapeHtml(snapshot.summary || "Not recorded")}</dd></div></dl><button type="button" class="secondary-action" data-history-edit="${closure.date}">${editable ? "Editing enabled" : "Edit Day"}</button></div></dialog>`;
  }
  function createWeeklyReviewView({ review, summary, weekStart, weekEnd }) {
    const questions = [
      ["achieved", "What was achieved?", "Name the outcomes that moved forward."],
      ["incomplete", "What remained incomplete?", "Keep this factual; it will inform next week."],
      ["repeatedRisks", "What risks repeated?", "Look for patterns worth improving."],
      ["delayedDecisions", "What decisions were delayed?", "Capture the decision, not the backstory."],
      ["unnecessaryTime", "What consumed unnecessary time?", "One observation is enough."],
      ["continue", "What should continue?", "Keep the leadership habits that helped."],
      ["stop", "What should stop?", "Remove one source of avoidable noise."],
      ["improve", "What should improve?", "Turn this into one practical next step."]
    ];
    const answerFields = questions.map(
      ([key, title, hint]) => `<label class="weekly-question"><span>${title}</span><small>${hint}</small><textarea rows="2" data-weekly-answer="${key}" placeholder="Capture a short note">${escapeHtml(review.answers?.[key] || "")}</textarea></label>`
    ).join("");
    const metric = (label, value) => `<div class="summary-metric"><strong>${value}</strong><span>${label}</span></div>`;
    const repeatedRiskText = summary.repeatedRiskLabels?.length ? summary.repeatedRiskLabels.join(" \xB7 ") : "No repeated risk pattern yet.";
    const repeatedRiskAction = summary.repeatedRiskLabels?.[0] ? `<button type="button" class="secondary-action" data-improvement-from-risk="${escapeHtml(summary.repeatedRiskLabels[0])}">Turn into improvement</button>` : "";
    return `<section class="weekly-command" aria-labelledby="weekly-title"><div class="review-intro"><div><p class="eyebrow">Review the rhythm</p><h2 id="weekly-title">Make the week useful.</h2><p class="secondary-text">${escapeHtml(weekStart)} to ${escapeHtml(weekEnd)} \xB7 A concise local summary of what your days are teaching you.</p></div><span class="review-time">10 min</span></div><div class="review-switcher" role="group" aria-label="Review period"><a href="#review" class="secondary-action">Daily review</a><a href="#review/weekly" class="secondary-action review-switcher--active">Weekly review</a></div><section class="weekly-summary" aria-labelledby="summary-title"><div class="section-heading"><div><p class="eyebrow">Automatic summary</p><h2 id="summary-title">What the week says</h2></div></div><div class="summary-metrics">${metric("priorities completed", summary.prioritiesCompleted)}${metric("carried forward", summary.prioritiesCarried)}${metric("repeated risks", summary.repeatedRisks)}${metric("overdue follow-ups", summary.overdueFollowUps)}${metric("decisions completed", summary.decisionsCompleted)}${metric("improvements captured", summary.improvementsCaptured)}${metric("morning preparations", summary.morningPreparations)}${metric("huddles completed", summary.huddlesCompleted)}${metric("day reviews completed", summary.dayReviewsCompleted)}</div><div class="summary-callout"><p><strong>Most common blocker:</strong> ${escapeHtml(summary.mostCommonBlocker || "No repeated blocker yet.")}</p><p><strong>Repeated pattern:</strong> ${escapeHtml(repeatedRiskText)}</p>${repeatedRiskAction}</div></section><section class="weekly-questions" aria-labelledby="questions-title"><div class="section-heading"><div><p class="eyebrow">Reflect</p><h2 id="questions-title">What should change?</h2></div></div>${answerFields}</section><section class="weekly-output" aria-labelledby="next-week-title"><div class="section-heading"><div><p class="eyebrow">Prepare next week</p><h2 id="next-week-title">Three priorities, one improvement, one focus.</h2></div></div><div class="weekly-priority-fields">${[0, 1, 2].map((index) => `<label>Priority ${index + 1}<input data-weekly-priority="${index}" value="${escapeHtml(review.nextPriorities?.[index] || "")}" placeholder="A meaningful outcome"></label>`).join("")}</div><div class="form-two-col"><label>Operating improvement<textarea rows="2" data-weekly-improvement placeholder="One change to test">${escapeHtml(review.operatingImprovement || "")}</textarea></label><label>Leadership focus<textarea rows="2" data-weekly-focus placeholder="How you want to lead">${escapeHtml(review.leadershipFocus || "")}</textarea></label></div><button type="button" class="primary-action" data-weekly-save>Save weekly review <span aria-hidden="true">\u2192</span></button></section></section>`;
  }
  var improvementCategories = [
    ["simplify", "Simplify"],
    ["remove-delay", "Remove delay"],
    ["clarity", "Improve clarity"],
    ["reduce-error", "Reduce error"],
    ["handover", "Improve handover"],
    ["meeting", "Improve meeting"],
    ["customer-outcome", "Improve customer outcome"],
    ["workflow", "Improve workflow"]
  ];
  function createImproveView(improvements) {
    const cards = improvements.length ? improvements.map(
      (item) => `<article class="improvement-card"><div class="improvement-card__top"><div><span class="work-type">${escapeHtml(improvementCategories.find(([value]) => value === item.category)?.[1] || "Improvement")}</span><h3>${escapeHtml(item.notWorking)}</h3></div><span class="status-chip status-chip--${item.status === "implemented" ? "success" : "neutral"}">${escapeHtml((item.status || "captured")[0].toUpperCase() + (item.status || "captured").slice(1))}</span></div><p>${escapeHtml(item.change || "No change captured yet.")}</p><dl class="improvement-meta"><div><dt>Why it helps</dt><dd>${escapeHtml(item.why || "Not captured")}</dd></div><div><dt>Next step</dt><dd>${escapeHtml(item.nextStep || "Not captured")}</dd></div></dl><div class="work-card__actions"><button type="button" class="text-button" data-edit-improvement="${item.id}">Edit</button><button type="button" class="text-button text-button--quiet" data-delete-improvement="${item.id}">Delete</button></div></article>`
    ).join("") : `<div class="section-empty"><span aria-hidden="true">\u2014</span><p>No improvements captured yet. Start with one small change.</p></div>`;
    return `<section class="improve-command" aria-labelledby="improve-title"><div class="work-intro"><div><p class="eyebrow">Learn and refine</p><h2 id="improve-title">Improve the rhythm.</h2><p class="secondary-text">Keep observations small, actionable, and close to the work.</p></div><button type="button" class="primary-action" data-add-improvement>Capture improvement <span aria-hidden="true">\u2192</span></button></div><div class="improvement-summary"><span>${improvements.length} captured</span><span>${improvements.filter((item) => item.status === "implemented").length} implemented</span><span>Local-only</span></div><div class="improvement-list">${cards}</div></section>${createImprovementSheet()}`;
  }
  function createImprovementSheet(item = {}) {
    const category = item.category || "simplify";
    const status = item.status || "captured";
    return `<dialog id="improvement-detail" class="modal work-detail-dialog" aria-labelledby="improvement-title"><div class="modal__header"><div><p class="eyebrow">Improve</p><h2 id="improvement-title">${item.id ? "Edit improvement" : "Capture improvement"}</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close improvement">\xD7</button></div><form class="modal__body work-form" data-improvement-form><input type="hidden" name="id" value="${escapeHtml(item.id || "")}"><label>What is not working?<textarea name="notWorking" rows="2" required>${escapeHtml(item.notWorking || "")}</textarea></label><label>What should change?<textarea name="change" rows="2" required>${escapeHtml(item.change || "")}</textarea></label><label>Why would it help?<textarea name="why" rows="2">${escapeHtml(item.why || "")}</textarea></label><label>What is the next step?<textarea name="nextStep" rows="2">${escapeHtml(item.nextStep || "")}</textarea></label><div class="form-two-col"><label>Category<select name="category">${improvementCategories.map(([value, label]) => `<option value="${value}" ${category === value ? "selected" : ""}>${label}</option>`).join("")}</select></label><label>Status<select name="status">${["captured", "reviewing", "testing", "implemented", "closed"].map((value) => `<option value="${value}" ${status === value ? "selected" : ""}>${value[0].toUpperCase() + value.slice(1)}</option>`).join("")}</select></label></div><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Close</button><button type="submit" class="primary-action">Save improvement</button></div></form></dialog>`;
  }
  function playbookTopicById(id) {
    return playbookTopics.find((topic) => topic.id === id);
  }
  function playbookTopicCard(topic, state) {
    const saved = state.savedTopicIds?.includes(topic.id);
    return `<article class="playbook-card"><div class="playbook-card__top"><span class="work-type">${escapeHtml(topic.group)}</span>${saved ? '<span class="status-chip status-chip--success">Saved</span>' : ""}</div><h3>${escapeHtml(topic.title)}</h3><p>${escapeHtml(topic.summary)}</p><button type="button" class="secondary-action" data-open-playbook-topic="${topic.id}">Open guidance <span aria-hidden="true">\u2192</span></button></article>`;
  }
  function createPlaybookView(topics, state, query = "", group = "All topics") {
    const normalizedQuery = query.trim().toLowerCase();
    const matching = topics.filter((topic) => {
      const matchesGroup = group === "All topics" || topic.group === group;
      const haystack = `${topic.title} ${topic.group} ${topic.summary} ${topic.when} ${topic.what} ${topic.say} ${topic.avoid} ${topic.success}`.toLowerCase();
      return matchesGroup && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
    const groups = ["All topics", ...new Set(topics.map((topic) => topic.group))];
    const savedTopics = (state.savedTopicIds || []).map(playbookTopicById).filter(Boolean);
    const recentTopics = (state.recentTopicIds || []).map(playbookTopicById).filter(Boolean);
    const groupButtons = groups.map((name) => `<button type="button" class="work-filter ${group === name ? "work-filter--active" : ""}" data-playbook-group="${escapeHtml(name)}" aria-pressed="${group === name}">${escapeHtml(name)}</button>`).join("");
    const smallSection = (label, items) => `<section class="playbook-section playbook-section--compact"><div class="section-heading"><div><p class="eyebrow">${label}</p><h2>${label}</h2></div><span class="section-count">${items.length}</span></div>${items.length ? `<div class="playbook-grid">${items.slice(0, 4).map((topic) => playbookTopicCard(topic, state)).join("")}</div>` : '<div class="section-empty"><span aria-hidden="true">\u2014</span><p>No topics here yet.</p></div>'}</section>`;
    const content = matching.length ? `<div class="playbook-grid">${matching.map((topic) => playbookTopicCard(topic, state)).join("")}</div>` : `<div class="section-empty"><span aria-hidden="true">\u2014</span><p>No guidance matches \u201C${escapeHtml(query)}\u201D. Try a simpler phrase.</p></div>`;
    return `<section class="playbook-command" aria-labelledby="playbook-title"><div class="work-intro"><div><p class="eyebrow">Guidance when it matters</p><h2 id="playbook-title">Lead with a clear next move.</h2><p class="secondary-text">Short, practical guidance for the moments that shape the day. Everything is available offline.</p></div></div><label class="playbook-search">Search the Playbook<input type="search" data-playbook-search value="${escapeHtml(query)}" placeholder="Try \u201Crisk\u201D, \u201Cdelegate\u201D, or \u201Cweekly review\u201D" autocomplete="off"></label><div class="work-filters playbook-filters" role="group" aria-label="Playbook topic groups">${groupButtons}</div>${smallSection("Saved topics", savedTopics)}${smallSection("Recently viewed", recentTopics)}<section class="playbook-section" aria-labelledby="all-playbook-topics"><div class="section-heading"><div><p class="eyebrow">Topic groups</p><h2 id="all-playbook-topics">${normalizedQuery ? "Search results" : group}</h2></div><span class="section-count">${matching.length}</span></div>${content}</section></section>`;
  }
  function createPlaybookDialog(topic, saved = false) {
    if (!topic) return "";
    return `<dialog id="playbook-detail" class="modal playbook-dialog" aria-labelledby="playbook-detail-title"><div class="modal__header"><div><p class="eyebrow">${escapeHtml(topic.group)}</p><h2 id="playbook-detail-title">${escapeHtml(topic.title)}</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close guidance">\xD7</button></div><div class="modal__body playbook-detail"><p class="secondary-text">${escapeHtml(topic.summary)}</p><dl><div><dt>When to use it</dt><dd>${escapeHtml(topic.when)}</dd></div><div><dt>What to do</dt><dd>${escapeHtml(topic.what)}</dd></div><div><dt>What to say</dt><dd>${escapeHtml(topic.say)}</dd></div><div><dt>What to avoid</dt><dd>${escapeHtml(topic.avoid)}</dd></div><div><dt>What success looks like</dt><dd>${escapeHtml(topic.success)}</dd></div></dl><div class="modal__actions"><button type="button" class="secondary-action" data-playbook-save="${topic.id}">${saved ? "Remove from saved" : "Save topic"}</button><button type="button" class="primary-action" data-close-dialog>Done</button></div></div></dialog>`;
  }
  function createContextualGuidance(topicId, label = "Playbook guidance") {
    const topic = playbookTopicById(topicId);
    return topic ? `<p class="contextual-guidance"><span aria-hidden="true">\u2726</span><span>${escapeHtml(topic.summary)}</span><button type="button" class="text-button" data-open-playbook-topic="${topic.id}">${escapeHtml(label)}</button></p>` : "";
  }
  function getRoute() {
    const parts = window.location.hash.slice(1).split("/");
    const key = parts[0] || "today";
    return routes[key] ? { ...routes[key], key, subroute: parts[1] || "" } : { ...routes.today, key: "today", subroute: "" };
  }
  function navItems(currentKey, className) {
    const items = navigation.map(
      ([key, label, icon]) => `<a class="nav-item ${className}" href="#${key}" ${currentKey === key ? 'aria-current="page"' : ""}><span class="nav-item__icon" aria-hidden="true">${icon}</span><span>${label}</span></a>`
    ).join("");
    return `${items}${currentKey === "review" ? '<a class="nav-item nav-item--subtle" href="#review/weekly"><span class="nav-item__icon" aria-hidden="true">\u21B3</span><span>Weekly review</span></a>' : ""}`;
  }
  function settingsDialog() {
    return `<dialog id="settings-dialog" class="modal" aria-labelledby="settings-title">
    <div class="modal__header"><div><p class="eyebrow">Preferences</p><h2 id="settings-title">Settings</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close settings">\xD7</button></div>
    <div class="modal__body"><p class="secondary-text">Tune the interface to the way you work. Your records stay on this device unless you export them.</p>
      ${createSegmentedControl("Appearance", [
      ["light", "Light"],
      ["system", "System"],
      ["dark", "Dark"]
    ])}
      <button type="button" class="secondary-action settings-data-button" data-open-data>Data</button>
    </div>
  </dialog>`;
  }
  function createDataDialog(snapshots = []) {
    const snapshotList = snapshots.length ? snapshots.map((snapshot) => `<li><span><strong>${escapeHtml(new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" }).format(new Date(snapshot.createdAt)))}</strong><small>${escapeHtml(snapshot.snapshotType)} snapshot \xB7 ${snapshot.recordCount || 0} records</small></span><button type="button" class="text-button" data-restore-snapshot="${escapeHtml(snapshot.id)}">Restore</button></li>`).join("") : '<li class="section-empty"><span aria-hidden="true">\u2014</span><p>No local snapshots yet.</p></li>';
    return `<dialog id="data-dialog" class="modal data-dialog" aria-labelledby="data-title"><div class="modal__header"><div><p class="eyebrow">Settings \xB7 Data</p><h2 id="data-title">Protect your workspace.</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close data settings">\xD7</button></div><div class="modal__body data-manager"><p class="secondary-text">Backups, restores, and imports happen locally. Nothing is uploaded.</p><section class="data-section"><h3>JSON backup</h3><p>Export everything needed to rebuild this workspace on another device.</p><button type="button" class="primary-action" data-export-backup>Export backup</button><label class="file-picker">Restore backup<input type="file" accept="application/json,.json" data-restore-file></label><div class="restore-preview" data-restore-preview hidden></div></section><section class="data-section"><h3>CSV tools</h3><div class="form-two-col"><label>Dataset<select data-csv-type><option value="priorities">Priorities</option><option value="risks">Risks</option><option value="decisions">Decisions</option><option value="followUps">Follow-ups</option><option value="improvements">Improvements</option><option value="dailySummaries">Daily summaries</option><option value="weeklySummaries">Weekly summaries</option></select></label><div class="data-actions"><button type="button" class="secondary-action" data-export-csv>Export CSV</button><button type="button" class="text-button" data-download-csv-template>Download template</button></div></div><label class="file-picker">Import CSV<input type="file" accept="text/csv,.csv" data-csv-file></label><div class="csv-preview" data-csv-preview hidden></div></section><section class="data-section"><h3>Local snapshots</h3><p>Automatic daily and weekly snapshots rotate on this device.</p><ul class="history-list snapshot-list">${snapshotList}</ul></section><section class="data-section data-danger"><h3>Delete all data</h3><p>This removes workspace records and cannot be undone. Export a backup first.</p><button type="button" class="secondary-action" data-delete-all-data>Delete all data</button></section><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Done</button></div></div></dialog>`;
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
    ${["review", "playbook"].includes(route.key) ? "" : `<div class="primary-action-bar"><button class="primary-action" type="button" data-primary-action>${route.action}<span aria-hidden="true">\u2192</span></button></div>`}
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
  var DB_VERSION = 6;
  var stores = {
    settings: "settings",
    dailyPlans: "dailyPlans",
    priorities: "priorities",
    workItems: "workItems",
    dailyReviews: "dailyReviews",
    tomorrowPlans: "tomorrowPlans",
    dayClosures: "dayClosures",
    weeklyReviews: "weeklyReviews",
    improvements: "improvements",
    playbookState: "playbookState",
    backupSnapshots: "backupSnapshots",
    appMeta: "appMeta"
  };
  function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        if (request.error?.name === "QuotaExceededError") reject(new Error("Local workspace storage is full. Export a backup and remove unused data."));
        else reject(request.error);
      };
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
        if (!database2.objectStoreNames.contains(stores.dailyReviews)) {
          database2.createObjectStore(stores.dailyReviews, { keyPath: "date" });
        }
        if (!database2.objectStoreNames.contains(stores.tomorrowPlans)) {
          database2.createObjectStore(stores.tomorrowPlans, { keyPath: "date" });
        }
        if (!database2.objectStoreNames.contains(stores.dayClosures)) {
          database2.createObjectStore(stores.dayClosures, { keyPath: "date" });
        }
        if (!database2.objectStoreNames.contains(stores.weeklyReviews)) {
          database2.createObjectStore(stores.weeklyReviews, { keyPath: "weekStart" });
        }
        if (!database2.objectStoreNames.contains(stores.improvements)) {
          const improvements = database2.createObjectStore(stores.improvements, { keyPath: "id" });
          improvements.createIndex("status", "status");
          improvements.createIndex("category", "category");
          improvements.createIndex("createdAt", "createdAt");
        }
        if (!database2.objectStoreNames.contains(stores.playbookState)) {
          database2.createObjectStore(stores.playbookState, { keyPath: "id" });
        }
        if (!database2.objectStoreNames.contains(stores.backupSnapshots)) {
          const snapshots = database2.createObjectStore(stores.backupSnapshots, { keyPath: "id" });
          snapshots.createIndex("snapshotType", "snapshotType");
          snapshots.createIndex("createdAt", "createdAt");
        }
        if (!database2.objectStoreNames.contains(stores.appMeta)) {
          database2.createObjectStore(stores.appMeta, { keyPath: "key" });
        }
      };
      request.onsuccess = () => {
        request.result.onversionchange = () => request.result.close();
        resolve(request.result);
      };
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
  async function saveDailyPlan(database2, plan) {
    return putRecord(database2, stores.dailyPlans, { ...plan, updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
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
  async function getAllPriorities(database2) {
    return getAll(database2, stores.priorities);
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
  async function getDailyReview(database2, date = todayKey()) {
    const existing = await getRecord(database2, stores.dailyReviews, date);
    if (existing) return existing;
    const review = {
      date,
      closed: false,
      actions: {},
      improvement: "",
      tomorrowItems: [],
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await putRecord(database2, stores.dailyReviews, review);
    return review;
  }
  async function saveDailyReview(database2, review) {
    return putRecord(database2, stores.dailyReviews, {
      ...review,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async function getTomorrowPlan(database2, date = todayKey()) {
    const existing = await getRecord(database2, stores.tomorrowPlans, date);
    if (existing) return existing;
    return {
      date,
      items: [],
      meetings: [],
      risks: [],
      decisions: [],
      followUps: [],
      confirmed: false
    };
  }
  async function saveTomorrowPlan(database2, plan) {
    return putRecord(database2, stores.tomorrowPlans, {
      ...plan,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async function saveDayClosure(database2, closure) {
    return putRecord(database2, stores.dayClosures, {
      ...closure,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async function getDayClosures(database2) {
    return (await getAll(database2, stores.dayClosures)).sort((a, b) => b.date.localeCompare(a.date));
  }
  async function getWeeklyReview(database2, weekStart) {
    const existing = await getRecord(database2, stores.weeklyReviews, weekStart);
    if (existing) return existing;
    return {
      weekStart,
      answers: {},
      nextPriorities: ["", "", ""],
      operatingImprovement: "",
      leadershipFocus: "",
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  async function saveWeeklyReview(database2, review) {
    return putRecord(database2, stores.weeklyReviews, {
      ...review,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async function getImprovements(database2) {
    return (await getAll(database2, stores.improvements)).sort(
      (a, b) => (b.updatedAt || b.createdAt || "").localeCompare(a.updatedAt || a.createdAt || "")
    );
  }
  async function saveImprovement(database2, improvement) {
    return putRecord(database2, stores.improvements, {
      ...improvement,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async function deleteImprovement(database2, id) {
    return deleteRecord(database2, stores.improvements, id);
  }
  async function getPlaybookState(database2) {
    const existing = await getRecord(database2, stores.playbookState, "primary");
    return existing || { id: "primary", savedTopicIds: [], recentTopicIds: [] };
  }
  async function savePlaybookState(database2, state) {
    return putRecord(database2, stores.playbookState, {
      id: "primary",
      savedTopicIds: state.savedTopicIds || [],
      recentTopicIds: state.recentTopicIds || [],
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async function getBackupSnapshots(database2) {
    return (await getAll(database2, stores.backupSnapshots)).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  async function saveBackupSnapshot(database2, snapshot) {
    return putRecord(database2, stores.backupSnapshots, snapshot);
  }
  async function deleteBackupSnapshot(database2, id) {
    return deleteRecord(database2, stores.backupSnapshots, id);
  }
  async function clearWorkspaceData(database2, includeSnapshots = false) {
    const names = Object.values(stores).filter((storeName) => includeSnapshots || storeName !== stores.backupSnapshots);
    const transaction = database2.transaction(names, "readwrite");
    names.forEach((storeName) => transaction.objectStore(storeName).clear());
    return new Promise((resolve, reject) => {
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error || new Error("Workspace deletion was aborted."));
    });
  }

  // src/backup.js
  var EXPORT_FORMAT_VERSION = 1;
  var APPLICATION_VERSION = "0.1.0";
  var BACKUP_COLLECTIONS = [
    "settings",
    "dailyPlans",
    "priorities",
    "huddles",
    "workItems",
    "risks",
    "decisions",
    "followUps",
    "dailyReviews",
    "tomorrowPlans",
    "weeklyReviews",
    "improvements",
    "savedPlaybookTopics",
    "onboardingState"
  ];
  var datePattern = /^\d{4}-\d{2}-\d{2}$/;
  function sanitizeImportedValue(value) {
    if (typeof value === "string") {
      return Array.from(value.replace(/[<>]/g, "")).filter((character) => {
        const code = character.charCodeAt(0);
        return !(code <= 8 || code === 11 || code === 12 || code >= 14 && code <= 31);
      }).join("").slice(0, 2e4);
    }
    if (Array.isArray(value)) return value.map(sanitizeImportedValue);
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, sanitizeImportedValue(child)]));
    }
    return value;
  }
  function createBackup(data, exportedAt = (/* @__PURE__ */ new Date()).toISOString()) {
    return {
      format: "TalentisOS workspace backup",
      exportVersion: EXPORT_FORMAT_VERSION,
      applicationVersion: APPLICATION_VERSION,
      exportedAt,
      data: Object.fromEntries(
        BACKUP_COLLECTIONS.map((collection) => [collection, sanitizeImportedValue(data[collection] || [])])
      )
    };
  }
  function migrateBackup(input) {
    if (!input || typeof input !== "object") throw new Error("The selected file is not a JSON object.");
    if (input.format === "TalentisOS workspace backup" && input.exportVersion === EXPORT_FORMAT_VERSION) return sanitizeImportedValue(input);
    if (input.format === "TalentisOS workspace backup" && input.exportVersion === 0 && input.data) {
      return createBackup(input.data, input.exportedAt || (/* @__PURE__ */ new Date()).toISOString());
    }
    throw new Error("Unsupported TalentisOS backup format or export version.");
  }
  function validateBackup(input) {
    const backup = migrateBackup(input);
    if (!backup.exportedAt || Number.isNaN(Date.parse(backup.exportedAt))) throw new Error("Backup export date is invalid.");
    for (const collection of BACKUP_COLLECTIONS) {
      if (!Array.isArray(backup.data[collection])) throw new Error(`Backup collection \u201C${collection}\u201D must be an array.`);
    }
    return backup;
  }
  function backupCounts(backup) {
    return Object.fromEntries(BACKUP_COLLECTIONS.map((collection) => [collection, backup.data[collection]?.length || 0]));
  }
  function restoreCollections(backup) {
    const data = backup.data;
    const workItems = data.workItems?.length ? data.workItems : [...data.risks || [], ...data.decisions || [], ...data.followUps || []];
    return {
      settings: data.settings,
      dailyPlans: data.dailyPlans,
      priorities: data.priorities,
      workItems,
      dailyReviews: data.dailyReviews,
      tomorrowPlans: data.tomorrowPlans,
      weeklyReviews: data.weeklyReviews,
      improvements: data.improvements,
      playbookState: [{ id: "primary", savedTopicIds: data.savedPlaybookTopics || [], recentTopicIds: [] }],
      appMeta: data.onboardingState || []
    };
  }
  function csvEscape(value) {
    const text = value == null ? "" : String(value);
    return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
  }
  function createCsv(rows, columns) {
    return [columns, ...rows.map((row) => columns.map((column) => row[column]))].map((line) => line.map(csvEscape).join(",")).join("\r\n") + "\r\n";
  }
  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = "";
    let quoted = false;
    for (let index = 0; index < text.length; index += 1) {
      const character = text[index];
      const next = text[index + 1];
      if (quoted && character === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = !quoted;
      } else if (!quoted && character === ",") {
        row.push(field);
        field = "";
      } else if (!quoted && (character === "\n" || character === "\r")) {
        if (character === "\r" && next === "\n") index += 1;
        row.push(field);
        if (row.some((value) => value !== "")) rows.push(row);
        row = [];
        field = "";
      } else {
        field += character;
      }
    }
    if (field || row.length) {
      row.push(field);
      rows.push(row);
    }
    if (!rows.length) return { headers: [], rows: [] };
    const headers = rows.shift().map((header) => header.trim());
    return { headers, rows: rows.map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]))) };
  }
  var csvSchemas = {
    priorities: { required: ["outcome", "planDate"], columns: ["id", "planDate", "outcome", "why", "duePoint", "status", "order"] },
    risks: { required: ["title", "planDate"], columns: ["id", "planDate", "title", "whatAtRisk", "impact", "immediateAction", "dueDate", "status", "riskLevel"] },
    decisions: { required: ["title", "planDate"], columns: ["id", "planDate", "title", "decisionRequired", "decisionMade", "resultingAction", "dueDate", "status"] },
    followUps: { required: ["title", "dueDate"], columns: ["id", "title", "responsible", "dueDate", "nextAction", "status", "followedUpWith"] },
    improvements: { required: ["notWorking", "change"], columns: ["id", "notWorking", "change", "why", "nextStep", "category", "status", "createdAt"] }
  };
  function csvSchema(type) {
    const schema = csvSchemas[type];
    if (!schema) throw new Error(`CSV type \u201C${type}\u201D is not supported.`);
    return schema;
  }
  function validateCsv(type, parsed) {
    const schema = csvSchema(type);
    const missing = schema.required.filter((column) => !parsed.headers.includes(column));
    if (missing.length) throw new Error(`Missing required column(s): ${missing.join(", ")}.`);
    const errors = [];
    const records = parsed.rows.map((row, index) => {
      const rowNumber = index + 2;
      for (const column of schema.required) if (!row[column]?.trim()) errors.push(`Row ${rowNumber}: ${column} is required.`);
      for (const column of ["planDate", "dueDate", "createdAt"]) {
        if (row[column] && (column === "createdAt" ? Number.isNaN(Date.parse(row[column])) : !datePattern.test(row[column]) || Number.isNaN(Date.parse(`${row[column]}T12:00:00`)))) errors.push(`Row ${rowNumber}: ${column} is not a valid date.`);
      }
      return sanitizeImportedValue(row);
    });
    return { records, errors };
  }
  function csvTemplate(type) {
    const schema = csvSchema(type);
    return createCsv([], schema.columns);
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
  var currentReviewDate;
  var editingHistoricalDay = false;
  var currentReview;
  var currentTomorrowPlan;
  var currentHistory = [];
  var currentReviewSuggestions = [];
  var currentWeeklyReview;
  var currentImprovements = [];
  var currentPlaybookState = { savedTopicIds: [], recentTopicIds: [] };
  var currentPlaybookQuery = "";
  var currentPlaybookGroup = "All topics";
  var currentSnapshots = [];
  var pendingRestore = null;
  var pendingCsvImport = null;
  var updateRequested = false;
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
  function showUpdateToast(registration) {
    toastRegion.replaceChildren();
    toastRegion.innerHTML = createToast("A new TalentisOS version is ready. Your saved data is safe.");
    const toast = toastRegion.firstElementChild;
    const update = document.createElement("button");
    update.className = "toast__action";
    update.type = "button";
    update.textContent = "Update now";
    update.addEventListener("click", () => {
      updateRequested = true;
      registration.waiting?.postMessage({ type: "SKIP_WAITING" });
    });
    const later = document.createElement("button");
    later.className = "toast__action";
    later.type = "button";
    later.textContent = "Later";
    later.addEventListener("click", () => toast.remove());
    toast.append(update, later);
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
      huddles: dailyPlans.filter((plan) => plan.huddleStatus || plan.huddleDiscussions?.length).map((plan) => ({ date: plan.date, status: plan.huddleStatus || "", discussions: plan.huddleDiscussions || [] })),
      workItems,
      risks: workItems.filter((item) => item.type === "risk"),
      decisions: workItems.filter((item) => item.type === "decision"),
      followUps: workItems.filter((item) => item.type === "follow-up"),
      dailyReviews: await read(stores.dailyReviews),
      tomorrowPlans: await read(stores.tomorrowPlans),
      weeklyReviews: await read(stores.weeklyReviews),
      improvements: await read(stores.improvements),
      savedPlaybookTopics: playbookState[0]?.savedTopicIds || [],
      onboardingState: appMeta.filter((item) => item.key === "onboarding")
    };
  }
  function dateStamp(date = /* @__PURE__ */ new Date()) {
    return date.toISOString().slice(0, 10);
  }
  function downloadFile(content, filename, type) {
    const file = new File([content], filename, { type });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      navigator.share({ files: [file], title: filename }).catch(() => {
      });
      return;
    }
    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
  }
  async function exportBackup() {
    const backup = createBackup(await collectBackupData());
    downloadFile(JSON.stringify(backup, null, 2), `TalentisOS_Backup_${dateStamp()}.json`, "application/json");
    showToast("Backup exported locally.");
  }
  async function saveAutomaticSnapshot(snapshotType) {
    const backup = createBackup(await collectBackupData());
    const snapshot = {
      id: `${snapshotType}-${dateStamp()}`,
      snapshotType,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      recordCount: Object.values(backup.data).reduce((total, records) => total + (Array.isArray(records) ? records.length : 0), 0),
      backup
    };
    await saveBackupSnapshot(database, snapshot);
    const snapshots = await getBackupSnapshots(database);
    const keep = snapshotType === "daily" ? 7 : 4;
    for (const old of snapshots.filter((item) => item.snapshotType === snapshotType).slice(keep)) {
      await deleteBackupSnapshot(database, old.id);
    }
  }
  async function ensureAutomaticSnapshots() {
    const snapshots = await getBackupSnapshots(database);
    const today = dateStamp();
    if (!snapshots.some((snapshot) => snapshot.id === `daily-${today}`)) await saveAutomaticSnapshot("daily");
    const week = startOfWeek(/* @__PURE__ */ new Date());
    if (!snapshots.some((snapshot) => snapshot.id === `weekly-${week}`)) await saveAutomaticSnapshot("weekly");
  }
  async function applyRestore(backup, mode = "replace") {
    if (mode === "replace") {
      await saveBackupSnapshot(database, { id: `pre-restore-${Date.now()}`, snapshotType: "pre-restore", createdAt: (/* @__PURE__ */ new Date()).toISOString(), recordCount: 0, backup: createBackup(await collectBackupData()) });
      await clearWorkspaceData(database, true);
    }
    const collections = restoreCollections(backup);
    for (const [storeName, records] of Object.entries(collections)) {
      for (const record of records || []) await putRecord(database, stores[storeName], record);
    }
    pendingRestore = null;
    showToast(mode === "replace" ? "Backup restored. Your workspace was replaced." : "Backup merged into your workspace.");
    await render();
  }
  function csvRows(type, data) {
    if (type === "dailySummaries") return data.dailyReviews.map((item) => ({ date: item.date, summary: item.summary || item.improvement || "", closed: item.closed ? "Yes" : "No" }));
    if (type === "weeklySummaries") return data.weeklyReviews.map((item) => ({ weekStart: item.weekStart, achieved: item.answers?.achieved || "", incomplete: item.answers?.incomplete || "", nextPriorities: (item.nextPriorities || []).join(" | "), operatingImprovement: item.operatingImprovement || "", leadershipFocus: item.leadershipFocus || "" }));
    return data[type] || [];
  }
  function csvColumns(type, data) {
    if (["dailySummaries", "weeklySummaries"].includes(type)) return Object.keys(csvRows(type, data)[0] || (type === "dailySummaries" ? { date: "", summary: "", closed: "" } : { weekStart: "", achieved: "", incomplete: "", nextPriorities: "", operatingImprovement: "", leadershipFocus: "" }));
    return csvSchema(type).columns;
  }
  async function exportCsv(type) {
    const data = await collectBackupData();
    const rows = csvRows(type, data);
    downloadFile(createCsv(rows, csvColumns(type, data)), `TalentisOS_${type[0].toUpperCase() + type.slice(1)}_${dateStamp()}.csv`, "text/csv;charset=utf-8");
    showToast("CSV exported locally.");
  }
  function importedCsvRecords(type, records) {
    if (type === "priorities") return records.map((record, index) => ({ ...record, id: record.id || crypto.randomUUID(), order: Number(record.order) || index, status: record.status || "not-started" }));
    if (type === "improvements") return records.map((record) => ({ ...record, id: record.id || crypto.randomUUID(), createdAt: record.createdAt || (/* @__PURE__ */ new Date()).toISOString(), status: record.status || "captured" }));
    const workType = type === "risks" ? "risk" : type === "decisions" ? "decision" : "follow-up";
    return records.map((record) => ({ ...record, id: record.id || crypto.randomUUID(), type: workType, group: record.group || "next", status: record.status || "not-started", title: record.title || record.outcome || "" }));
  }
  function dataDialog() {
    return document.querySelector("#data-dialog");
  }
  function showRestorePreview(backup, source = "file") {
    pendingRestore = backup;
    const preview = dataDialog()?.querySelector("[data-restore-preview]");
    if (!preview) return;
    const counts = backupCounts(backup);
    const rows = Object.entries(counts).filter(([, count]) => count).map(([label, count]) => `<span>${label}: <strong>${count}</strong></span>`).join("");
    preview.hidden = false;
    preview.innerHTML = `<p><strong>${source === "snapshot" ? "Local snapshot ready" : "Backup ready"}</strong> \xB7 exported ${new Intl.DateTimeFormat(void 0, { dateStyle: "medium" }).format(new Date(backup.exportedAt))}</p><div class="data-counts">${rows || "<span>No records found.</span>"}</div><label>Restore mode<select data-restore-mode><option value="replace">Replace current data (automatic backup first)</option><option value="merge">Merge into current data</option></select></label><div class="modal__actions"><button type="button" class="secondary-action" data-restore-cancel>Cancel</button><button type="button" class="primary-action" data-restore-apply>Restore backup</button></div>`;
  }
  async function handleRestoreFile(file) {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      showRestorePreview(validateBackup(parsed));
    } catch (error) {
      const preview = dataDialog()?.querySelector("[data-restore-preview]");
      if (preview) {
        preview.hidden = false;
        preview.innerHTML = `<p class="data-error">${escapeHtml(error.message || "This backup could not be read.")}</p>`;
      }
      pendingRestore = null;
    }
  }
  async function handleCsvFile(file) {
    if (!file) return;
    const type = dataDialog()?.querySelector("[data-csv-type]")?.value;
    const preview = dataDialog()?.querySelector("[data-csv-preview]");
    try {
      if (!["priorities", "risks", "decisions", "followUps", "improvements"].includes(type)) throw new Error("CSV import is available for priorities, risks, decisions, follow-ups, and improvements.");
      const result = validateCsv(type, parseCsv(await file.text()));
      pendingCsvImport = { type, records: importedCsvRecords(type, result.records), errors: result.errors };
      preview.hidden = false;
      preview.innerHTML = `<p><strong>${pendingCsvImport.records.length} rows ready.</strong> ${result.errors.length ? `${result.errors.length} row error(s) need attention.` : "No validation errors found."}</p>${result.errors.length ? `<ul class="data-error-list">${result.errors.map((error) => `<li>${escapeHtml(error)}</li>`).join("")}</ul>` : ""}<label>Duplicate IDs<select data-csv-duplicate-mode><option value="skip">Skip existing records</option><option value="replace">Replace existing records</option></select></label><div class="modal__actions"><button type="button" class="secondary-action" data-csv-cancel>Cancel</button><button type="button" class="primary-action" data-csv-apply ${result.errors.length ? "disabled" : ""}>Import rows</button></div>`;
    } catch (error) {
      pendingCsvImport = null;
      preview.hidden = false;
      preview.innerHTML = `<p class="data-error">${escapeHtml(error.message || "This CSV could not be read.")}</p>`;
    }
  }
  async function applyCsvImport() {
    if (!pendingCsvImport) return;
    const { type, records, errors } = pendingCsvImport;
    if (errors.length) return;
    const storeName = type === "improvements" ? stores.improvements : type === "priorities" ? stores.priorities : stores.workItems;
    const existing = new Set((await getAll(database, storeName)).map((record) => record.id));
    const mode = dataDialog()?.querySelector("[data-csv-duplicate-mode]")?.value || "skip";
    let imported = 0;
    let skipped = 0;
    for (const record of records) {
      if (existing.has(record.id) && mode === "skip") {
        skipped += 1;
        continue;
      }
      await putRecord(database, storeName, record);
      imported += 1;
    }
    pendingCsvImport = null;
    dataDialog()?.querySelector("[data-csv-preview]")?.setAttribute("hidden", "");
    showToast(`${imported} CSV row(s) imported${skipped ? `; ${skipped} duplicate(s) skipped` : ""}.`);
    await render();
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
      await importPreparedPlanIfNeeded();
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
    } else if (route.key === "review") {
      currentReviewDate ||= (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      currentPlan = await getDailyPlan(database, currentReviewDate);
      currentPriorities = await getPriorities(database, currentReviewDate);
      currentWorkItems = await getWorkItems(database);
      currentReview = await getDailyReview(database, currentReviewDate);
      currentTomorrowPlan = await getTomorrowPlan(database, addDays(currentReviewDate, 1));
      currentHistory = await getDayClosures(database);
      currentReviewSuggestions = createReviewSuggestions(
        currentPlan,
        currentPriorities,
        currentWorkItems
      );
      if (!currentReview.tomorrowItems?.length && !currentTomorrowPlan.items?.length) {
        currentReview.tomorrowItems = defaultTomorrowItems(currentReviewSuggestions);
        await saveDailyReview(database, currentReview);
      }
      app.innerHTML = createAppShell({
        ...route,
        action: currentReview.closed ? "Finish Day" : "Finish Day"
      });
      if (route.subroute === "weekly") {
        const weekStart = startOfWeek(/* @__PURE__ */ new Date());
        currentWeeklyReview = await getWeeklyReview(database, weekStart);
        currentImprovements = await getImprovements(database);
        const closures = currentHistory.filter((closure) => closure.date >= weekStart && closure.date <= addDays(weekStart, 6));
        const weekPriorities = (await getAllPriorities(database)).filter((item) => item.planDate >= weekStart && item.planDate <= addDays(weekStart, 6));
        const weekWork = currentWorkItems.filter((item) => {
          const updatedDate = item.updatedAt?.slice(0, 10);
          return updatedDate >= weekStart && updatedDate <= addDays(weekStart, 6) || item.dueDate >= weekStart && item.dueDate <= addDays(weekStart, 6);
        });
        document.querySelector("#view-root").innerHTML = createWeeklyReviewView({
          review: currentWeeklyReview,
          summary: weeklySummary(closures, weekPriorities, weekWork, weekStart, addDays(weekStart, 6)),
          weekStart,
          weekEnd: addDays(weekStart, 6)
        }) + createImprovementSheet();
      } else {
        document.querySelector("#view-root").innerHTML = createReviewView({
          review: currentReview,
          plan: currentPlan,
          completed: completedRecords(currentPriorities, currentWorkItems),
          suggestions: currentReviewSuggestions,
          tomorrowPlan: currentTomorrowPlan,
          history: currentHistory,
          editable: editingHistoricalDay
        });
      }
      document.title = "Review \u2014 TalentisOS";
    } else if (route.key === "improve") {
      currentImprovements = await getImprovements(database);
      app.innerHTML = createAppShell({ ...route, action: "Capture improvement" });
      document.querySelector("#view-root").innerHTML = createImproveView(currentImprovements);
      document.title = "Improve \u2014 TalentisOS";
    } else if (route.key === "playbook") {
      currentPlaybookState = await getPlaybookState(database);
      app.innerHTML = createAppShell(route);
      document.querySelector("#view-root").innerHTML = createPlaybookView(
        playbookTopics,
        currentPlaybookState,
        currentPlaybookQuery,
        currentPlaybookGroup
      );
      document.title = "Playbook \u2014 TalentisOS";
    } else {
      app.innerHTML = createAppShell(route);
      renderView(route);
      document.title = `${route.label} \u2014 TalentisOS`;
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
    const incomplete = priorities.filter((item) => item.status !== "done").length;
    const risks = workItems.filter((item) => item.type === "risk");
    const blockerCounts = /* @__PURE__ */ new Map();
    risks.forEach((item) => {
      const blocker = (item.whatAtRisk || item.impact || item.title || "Unspecified risk").trim();
      const key = blocker.toLowerCase();
      const existing = blockerCounts.get(key) || { label: blocker, count: 0 };
      blockerCounts.set(key, { ...existing, count: existing.count + 1 });
    });
    const repeatedBlockers = [...blockerCounts.values()].filter((item) => item.count > 1);
    const mostCommonBlocker = [...blockerCounts.values()].sort((a, b) => b.count - a.count)[0]?.label || "";
    return {
      prioritiesCompleted: priorities.filter((item) => item.status === "done").length,
      prioritiesCarried: incomplete,
      repeatedRisks: repeatedBlockers.reduce((total, item) => total + item.count, 0),
      repeatedRiskLabels: repeatedBlockers.map((item) => item.label),
      overdueFollowUps: workItems.filter((item) => item.type === "follow-up" && item.status !== "complete" && item.dueDate && item.dueDate < (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)).length,
      decisionsCompleted: workItems.filter((item) => item.type === "decision" && item.status === "decided").length,
      improvementsCaptured: currentImprovements.filter((item) => {
        const createdDate = item.createdAt?.slice(0, 10);
        return createdDate >= weekStart && createdDate <= weekEnd;
      }).length,
      mostCommonBlocker,
      morningPreparations: closures.filter((closure) => closure.snapshot?.plan?.preparedPlanImported).length,
      huddlesCompleted: closures.filter((closure) => closure.snapshot?.plan?.huddleStatus === "complete").length,
      dayReviewsCompleted: closures.length
    };
  }
  function addDays(date, amount) {
    const next = /* @__PURE__ */ new Date(`${date}T12:00:00`);
    next.setDate(next.getDate() + amount);
    return next.toISOString().slice(0, 10);
  }
  function createReviewSuggestions(plan, priorities, workItems) {
    const suggestions = priorities.filter((item) => item.status !== "done").map((item) => ({
      key: `priority:${item.id}`,
      sourceType: "priority",
      sourceId: item.id,
      category: "Priority",
      title: item.outcome,
      detail: item.why || item.duePoint,
      nextAction: item.duePoint
    }));
    workItems.filter((item) => item.status !== "complete").forEach((item) => {
      suggestions.push({
        key: `work:${item.id}`,
        sourceType: "work",
        sourceId: item.id,
        category: item.type === "follow-up" ? "Follow-up" : item.type[0].toUpperCase() + item.type.slice(1),
        title: item.title,
        detail: item.whatAtRisk || item.decisionRequired || item.whatNeedsToHappen || item.outcome,
        nextAction: item.nextAction || item.dueDate
      });
    });
    (plan.huddleDiscussions || []).forEach(
      (item, index) => suggestions.push({
        key: `huddle:${index}`,
        sourceType: "huddle",
        sourceId: index,
        category: "Huddle",
        title: item,
        detail: "Parked discussion from today"
      })
    );
    return suggestions;
  }
  function completedRecords(priorities, workItems) {
    return [
      ...priorities.filter((item) => item.status === "done").map((item) => ({ title: item.outcome })),
      ...workItems.filter((item) => item.status === "complete").map((item) => ({ title: item.title }))
    ];
  }
  function defaultTomorrowItems(suggestions) {
    return suggestions.filter((item) => ["Priority", "Risk", "Decision", "Follow-up"].includes(item.category)).slice(0, 3).map((item, index) => ({
      id: crypto.randomUUID(),
      sourceId: item.sourceId,
      sourceType: item.sourceType,
      title: item.title,
      outcome: item.detail,
      type: item.category,
      order: index,
      status: "not-started"
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
        why: item.outcome || "",
        duePoint: item.dueDate || "",
        status: "not-started",
        completedAt: null
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
    dialog.querySelector("button, [href], input, select, textarea")?.focus();
  }
  async function openPlaybookTopic(id) {
    const topic = playbookTopics.find((item) => item.id === id);
    if (!topic) return;
    currentPlaybookState = await getPlaybookState(database);
    currentPlaybookState.recentTopicIds = [
      topic.id,
      ...(currentPlaybookState.recentTopicIds || []).filter((topicId) => topicId !== topic.id)
    ].slice(0, 6);
    await savePlaybookState(database, currentPlaybookState);
    const existing = document.querySelector("#playbook-detail");
    existing?.remove();
    app.insertAdjacentHTML("beforeend", createPlaybookDialog(topic, currentPlaybookState.savedTopicIds?.includes(topic.id)));
    openDialog(document.querySelector("#playbook-detail"));
  }
  function renderPlaybookResults() {
    const viewRoot = document.querySelector("#view-root");
    if (!viewRoot) return;
    viewRoot.innerHTML = createPlaybookView(
      playbookTopics,
      currentPlaybookState,
      currentPlaybookQuery,
      currentPlaybookGroup
    );
  }
  function formValues(form) {
    return Object.fromEntries(new FormData(form).entries());
  }
  function draftStorageKey(form) {
    return form.matches("[data-priority-form]") ? "talentisos-draft-priority" : "talentisos-draft-improvement";
  }
  function saveDraft(form) {
    try {
      localStorage.setItem(draftStorageKey(form), JSON.stringify(formValues(form)));
    } catch {
    }
  }
  function restoreDraft(form) {
    try {
      const draft = JSON.parse(localStorage.getItem(draftStorageKey(form)) || "null");
      if (!draft || form.elements.id?.value) return;
      Object.entries(draft).forEach(([name, value]) => {
        if (form.elements[name]) form.elements[name].value = value;
      });
    } catch {
    }
  }
  function clearDraft(form) {
    try {
      localStorage.removeItem(draftStorageKey(form));
    } catch {
    }
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
    if (!priority) restoreDraft(form);
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
    clearDraft(form);
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
  function tomorrowItemsFromReview() {
    return currentReview.tomorrowItems || currentTomorrowPlan.items || [];
  }
  async function applyReviewAction(key, action) {
    const suggestion = currentReviewSuggestions.find((item) => item.key === key);
    if (!suggestion) return;
    let reason = "";
    if (action === "defer") {
      reason = window.prompt("Why is this being deferred?") || "";
      if (!reason) return;
    }
    currentReview.actions = { ...currentReview.actions, [key]: { action, reason } };
    let tomorrowItems = tomorrowItemsFromReview();
    if (["carry-forward", "defer", "escalate"].includes(action) && !tomorrowItems.some((item) => item.sourceId === suggestion.sourceId)) {
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
          status: "not-started",
          deferReason: reason
        }
      ];
    }
    if (["complete", "remove", "improve"].includes(action)) {
      tomorrowItems = tomorrowItems.filter((item) => item.sourceId !== suggestion.sourceId);
    }
    currentReview.tomorrowItems = tomorrowItems.map((item, index) => ({ ...item, order: index }));
    if (suggestion.sourceType === "priority") {
      const source = currentPriorities.find((item) => item.id === suggestion.sourceId);
      if (source && action === "complete")
        await savePriority(database, {
          ...source,
          status: "done",
          completedAt: (/* @__PURE__ */ new Date()).toISOString()
        });
    }
    if (suggestion.sourceType === "work") {
      const source = currentWorkItems.find((item) => item.id === suggestion.sourceId);
      if (source && ["complete", "escalate"].includes(action))
        await saveWorkItem(database, {
          ...source,
          status: action === "complete" ? "complete" : "at-risk"
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
      risks: currentReviewSuggestions.filter((item) => item.category === "Risk").map((item) => item.title),
      decisions: currentReviewSuggestions.filter((item) => item.category === "Decision").map((item) => item.title),
      followUps: currentReviewSuggestions.filter((item) => item.category === "Follow-up").map((item) => item.title),
      confirmed: true
    };
    const review = {
      ...currentReview,
      closed: true,
      closedAt: (/* @__PURE__ */ new Date()).toISOString(),
      summary: currentReview.improvement || "Day reviewed and tomorrow prepared."
    };
    const snapshot = {
      plan: currentPlan,
      priorities: currentPriorities,
      workItems: currentWorkItems,
      completedWork: completedRecords(currentPriorities, currentWorkItems).map((item) => item.title),
      tomorrow,
      summary: review.summary
    };
    await saveTomorrowPlan(database, tomorrow);
    await saveDailyReview(database, review);
    await saveDayClosure(database, { date: currentReviewDate, closedAt: review.closedAt, snapshot });
    currentReview = review;
    showToast("Today is closed. Tomorrow is prepared.");
    await render();
  }
  async function reorderTomorrow(id, direction) {
    const items = [...tomorrowItemsFromReview()];
    const index = items.findIndex((item) => item.id === id);
    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || nextIndex < 0 || nextIndex >= items.length) return;
    [items[index], items[nextIndex]] = [items[nextIndex], items[index]];
    currentReview.tomorrowItems = items.map((item, itemIndex) => ({ ...item, order: itemIndex }));
    await saveDailyReview(database, currentReview);
    await render();
  }
  document.addEventListener("submit", async (event) => {
    const submittedForm = event.target;
    if (submittedForm.dataset.submitting === "true") {
      event.preventDefault();
      return;
    }
    submittedForm.dataset.submitting = "true";
    const submitButton = submittedForm.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    window.setTimeout(() => {
      submittedForm.dataset.submitting = "false";
      if (submitButton) submitButton.disabled = false;
    }, 2500);
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
      return;
    }
    const improvementForm = event.target.closest("[data-improvement-form]");
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
        createdAt: values.id ? currentImprovements.find((item) => item.id === values.id)?.createdAt : (/* @__PURE__ */ new Date()).toISOString()
      });
      improvementForm.closest("dialog").close();
      clearDraft(improvementForm);
      showToast("Improvement saved.");
      await render();
    }
  });
  document.addEventListener("input", (event) => {
    const draftForm = event.target.closest("[data-priority-form], [data-improvement-form]");
    if (draftForm && !draftForm.elements.id?.value) saveDraft(draftForm);
    const playbookSearch = event.target.closest("[data-playbook-search]");
    if (playbookSearch) {
      currentPlaybookQuery = playbookSearch.value;
      renderPlaybookResults();
      const nextSearch = document.querySelector("[data-playbook-search]");
      nextSearch?.focus();
      nextSearch?.setSelectionRange(currentPlaybookQuery.length, currentPlaybookQuery.length);
      return;
    }
    const reviewImprovement = event.target.closest("[data-review-improvement]");
    if (reviewImprovement) {
      window.clearTimeout(autosaveTimer);
      autosaveTimer = window.setTimeout(async () => {
        currentReview.improvement = reviewImprovement.value;
        await saveDailyReview(database, currentReview);
      }, 500);
      return;
    }
    const weeklyAnswer = event.target.closest("[data-weekly-answer]");
    if (weeklyAnswer && currentWeeklyReview) {
      window.clearTimeout(autosaveTimer);
      autosaveTimer = window.setTimeout(async () => {
        currentWeeklyReview.answers = { ...currentWeeklyReview.answers, [weeklyAnswer.dataset.weeklyAnswer]: weeklyAnswer.value };
        await saveWeeklyReview(database, currentWeeklyReview);
      }, 500);
      return;
    }
    const weeklyPriority = event.target.closest("[data-weekly-priority]");
    if (weeklyPriority && currentWeeklyReview) {
      window.clearTimeout(autosaveTimer);
      autosaveTimer = window.setTimeout(async () => {
        const priorities = [...currentWeeklyReview.nextPriorities || ["", "", ""]];
        priorities[Number(weeklyPriority.dataset.weeklyPriority)] = weeklyPriority.value;
        currentWeeklyReview.nextPriorities = priorities;
        await saveWeeklyReview(database, currentWeeklyReview);
      }, 500);
      return;
    }
    const weeklyImprovement = event.target.closest("[data-weekly-improvement]");
    const weeklyFocus = event.target.closest("[data-weekly-focus]");
    if ((weeklyImprovement || weeklyFocus) && currentWeeklyReview) {
      window.clearTimeout(autosaveTimer);
      autosaveTimer = window.setTimeout(async () => {
        if (weeklyImprovement) currentWeeklyReview.operatingImprovement = weeklyImprovement.value;
        if (weeklyFocus) currentWeeklyReview.leadershipFocus = weeklyFocus.value;
        await saveWeeklyReview(database, currentWeeklyReview);
      }, 500);
      return;
    }
    const workForm = event.target.closest("[data-work-form]");
    if (!workForm) return;
    window.clearTimeout(autosaveTimer);
    autosaveTimer = window.setTimeout(() => persistWorkForm(workForm), 600);
  });
  document.addEventListener("change", (event) => {
    const restoreFile = event.target.closest("[data-restore-file]");
    if (restoreFile) {
      handleRestoreFile(restoreFile.files?.[0]);
      return;
    }
    const csvFile = event.target.closest("[data-csv-file]");
    if (csvFile) {
      handleCsvFile(csvFile.files?.[0]);
      return;
    }
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
    if (event.target.closest("[data-open-data]")) {
      currentSnapshots = await getBackupSnapshots(database);
      document.body.insertAdjacentHTML("beforeend", createDataDialog(currentSnapshots));
      openDialog(document.querySelector("#data-dialog"));
      return;
    }
    if (event.target.closest("[data-export-backup]")) {
      await exportBackup();
      return;
    }
    if (event.target.closest("[data-export-csv]")) {
      await exportCsv(dataDialog()?.querySelector("[data-csv-type]")?.value || "priorities");
      return;
    }
    if (event.target.closest("[data-download-csv-template]")) {
      const type = dataDialog()?.querySelector("[data-csv-type]")?.value || "priorities";
      if (["priorities", "risks", "decisions", "followUps", "improvements"].includes(type)) {
        downloadFile(csvTemplate(type), `TalentisOS_${type}_template.csv`, "text/csv;charset=utf-8");
        showToast("CSV template downloaded.");
      } else {
        showToast("Templates are available for importable CSV datasets.");
      }
      return;
    }
    if (event.target.closest("[data-restore-apply]") && pendingRestore) {
      const mode = dataDialog()?.querySelector("[data-restore-mode]")?.value || "replace";
      await applyRestore(pendingRestore, mode);
      document.querySelector("#data-dialog")?.remove();
      return;
    }
    if (event.target.closest("[data-restore-cancel]")) {
      pendingRestore = null;
      dataDialog()?.querySelector("[data-restore-preview]")?.setAttribute("hidden", "");
      return;
    }
    if (event.target.closest("[data-csv-apply]")) {
      await applyCsvImport();
      return;
    }
    if (event.target.closest("[data-csv-cancel]")) {
      pendingCsvImport = null;
      dataDialog()?.querySelector("[data-csv-preview]")?.setAttribute("hidden", "");
      return;
    }
    const restoreSnapshot = event.target.closest("[data-restore-snapshot]");
    if (restoreSnapshot) {
      const snapshot = currentSnapshots.find((item) => item.id === restoreSnapshot.dataset.restoreSnapshot);
      if (snapshot) showRestorePreview(snapshot.backup, "snapshot");
      return;
    }
    if (event.target.closest("[data-delete-all-data]")) {
      const confirmed = window.confirm("This will permanently delete all workspace records. Export a backup now?");
      if (!confirmed) return;
      await exportBackup();
      const phrase = window.prompt("Type DELETE ALL DATA to confirm permanent deletion.");
      if (phrase !== "DELETE ALL DATA") {
        showToast("Deletion cancelled.");
        return;
      }
      await clearWorkspaceData(database);
      document.querySelector("#data-dialog")?.remove();
      onboardingState = await getOnboardingState(database);
      showToast("All workspace data was deleted.");
      await render();
      return;
    }
    const playbookTopicButton = event.target.closest("[data-open-playbook-topic]");
    if (playbookTopicButton) {
      await openPlaybookTopic(playbookTopicButton.dataset.openPlaybookTopic);
      return;
    }
    const playbookGroup = event.target.closest("[data-playbook-group]");
    if (playbookGroup) {
      currentPlaybookGroup = playbookGroup.dataset.playbookGroup;
      renderPlaybookResults();
      return;
    }
    const playbookSave = event.target.closest("[data-playbook-save]");
    if (playbookSave) {
      const topicId = playbookSave.dataset.playbookSave;
      const saved = new Set(currentPlaybookState.savedTopicIds || []);
      if (saved.has(topicId)) {
        saved.delete(topicId);
        playbookSave.textContent = "Save topic";
        showToast("Topic removed from saved.");
      } else {
        saved.add(topicId);
        playbookSave.textContent = "Remove from saved";
        showToast("Topic saved locally.");
      }
      currentPlaybookState.savedTopicIds = [...saved];
      await savePlaybookState(database, currentPlaybookState);
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
    const reviewAction = event.target.closest("[data-review-action]");
    if (reviewAction) {
      await applyReviewAction(reviewAction.dataset.reviewKey, reviewAction.dataset.reviewAction);
      return;
    }
    if (event.target.closest("[data-weekly-save]")) {
      await saveWeeklyReview(database, currentWeeklyReview);
      showToast("Weekly review saved locally.");
      return;
    }
    const repeatedRiskButton = event.target.closest("[data-improvement-from-risk]");
    if (repeatedRiskButton) {
      const dialog = document.querySelector("#improvement-detail");
      if (dialog) {
        dialog.outerHTML = createImprovementSheet({
          notWorking: repeatedRiskButton.dataset.improvementFromRisk,
          change: "Define and test a small change that prevents this risk from repeating.",
          why: "Reduce a recurring blocker in the operating rhythm.",
          category: "workflow",
          status: "captured"
        });
        document.querySelector("#improvement-detail")?.showModal();
        document.querySelector("#improvement-detail textarea")?.focus();
      }
      return;
    }
    if (event.target.closest("[data-add-improvement]") || event.target.closest("[data-primary-action]") && getRoute().key === "improve") {
      const dialog = document.querySelector("#improvement-detail");
      dialog?.showModal();
      const form = dialog?.querySelector("[data-improvement-form]");
      if (form) restoreDraft(form);
      dialog?.querySelector("textarea")?.focus();
      return;
    }
    const editImprovement = event.target.closest("[data-edit-improvement]");
    if (editImprovement) {
      const item = currentImprovements.find((improvement) => improvement.id === editImprovement.dataset.editImprovement);
      const dialog = document.querySelector("#improvement-detail");
      if (dialog && item) {
        dialog.outerHTML = createImprovementSheet(item);
        document.querySelector("#improvement-detail")?.showModal();
        document.querySelector("#improvement-detail textarea")?.focus();
      }
      return;
    }
    const deleteImprovementButton = event.target.closest("[data-delete-improvement]");
    if (deleteImprovementButton) {
      if (window.confirm("Delete this improvement?")) {
        await deleteImprovement(database, deleteImprovementButton.dataset.deleteImprovement);
        showToast("Improvement deleted.");
        await render();
      }
      return;
    }
    if (event.target.closest("[data-review-finish]")) {
      await finishReview();
      return;
    }
    if (event.target.closest("[data-review-done]")) {
      window.location.hash = "#today";
      currentReviewDate = void 0;
      editingHistoricalDay = false;
      await render();
      return;
    }
    if (event.target.closest("[data-tomorrow-confirm]")) {
      await saveTomorrowPlan(database, {
        ...currentTomorrowPlan,
        date: addDays(currentReviewDate, 1),
        items: tomorrowItemsFromReview(),
        confirmed: true
      });
      showToast("Tomorrow is prepared.");
      return;
    }
    const tomorrowAdd = event.target.closest("[data-tomorrow-add]");
    if (tomorrowAdd) {
      const title = window.prompt("What is the one item to add for tomorrow?");
      if (title?.trim()) {
        currentReview.tomorrowItems = [
          ...tomorrowItemsFromReview(),
          {
            id: crypto.randomUUID(),
            title: title.trim(),
            outcome: "",
            type: "Action",
            order: tomorrowItemsFromReview().length,
            status: "not-started"
          }
        ];
        await saveDailyReview(database, currentReview);
        await render();
      }
      return;
    }
    const tomorrowMove = event.target.closest("[data-tomorrow-move]");
    if (tomorrowMove) {
      await reorderTomorrow(tomorrowMove.dataset.tomorrowMove, tomorrowMove.dataset.direction);
      return;
    }
    const tomorrowRemove = event.target.closest("[data-tomorrow-remove]");
    if (tomorrowRemove) {
      currentReview.tomorrowItems = tomorrowItemsFromReview().filter((item) => item.id !== tomorrowRemove.dataset.tomorrowRemove).map((item, index) => ({ ...item, order: index }));
      await saveDailyReview(database, currentReview);
      await render();
      return;
    }
    const historyOpen = event.target.closest("[data-history-open]");
    if (historyOpen) {
      const closure = currentHistory.find((item) => item.date === historyOpen.dataset.historyOpen);
      if (closure) {
        document.body.insertAdjacentHTML("beforeend", createHistoryDialog(closure));
        openDialog(document.querySelector("#history-dialog"));
      }
      return;
    }
    const historyEdit = event.target.closest("[data-history-edit]");
    if (historyEdit) {
      document.querySelector("#history-dialog")?.close();
      currentReviewDate = historyEdit.dataset.historyEdit;
      editingHistoricalDay = true;
      await render();
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
    if (event.target.closest("[data-primary-action]") && getRoute().key === "review") {
      if (currentReview.closed) {
        window.location.hash = "#today";
        currentReviewDate = void 0;
        await render();
      } else {
        await finishReview();
      }
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
  window.addEventListener("unhandledrejection", (event) => {
    event.preventDefault();
    const message = event.reason?.message || "";
    showToast(message.includes("storage") || message.includes("Quota") ? message : "That local change could not be saved. Your existing data is unchanged.");
  });
  async function initialize() {
    try {
      database = await openDatabase();
      onboardingState = await getOnboardingState(database);
      try {
        await ensureAutomaticSnapshots();
      } catch {
      }
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
        const announceWaiting = () => {
          if (registration.waiting && navigator.serviceWorker.controller) showUpdateToast(registration);
        };
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          worker?.addEventListener("statechange", () => {
            if (worker.state === "installed") announceWaiting();
          });
        });
        announceWaiting();
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (updateRequested) window.location.reload();
        });
      } catch {
        showToast("Offline support is unavailable in this browser session.");
      }
    });
  }
})();
