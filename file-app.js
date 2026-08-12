(() => {
  // src/journey.js
  var journeyStages = [
    { id: "first-7", label: "First 7 Days", objective: "Listen, observe and establish clarity", milestones: [
      { id: "prepare-team-meeting", title: "Prepare to Meet Your Team", summary: "Create a calm first conversation that builds trust and makes the next 90 days visible.", checklist: ["Set the purpose and tone", "Prepare three to five listening questions", "Share expectations and close with next steps"] },
      { id: "meet-team", title: "Meet the team", summary: "Listen for strengths, friction and what the team needs from you.", checklist: ["Ask what is working", "Ask what gets in the way", "Capture themes without promising instant fixes"] },
      { id: "observe-work", title: "Observe the work", summary: "Understand the real workflow before changing it.", checklist: ["Follow one piece of work end to end", "Notice handovers and waiting points", "Record questions to revisit"] },
      { id: "set-first-expectations", title: "Set first expectations", summary: "Make communication, ownership and escalation expectations clear.", checklist: ["Name what the team can expect from you", "Name what you need from the team", "Agree how issues will be raised"] },
      { id: "choose-first-focus", title: "Choose the first focus", summary: "Select one useful outcome for the first month.", checklist: ["Describe the outcome", "Explain why it matters", "Share how progress will be checked"] }
    ] },
    { id: "first-30", label: "First 30 Days", objective: "Understand the operation and establish a reliable leadership rhythm", milestones: [
      { id: "map-work", title: "Map the work", summary: "Make key responsibilities, customers and handovers visible.", checklist: ["List recurring work", "Clarify responsible areas", "Identify the most important handovers"] },
      { id: "build-rhythm", title: "Build the operating rhythm", summary: "Use preparation, huddles, follow-up and review consistently.", checklist: ["Prepare the day", "Run a focused huddle", "Close the day with a next step"] },
      { id: "clarify-priorities", title: "Clarify priorities", summary: "Turn activity into a small set of visible outcomes.", checklist: ["Define up to three outcomes", "Make trade-offs explicit", "Review progress regularly"] },
      { id: "surface-risks", title: "Surface risks early", summary: "Create a safe, practical way to raise risk and blockers.", checklist: ["State impact", "Name immediate action", "Escalate before options narrow"] },
      { id: "review-first-month", title: "Review the first month", summary: "Use evidence and team feedback to choose what to keep and change.", checklist: ["Review outcomes", "Ask what should continue", "Choose one improvement to test"] }
    ] },
    { id: "days-31-60", label: "Days 31\u201360", objective: "Strengthen execution, accountability and operational flow", milestones: [
      { id: "delegate-outcomes", title: "Delegate outcomes", summary: "Create ownership with clear authority and check-in points.", checklist: ["Name the outcome", "Confirm decision boundaries", "Agree the follow-up point"] },
      { id: "remove-repeat-blocker", title: "Remove a repeated blocker", summary: "Address one constraint that repeatedly slows useful work.", checklist: ["Describe the pattern", "Find the smallest unlock", "Check whether movement improves"] },
      { id: "strengthen-handover", title: "Strengthen a handover", summary: "Make the information and ownership needed for a clean handover explicit.", checklist: ["Define the handover point", "Confirm required information", "Test it with the receiving area"] },
      { id: "develop-team-rhythm", title: "Develop the team rhythm", summary: "Adjust meetings and communication to support the work.", checklist: ["Keep what helps", "Remove unnecessary meeting time", "Make decisions and actions visible"] },
      { id: "review-day-60", title: "Review day 60", summary: "Check whether the leadership system is helping the team deliver.", checklist: ["Review repeated risks", "Review delayed decisions", "Choose the next leadership focus"] }
    ] },
    { id: "days-61-90", label: "Days 61\u201390", objective: "Build a sustainable operating system and establish continuous improvement", milestones: [
      { id: "set-team-standards", title: "Set team standards", summary: "Make the expected way of working clear and usable.", checklist: ["Describe quality and response expectations", "Agree how exceptions are handled", "Review standards with the team"] },
      { id: "build-decision-rhythm", title: "Build a decision rhythm", summary: "Prevent important decisions from waiting without a next review date.", checklist: ["Record decisions", "Name the decision owner", "Set review dates when deferring"] },
      { id: "test-improvement", title: "Test an improvement", summary: "Run one small improvement through a clear test and review.", checklist: ["State what is not working", "Try a small change", "Capture what happened"] },
      { id: "prepare-next-quarter", title: "Prepare the next quarter", summary: "Translate learning into a manageable forward focus.", checklist: ["Name the strongest outcomes", "Carry forward useful lessons", "Choose three priorities"] },
      { id: "complete-90-day-review", title: "Complete the 90-day review", summary: "Reflect on trust, clarity, execution and the next leadership chapter.", checklist: ["Review progress", "Ask the team what changed", "Set the next leadership focus"] }
    ] }
  ];
  function getJourneyProgress(state = {}) {
    const completed = new Set(state.completedMilestoneIds || []);
    const milestones = journeyStages.flatMap((stage) => stage.milestones.map((milestone) => ({ ...milestone, stage })));
    const current = milestones.find((milestone) => !completed.has(milestone.id)) || milestones[milestones.length - 1];
    return { completed, milestones, current, completedCount: milestones.filter((milestone) => completed.has(milestone.id)).length, total: milestones.length };
  }

  // src/l10.js
  var L10_AGENDA = [
    { id: "segue", label: "Segue", minutes: 5 },
    { id: "scorecard", label: "Scorecard", minutes: 5 },
    { id: "rocks", label: "Rock review", minutes: 5 },
    { id: "headlines", label: "Headlines", minutes: 5 },
    { id: "todos", label: "To-Dos", minutes: 5 },
    { id: "ids", label: "IDS", minutes: 60 },
    { id: "conclude", label: "Conclude", minutes: 5 }
  ];
  function l10WeekStart(date = /* @__PURE__ */ new Date()) {
    const value = new Date(date);
    const day = value.getDay() || 7;
    value.setDate(value.getDate() - day + 1);
    return value.toISOString().slice(0, 10);
  }
  function l10WeekEnd(weekStart) {
    const value = /* @__PURE__ */ new Date(`${weekStart}T12:00:00`);
    value.setDate(value.getDate() + 6);
    return value.toISOString().slice(0, 10);
  }
  function scorecardStatus(goal, actual, direction = "at-least") {
    if (goal === "" || goal == null || actual === "" || actual == null) return "not-entered";
    const target = Number(goal);
    const value = Number(actual);
    if (!Number.isFinite(target) || !Number.isFinite(value)) return "not-entered";
    return direction === "at-most" ? value <= target ? "on-track" : "off-track" : value >= target ? "on-track" : "off-track";
  }
  function l10RemainingSeconds(meeting, sectionId) {
    const section = L10_AGENDA.find((item) => item.id === sectionId);
    const timer = meeting?.timer?.sectionId === sectionId ? meeting.timer : {};
    const elapsed = (timer.elapsedSeconds || 0) + (timer.startedAt ? Math.floor((Date.now() - Date.parse(timer.startedAt)) / 1e3) : 0);
    return Math.max(0, (section?.minutes || 5) * 60 - elapsed);
  }
  function defaultL10Meeting(weekStart = l10WeekStart()) {
    return {
      id: `l10-${weekStart}`,
      weekStart,
      weekEnd: l10WeekEnd(weekStart),
      meetingAt: `${weekStart}T09:00`,
      currentSection: "segue",
      sectionStatus: {},
      timer: { sectionId: "segue", startedAt: null, elapsedSeconds: 0, paused: false },
      segue: { leadershipBest: "", businessBest: "", reflection: "" },
      headlines: [],
      todos: [],
      issueIds: [],
      cascadingMessages: [],
      rating: "",
      meetingImprovement: "",
      completedAt: null,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
  }

  // src/meetings.js
  var meetingCadences = [
    ["weekly", "Weekly"],
    ["fortnightly", "Fortnightly"],
    ["monthly", "Monthly"]
  ];
  function dateOnly(date = /* @__PURE__ */ new Date()) {
    const value = new Date(date);
    return value.toISOString().slice(0, 10);
  }
  function advanceMeetingDate(date, cadence) {
    const value = /* @__PURE__ */ new Date(`${date}T12:00:00`);
    if (cadence === "monthly") value.setMonth(value.getMonth() + 1);
    else value.setDate(value.getDate() + (cadence === "fortnightly" ? 14 : 7));
    return dateOnly(value);
  }
  function nextMeetingDate(schedule, today = dateOnly()) {
    let nextDate = schedule.nextDate;
    while (nextDate && nextDate < today) nextDate = advanceMeetingDate(nextDate, schedule.cadence);
    return nextDate || today;
  }
  function daysUntil(date, today = dateOnly()) {
    const start = /* @__PURE__ */ new Date(`${today}T12:00:00`);
    const end = /* @__PURE__ */ new Date(`${date}T12:00:00`);
    return Math.max(0, Math.round((end - start) / 864e5));
  }
  function getNextWorkday(value = /* @__PURE__ */ new Date()) {
    const date = /* @__PURE__ */ new Date(`${dateOnly(value)}T12:00:00`);
    const day = date.getDay();
    const offset = day === 5 ? 3 : day === 6 ? 2 : day === 0 ? 1 : 1;
    date.setDate(date.getDate() + offset);
    return dateOnly(date);
  }

  // src/components.js
  var routes = {
    journey: { label: "Journey", eyebrow: "Your first 90 days", title: "Build the leadership rhythm.", description: "A practical path for listening, clarity, execution and improvement.", action: "Continue journey" },
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
    eod: {
      label: "End of Day",
      eyebrow: "Review \xB7 Prepare",
      title: "Close today. Prepare tomorrow.",
      description: "A calm close-out assistant for completed work, open loops, risk, and tomorrow\u2019s focus.",
      prompt: "Capture what matters before you leave the day.",
      action: "Enter End of Day"
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
    ["journey", "Journey", "\u25CC"],
    ["huddle", "Huddle", "\uFF0B"],
    ["work", "Work", "\u25A1"],
    ["review", "Review", "\u2713"],
    ["eod", "End of Day", "\u25D2"]
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
  playbookTopics.push(
    { id: "first-7-days", title: "Leading the first 7 days", group: "First 90 days", summary: "Listen, observe and establish clarity before making large changes.", when: "When you are starting in a new leadership role.", what: "Meet the team, observe the work, set first expectations and choose one useful focus.", say: "I will listen first, make the work visible and share what I learn.", avoid: "Avoid promising fixes before understanding the system.", success: "The team knows what to expect and the first focus is visible." },
    { id: "first-30-days", title: "Leading the first 30 days", group: "First 90 days", summary: "Build a reliable operating rhythm and make responsibilities clear.", when: "At the end of your first month.", what: "Map the work, clarify priorities, surface risks and review what to keep or change.", say: "What is helping us deliver, and where is the rhythm creating friction?", avoid: "Avoid treating the first month as a performance report.", success: "The team has a useful rhythm and one improvement to test." },
    { id: "first-90-days", title: "Completing the first 90 days", group: "First 90 days", summary: "Turn the first three months of learning into a sustainable leadership focus.", when: "At the end of the first 90 days.", what: "Review trust, clarity, execution and improvement; then choose the next three priorities.", say: "What changed because of how we led, and what should happen next?", avoid: "Avoid adding a large plan when three priorities will do.", success: "The next leadership chapter has a clear focus and operating rhythm." }
  );
  var onboardingSteps = [
    {
      title: "What is your leadership situation?",
      explanation: "This helps tailor the first 90 days to where you are starting."
    },
    {
      title: "What kind of work does your team do?",
      explanation: "We use this to keep guidance close to the work you lead."
    },
    {
      title: "How should guidance be structured?",
      explanation: "Choose the amount of structure that will help you act."
    },
    {
      title: "What time does your workday normally begin?",
      explanation: "We use this only to frame your daily rhythm."
    },
    {
      title: "What time should the end-of-day review be suggested?",
      explanation: "Choose a calm moment to close the loop and prepare tomorrow."
    },
    {
      title: "Set up the team you lead",
      explanation: "Use role and team-area labels to make your leadership context visible. Do not add names or personal details."
    }
  ];
  var leadershipSituationOptions = ["First-time leader", "Experienced leader", "New team", "Changed role", "Building a better system"];
  var workTypeOptions = ["Operations or service", "Office or administration", "Projects or professional services", "Sales or customer experience", "Technical or digital", "Other"];
  var guidanceOptions = ["Step-by-step", "Key milestones", "Independent"];
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
    if (!state.welcomeSeen) return `<main class="onboarding-screen welcome-screen" aria-labelledby="welcome-title"><div class="onboarding-brand">TalentisOS</div><p class="eyebrow">Your first 90 days</p><h1 id="welcome-title">Welcome to leadership.</h1><p>Build a clear, practical rhythm for the first 90 days of leading your team.</p><div class="onboarding-actions"><button class="primary-action" type="button" data-begin-journey>Build My First 90 Days <span aria-hidden="true">\u2192</span></button><button class="text-button" type="button" data-explore-talentis>Explore TalentisOS</button></div></main>`;
    if (state.completed && !state.completionSeen) {
      return `<main class="onboarding-screen onboarding-complete" aria-labelledby="onboarding-complete-title"><div class="completion-mark" aria-hidden="true">\u2713</div><p class="eyebrow">Your first 90 days</p><h1 id="onboarding-complete-title">Your leadership journey is ready.</h1><p>Start with the foundations and build the rhythm one useful step at a time.</p><button class="primary-action" type="button" data-start-today>Begin Day 1 <span aria-hidden="true">\u2192</span></button></main>`;
    }
    const step = Math.max(0, Math.min(state.step || 0, onboardingSteps.length - 1));
    const current = onboardingSteps[step];
    return `<main class="onboarding-screen" aria-labelledby="onboarding-title"><div class="onboarding-top"><span class="onboarding-brand">TalentisOS</span><button class="text-button" type="button" data-onboarding-save>Save &amp; resume later</button></div><div class="onboarding-progress" aria-label="Onboarding progress"><span>Step ${step + 1} of ${onboardingSteps.length}</span><div class="progress-track"><span style="width:${(step + 1) / onboardingSteps.length * 100}%"></span></div></div><section class="onboarding-card"><p class="eyebrow">Set up your daily rhythm</p><h1 id="onboarding-title">${current.title}</h1><p class="onboarding-explanation">${current.explanation}</p><form data-onboarding-form data-step="${step}">${onboardingFields(step, state)}<div class="onboarding-actions">${step > 0 ? '<button class="secondary-action" type="button" data-onboarding-back>Back</button>' : "<span></span>"}<button class="primary-action" type="submit">${step === onboardingSteps.length - 1 ? "Finish setup" : "Continue"} <span aria-hidden="true">\u2192</span></button></div></form></section></main>`;
  }
  function onboardingFields(step, state) {
    if (step === 0)
      return `<div class="option-grid">${leadershipSituationOptions.map((option) => `<label class="select-option"><input type="radio" name="leadershipSituation" value="${escapeHtml(option)}" ${state.answers?.leadershipSituation === option ? "checked" : ""} required><span>${option}</span></label>`).join("")}</div>`;
    if (step === 1)
      return `<div class="option-grid">${workTypeOptions.map((option) => `<label class="select-option"><input type="radio" name="workType" value="${escapeHtml(option)}" ${state.answers?.workType === option ? "checked" : ""} required><span>${option}</span></label>`).join("")}</div>`;
    if (step === 2)
      return `<div class="option-grid option-grid--three">${guidanceOptions.map((option) => `<label class="select-option"><input type="radio" name="guidanceLevel" value="${escapeHtml(option)}" ${state.answers?.guidanceLevel === option ? "checked" : ""} required><span>${option}</span></label>`).join("")}</div>`;
    if (step === 3)
      return `<label class="large-field">Workday start time<input type="time" name="startTime" value="${onboardingAnswer(state, "startTime")}" required></label>`;
    if (step === 4)
      return `<label class="large-field">Suggested review time<input type="time" name="reviewTime" value="${onboardingAnswer(state, "reviewTime")}" required></label>`;
    return `<div class="onboarding-team-setup"><label class="large-field">Your leadership role<input name="leaderRole" value="${onboardingAnswer(state, "leaderRole")}" placeholder="e.g. Operations lead" required></label><label class="large-field">Roles or team areas reporting to you<small>Use one role or area per line. Names are not needed.</small><textarea name="reportingRoles" rows="4" placeholder="Operations
Customer experience
Projects" required>${onboardingAnswer(state, "reportingRoles")}</textarea></label><label class="large-field">How is the team structured?<select name="teamStructure" required><option value="" disabled ${!state.answers?.teamStructure ? "selected" : ""}>Choose a structure</option>${["Functional areas", "Cross-functional team", "Small, cross-functional team", "Distributed or matrix", "Small direct team"].map((option) => `<option value="${escapeHtml(option)}" ${state.answers?.teamStructure === option ? "selected" : ""}>${option}</option>`).join("")}</select></label></div>`;
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
  function createJourneyView(state = {}, selectedMilestoneId = "") {
    const progress = getJourneyProgress(state);
    const stageIndex = journeyStages.findIndex((stage) => stage.id === progress.current.stage.id);
    const currentIndex = progress.current.stage.milestones.findIndex((item) => item.id === progress.current.id);
    const visible = progress.current.stage.milestones.slice(currentIndex, currentIndex + 3);
    const selected = progress.milestones.find((milestone) => milestone.id === selectedMilestoneId) || progress.current;
    const selectedCompleted = progress.completed.has(selected.id);
    const completed = progress.milestones.filter((milestone) => progress.completed.has(milestone.id));
    const completedSection = completed.length ? `<details class="journey-history"><summary>Review completed steps <span>${completed.length}</span></summary><div class="journey-history-list">${completed.map((milestone) => `<article><div class="journey-history-heading"><button class="journey-complete-toggle" type="button" data-reopen-milestone="${milestone.id}" aria-label="Mark ${escapeHtml(milestone.title)} incomplete" title="Mark incomplete">\u2713</button><div><p class="eyebrow">${escapeHtml(milestone.stage.label)}</p><h3>${escapeHtml(milestone.title)}</h3><p>${escapeHtml(milestone.summary)}</p>${state.completedAt?.[milestone.id] ? `<small>Completed ${escapeHtml(new Intl.DateTimeFormat(void 0, { dateStyle: "medium" }).format(new Date(state.completedAt[milestone.id])))}</small>` : ""}</div></div><ul class="journey-checklist">${milestone.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article>`).join("")}</div></details>` : "";
    return `<section class="journey-command" aria-labelledby="journey-title"><div class="journey-intro"><p class="eyebrow">First 90 Days Journey</p><h2 id="journey-title">Build the leadership rhythm.</h2><p class="secondary-text">${escapeHtml(progress.current.stage.objective)}. Progress is saved on this device.</p><div class="journey-progress" aria-label="${progress.completedCount} of ${progress.total} milestones complete"><div class="progress-track"><span style="width:${progress.completedCount / progress.total * 100}%"></span></div><span>${progress.completedCount} of ${progress.total} milestones</span></div></div><div class="journey-stage-tabs" role="list">${journeyStages.map((stage, index) => `<div class="journey-stage-tab ${index === stageIndex ? "journey-stage-tab--current" : index < stageIndex ? "journey-stage-tab--done" : ""}" role="listitem"><span>${index + 1}</span><strong>${stage.label}</strong></div>`).join("")}</div><section class="journey-current journey-selected-milestone" aria-labelledby="current-milestone-title"><p class="eyebrow">${selectedCompleted ? "Completed milestone" : selected.id === progress.current.id ? "Current milestone" : "Selected milestone"} \xB7 ${escapeHtml(selected.stage.label)}</p><h2 id="current-milestone-title">${escapeHtml(selected.title)}</h2><p>${escapeHtml(selected.summary)}</p><ul class="journey-checklist">${selected.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul><div class="modal__actions">${selectedCompleted ? '<span class="status-chip status-chip--success">Completed</span>' : `<button class="primary-action" type="button" data-complete-milestone="${selected.id}">Mark milestone complete <span aria-hidden="true">\u2192</span></button>`}<button class="secondary-action" type="button" data-print-milestone>Print milestone</button>${selected.id === "prepare-team-meeting" ? '<button class="secondary-action" type="button" data-open-meeting-builder>Open meeting builder</button>' : ""}</div></section><section class="journey-next" aria-labelledby="journey-next-title"><p class="eyebrow">Keep moving</p><h2 id="journey-next-title">Next milestones</h2><div class="journey-next-list">${visible.slice(1).map((milestone) => `<article><button class="journey-milestone-select" type="button" data-select-milestone="${milestone.id}"><span class="status-chip status-chip--neutral">Next</span><h3>${escapeHtml(milestone.title)}</h3><p>${escapeHtml(milestone.summary)}</p><span class="journey-select-label">View milestone \u2192</span></button></article>`).join("")}</div></section>${completedSection}</section>`;
  }
  function createMeetingBuilderDialog(state = {}) {
    const meeting = state.meetingPreparation || {};
    return `<dialog id="meeting-builder" class="modal" aria-labelledby="meeting-builder-title"><div class="modal__header"><div><p class="eyebrow">First 7 Days</p><h2 id="meeting-builder-title">Prepare to Meet Your Team</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close meeting builder">\xD7</button></div><form class="modal__body" data-meeting-builder-form><p class="secondary-text">Create a simple first conversation. You can change this later.</p><label>Purpose<textarea name="purpose" rows="2" required>${escapeHtml(meeting.purpose || "Listen, understand the work and agree how we will work together.")}</textarea></label><label>Introduction<textarea name="introduction" rows="2" required>${escapeHtml(meeting.introduction || "I am here to understand the work, support the team and make our priorities clear.")}</textarea></label><fieldset><legend>Questions to ask</legend>${["What is working well?", "What gets in the way?", "What should I understand before changing anything?", "Where do customers or colleagues feel friction?", "What would make the next 90 days useful?"].map((question) => `<label class="check-option"><input type="checkbox" name="questions" value="${escapeHtml(question)}" ${(meeting.questions || []).includes(question) ? "checked" : ""}><span>${question}</span></label>`).join("")}</fieldset><label>Expectations to share<textarea name="expectations" rows="2" required>${escapeHtml(meeting.expectations || "We will be clear about priorities, raise risk early and close the loop on commitments.")}</textarea></label><label>How to close<textarea name="close" rows="2" required>${escapeHtml(meeting.close || "Thank you. I will share what I heard, the next actions and when we will check back in.")}</textarea></label><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Cancel</button><button class="primary-action" type="submit">Save meeting plan</button></div></form></dialog>`;
  }
  function createMeetingScheduleCard(schedules = []) {
    const today = dateOnly();
    const upcoming = schedules.filter((schedule) => schedule.active !== false).map((schedule) => ({ ...schedule, nextDate: nextMeetingDate(schedule, today) })).sort((a, b) => a.nextDate.localeCompare(b.nextDate));
    const next = upcoming[0];
    if (!next) return `<section class="meeting-schedule-card meeting-schedule-card--empty" aria-labelledby="meeting-schedule-title"><div><p class="eyebrow">Meeting rhythm</p><h2 id="meeting-schedule-title">Set your next meeting.</h2><p class="secondary-text">Keep recurring leadership meetings visible without adding them to your task list.</p></div><button type="button" class="secondary-action" data-open-meeting-schedules>Set up meetings <span aria-hidden="true">\u2192</span></button></section>`;
    const days = daysUntil(next.nextDate, today);
    const countdown = days === 0 ? "Today" : days === 1 ? "Tomorrow" : `In ${days} days`;
    const agendaPreview = next.agenda ? `<p class="meeting-agenda-preview"><strong>Agenda</strong> \xB7 ${escapeHtml(next.agenda.split("\n").filter(Boolean).slice(0, 2).join(" \xB7 "))}</p>` : "";
    return `<section class="meeting-schedule-card" aria-labelledby="meeting-schedule-title"><div><p class="eyebrow">Next meeting</p><h2 id="meeting-schedule-title">${escapeHtml(next.name)}</h2><p class="secondary-text">${escapeHtml(next.cadenceLabel || meetingCadences.find(([value]) => value === next.cadence)?.[1] || "Recurring")} \xB7 ${escapeHtml(next.meetingTime || "Time not set")}</p>${agendaPreview}</div><div class="meeting-countdown"><strong>${countdown}</strong><span>${new Intl.DateTimeFormat(void 0, { weekday: "short", month: "short", day: "numeric" }).format(/* @__PURE__ */ new Date(`${next.nextDate}T12:00:00`))}</span></div><button type="button" class="secondary-action" data-open-meeting-schedules>Manage meetings</button></section>`;
  }
  function createMeetingScheduleDialog(schedules = []) {
    const rows = schedules.map((schedule) => `<li><span><strong>${escapeHtml(schedule.name)}</strong><small>${escapeHtml(meetingCadences.find(([value]) => value === schedule.cadence)?.[1] || schedule.cadence)} \xB7 next ${escapeHtml(schedule.nextDate)}</small>${schedule.agenda ? `<small class="meeting-agenda-line">Agenda: ${escapeHtml(schedule.agenda.split("\n").filter(Boolean).join(" \xB7 "))}</small>` : ""}</span><div class="meeting-schedule-row-actions"><button type="button" class="text-button" data-edit-meeting-schedule="${escapeHtml(schedule.id)}">Edit</button><button type="button" class="icon-button meeting-schedule-delete" data-delete-meeting-schedule="${schedule.id}" aria-label="Delete ${escapeHtml(schedule.name)}" title="Delete meeting"><svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg></button></div></li>`).join("");
    return `<dialog id="meeting-schedules-dialog" class="modal" aria-labelledby="meeting-schedules-title"><div class="modal__header"><div><p class="eyebrow">Today \xB7 Meeting rhythm</p><h2 id="meeting-schedules-title">Recurring meetings</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close recurring meetings">\xD7</button></div><div class="modal__body meeting-schedule-dialog-body"><p class="secondary-text">Set the next date for a recurring meeting. Dates and schedules stay on this device.</p><form data-meeting-schedule-form class="work-form meeting-schedule-form"><label>Meeting name<input name="name" placeholder="e.g. Weekly leadership meeting" required></label><div class="form-two-col"><label>Cadence<select name="cadence">${meetingCadences.map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}</select></label><label>Meeting time<input name="meetingTime" type="time" value="09:00"></label></div><label>Next meeting date<input name="nextDate" type="date" value="${dateOnly()}" required></label><label>Agenda<small>Use one topic per line.</small><textarea name="agenda" rows="3" placeholder="Scorecard
Priority review
Decisions and next actions"></textarea></label><button class="primary-action meeting-schedule-submit" type="submit">Add recurring meeting</button></form><section class="meeting-schedule-list"><h3>Saved schedules</h3><ul class="history-list">${rows || '<li class="section-empty"><p>No recurring meetings yet.</p></li>'}</ul></section></div></dialog>`;
  }
  function createTodayView(plan, priorities, workItems = [], todayReferences = []) {
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
    const todayWork = todayReferences.map((ref) => workItems.find((item) => item.id === ref.itemId)).filter((item) => item && item.status !== "complete");
    const todayWorkSection = todayWork.length ? `<section class="today-section" aria-labelledby="huddle-work-title"><div class="section-heading"><div><p class="eyebrow">Morning Huddle</p><h2 id="huddle-work-title">Added to Today</h2></div><span class="section-count">${todayWork.length}</span></div><div class="work-list">${todayWork.map((item) => `<article class="work-card"><div class="work-card__top"><div><span class="work-type">${escapeHtml(item.priority || "Action")}</span><h3>${escapeHtml(item.title || item.outcome)}</h3></div><span class="status-chip status-chip--neutral">${escapeHtml(workStatusLabel(item.status))}</span></div><div class="work-card__meta"><span>Raised ${escapeHtml(workDateLabel(item.raisedDate || item.createdAt?.slice(0, 10)))}</span>${item.dueDate ? `<span>Due ${escapeHtml(workDateLabel(item.dueDate))}</span>` : ""}</div><div class="work-card__actions"><button type="button" class="text-button" data-complete-work="${escapeHtml(item.id)}">Complete</button><button type="button" class="text-button" data-edit-work="${escapeHtml(item.id)}">Open details</button></div></article>`).join("")}</div></section>` : "";
    return `<section class="today-command" aria-labelledby="today-focus-title"><div class="today-greeting"><p class="eyebrow">${new Intl.DateTimeFormat(void 0, { weekday: "long", month: "long", day: "numeric" }).format(/* @__PURE__ */ new Date())}</p><h2 id="today-focus-title">Good morning.</h2><p class="secondary-text">Here is the shape of your leadership day.</p></div><section class="daily-focus"><div><p class="card-kicker">Daily focus</p><h3>${escapeHtml(focus)}</h3></div><span class="focus-card__icon" aria-hidden="true">\u2726</span></section><section class="today-section" aria-labelledby="priorities-title"><div class="section-heading"><div><p class="eyebrow">What matters now?</p><h2 id="priorities-title">Top three priorities</h2></div><button class="secondary-action" type="button" data-add-priority ${priorities.length >= 3 ? "disabled" : ""}>${priorities.length >= 3 ? "Three set" : "Add priority"}</button></div><div class="priority-list">${priorityCards}</div></section>${todayWorkSection}<div class="today-grid"><section class="today-section compact-section" aria-labelledby="carryover-title"><div class="section-heading"><h2 id="carryover-title">Carryover</h2><span class="section-count">${plan.carryover?.length || 0}</span></div>${plan.carryover?.length ? plan.carryover.map((item) => `<p>${escapeHtml(item)}</p>`).join("") : empty("Nothing carried over.")}</section><section class="today-section compact-section" aria-labelledby="risk-title"><div class="section-heading"><h2 id="risk-title">At risk</h2><span class="section-count section-count--warning">${criticalRisks.length}</span></div>${signalList(criticalRisks, "No critical risks surfaced.")}</section><section class="today-section compact-section" aria-labelledby="decision-title"><div class="section-heading"><h2 id="decision-title">Decisions</h2><span class="section-count">${dueDecisions.length}</span></div>${signalList(dueDecisions, "No decisions due.")}</section><section class="today-section compact-section" aria-labelledby="follow-up-title"><div class="section-heading"><h2 id="follow-up-title">Follow-ups due</h2><span class="section-count">${overdueFollowUps.length}</span></div>${signalList(overdueFollowUps, "No overdue follow-ups.")}</section></div><section class="today-section meetings-section" aria-labelledby="meetings-title"><div class="section-heading"><h2 id="meetings-title">Meetings</h2><span class="section-count">${plan.meetings?.length || 0}</span></div>${plan.meetings?.length ? plan.meetings.map((item) => `<p>${escapeHtml(item)}</p>`).join("") : empty("No meetings added.")}</section><section class="leadership-prompt" aria-labelledby="prompt-title"><p class="eyebrow">Leadership prompt</p><h2 id="prompt-title">${prompt}</h2></section><section class="end-day-status" aria-labelledby="end-day-title"><div><p class="eyebrow">End-of-day status</p><h2 id="end-day-title">${plan.endOfDayStatus === "complete" ? "Review complete." : "Not reviewed yet."}</h2></div><span class="status-chip status-chip--${plan.endOfDayStatus === "complete" ? "success" : "neutral"}">${plan.endOfDayStatus === "complete" ? "Complete" : "Open"}</span></section></section>${createPrioritySheet()}`;
  }
  function eodTaskProgress(task) {
    const subtasks = task.subtasks || [];
    const completed = subtasks.filter((item) => item.completed).length;
    const total = subtasks.length;
    return { completed, total, remaining: total ? total - completed : task.status === "complete" ? 0 : 1, percent: total ? Math.round(completed / total * 100) : task.status === "complete" ? 100 : 0 };
  }
  function eodTaskCard(task, action = "complete", selectedIds = []) {
    const progress = eodTaskProgress(task);
    return `<article class="eod-task-card"><div><span class="work-type">${escapeHtml(task.priority || "Normal")}</span><h3>${escapeHtml(task.title || task.outcome || "Untitled task")}</h3><p>${task.raisedDate || task.createdAt ? `Raised ${escapeHtml(String(task.raisedDate || task.createdAt).slice(0, 10))} \xB7 ` : ""}${task.completedDate ? `Completed ${escapeHtml(task.completedDate)} \xB7 ` : ""}${task.dueDate ? `Due ${escapeHtml(task.dueDate)} \xB7 ` : ""}${progress.total ? `${progress.completed} of ${progress.total} subtasks complete` : "No subtasks"}</p><div class="eod-progress"><span style="width:${progress.percent}%"></span></div></div>${action === "complete" ? `<div class="eod-task-actions"><button type="button" class="secondary-action" data-eod-complete-task="${escapeHtml(task.id)}">${task.status === "complete" ? "Completed" : "Complete"}</button>${task.status !== "complete" ? `<button type="button" class="text-button" data-add-to-huddle="${escapeHtml(task.id)}">Add to Huddle</button>` : ""}</div>` : `<label class="eod-task-select"><input type="checkbox" data-eod-tomorrow-task="${escapeHtml(task.id)}" ${selectedIds.includes(task.id) ? "checked" : ""}><span>Make priority</span></label>`}</article>`;
  }
  function createEodView({ eod, date, workItems = [], history = [], filter = "all" }) {
    const tasks = workItems.filter((item) => ["action", "priority"].includes(item.type) || item.source === "eod");
    const outstandingTasks = tasks.filter((item) => item.status !== "complete");
    const completedTasks = tasks.filter((item) => item.status === "complete" && String(item.completedAt || "").startsWith(date));
    const completedSubtasks = completedTasks.reduce((count, task) => count + (task.subtasks || []).filter((subtask) => subtask.completed && String(subtask.completedAt || "").startsWith(date)).length, 0);
    const outstandingSubtasks = outstandingTasks.reduce((count, task) => count + eodTaskProgress(task).remaining, 0);
    const risks = workItems.filter((item) => item.type === "risk" && item.status !== "complete");
    const tomorrowIds = eod.tomorrowPriorityIds || [];
    const tomorrowTasks = tomorrowIds.map((id) => tasks.find((task) => task.id === id)).filter(Boolean);
    const visibleTasks = filter === "completed" ? completedTasks : filter === "outstanding" ? outstandingTasks : tasks;
    const filterPanel = filter === "all" ? "" : `<section class="eod-filter-panel" aria-labelledby="eod-filter-title"><div class="section-heading"><div><p class="eyebrow">Filtered view</p><h2 id="eod-filter-title">${filter === "outstanding" ? "Outstanding Work" : filter === "risks" ? "Active Risks" : filter === "tomorrow" ? "Tomorrow\u2019s Priorities" : "Completed Today"}</h2><p class="secondary-text">${filter === "outstanding" ? `${outstandingTasks.length} tasks \xB7 ${outstandingSubtasks} subtasks still open.` : filter === "risks" ? "Open and watching risks that may affect tomorrow." : filter === "tomorrow" ? "The work selected for the next leadership day." : "Work completed during today\u2019s close-out."}</p></div><button type="button" class="secondary-action" data-eod-clear-filter>Back to EOD</button></div>${filter === "risks" ? `<div class="eod-risk-list">${risks.length ? risks.map((risk) => `<article class="eod-risk-card"><div><span class="status-chip status-chip--${risk.riskLevel === "critical" ? "warning" : "neutral"}">${escapeHtml(risk.riskLevel || "medium")}</span><h3>${escapeHtml(risk.title)}</h3><p><strong>Impact:</strong> ${escapeHtml(risk.impact || "Not specified")} \xB7 <strong>Next:</strong> ${escapeHtml(risk.nextAction || "Not recorded")}</p></div></article>`).join("") : '<div class="section-empty"><p>No active risks.</p><small>Nothing currently needs escalation.</small></div>'}</div>` : filter === "tomorrow" ? `<div class="eod-filter-list">${tomorrowTasks.length ? tomorrowTasks.map((task, index) => `<article class="eod-filter-item"><strong>${index + 1}</strong><div><h3>${escapeHtml(task.title || task.outcome)}</h3><p>${escapeHtml(task.priority || "Normal")} \xB7 ${task.dueDate ? `Due ${escapeHtml(task.dueDate)}` : "No due date"}</p></div></article>`).join("") : '<div class="section-empty"><p>No priorities selected.</p><small>Choose up to three things that matter most tomorrow.</small></div>'}</div>` : `<div class="eod-filter-list">${visibleTasks.length ? visibleTasks.map((task) => `<article class="eod-filter-item"><div><h3>${escapeHtml(task.title || task.outcome)}</h3><p>${escapeHtml(task.priority || "Normal")} \xB7 ${task.dueDate ? `Due ${escapeHtml(task.dueDate)}` : "No due date"}${(task.subtasks || []).length ? ` \xB7 ${eodTaskProgress(task).completed} of ${task.subtasks.length} subtasks complete` : ""}</p>${filter === "outstanding" && (task.subtasks || []).length ? `<ul>${task.subtasks.filter((subtask) => !subtask.completed).map((subtask) => `<li>${escapeHtml(subtask.title)}</li>`).join("")}</ul>` : ""}</div><button type="button" class="secondary-action" data-eod-complete-task="${escapeHtml(task.id)}">${filter === "completed" ? "Completed" : "Complete"}</button></article>`).join("") : `<div class="section-empty"><p>${filter === "completed" ? "Nothing completed yet." : "Nothing outstanding."}</p><small>${filter === "completed" ? "Completed work will appear here." : "You\u2019re clear for tomorrow."}</small></div>`}</div>`}</section>`;
    const active = eod.status === "in-progress" && eod.step > 0 ? "Continue End of Day" : eod.status === "closed" ? "View Today's EOD" : "Enter End of Day";
    const tile = (key, value, label, detail) => `<button type="button" class="eod-summary-tile eod-summary-tile--${key}" data-eod-filter="${key}"><strong>${value}</strong><span>${label}</span><small>${detail}</small></button>`;
    let wizard = "";
    if (eod.status === "in-progress") {
      const step = Math.max(0, Math.min(4, eod.step || 0));
      const titles = ["Review Today", "Outstanding Work", "Risks", "Tomorrow", "Close Day"];
      let content = "";
      if (step === 0) content = `<p class="secondary-text">Review today\u2019s work and close anything finished.</p><div class="eod-task-list">${visibleTasks.length ? visibleTasks.map((task) => eodTaskCard(task)).join("") : '<div class="section-empty"><p>Nothing recorded yet. Add a completed task below if you need to.</p></div>'}</div><form class="eod-inline-form" data-eod-task-form><input name="title" placeholder="Task completed today" required><input name="dueDate" type="date" aria-label="Due date"><button class="secondary-action" type="submit">+ Add completed task</button></form>`;
      if (step === 1) content = `<p class="secondary-text">Keep the open work visible without carrying it in your head.</p><div class="eod-task-list">${outstandingTasks.length ? outstandingTasks.map((task) => eodTaskCard(task)).join("") : '<div class="section-empty"><p>Nothing outstanding.</p><small>You\u2019re clear for tomorrow.</small></div>'}</div><form class="eod-inline-form" data-eod-task-form><input name="title" placeholder="Add a task" required><input name="dueDate" type="date" aria-label="Due date"><select name="priority"><option>Normal</option><option>Low</option><option>High</option><option>Critical</option></select><button class="secondary-action" type="submit">+ Add Task</button></form>`;
      if (step === 2) content = `<p class="secondary-text">Capture anything that could affect tomorrow.</p><div class="eod-risk-list">${risks.length ? risks.map((risk) => `<article class="eod-risk-card"><div><span class="status-chip status-chip--${risk.riskLevel === "critical" ? "warning" : "neutral"}">${escapeHtml(risk.riskLevel || "medium")}</span><h3>${escapeHtml(risk.title)}</h3><p>${escapeHtml(risk.nextAction || "No next action recorded.")}</p></div></article>`).join("") : '<div class="section-empty"><p>No active risks.</p><small>Nothing currently needs escalation.</small></div>'}</div><form class="eod-risk-form" data-eod-risk-form><input name="title" placeholder="What is at risk?" required><select name="impact"><option>Customer</option><option>People</option><option>Delivery</option><option>Operational</option><option>Financial</option><option>Other</option></select><select name="riskLevel"><option value="at-risk">Medium</option><option value="critical">High</option><option value="monitor">Low</option></select><textarea name="nextAction" rows="2" placeholder="What needs to happen next?"></textarea><button class="secondary-action" type="submit">+ Add Risk</button></form>`;
      if (step === 3) content = `<p class="secondary-text">Choose up to three things that matter most tomorrow.</p><div class="eod-task-list">${outstandingTasks.length ? outstandingTasks.map((task) => eodTaskCard(task, "tomorrow", tomorrowIds)).join("") : '<div class="section-empty"><p>No priorities selected.</p><small>Choose up to three things that matter most tomorrow.</small></div>'}</div><div class="eod-tomorrow-selected"><h3>Tomorrow\u2019s priorities</h3>${tomorrowTasks.length ? tomorrowTasks.map((task, index) => `<p><strong>${index + 1}</strong>${escapeHtml(task.title || task.outcome)}</p>`).join("") : '<p class="secondary-text">No priorities selected.</p>'}</div><label class="eod-handover-field">Tomorrow note<textarea data-eod-tomorrow-note rows="3" placeholder="Anything you need to remember before tomorrow begins\u2026">${escapeHtml(eod.tomorrowNote || "")}</textarea></label>`;
      if (step === 4) content = `<div class="eod-close-summary"><div><strong>${completedTasks.length}</strong><span>Completed</span></div><div><strong>${outstandingTasks.length}</strong><span>Outstanding</span></div><div><strong>${outstandingSubtasks}</strong><span>Subtasks</span></div><div><strong>${risks.length}</strong><span>Risks</span></div></div>${risks.some((risk) => risk.riskLevel === "critical") ? '<div class="eod-high-risk-warning"><strong>You have unresolved high-priority risks.</strong><span>You can review them or close anyway.</span></div>' : ""}<h3>Tomorrow</h3><ol class="eod-tomorrow-list">${tomorrowTasks.map((task) => `<li>${escapeHtml(task.title || task.outcome)}</li>`).join("") || "<li>No priorities selected.</li>"}</ol><label class="eod-handover-field">Handover note<textarea data-eod-handover-note rows="4" placeholder="What would someone need to know if you were unavailable tomorrow?">${escapeHtml(eod.handoverNote || "")}</textarea></label>`;
      wizard = `<section class="eod-wizard" aria-labelledby="eod-wizard-title"><div class="eod-wizard__top"><div><p class="eyebrow">Step ${step + 1} of 5</p><h2 id="eod-wizard-title">${titles[step]}</h2></div><div class="eod-progress-track"><span style="width:${(step + 1) / 5 * 100}%"></span></div></div>${content}<div class="eod-wizard-actions">${step > 0 ? '<button type="button" class="secondary-action" data-eod-back>Back</button>' : "<span></span>"}${step === 4 ? '<button type="button" class="primary-action" data-eod-close>Close My Day</button>' : '<button type="button" class="primary-action" data-eod-next>Continue <span aria-hidden="true">\u2192</span></button>'}</div></section>`;
    }
    const historyMarkup = history.length ? `<section class="eod-history"><div class="section-heading"><div><p class="eyebrow">Past close-outs</p><h2>EOD History</h2></div></div><div class="eod-history-list">${history.map((item) => `<article><div><strong>${escapeHtml(item.date)}</strong><span>${item.status === "closed" ? "Closed" : "In progress"} \xB7 ${item.completedTaskIds?.length || 0} completed \xB7 ${item.carriedForwardIds?.length || 0} carried to Huddle \xB7 ${item.riskIds?.length || 0} risks</span></div><button type="button" class="text-button" data-eod-history-id="${escapeHtml(item.id)}">View summary</button></article>`).join("")}</div></section>` : "";
    if (eod.status === "closed") wizard = `<section class="eod-closed-state"><div class="completion-mark" aria-hidden="true">\u2713</div><p class="eyebrow">Today\u2019s close-out</p><h2>Day Closed</h2><p class="secondary-text">Tomorrow is already clearer.</p><div class="eod-close-summary"><div><strong>${completedTasks.length}</strong><span>Completed</span></div><div><strong>${outstandingTasks.length}</strong><span>Outstanding</span></div><div><strong>${risks.length}</strong><span>Risks</span></div><div><strong>${tomorrowTasks.length}</strong><span>Tomorrow</span></div></div><div class="eod-closed-actions"><button type="button" class="secondary-action" data-eod-filter="completed">View Summary</button><button type="button" class="secondary-action" data-eod-edit-current>Edit Today\u2019s EOD</button></div></section>`;
    return `<section class="eod-command" aria-labelledby="eod-title"><div class="eod-intro"><div><p class="eyebrow">Review \xB7 Prepare</p><h2 id="eod-title">End of Day</h2><p class="secondary-text">Close today. Prepare tomorrow.</p></div><div class="eod-date">${escapeHtml(date)}</div></div><div class="eod-actions"><button type="button" class="primary-action" data-eod-enter>${active} <span aria-hidden="true">\u2192</span></button><button type="button" class="secondary-action" data-eod-history>EOD History</button></div><div class="eod-summary-grid">${tile("outstanding", outstandingTasks.length + outstandingSubtasks, "Outstanding", `${outstandingTasks.length} tasks \xB7 ${outstandingSubtasks} subtasks`)}${tile("risks", risks.length, "Risks", "Active risks and issues")}${tile("tomorrow", tomorrowTasks.length, "Tomorrow\u2019s Priorities", "Selected for tomorrow")}${tile("completed", completedTasks.length + completedSubtasks, "Completed Today", `${completedTasks.length} tasks \xB7 ${completedSubtasks} subtasks`)}</div>${outstandingTasks.length ? `<section class="eod-carry-forward"><div><p class="eyebrow">Continuity</p><h2>Carry outstanding work forward</h2><p class="secondary-text">Add ${outstandingTasks.length} tasks and ${outstandingSubtasks} subtasks to the next Morning Huddle without creating duplicates.</p></div><div class="eod-carry-forward__actions"><button type="button" class="primary-action" data-eod-add-all-huddle>Add all to next Huddle <span aria-hidden="true">\u2192</span></button><button type="button" class="secondary-action" data-eod-review-items>Review items</button><button type="button" class="text-button" data-eod-not-now>Not now</button></div></section>` : ""}${filterPanel}${wizard}${historyMarkup}</section>`;
  }
  function createEodHistoryDialog(record = {}) {
    return `<dialog id="eod-history-dialog" class="modal eod-history-dialog" aria-labelledby="eod-history-title"><div class="modal__header"><div><p class="eyebrow">EOD History \xB7 ${escapeHtml(record.status === "closed" ? "Closed" : "In progress")}</p><h2 id="eod-history-title">${escapeHtml(record.date || "End of Day")}</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close EOD history">\xD7</button></div><form class="modal__body" data-eod-history-edit><input type="hidden" name="id" value="${escapeHtml(record.id || "")}"><div class="eod-close-summary"><div><strong>${record.completedTaskIds?.length || 0}</strong><span>Completed</span></div><div><strong>${record.outstandingTaskIds?.length || 0}</strong><span>Outstanding</span></div><div><strong>${record.riskIds?.length || 0}</strong><span>Risks</span></div><div><strong>${record.tomorrowPriorityIds?.length || 0}</strong><span>Tomorrow</span></div></div><label class="eod-handover-field">Tomorrow note<textarea name="tomorrowNote" rows="3">${escapeHtml(record.tomorrowNote || "")}</textarea></label><label class="eod-handover-field">Handover note<textarea name="handoverNote" rows="4">${escapeHtml(record.handoverNote || "")}</textarea></label><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Cancel</button><button type="submit" class="primary-action">Save EOD changes</button></div></form></dialog>`;
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
    ["not-started", "Incomplete"],
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
    const raised = item.raisedDate ? `<span>Raised ${escapeHtml(workDateLabel(item.raisedDate))}</span>` : "";
    const completed = item.completedDate ? `<span>Completed ${escapeHtml(workDateLabel(item.completedDate))}</span>` : "";
    const age = item.status !== "complete" && item.raisedDate ? `<span class="work-age work-age--${workAgeClass(item.raisedDate)}">${workAge(item.raisedDate)}</span>` : "";
    return `<article class="work-card ${item.status === "complete" ? "work-card--complete" : ""}" data-work-id="${item.id}"><div class="work-card__top"><div><span class="work-type">${workTypes[item.type] || "Action"}</span><h3>${escapeHtml(item.title || item.outcome || "Untitled work item")}</h3></div><span class="status-chip status-chip--${statusClass}">${escapeHtml(workStatusLabel(item.status))}</span></div><p class="work-card__outcome">${escapeHtml(item.outcome || item.nextAction || item.impact || "No outcome added yet.")}</p><div class="work-card__meta">${raised}${completed}${age}<span>${item.dueDate ? escapeHtml(workDateLabel(item.dueDate)) : "No due point"}</span>${item.responsible ? `<span>With ${escapeHtml(item.responsible)}</span>` : ""}${item.group === "waiting" ? `<span class="waiting-note">Awaiting ${escapeHtml(item.followedUpWith || item.responsible || "a response")} \xB7 next follow-up ${escapeHtml(workDateLabel(item.dueDate))}</span>` : ""}${item.relatedItemIds?.length ? `<span>${item.relatedItemIds.length} related</span>` : ""}</div><div class="work-card__actions"><button class="text-button" type="button" data-edit-work="${item.id}">Open details</button>${item.status === "complete" ? '<button class="text-button" type="button" data-undo-work>Undo</button>' : `<button class="text-button" type="button" data-complete-work="${item.id}">Complete</button><button class="text-button" type="button" data-add-to-huddle="${item.id}">Add to Huddle</button>`}<button class="text-button text-button--quiet" type="button" data-delete-work="${item.id}">Delete</button></div></article>`;
  }
  function workAgeClass(raisedDate) {
    const days = Math.max(0, Math.round((/* @__PURE__ */ new Date(`${dateOnly()}T12:00:00`) - /* @__PURE__ */ new Date(`${raisedDate}T12:00:00`)) / 864e5));
    return days >= 6 ? "attention" : days >= 3 ? "warning" : "normal";
  }
  function workAge(raisedDate) {
    const days = Math.max(0, Math.round((/* @__PURE__ */ new Date(`${dateOnly()}T12:00:00`) - /* @__PURE__ */ new Date(`${raisedDate}T12:00:00`)) / 864e5));
    return `Open ${days} day${days === 1 ? "" : "s"}`;
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
    const subtasks = item.subtasks || [];
    const subtaskProgress = subtasks.length ? Math.round(subtasks.filter((subtask) => subtask.completed).length / subtasks.length * 100) : item.status === "complete" ? 100 : 0;
    const taskProgress = ["action", "priority"].includes(type) ? `<section class="task-progress-panel"><div class="section-heading"><div><p class="eyebrow">Task progress</p><h3>Subtasks</h3></div><strong>${subtaskProgress}%</strong></div><div class="task-progress-bar"><span style="width:${subtaskProgress}%"></span></div><p class="secondary-text">${subtasks.filter((subtask) => subtask.completed).length} of ${subtasks.length} subtasks complete</p><label>Subtasks <span class="field-hint">one per line</span><textarea name="subtasksText" rows="4" placeholder="Add the steps that make this outcome complete">${escapeHtml(subtasks.map((subtask) => subtask.title).join("\n"))}</textarea></label></section>` : "";
    const history = (item.movementHistory || []).slice().sort((a, b) => String(a.timestamp).localeCompare(String(b.timestamp)));
    const historyMarkup = item.id ? `<details class="work-history"><summary>History</summary><div class="work-history__timeline">${history.length ? history.map((event) => `<div><time>${escapeHtml(workDateLabel(event.date || event.timestamp?.slice(0, 10)))}</time><p><strong>${escapeHtml(event.action)}</strong>${event.note ? ` \xB7 ${escapeHtml(event.note)}` : ""}</p></div>`).join("") : '<p class="secondary-text">No history recorded yet.</p>'}</div></details>` : "";
    const metadata = item.id ? `<dl class="work-detail-meta"><div><dt>Raised</dt><dd>${escapeHtml(item.raisedDate || "Not recorded")}</dd></div><div><dt>Completed</dt><dd>${escapeHtml(item.completedDate || "Open")}</dd></div></dl>` : "";
    return `<dialog id="work-detail" class="modal work-detail-dialog" aria-labelledby="work-detail-title"><div class="modal__header"><div><p class="eyebrow">${item.id ? "Work item" : "Quick add"}</p><h2 id="work-detail-title">${item.id ? "Work item details" : "Add work item"}</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close work item">\xD7</button></div><form class="modal__body work-form" data-work-form><input type="hidden" name="id" value="${escapeHtml(item.id || "")}"><div class="form-two-col"><label>Type<select name="type"><option value="action" ${type === "action" ? "selected" : ""}>Action</option><option value="priority" ${type === "priority" ? "selected" : ""}>Priority</option><option value="risk" ${type === "risk" ? "selected" : ""}>Risk</option><option value="decision" ${type === "decision" ? "selected" : ""}>Decision</option><option value="follow-up" ${type === "follow-up" ? "selected" : ""}>Follow-up</option></select></label><label>Group<select name="group"><option value="now" ${item.group === "now" ? "selected" : ""}>Now</option><option value="next" ${!item.group || item.group === "next" ? "selected" : ""}>Next</option><option value="later" ${item.group === "later" ? "selected" : ""}>Later</option><option value="waiting" ${item.group === "waiting" ? "selected" : ""}>Waiting</option></select></label></div><label>Title<input name="title" maxlength="140" value="${escapeHtml(item.title || "")}" required placeholder="What needs your leadership?"></label><label>Outcome<textarea name="outcome" rows="2" placeholder="What will be different when this is done?">${escapeHtml(item.outcome || "")}</textarea></label><div class="form-two-col"><label>Responsible person or area <span class="field-hint">optional plain text</span><input name="responsible" value="${escapeHtml(item.responsible || "")}"></label><label>Due date or time<input type="date" name="dueDate" value="${escapeHtml(item.dueDate || "")}"></label></div><div class="form-two-col"><label>Status<select name="status">${workStatusOptions(type, item.status)}</select></label><label>Risk level<select name="riskLevel"><option value="monitor" ${item.riskLevel === "monitor" ? "selected" : ""}>Monitor</option><option value="at-risk" ${item.riskLevel === "at-risk" ? "selected" : ""}>At risk</option><option value="critical" ${item.riskLevel === "critical" ? "selected" : ""}>Critical</option></select></label></div>${metadata}${taskProgress}<label class="check-row"><input type="checkbox" name="blocked" ${item.blocked ? "checked" : ""}> Blocked</label><label>What\u2019s blocking this?<textarea name="blockerNote" rows="2" placeholder="Optional short blocker note">${escapeHtml(item.blockerNote || "")}</textarea></label><label>Waiting on <input name="waitingOn" value="${escapeHtml(item.waitingOn || "")}" placeholder="Optional person, area or dependency"></label><label>Next action<textarea name="nextAction" rows="2">${escapeHtml(item.nextAction || "")}</textarea></label><label>Notes<textarea name="notes" rows="3">${escapeHtml(item.notes || "")}</textarea></label><label>Related item IDs <span class="field-hint">optional, comma separated</span><input name="relatedItemIds" value="${escapeHtml((item.relatedItemIds || []).join(", "))}"></label><div data-type-fields>${workTypeFields(type, item)}</div>${item.id && item.status !== "complete" ? '<button type="button" class="secondary-action" data-add-to-huddle="' + escapeHtml(item.id) + '">Add to Huddle</button>' : ""}${historyMarkup}<p class="autosave-note" data-autosave-note>Changes save automatically.</p><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Close</button><button type="submit" class="primary-action">Save item</button></div></form></dialog>`;
  }
  function createHuddlePickerDialog(item = {}, nextWorkday = dateOnly()) {
    return `<dialog id="huddle-picker-dialog" class="modal" aria-labelledby="huddle-picker-title"><div class="modal__header"><div><p class="eyebrow">Morning Huddle</p><h2 id="huddle-picker-title">Add to Huddle</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close Huddle date picker">\xD7</button></div><form class="modal__body" data-huddle-picker-form><input type="hidden" name="itemId" value="${escapeHtml(item.id || "")}"><p class="secondary-text">Keep the existing work item and make it visible on the selected Huddle date.</p><label>Huddle date<input type="date" name="huddleDate" value="${escapeHtml(nextWorkday)}" required></label><div class="modal__actions"><button type="button" class="secondary-action" data-huddle-next-workday>Next Workday</button><button type="button" class="secondary-action" data-close-dialog>Cancel</button><button type="submit" class="primary-action">Add to Huddle</button></div></form></dialog>`;
  }
  function createEodCarryReviewDialog(tasks = [], nextWorkday = dateOnly()) {
    return `<dialog id="eod-carry-review-dialog" class="modal" aria-labelledby="eod-carry-review-title"><div class="modal__header"><div><p class="eyebrow">Carry Forward</p><h2 id="eod-carry-review-title">Review items for the next Huddle</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close carry-forward review">\xD7</button></div><form class="modal__body" data-eod-carry-review-form><p class="secondary-text">All outstanding work is selected. Deselect anything that does not need Huddle visibility.</p><label>Huddle date<input type="date" name="huddleDate" value="${escapeHtml(nextWorkday)}" required></label><div class="carry-review-list">${tasks.map((task) => `<label class="carry-review-item"><input type="checkbox" name="itemId" value="${escapeHtml(task.id)}" checked><span><strong>${escapeHtml(task.title || task.outcome)}</strong><small>${escapeHtml(task.priority || "Standard")} \xB7 ${task.subtasks?.filter((item) => !item.completed).length || 0} incomplete subtasks${task.blocked ? " \xB7 Blocked" : task.status === "waiting" ? " \xB7 Waiting" : ""}</small></span></label>`).join("")}</div><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Cancel</button><button type="submit" class="primary-action">Add selected</button></div></form></dialog>`;
  }
  function createHuddleView(date, workItems, huddleItems, availableDates = []) {
    const refs = huddleItems.map((ref) => {
      const parent = workItems.find((item) => item.id === (ref.parentItemId || ref.itemId));
      const subtask = ref.itemType === "subtask" ? parent?.subtasks?.find((item) => item.id === ref.itemId) : null;
      return { ref, item: subtask ? { ...parent, id: ref.itemId, title: subtask.title, status: subtask.completed ? "complete" : "not-started", raisedDate: subtask.raisedDate || parent.raisedDate, completedDate: subtask.completedDate } : parent };
    }).filter(({ item }) => item);
    const grouped = refs.reduce((groups, { ref, item }) => {
      const key = item.id;
      if (!groups[key]) groups[key] = { ref, item };
      return groups;
    }, {});
    const dateSwitcher = `<button type="button" class="primary-action" data-huddle-add-new>Add work item <span aria-hidden="true">\uFF0B</span></button>${availableDates.length ? `<div class="huddle-date-switcher" role="group" aria-label="Huddle dates">${availableDates.map((availableDate) => `<button type="button" class="text-button ${availableDate === date ? "text-button--selected" : ""}" data-huddle-date="${escapeHtml(availableDate)}">${escapeHtml(workDateLabel(availableDate))}</button>`).join("")}</div>` : ""}`;
    return `<section class="huddle-command" aria-labelledby="huddle-title"><div class="review-intro"><div><p class="eyebrow">Prepare \xB7 Align</p><h2 id="huddle-title">Morning Huddle</h2><p class="secondary-text">${escapeHtml(workDateLabel(date))} \xB7 Carried work stays connected to the original item.</p></div>${dateSwitcher}</div><section class="today-section" aria-labelledby="carried-forward-title"><div class="section-heading"><div><p class="eyebrow">Continuity</p><h2 id="carried-forward-title">Carried forward</h2></div><span class="section-count">${Object.keys(grouped).length}</span></div>${Object.keys(grouped).length ? `<div class="work-list">${Object.values(grouped).map(({ item }) => {
      const incomplete = (item.subtasks || []).filter((subtask) => !subtask.completed);
      const carryCount = (item.movementHistory || []).filter((event) => ["Copied to Huddle", "Carried Forward", "Moved to Huddle"].includes(event.action)).length;
      return `<article class="work-card ${item.status === "complete" ? "work-card--complete" : ""}"><div class="work-card__top"><div><span class="work-type">${escapeHtml(item.priority || item.type || "Action")}</span><h3>${escapeHtml(item.title || item.outcome)}</h3></div><span class="status-chip status-chip--${item.status === "complete" ? "success" : item.blocked ? "warning" : "neutral"}">${item.status === "complete" ? "Completed" : item.blocked ? "Blocked" : item.status === "waiting" ? "Waiting" : "Open"}</span></div><div class="work-card__meta"><span>Raised ${escapeHtml(workDateLabel(item.raisedDate || item.createdAt?.slice(0, 10)))}</span><span>Open ${escapeHtml(workAge(item.raisedDate || item.createdAt?.slice(0, 10)).replace("Open ", ""))}</span>${item.dueDate ? `<span>Due ${escapeHtml(workDateLabel(item.dueDate))}</span>` : ""}${carryCount > 1 ? `<span>Carried forward ${carryCount} times</span>` : ""}</div>${incomplete.length ? `<p class="work-card__outcome">${incomplete.length} incomplete subtask${incomplete.length === 1 ? "" : "s"}: ${escapeHtml(incomplete.map((subtask) => subtask.title).join(" \xB7 "))}</p>` : ""}<div class="work-card__actions">${item.status === "complete" ? "" : `<button type="button" class="text-button" data-complete-work="${escapeHtml(item.id)}">Complete</button><button type="button" class="text-button" data-huddle-add-today="${escapeHtml(item.id)}">Add to Today</button><button type="button" class="text-button" data-huddle-block="${escapeHtml(item.id)}">${item.blocked ? "Unblock" : "Block"}</button><button type="button" class="text-button" data-huddle-move="${escapeHtml(item.id)}">Move</button>`}<button type="button" class="text-button" data-edit-work="${escapeHtml(item.id)}">Open details</button></div></article>`;
    }).join("")}</div>` : '<div class="section-empty"><p>No carried-forward work for this Huddle.</p><small>Add an outstanding item from Work or End of Day.</small></div>'}</section></section>${createWorkDetailSheet()}`;
  }
  function createHuddleMeetingDialog(date, workItems, huddleItems) {
    const items = huddleItems.map((ref) => workItems.find((item) => item.id === ref.itemId)).filter((item) => item && item.status !== "complete");
    return `<dialog id="morning-huddle-dialog" class="modal morning-huddle-dialog" aria-labelledby="morning-huddle-title"><div class="modal__header"><div><p class="eyebrow">Today \xB7 Prepare \xB7 Align</p><h2 id="morning-huddle-title">Morning Huddle</h2><p class="secondary-text">${escapeHtml(workDateLabel(date))} \xB7 ${items.length} carried-over item${items.length === 1 ? "" : "s"}</p></div><button class="icon-button" type="button" data-close-dialog aria-label="Close Morning Huddle">\xD7</button></div><div class="modal__body"><section class="huddle-dialog-intro"><p>Decide what needs attention today. Complete it, add it to Today, block it, or move it forward.</p></section><section class="huddle-dialog-section" aria-labelledby="huddle-dialog-carried-title"><div class="section-heading"><div><p class="eyebrow">Continuity</p><h3 id="huddle-dialog-carried-title">Carried forward</h3></div><span class="section-count">${items.length}</span></div>${items.length ? `<div class="huddle-dialog-list">${items.map((item) => {
      const incomplete = (item.subtasks || []).filter((subtask) => !subtask.completed);
      return `<article class="huddle-dialog-item"><div><strong>${escapeHtml(item.title || item.outcome)}</strong><small>Raised ${escapeHtml(workDateLabel(item.raisedDate || item.createdAt?.slice(0, 10)))}${item.dueDate ? ` \xB7 Due ${escapeHtml(workDateLabel(item.dueDate))}` : ""}${item.blocked ? " \xB7 Blocked" : ""}</small>${incomplete.length ? `<small>${incomplete.length} incomplete subtask${incomplete.length === 1 ? "" : "s"}</small>` : ""}</div><div class="huddle-dialog-item__actions"><button type="button" class="text-button" data-complete-work="${escapeHtml(item.id)}">Complete</button><button type="button" class="text-button" data-huddle-add-today="${escapeHtml(item.id)}">Add to Today</button></div></article>`;
    }).join("")}</div>` : '<div class="section-empty"><p>No carried-over items.</p><small>Add a new work item to start the day.</small></div>'}</section><div class="modal__actions"><button type="button" class="primary-action" data-huddle-dialog-add>\uFF0B Add work item</button><button type="button" class="secondary-action" data-close-dialog>Continue to Huddle</button></div></div></dialog>`;
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
  function createL10MetricChart(metric, entries) {
    const points = entries.filter((entry) => entry.metricId === metric.id && Number.isFinite(Number(entry.actual))).sort((a, b) => String(a.weekStart).localeCompare(String(b.weekStart))).slice(-8).map((entry) => ({
      label: String(entry.weekStart || "").slice(5),
      actual: Number(entry.actual),
      goal: Number(entry.goal ?? metric.weeklyGoal)
    }));
    const chartLabel = `${metric.name} weekly actual versus goal`;
    if (!points.length) return `<article class="l10-chart l10-chart--empty"><div class="l10-chart__heading"><div><span class="work-type">${escapeHtml(metric.area || "Team area")}</span><h3>${escapeHtml(metric.name)}</h3></div><span class="secondary-text">No weekly data yet</span></div><p class="secondary-text">Save a weekly number to start the local trend.</p></article>`;
    const width = 560;
    const height = 190;
    const pad = { top: 18, right: 18, bottom: 32, left: 42 };
    const maxValue = Math.max(...points.flatMap((point) => [point.actual, point.goal]), 1);
    const minValue = Math.min(...points.flatMap((point) => [point.actual, point.goal]), 0);
    const range = Math.max(maxValue - minValue, 1);
    const x = (index) => pad.left + (points.length === 1 ? (width - pad.left - pad.right) / 2 : index * (width - pad.left - pad.right) / (points.length - 1));
    const y = (value) => pad.top + (maxValue - value) * (height - pad.top - pad.bottom) / range;
    const actualLine = points.map((point, index) => `${x(index)},${y(point.actual)}`).join(" ");
    const goalLine = points.map((point, index) => `${x(index)},${y(point.goal)}`).join(" ");
    const labels = points.map((point, index) => `<text x="${x(index)}" y="${height - 9}" text-anchor="middle">${escapeHtml(point.label)}</text>`).join("");
    const dots = points.map((point, index) => `<circle class="l10-chart__dot" cx="${x(index)}" cy="${y(point.actual)}" r="4"><title>${escapeHtml(point.label)}: actual ${point.actual}, goal ${point.goal}</title></circle>`).join("");
    const latest = points[points.length - 1];
    const status = scorecardStatus(latest.goal, latest.actual, metric.direction);
    const statusLabel2 = status === "on-track" ? "On track" : "Off track";
    const light = status === "on-track" ? "green" : "red";
    return `<article class="l10-chart" aria-label="${escapeHtml(chartLabel)}"><div class="l10-chart__heading"><div><span class="work-type">${escapeHtml(metric.area || "Team area")}</span><h3>${escapeHtml(metric.name)}</h3></div><span class="l10-traffic-light l10-traffic-light--${light}" role="img" aria-label="Latest result: ${statusLabel2}"><span aria-hidden="true">\u25CF</span><strong>${statusLabel2}</strong></span></div><svg class="l10-chart__svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(chartLabel)}"><line class="l10-chart__axis" x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}"></line><polyline class="l10-chart__goal" points="${goalLine}"></polyline><polyline class="l10-chart__actual" points="${actualLine}"></polyline>${dots}${labels}</svg><div class="l10-chart__legend"><span><i class="l10-chart__legend-line l10-chart__legend-line--actual"></i>Actual</span><span><i class="l10-chart__legend-line l10-chart__legend-line--goal"></i>Goal</span><span>Latest: ${latest.actual}</span></div></article>`;
  }
  function createL10View({ settings, meeting, metrics, entries, rocks, issues, history, weekStart }) {
    const active = meeting?.currentSection || "segue";
    const agenda = L10_AGENDA.map((section, index) => `<button type="button" class="l10-agenda-item ${active === section.id ? "l10-agenda-item--active" : ""} ${meeting?.sectionStatus?.[section.id] ? "l10-agenda-item--done" : ""}" data-l10-section="${section.id}"><span>${index + 1}</span><strong>${section.label}</strong><small>${section.minutes} min</small></button>`).join("");
    const currentEntries = entries.filter((entry) => entry.weekStart === weekStart);
    const metricRows = metrics.filter((metric) => metric.active !== false).map((metric) => {
      const entry = currentEntries.find((item) => item.metricId === metric.id) || {};
      const status = scorecardStatus(entry.goal ?? metric.weeklyGoal, entry.actual, metric.direction);
      const statusLabel2 = status === "on-track" ? "On track" : status === "off-track" ? "Off track" : "Not entered";
      const light = status === "on-track" ? "green" : status === "off-track" ? "red" : "amber";
      return `<article class="l10-record-card"><div><span class="work-type">${escapeHtml(metric.area || "Team area")}</span><h3>${escapeHtml(metric.name)}</h3><p>Goal: ${escapeHtml(entry.goal ?? metric.weeklyGoal ?? "Not set")} \xB7 Actual: ${escapeHtml(entry.actual ?? "Not entered")}</p></div><span class="l10-traffic-light l10-traffic-light--${light}" role="img" aria-label="${statusLabel2}"><span aria-hidden="true">\u25CF</span><strong>${statusLabel2}</strong></span><div class="l10-record-actions"><button type="button" class="text-button" data-l10-edit-metric="${metric.id}">Edit</button><button type="button" class="text-button text-button--quiet" data-l10-delete-metric="${metric.id}">Delete</button><button type="button" class="text-button" data-l10-metric-issue="${metric.id}">Add to Issues</button></div></article>`;
    }).join("");
    const rockRows = rocks.map((rock) => `<article class="l10-record-card"><div><span class="work-type">${escapeHtml(rock.area || "Team area")}</span><h3>${escapeHtml(rock.outcome)}</h3><p>Due ${escapeHtml(rock.dueDate || "Not set")}</p></div><span class="status-chip status-chip--${rock.status === "on-track" ? "success" : rock.status === "off-track" ? "warning" : "neutral"}">${escapeHtml(rock.status || "on-track")}</span><button type="button" class="text-button" data-l10-rock-issue="${rock.id}">Add to Issues</button></article>`).join("");
    const issueRows = issues.sort((a, b) => (a.priorityOrder || 0) - (b.priorityOrder || 0)).map((issue) => `<article class="l10-record-card"><div><span class="work-type">${escapeHtml(issue.source || "manual")}</span><h3>${escapeHtml(issue.title)}</h3><p>${escapeHtml(issue.status || "open")}</p></div><button type="button" class="secondary-action" data-l10-open-issue="${issue.id}">Work in IDS</button></article>`).join("");
    let sectionContent = "";
    if (active === "segue") sectionContent = `<form class="l10-section-form" data-l10-segue-form><label>Leadership best<textarea name="leadershipBest" rows="2">${escapeHtml(meeting.segue?.leadershipBest || "")}</textarea></label><label>Business, customer, or community best<textarea name="businessBest" rows="2">${escapeHtml(meeting.segue?.businessBest || "")}</textarea></label><label>Optional reflection<textarea name="reflection" rows="2">${escapeHtml(meeting.segue?.reflection || "")}</textarea></label><button class="primary-action" type="submit">Save and continue</button></form>`;
    if (active === "scorecard") sectionContent = `<div class="l10-section-form"><p class="secondary-text">Review the weekly numbers only. Add off-track items to IDS for discussion.</p><section class="l10-chart-grid" aria-label="Scorecard trends">${metrics.filter((metric) => metric.active !== false).map((metric) => createL10MetricChart(metric, entries)).join("") || '<div class="section-empty"><p>Add a scorecard metric below to start plotting trends.</p></div>'}</section><div class="l10-record-list">${metricRows || '<div class="section-empty"><p>No scorecard metrics yet.</p></div>'}</div><form data-l10-scorecard-entry-form><label>Metric<select name="metricId">${metrics.map((metric) => `<option value="${metric.id}">${escapeHtml(metric.name)}</option>`).join("")}</select></label><div class="form-two-col"><label>Goal<input name="goal" type="number" step="any" required></label><label>Actual<input name="actual" type="number" step="any" required></label></div><label>Note<textarea name="note" rows="2"></textarea></label><button class="secondary-action" type="submit">Save weekly number</button></form></div>`;
    if (active === "rocks") sectionContent = `<div class="l10-section-form"><div class="l10-record-list">${rockRows || '<div class="section-empty"><p>No Rocks yet.</p></div>'}</div><form data-l10-rock-form><label>Outcome<input name="outcome" required></label><div class="form-two-col"><label>Area<input name="area"></label><label>Due date<input name="dueDate" type="date"></label></div><button class="secondary-action" type="submit">Add Rock</button></form></div>`;
    if (active === "headlines") sectionContent = `<form class="l10-section-form" data-l10-headline-form><label>Headline type<select name="type"><option value="customer">Customer/community</option><option value="team">Team area</option><option value="operating">Operating</option></select></label><label>Area<input name="area"></label><label>Headline<textarea name="text" rows="2" required></textarea></label><label><input type="checkbox" name="concern"> This needs attention</label><button class="primary-action" type="submit">Save headline</button></form><div class="l10-headline-list">${(meeting.headlines || []).map((headline) => `<p><strong>${escapeHtml(headline.type)}</strong> \xB7 ${escapeHtml(headline.text)}</p>`).join("")}</div>`;
    if (active === "todos") sectionContent = `<div class="l10-section-form"><div class="l10-record-list">${(meeting.todos || []).map((todo) => `<article class="l10-record-card"><div><h3>${escapeHtml(todo.title)}</h3><p>${escapeHtml(todo.area || "Team area")} \xB7 due ${escapeHtml(todo.dueDate || "Not set")}</p></div><button type="button" class="text-button" data-l10-todo-toggle="${todo.id}">${todo.status === "done" ? "Done" : "Not done"}</button></article>`).join("") || '<div class="section-empty"><p>No previous To-Dos.</p></div>'}</div><form data-l10-todo-form><label>To-Do<input name="title" required></label><div class="form-two-col"><label>Area<input name="area"></label><label>Due date<input name="dueDate" type="date"></label></div><button class="secondary-action" type="submit">Add To-Do</button></form></div>`;
    if (active === "ids") sectionContent = `<div class="l10-section-form"><div class="l10-record-list">${issueRows || '<div class="section-empty"><p>No Issues yet. Add one from the form below.</p></div>'}</div><form data-l10-issue-form><label>Issue<input name="title" required placeholder="State the issue, not only the symptom"></label><label>Area<input name="area"></label><button class="secondary-action" type="submit">Add issue to IDS</button></form></div>`;
    if (active === "conclude") sectionContent = `<form class="l10-section-form" data-l10-conclude-form><label>Cascading message<textarea name="cascadingMessage" rows="2"></textarea></label><label>Meeting improvement<textarea name="meetingImprovement" rows="2">${escapeHtml(meeting.meetingImprovement || "")}</textarea></label><label>Meeting rating (1\u201310)<input name="rating" type="number" min="1" max="10" value="${escapeHtml(meeting.rating || "")}" required></label><button class="primary-action" type="submit">Complete L10 meeting</button></form>`;
    return `<section class="l10-command" aria-labelledby="l10-title"><div class="l10-intro"><div><p class="eyebrow">Weekly leadership meeting</p><h2 id="l10-title">L10 Meeting</h2><p class="secondary-text">${escapeHtml(weekStart)} \xB7 week ending ${escapeHtml(meeting.weekEnd || "")} \xB7 90 minutes \xB7 local-only workspace</p></div><span class="review-time">${L10_AGENDA.reduce((total, section) => total + section.minutes, 0)} min</span></div><div class="review-switcher" role="group" aria-label="Review period"><a href="#review" class="secondary-action">Daily review</a><a href="#review/weekly" class="secondary-action">Weekly review</a><a href="#review/l10" class="secondary-action review-switcher--active">L10 meeting</a></div><div class="l10-layout"><aside class="l10-agenda" aria-label="L10 agenda">${agenda}</aside><section class="l10-active-section" aria-labelledby="l10-section-title"><p class="eyebrow">${L10_AGENDA.find((item) => item.id === active)?.minutes} minutes</p><h2 id="l10-section-title">${L10_AGENDA.find((item) => item.id === active)?.label}</h2>${sectionContent}<button type="button" class="secondary-action" data-l10-next>Save section and continue</button></section></div><section class="l10-resources"><div class="section-heading"><div><p class="eyebrow">Operating setup</p><h2>Scorecard and team areas</h2></div></div><form data-l10-metric-form class="form-two-col"><label>New scorecard metric<input name="name" placeholder="e.g. Follow-ups completed on time" required></label><label>Area<input name="area" placeholder="Operations"></label><label>Direction<select name="direction"><option value="at-least">At least</option><option value="at-most">At most</option></select></label><label>Weekly goal<input name="weeklyGoal" type="number" step="any" required></label><button class="secondary-action" type="submit">Add metric</button></form><p class="secondary-text">${settings.teamAreas?.length ? `Areas: ${settings.teamAreas.map(escapeHtml).join(" \xB7 ")}` : "Use team areas rather than employee profiles."}</p></section><details class="l10-history"><summary>Previous L10 meetings (${history.length})</summary><div>${history.map((item) => `<article class="l10-history-row"><div><p>${escapeHtml(item.weekStart)}${item.weekEnd ? ` \u2013 ${escapeHtml(item.weekEnd)}` : ""} \xB7 ${item.completedAt ? "Complete" : "In progress"} \xB7 rating ${escapeHtml(item.rating || "Not rated")}</p></div><button type="button" class="secondary-action" data-l10-history-id="${item.id}">View details</button></article>`).join("") || "<p>No previous meetings yet.</p>"}</div></details></section>`;
  }
  function createL10IssueDialog(issue = {}) {
    return `<dialog id="l10-issue-dialog" class="modal work-detail-dialog" aria-labelledby="l10-issue-title"><div class="modal__header"><div><p class="eyebrow">IDS</p><h2 id="l10-issue-title">Work the issue</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close issue">\xD7</button></div><form class="modal__body work-form" data-l10-ids-form><input type="hidden" name="id" value="${escapeHtml(issue.id || "")}"><label>Issue title<input name="title" value="${escapeHtml(issue.title || "")}" required></label><label>Identify<textarea name="identify" rows="3">${escapeHtml(issue.identify || "")}</textarea></label><label>Discuss<textarea name="discuss" rows="3">${escapeHtml(issue.discuss || "")}</textarea></label><label>Solve<textarea name="solve" rows="3">${escapeHtml(issue.solve || "")}</textarea></label><div class="form-two-col"><label>Status<select name="status">${["open", "in-discussion", "solved", "carried-forward"].map((value) => `<option value="${value}" ${issue.status === value ? "selected" : ""}>${value}</option>`).join("")}</select></label><label>Convert solution<select name="conversion"><option value="">No conversion</option><option value="decision">Create decision</option><option value="follow-up">Create follow-up</option><option value="improvement">Create improvement</option><option value="message">Cascading message</option></select></label></div><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Cancel</button><button type="submit" class="primary-action">Save IDS outcome</button></div></form></dialog>`;
  }
  function createL10SettingsDialog(settings = {}) {
    return `<dialog id="l10-settings-dialog" class="modal" aria-labelledby="l10-settings-title"><div class="modal__header"><div><p class="eyebrow">L10 setup</p><h2 id="l10-settings-title">Meeting setup</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close meeting setup">\xD7</button></div><form class="modal__body work-form" data-l10-settings-form><label>Meeting day<select name="meetingDay">${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day, index) => `<option value="${index + 1}" ${Number(settings.meetingDay) === index + 1 ? "selected" : ""}>${day}</option>`).join("")}</select></label><label>Meeting time<input type="time" name="meetingTime" value="${escapeHtml(settings.meetingTime || "09:00")}"></label><label>Team areas<input name="teamAreas" value="${escapeHtml((settings.teamAreas || []).join(", "))}" placeholder="Operations, Customer, Leadership"></label><div class="form-two-col"><label>Facilitator area<input name="facilitatorArea" value="${escapeHtml(settings.facilitatorArea || "")}"></label><label>Scribe area<input name="scribeArea" value="${escapeHtml(settings.scribeArea || "")}"></label></div><label>Meeting rating target<input type="number" name="ratingTarget" min="1" max="10" value="${escapeHtml(settings.ratingTarget || 8)}"></label><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Cancel</button><button type="submit" class="primary-action">Save setup</button></div></form></dialog>`;
  }
  function createL10MeetingDetailDialog(meeting = {}) {
    const todoList = (meeting.todos || []).map((todo) => `<li>${todo.status === "done" ? "\u2713" : "\u25CB"} ${escapeHtml(todo.title)} \xB7 ${escapeHtml(todo.area || "Team area")} \xB7 due ${escapeHtml(todo.dueDate || "Not set")}</li>`).join("");
    const headlineList = (meeting.headlines || []).map((headline) => `<li><strong>${escapeHtml(headline.type)}</strong> \xB7 ${escapeHtml(headline.text)}</li>`).join("");
    const messages = (meeting.cascadingMessages || []).map((message) => `<li>${escapeHtml(message)}</li>`).join("");
    return `<dialog id="l10-history-${escapeHtml(meeting.id)}" class="modal l10-detail-dialog" aria-labelledby="l10-detail-title-${escapeHtml(meeting.id)}"><div class="modal__header"><div><p class="eyebrow">Previous L10 meeting</p><h2 id="l10-detail-title-${escapeHtml(meeting.id)}">${escapeHtml(meeting.weekStart || "Meeting details")}</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close meeting details">\xD7</button></div><div class="modal__body l10-detail-body"><div class="l10-detail-summary"><span>Week ending</span><strong>${escapeHtml(meeting.weekEnd || "Not recorded")}</strong><span>Rating</span><strong>${escapeHtml(meeting.rating || "Not rated")} / 10</strong></div><section><h3>Segue</h3><p><strong>Leadership best:</strong> ${escapeHtml(meeting.segue?.leadershipBest || "Not recorded")}</p><p><strong>Business/customer/community best:</strong> ${escapeHtml(meeting.segue?.businessBest || "Not recorded")}</p></section><section><h3>Headlines</h3><ul>${headlineList || "<li>None recorded.</li>"}</ul></section><section><h3>To-Dos</h3><ul>${todoList || "<li>None recorded.</li>"}</ul></section><section><h3>Cascading messages</h3><ul>${messages || "<li>None recorded.</li>"}</ul></section><section><h3>Meeting improvement</h3><p>${escapeHtml(meeting.meetingImprovement || "None recorded.")}</p></section><div class="modal__actions"><button type="button" class="secondary-action" data-print-l10-history="${escapeHtml(meeting.id)}">Print meeting</button><button type="button" class="primary-action" data-close-dialog>Done</button></div></div></dialog>`;
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
    const completed = state.completedTopicIds?.includes(topic.id);
    return `<article class="playbook-card ${completed ? "playbook-card--completed" : ""}"><div class="playbook-card__top"><span class="work-type">${escapeHtml(topic.group)}</span><div class="playbook-card__badges">${saved ? '<span class="status-chip status-chip--success">Saved</span>' : ""}${completed ? '<span class="status-chip status-chip--success">Completed</span>' : ""}</div></div><h3>${escapeHtml(topic.title)}</h3><p>${escapeHtml(topic.summary)}</p><div class="playbook-card__actions"><button type="button" class="secondary-action" data-open-playbook-topic="${topic.id}">Open guidance <span aria-hidden="true">\u2192</span></button><button type="button" class="playbook-complete" data-playbook-complete="${topic.id}" aria-pressed="${completed}" aria-label="${completed ? "Mark skill incomplete" : "Mark skill complete"}"><span aria-hidden="true">${completed ? "\u2713" : "\u25CB"}</span>${completed ? "Completed" : "Complete skill"}</button></div></article>`;
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
    const completedTopics = (state.completedTopicIds || []).map(playbookTopicById).filter(Boolean);
    const groupButtons = groups.map((name) => `<button type="button" class="work-filter ${group === name ? "work-filter--active" : ""}" data-playbook-group="${escapeHtml(name)}" aria-pressed="${group === name}">${escapeHtml(name)}</button>`).join("");
    const smallSection = (label, items) => `<section class="playbook-section playbook-section--compact"><div class="section-heading"><div><p class="eyebrow">${label}</p><h2>${label}</h2></div><span class="section-count">${items.length}</span></div>${items.length ? `<div class="playbook-grid">${items.slice(0, 4).map((topic) => playbookTopicCard(topic, state)).join("")}</div>` : '<div class="section-empty"><span aria-hidden="true">\u2014</span><p>No topics here yet.</p></div>'}</section>`;
    const content = matching.length ? `<div class="playbook-grid">${matching.map((topic) => playbookTopicCard(topic, state)).join("")}</div>` : `<div class="section-empty"><span aria-hidden="true">\u2014</span><p>No guidance matches \u201C${escapeHtml(query)}\u201D. Try a simpler phrase.</p></div>`;
    return `<section class="playbook-command" aria-labelledby="playbook-title"><div class="work-intro"><div><p class="eyebrow">Guidance when it matters</p><h2 id="playbook-title">Lead with a clear next move.</h2><p class="secondary-text">Short, practical guidance for the moments that shape the day. Everything is available offline.</p></div></div><label class="playbook-search">Search the Playbook<input type="search" data-playbook-search value="${escapeHtml(query)}" placeholder="Try \u201Crisk\u201D, \u201Cdelegate\u201D, or \u201Cweekly review\u201D" autocomplete="off"></label><div class="work-filters playbook-filters" role="group" aria-label="Playbook topic groups">${groupButtons}</div>${smallSection("Saved topics", savedTopics)}${smallSection("Recently viewed", recentTopics)}${smallSection("Completed skills", completedTopics)}<section class="playbook-section" aria-labelledby="all-playbook-topics"><div class="section-heading"><div><p class="eyebrow">Topic groups</p><h2 id="all-playbook-topics">${normalizedQuery ? "Search results" : group}</h2></div><span class="section-count">${matching.length}</span></div>${content}</section></section>`;
  }
  function createPlaybookDialog(topic, saved = false, completed = false) {
    if (!topic) return "";
    return `<dialog id="playbook-detail" class="modal playbook-dialog" aria-labelledby="playbook-detail-title"><div class="modal__header"><div><p class="eyebrow">${escapeHtml(topic.group)}</p><h2 id="playbook-detail-title">${escapeHtml(topic.title)}</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close guidance">\xD7</button></div><div class="modal__body playbook-detail"><p class="secondary-text">${escapeHtml(topic.summary)}</p><dl><div><dt>When to use it</dt><dd>${escapeHtml(topic.when)}</dd></div><div><dt>What to do</dt><dd>${escapeHtml(topic.what)}</dd></div><div><dt>What to say</dt><dd>${escapeHtml(topic.say)}</dd></div><div><dt>What to avoid</dt><dd>${escapeHtml(topic.avoid)}</dd></div><div><dt>What success looks like</dt><dd>${escapeHtml(topic.success)}</dd></div></dl><div class="modal__actions"><button type="button" class="secondary-action" data-playbook-save="${topic.id}">${saved ? "Remove from saved" : "Save topic"}</button><button type="button" class="playbook-complete" data-playbook-complete="${topic.id}" aria-pressed="${completed}"><span aria-hidden="true">${completed ? "\u2713" : "\u25CB"}</span>${completed ? "Completed" : "Mark complete"}</button><button type="button" class="primary-action" data-close-dialog>Done</button></div></div></dialog>`;
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
      ([key, label, icon]) => `<a class="nav-item ${className}" data-mobile-menu-link href="#${key}" ${currentKey === key ? 'aria-current="page"' : ""}><span class="nav-item__icon" aria-hidden="true">${icon}</span><span>${label}</span></a>`
    ).join("");
    return `${items}${currentKey === "review" ? '<a class="nav-item nav-item--subtle" href="#review/weekly"><span class="nav-item__icon" aria-hidden="true">\u21B3</span><span>Weekly review</span></a><a class="nav-item nav-item--subtle" href="#review/l10"><span class="nav-item__icon" aria-hidden="true">\u21B3</span><span>L10 meeting</span></a>' : ""}`;
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
      <div class="settings-actions"><button type="button" class="secondary-action settings-data-button" data-open-data>Data</button><button type="button" class="secondary-action" data-reset-onboarding>Restart onboarding</button></div>
    </div>
  </dialog>`;
  }
  function createDataDialog(snapshots = []) {
    const snapshotList = snapshots.length ? snapshots.map((snapshot) => `<li><span><strong>${escapeHtml(new Intl.DateTimeFormat(void 0, { dateStyle: "medium", timeStyle: "short" }).format(new Date(snapshot.createdAt)))}</strong><small>${escapeHtml(snapshot.snapshotType)} snapshot \xB7 ${snapshot.recordCount || 0} records</small></span><div class="snapshot-actions"><button type="button" class="text-button" data-restore-snapshot="${escapeHtml(snapshot.id)}">Restore</button><button type="button" class="icon-button snapshot-delete" data-delete-snapshot="${escapeHtml(snapshot.id)}" aria-label="Delete ${escapeHtml(snapshot.snapshotType)} snapshot" title="Delete snapshot"><svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg></button></div></li>`).join("") : '<li class="section-empty"><span aria-hidden="true">\u2014</span><p>No local snapshots yet.</p></li>';
    return `<dialog id="data-dialog" class="modal data-dialog" aria-labelledby="data-title"><div class="modal__header"><div><p class="eyebrow">Settings \xB7 Data</p><h2 id="data-title">Protect your workspace.</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close data settings">\xD7</button></div><div class="modal__body data-manager"><p class="secondary-text">Backups, restores, and imports happen locally. Nothing is uploaded.</p><section class="data-section"><h3>JSON backup</h3><p>Export everything needed to rebuild this workspace on another device.</p><button type="button" class="primary-action" data-export-backup>Export backup</button><label class="file-picker">Restore backup<input type="file" accept="application/json,.json" data-restore-file></label><div class="restore-preview" data-restore-preview hidden></div></section><section class="data-section"><h3>CSV tools</h3><div class="form-two-col"><label>Dataset<select data-csv-type><option value="priorities">Priorities</option><option value="risks">Risks</option><option value="decisions">Decisions</option><option value="followUps">Follow-ups</option><option value="improvements">Improvements</option><option value="l10ScorecardMetrics">L10 Scorecard metrics</option><option value="l10ScorecardEntries">L10 Scorecard entries</option><option value="l10Rocks">L10 Rocks</option><option value="l10Issues">L10 Issues</option><option value="l10Todos">L10 To-Dos</option><option value="l10Meetings">L10 meetings</option><option value="dailySummaries">Daily summaries</option><option value="weeklySummaries">Weekly summaries</option></select></label><div class="data-actions"><button type="button" class="secondary-action" data-export-csv>Export CSV</button><button type="button" class="text-button" data-download-csv-template>Download template</button></div></div><label class="file-picker">Import CSV<input type="file" accept="text/csv,.csv" data-csv-file></label><div class="csv-preview" data-csv-preview hidden></div></section><section class="data-section"><h3>Local snapshots</h3><p>Automatic daily and weekly snapshots rotate on this device.</p><ul class="history-list snapshot-list">${snapshotList}</ul></section><section class="data-section data-danger"><h3>Delete all data</h3><p>This removes workspace records and cannot be undone. Export a backup first.</p><button type="button" class="primary-action destructive-action" data-delete-all-data>Delete all data</button></section><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Done</button></div></div></dialog>`;
  }
  function createResetOnboardingDialog() {
    return `<dialog id="reset-onboarding-dialog" class="modal reset-onboarding-dialog" aria-labelledby="reset-onboarding-title"><div class="modal__header"><div><p class="eyebrow">Settings \xB7 Onboarding</p><h2 id="reset-onboarding-title">Restart onboarding?</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close restart onboarding dialog">\xD7</button></div><div class="modal__body"><div class="snapshot-warning"><span class="snapshot-warning__icon" aria-hidden="true">\u21BB</span><div><strong>Your setup answers will be cleared.</strong><p>Your existing priorities, work items, reviews, improvements, L10 records, and journey progress will remain on this device.</p></div></div><p class="secondary-text">You will return to the Welcome screen and can complete the setup again with a different leadership context.</p><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Cancel</button><button type="button" class="primary-action" data-reset-onboarding-confirm>Restart onboarding</button></div></div></dialog>`;
  }
  function createDeleteAllDataDialog() {
    return `<dialog id="delete-all-data-dialog" class="modal delete-all-data-dialog" aria-labelledby="delete-all-data-title"><div class="modal__header"><div><p class="eyebrow">Settings \xB7 Data</p><h2 id="delete-all-data-title">Delete all workspace data?</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close delete all data dialog">\xD7</button></div><div class="modal__body"><div class="danger-warning"><span class="danger-warning__icon" aria-hidden="true">!</span><div><strong>This action is permanent.</strong><p>All priorities, work items, reviews, improvements, journey progress, L10 records, playbook progress, schedules, and local snapshots will be removed from this device.</p></div></div><p class="secondary-text">Export a JSON backup first if you may need to recover this workspace later.</p><div class="modal__actions delete-all-data-actions"><button type="button" class="secondary-action" data-delete-all-export>Export backup first</button><button type="button" class="secondary-action" data-close-dialog>Cancel</button></div><label class="delete-confirmation-field">Type <strong>DELETE ALL DATA</strong> to confirm<input type="text" data-delete-all-phrase autocomplete="off" spellcheck="false" placeholder="DELETE ALL DATA"></label><div class="modal__actions"><button type="button" class="primary-action destructive-action" data-delete-all-confirm>Delete all data</button></div></div></dialog>`;
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
    return `<div class="app-layout ${["eod", "huddle"].includes(route.key) ? `app-layout--${route.key}` : ""} ">
    <header class="top-header" aria-label="Application header"><a class="brand" href="#today" aria-label="TalentisOS home"><span class="brand-mark" aria-hidden="true">T</span><span class="brand-wordmark">Talentis<span>OS</span></span></a><nav class="top-nav" aria-label="Primary navigation">${navItems(route.key, "top-nav__links")}</nav><div class="top-header__actions">${["review", "playbook"].includes(route.key) ? "" : `<button class="primary-action top-header__cta" type="button" data-primary-action>${route.action}<span aria-hidden="true">\u2192</span></button>`}<button class="secondary-action top-header__settings" type="button" data-open-settings>Settings</button><button class="icon-button menu-toggle" type="button" data-mobile-menu-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="Open navigation menu"><span aria-hidden="true">\u2630</span></button></div></header>
    <div class="mobile-menu-backdrop" data-close-mobile-menu></div><aside id="mobile-menu" class="mobile-menu" aria-label="Mobile navigation" aria-hidden="true"><div class="mobile-menu__header"><span class="eyebrow">Workspace</span><button class="icon-button" type="button" data-close-mobile-menu aria-label="Close navigation menu">\xD7</button></div><nav>${navItems(route.key, "mobile-menu__link")}</nav><button class="nav-item mobile-menu__settings" type="button" data-open-settings data-close-mobile-menu><span class="nav-item__icon" aria-hidden="true">\u2699</span><span>Settings</span></button></aside>
    <main id="main-content" class="content-area"><div class="content-inner"><header class="page-header"><div><p class="eyebrow">${route.eyebrow}</p><h1>${route.label}</h1></div><div class="page-header__meta"><span class="date-label">${new Intl.DateTimeFormat(void 0, { weekday: "long", month: "long", day: "numeric" }).format(/* @__PURE__ */ new Date())}</span><span class="status-dot" aria-label="Offline-ready shell"></span></div></header><div id="view-root"></div></div></main>
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
  var DB_VERSION = 11;
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
    journeyState: "journeyState",
    l10Settings: "l10Settings",
    l10ScorecardMetrics: "l10ScorecardMetrics",
    l10ScorecardEntries: "l10ScorecardEntries",
    l10Rocks: "l10Rocks",
    l10Issues: "l10Issues",
    l10Meetings: "l10Meetings",
    meetingSchedules: "meetingSchedules",
    eodRecords: "eodRecords",
    huddleItems: "huddleItems",
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
        if (!database2.objectStoreNames.contains(stores.journeyState)) {
          database2.createObjectStore(stores.journeyState, { keyPath: "id" });
        }
        if (!database2.objectStoreNames.contains(stores.l10Settings)) database2.createObjectStore(stores.l10Settings, { keyPath: "id" });
        if (!database2.objectStoreNames.contains(stores.l10ScorecardMetrics)) database2.createObjectStore(stores.l10ScorecardMetrics, { keyPath: "id" });
        if (!database2.objectStoreNames.contains(stores.l10ScorecardEntries)) {
          const entries = database2.createObjectStore(stores.l10ScorecardEntries, { keyPath: "id" });
          entries.createIndex("weekStart", "weekStart");
          entries.createIndex("metricId", "metricId");
        }
        if (!database2.objectStoreNames.contains(stores.l10Rocks)) database2.createObjectStore(stores.l10Rocks, { keyPath: "id" });
        if (!database2.objectStoreNames.contains(stores.l10Issues)) database2.createObjectStore(stores.l10Issues, { keyPath: "id" });
        if (!database2.objectStoreNames.contains(stores.l10Meetings)) {
          const meetings = database2.createObjectStore(stores.l10Meetings, { keyPath: "id" });
          meetings.createIndex("weekStart", "weekStart");
        }
        if (!database2.objectStoreNames.contains(stores.meetingSchedules)) {
          const schedules = database2.createObjectStore(stores.meetingSchedules, { keyPath: "id" });
          schedules.createIndex("nextDate", "nextDate");
          schedules.createIndex("active", "active");
        }
        if (!database2.objectStoreNames.contains(stores.backupSnapshots)) {
          const snapshots = database2.createObjectStore(stores.backupSnapshots, { keyPath: "id" });
          snapshots.createIndex("snapshotType", "snapshotType");
          snapshots.createIndex("createdAt", "createdAt");
        }
        if (!database2.objectStoreNames.contains(stores.eodRecords)) {
          const eodRecords = database2.createObjectStore(stores.eodRecords, { keyPath: "id" });
          eodRecords.createIndex("date", "date");
          eodRecords.createIndex("status", "status");
        }
        if (!database2.objectStoreNames.contains(stores.huddleItems)) {
          const huddleItems = database2.createObjectStore(stores.huddleItems, { keyPath: "id" });
          huddleItems.createIndex("huddleDate", "huddleDate");
          huddleItems.createIndex("itemId", "itemId");
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
      welcomeSeen: false,
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
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const completedAt = priority.status === "done" ? priority.completedAt || now : "";
    return putRecord(database2, stores.priorities, {
      ...priority,
      raisedDate: priority.raisedDate || priority.createdAt?.slice(0, 10) || todayKey(),
      createdAt: priority.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
      completedAt,
      completedDate: completedAt ? completedAt.slice(0, 10) : "",
      updatedAt: now
    });
  }
  async function getWorkItems(database2) {
    return getAll(database2, stores.workItems);
  }
  async function getAllPriorities(database2) {
    return getAll(database2, stores.priorities);
  }
  async function saveWorkItem(database2, workItem) {
    const existing = await getRecord(database2, stores.workItems, workItem.id);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const createdAt = workItem.createdAt || existing?.createdAt || now;
    const raisedDate = workItem.raisedDate || existing?.raisedDate || createdAt.slice(0, 10);
    const history = [...existing?.movementHistory || workItem.movementHistory || []];
    const addHistory = (action, from = "", to = "", note = "") => history.push({ id: crypto.randomUUID(), timestamp: now, date: now.slice(0, 10), action, from, to, note });
    if (!existing) addHistory(workItem.type === "risk" ? "Risk Raised" : "Created", workItem.source || "Work", workItem.source || "Work");
    if (existing && existing.status !== "complete" && workItem.status === "complete") addHistory("Completed", existing.status, "complete");
    if (existing && existing.status === "complete" && workItem.status !== "complete") addHistory("Reopened", "complete", workItem.status || "in-progress");
    let completedAt = workItem.completedAt ?? existing?.completedAt ?? "";
    let completedDate = workItem.completedDate ?? existing?.completedDate ?? "";
    if (workItem.status === "complete" && !completedAt) {
      completedAt = now;
      completedDate = now.slice(0, 10);
    }
    if (existing?.status === "complete" && workItem.status !== "complete") {
      completedAt = "";
      completedDate = "";
    }
    const subtasks = (workItem.subtasks || existing?.subtasks || []).map((subtask) => {
      const previous = (existing?.subtasks || []).find((item) => item.id === subtask.id || item.title === subtask.title);
      const subtaskCreatedAt = subtask.createdAt || previous?.createdAt || now;
      const subtaskRaisedDate = subtask.raisedDate || previous?.raisedDate || subtaskCreatedAt.slice(0, 10);
      const subtaskHistory = [...previous?.movementHistory || subtask.movementHistory || []];
      if (!previous) subtaskHistory.push({ id: crypto.randomUUID(), timestamp: now, date: now.slice(0, 10), action: "Created", from: "Work", to: "Work" });
      if (previous && !previous.completed && subtask.completed) subtaskHistory.push({ id: crypto.randomUUID(), timestamp: now, date: now.slice(0, 10), action: "Completed", from: "open", to: "complete" });
      if (previous?.completed && !subtask.completed) subtaskHistory.push({ id: crypto.randomUUID(), timestamp: now, date: now.slice(0, 10), action: "Reopened", from: "complete", to: "open" });
      const subtaskCompletedAt = subtask.completed ? subtask.completedAt || previous?.completedAt || now : "";
      return { ...subtask, id: subtask.id || crypto.randomUUID(), createdAt: subtaskCreatedAt, raisedDate: subtaskRaisedDate, completedAt: subtaskCompletedAt, completedDate: subtaskCompletedAt ? subtaskCompletedAt.slice(0, 10) : "", movementHistory: subtaskHistory };
    });
    return putRecord(database2, stores.workItems, {
      ...workItem,
      createdAt,
      raisedDate,
      updatedAt: now,
      completedAt,
      completedDate,
      movementHistory: history,
      subtasks
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
    return existing || { id: "primary", savedTopicIds: [], recentTopicIds: [], completedTopicIds: [] };
  }
  async function savePlaybookState(database2, state) {
    return putRecord(database2, stores.playbookState, {
      id: "primary",
      savedTopicIds: state.savedTopicIds || [],
      recentTopicIds: state.recentTopicIds || [],
      completedTopicIds: state.completedTopicIds || [],
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  async function getJourneyState(database2) {
    const existing = await getRecord(database2, stores.journeyState, "primary");
    return existing || { id: "primary", startedAt: null, completedMilestoneIds: [], completedAt: {}, meetingPreparation: {} };
  }
  async function saveJourneyState(database2, state) {
    const next = {
      id: "primary",
      startedAt: state.startedAt || (/* @__PURE__ */ new Date()).toISOString(),
      completedMilestoneIds: state.completedMilestoneIds || [],
      completedAt: state.completedAt || {},
      meetingPreparation: state.meetingPreparation || {},
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    await putRecord(database2, stores.journeyState, next);
    return next;
  }
  async function getL10Settings(database2) {
    return await getRecord(database2, stores.l10Settings, "primary") || { id: "primary", meetingDay: 1, meetingTime: "09:00", durationMinutes: 90, teamAreas: [], facilitatorArea: "", scribeArea: "", ratingTarget: 8 };
  }
  async function getL10Meeting(database2, weekStart) {
    return getRecord(database2, stores.l10Meetings, `l10-${weekStart}`);
  }
  async function getL10Meetings(database2) {
    return getAll(database2, stores.l10Meetings);
  }
  async function getL10Collection(database2, storeName) {
    return getAll(database2, stores[storeName]);
  }
  async function saveL10Record(database2, storeName, record) {
    const next = { ...record, updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
    await putRecord(database2, stores[storeName], next);
    return next;
  }
  async function getMeetingSchedules(database2) {
    return getAll(database2, stores.meetingSchedules);
  }
  async function saveMeetingSchedule(database2, schedule) {
    return putRecord(database2, stores.meetingSchedules, { ...schedule, updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
  }
  async function deleteMeetingSchedule(database2, id) {
    return deleteRecord(database2, stores.meetingSchedules, id);
  }
  async function getEodRecord(database2, date) {
    return await getRecord(database2, stores.eodRecords, `eod-${date}`) || null;
  }
  async function getEodRecords(database2) {
    return (await getAll(database2, stores.eodRecords)).sort((a, b) => b.date.localeCompare(a.date));
  }
  async function saveEodRecord(database2, record) {
    return putRecord(database2, stores.eodRecords, { ...record, updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
  }
  async function getHuddleItems(database2, huddleDate = null) {
    const records = await getAll(database2, stores.huddleItems);
    return huddleDate ? records.filter((item) => item.huddleDate === huddleDate) : records;
  }
  async function saveHuddleItem(database2, item) {
    return putRecord(database2, stores.huddleItems, { ...item, updatedAt: (/* @__PURE__ */ new Date()).toISOString() });
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
    "completedPlaybookTopics",
    "journeyState",
    "l10Settings",
    "l10ScorecardMetrics",
    "l10ScorecardEntries",
    "l10Rocks",
    "l10Issues",
    "l10Meetings",
    "meetingSchedules",
    "eodRecords",
    "huddleItems",
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
    if (input.format === "TalentisOS workspace backup" && input.exportVersion === EXPORT_FORMAT_VERSION) return createBackup(input.data || {}, input.exportedAt || (/* @__PURE__ */ new Date()).toISOString());
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
      playbookState: [{ id: "primary", savedTopicIds: data.savedPlaybookTopics || [], completedTopicIds: data.completedPlaybookTopics || [], recentTopicIds: [] }],
      journeyState: data.journeyState || [],
      l10Settings: data.l10Settings || [],
      l10ScorecardMetrics: data.l10ScorecardMetrics || [],
      l10ScorecardEntries: data.l10ScorecardEntries || [],
      l10Rocks: data.l10Rocks || [],
      l10Issues: data.l10Issues || [],
      l10Meetings: data.l10Meetings || [],
      meetingSchedules: data.meetingSchedules || [],
      eodRecords: data.eodRecords || [],
      huddleItems: data.huddleItems || [],
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
    improvements: { required: ["notWorking", "change"], columns: ["id", "notWorking", "change", "why", "nextStep", "category", "status", "createdAt"] },
    l10ScorecardMetrics: { required: ["name", "weeklyGoal"], columns: ["id", "name", "area", "direction", "weeklyGoal", "active", "order"] },
    l10ScorecardEntries: { required: ["metricId", "weekStart", "goal", "actual"], columns: ["id", "metricId", "weekStart", "goal", "actual", "status", "note"] },
    l10Rocks: { required: ["outcome"], columns: ["id", "quarter", "outcome", "area", "dueDate", "status"] },
    l10Issues: { required: ["title"], columns: ["id", "source", "title", "area", "priorityOrder", "identify", "discuss", "solve", "status", "createdAt", "solvedAt"] },
    l10Todos: { required: ["title"], columns: ["id", "meetingId", "title", "area", "dueDate", "status"] },
    l10Meetings: { required: ["weekStart"], columns: ["id", "weekStart", "weekEnd", "meetingAt", "rating", "completedAt", "meetingImprovement"] }
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
      for (const column of ["planDate", "weekStart", "dueDate", "createdAt"]) {
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
  var currentL10Meeting;
  var currentMeetingSchedules = [];
  var currentEodFilter = "all";
  var currentHuddleDate = "";
  var addNewItemToHuddle = false;
  var huddleDialogShownDate = "";
  var currentImprovements = [];
  var currentPlaybookState = { savedTopicIds: [], recentTopicIds: [] };
  var currentJourneyState = { id: "primary", completedMilestoneIds: [], meetingPreparation: {} };
  var selectedJourneyMilestoneId = "";
  var currentPlaybookQuery = "";
  var currentPlaybookGroup = "All topics";
  var currentSnapshots = [];
  var pendingRestore = null;
  var pendingCsvImport = null;
  var updateRequested = false;
  var autosaveTimer;
  var lastUndo;
  var l10TimerInterval;
  var journeyTouchStartX = null;
  function stopL10Timer() {
    window.clearInterval(l10TimerInterval);
    l10TimerInterval = void 0;
  }
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
      return localStorage.getItem("talentisos-theme") || "dark";
    } catch {
      return "dark";
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
    const huddleItems = await read(stores.huddleItems);
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
      huddleItems,
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
    if (type === "l10Todos") return data.l10Meetings.flatMap((meeting) => (meeting.todos || []).map((todo) => ({ ...todo, meetingId: meeting.id })));
    if (type === "l10Meetings") return data.l10Meetings.map((meeting) => ({ id: meeting.id, weekStart: meeting.weekStart, weekEnd: meeting.weekEnd || "", meetingAt: meeting.meetingAt, rating: meeting.rating || "", completedAt: meeting.completedAt || "", meetingImprovement: meeting.meetingImprovement || "" }));
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
    stopL10Timer();
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
      const todayReferences = (await getHuddleItems(database)).filter((ref) => ref.targetView === "Today" && ref.targetDate === currentPlan.date && ref.status !== "removed");
      currentJourneyState = await getJourneyState(database);
      currentMeetingSchedules = await getMeetingSchedules(database);
      await importPreparedPlanIfNeeded();
      const action = currentPriorities.length < 3 ? "Add a priority" : "Review priorities";
      app.innerHTML = createAppShell({ ...route, action });
      document.querySelector("#view-root").innerHTML = createTodayView(
        currentPlan,
        currentPriorities,
        currentWorkItems,
        todayReferences
      );
      document.querySelector("#view-root").insertAdjacentHTML("afterbegin", `${createMeetingScheduleCard(currentMeetingSchedules)}<section class="journey-today-card" aria-labelledby="journey-today-title"><div><p class="eyebrow">Your journey</p><h2 id="journey-today-title">Continue your first 90 days</h2><p class="secondary-text">Your next leadership milestone is ready.</p></div><a class="secondary-action" href="#journey">Open journey <span aria-hidden="true">\u2192</span></a></section>${createMeetingScheduleDialog(currentMeetingSchedules)}`);
      document.title = "Today \u2014 TalentisOS";
    } else if (route.key === "journey") {
      currentJourneyState = await getJourneyState(database);
      app.innerHTML = createAppShell(route);
      document.querySelector("#view-root").innerHTML = createJourneyView(currentJourneyState, selectedJourneyMilestoneId) + createMeetingBuilderDialog(currentJourneyState);
      document.title = "Journey \u2014 TalentisOS";
    } else if (route.key === "huddle") {
      const today = dateOnly();
      const prepared = await prepareTodayHuddle(today);
      const allHuddleItems = prepared.allRefs;
      const availableDates = [...new Set(allHuddleItems.filter((item) => item.status !== "removed" && item.huddleDate).map((item) => item.huddleDate))].sort();
      const huddleDate = currentHuddleDate || today;
      currentHuddleDate = huddleDate;
      const huddleItems = allHuddleItems.filter((item) => item.huddleDate === huddleDate && item.status !== "removed");
      currentWorkItems = prepared.workItems;
      app.innerHTML = createAppShell(route);
      document.querySelector("#view-root").innerHTML = createHuddleView(huddleDate, currentWorkItems, huddleItems, availableDates);
      const openItems = huddleItems.filter((ref) => currentWorkItems.some((item) => item.id === ref.itemId && item.status !== "complete"));
      if (openItems.length && huddleDialogShownDate !== huddleDate) {
        document.body.insertAdjacentHTML("beforeend", createHuddleMeetingDialog(huddleDate, currentWorkItems, huddleItems));
        document.querySelector("#morning-huddle-dialog")?.showModal();
        huddleDialogShownDate = today;
      }
      document.title = "Morning Huddle \u2014 TalentisOS";
    } else if (route.key === "eod") {
      const eodDate = dateOnly();
      const existingEod = await getEodRecord(database, eodDate);
      const eod = existingEod || { id: `eod-${eodDate}`, date: eodDate, status: "not-started", step: 0, completedTaskIds: [], outstandingTaskIds: [], riskIds: [], tomorrowPriorityIds: [], tomorrowNote: "", handoverNote: "", createdAt: (/* @__PURE__ */ new Date()).toISOString() };
      const eodHistory = await getEodRecords(database);
      currentWorkItems = await getWorkItems(database);
      app.innerHTML = createAppShell(route);
      document.querySelector("#view-root").innerHTML = createEodView({ eod, date: eodDate, workItems: currentWorkItems, history: eodHistory, filter: currentEodFilter });
      document.title = "End of Day \u2014 TalentisOS";
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
      if (route.subroute === "l10") {
        const weekStart = l10WeekStart(/* @__PURE__ */ new Date());
        const l10Settings = await getL10Settings(database);
        currentL10Meeting = await getL10Meeting(database, weekStart) || defaultL10Meeting(weekStart);
        const l10Data = {
          settings: l10Settings,
          meeting: currentL10Meeting,
          metrics: await getL10Collection(database, "l10ScorecardMetrics"),
          entries: await getL10Collection(database, "l10ScorecardEntries"),
          rocks: await getL10Collection(database, "l10Rocks"),
          issues: await getL10Collection(database, "l10Issues"),
          history: await getL10Meetings(database),
          weekStart
        };
        app.innerHTML = createAppShell({ ...route, label: "Review", action: "Finish Day" });
        document.querySelector("#view-root").innerHTML = createL10View(l10Data) + l10Data.history.map((item) => createL10MeetingDetailDialog(item)).join("") + createL10IssueDialog() + createL10SettingsDialog(l10Settings) + createImprovementSheet();
        document.querySelector("#view-root").insertAdjacentHTML("afterbegin", '<button type="button" class="secondary-action l10-settings-trigger" data-open-l10-settings>Meeting setup</button>');
        const activeSection = document.querySelector(".l10-active-section");
        document.querySelector(".l10-intro")?.insertAdjacentHTML("beforeend", `<form class="l10-week-form" data-l10-week-form><label>Week ending<input type="date" name="weekEnd" value="${escapeHtml(currentL10Meeting.weekEnd || l10WeekEnd(weekStart))}" required></label><button class="secondary-action" type="submit">Save date</button></form>`);
        const timerSeconds = l10RemainingSeconds(currentL10Meeting, currentL10Meeting.currentSection);
        activeSection?.querySelector("h2")?.insertAdjacentHTML("afterend", `<div class="l10-timer" aria-live="polite"><strong data-l10-timer>${String(Math.floor(timerSeconds / 60)).padStart(2, "0")}:${String(timerSeconds % 60).padStart(2, "0")}</strong><button type="button" class="secondary-action" data-l10-timer-toggle>${currentL10Meeting.timer?.startedAt ? "Pause timer" : currentL10Meeting.timer?.paused ? "Resume timer" : "Start timer"}</button></div>`);
        if (currentL10Meeting.timer?.startedAt) l10TimerInterval = window.setInterval(() => {
          const seconds = l10RemainingSeconds(currentL10Meeting, currentL10Meeting.currentSection);
          const timer = document.querySelector("[data-l10-timer]");
          if (timer) timer.textContent = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
        }, 1e3);
        document.title = "L10 Meeting \u2014 TalentisOS";
      } else if (route.subroute === "weekly") {
        const weekStart = startOfWeek(/* @__PURE__ */ new Date());
        currentWeeklyReview = await getWeeklyReview(database, weekStart);
        const l10MeetingForWeek = await getL10Meeting(database, weekStart);
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
        if (l10MeetingForWeek) document.querySelector("#view-root").insertAdjacentHTML("afterbegin", `<section class="l10-weekly-link"><div><p class="eyebrow">L10 meeting connection</p><h2>${l10MeetingForWeek.completedAt ? "L10 completed" : "L10 in progress"}</h2><p class="secondary-text">${l10MeetingForWeek.todos?.filter((todo) => todo.status === "done").length || 0} To-Dos complete \xB7 ${l10MeetingForWeek.issueIds?.length || 0} linked Issues \xB7 Rating ${escapeHtml(l10MeetingForWeek.rating || "Not rated")}</p></div><a class="secondary-action" href="#review/l10">Open L10 meeting <span aria-hidden="true">\u2192</span></a></section>`);
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
    app.insertAdjacentHTML("beforeend", createPlaybookDialog(topic, currentPlaybookState.savedTopicIds?.includes(topic.id), currentPlaybookState.completedTopicIds?.includes(topic.id)));
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
    const subtaskTitles = values.subtasksText == null ? null : values.subtasksText.split("\n").map((title) => title.trim()).filter(Boolean);
    const subtasks = subtaskTitles == null ? existing?.subtasks || [] : subtaskTitles.map((title) => {
      const previous = (existing?.subtasks || []).find((subtask) => subtask.title === title);
      return previous || { id: crypto.randomUUID(), title, completed: false, createdAt: (/* @__PURE__ */ new Date()).toISOString() };
    });
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
      ...subtaskTitles == null ? {} : { subtasks },
      whatAtRisk: values.whatAtRisk?.trim() || "",
      impact: values.impact?.trim() || "",
      immediateAction: values.immediateAction?.trim() || "",
      required: values.required?.trim() || "",
      reviewDate: values.reviewDate || "",
      escalationRequired: checkbox?.checked || false,
      blocked: form.elements.blocked?.checked || false,
      blockerNote: values.blockerNote?.trim() || "",
      waitingOn: values.waitingOn?.trim() || "",
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
  async function addTasksToHuddle(items, huddleDate, sourceView = "EOD", action = sourceView === "EOD" ? "Carried Forward" : "Added to Huddle") {
    const existingRefs = await getHuddleItems(database, huddleDate);
    const existingKeys = new Set(existingRefs.filter((ref) => ref.status !== "removed").map((ref) => `${ref.itemType}:${ref.itemId}`));
    let added = 0;
    for (const task of items.filter((item) => item && item.status !== "complete")) {
      if (existingKeys.has(`task:${task.id}`)) continue;
      const now = (/* @__PURE__ */ new Date()).toISOString();
      await saveHuddleItem(database, { id: `huddle-${huddleDate}-task-${task.id}`, itemId: task.id, itemType: "task", sourceView, targetView: "Morning Huddle", targetDate: huddleDate, huddleDate, createdAt: now, addedAt: now, status: "active" });
      await saveWorkItem(database, { ...task, movementHistory: [...task.movementHistory || [], { id: crypto.randomUUID(), timestamp: now, date: dateOnly(), action, from: sourceView, to: "Morning Huddle", targetDate: huddleDate }] });
      added += 1;
    }
    return added;
  }
  async function prepareTodayHuddle(date) {
    const allRefs = await getHuddleItems(database);
    const todayIds = new Set(allRefs.filter((ref) => ref.huddleDate === date && ref.status !== "removed").map((ref) => ref.itemId));
    const workItems = await getWorkItems(database);
    const outstanding = allRefs.filter((ref) => ref.huddleDate < date && ref.status === "active" && ref.itemType === "task" && !todayIds.has(ref.itemId)).map((ref) => workItems.find((item) => item.id === ref.itemId)).filter((item, index, list) => item && item.status !== "complete" && list.findIndex((candidate) => candidate.id === item.id) === index);
    if (!outstanding.length) return { allRefs, workItems };
    await addTasksToHuddle(outstanding, date, "Morning Huddle", "Carried Forward");
    for (const ref of allRefs.filter((item) => item.huddleDate < date && item.status === "active" && outstanding.some((task) => task.id === item.itemId))) {
      await saveHuddleItem(database, { ...ref, status: "carried-forward", carriedToDate: date });
    }
    return { allRefs: await getHuddleItems(database), workItems: await getWorkItems(database) };
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
    if (addNewItemToHuddle && item.status !== "complete") {
      await addTasksToHuddle([item], currentHuddleDate || dateOnly(), "Morning Huddle", "Added to Huddle");
      addNewItemToHuddle = false;
    }
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
      leadershipSituation: answers.leadershipSituation,
      teamFunction: answers.workType,
      guidanceLevel: answers.guidanceLevel,
      workdayStart: answers.startTime,
      reviewTime: answers.reviewTime,
      leaderRole: answers.leaderRole,
      reportingRoles: (answers.reportingRoles || "").split("\n").map((role) => role.trim()).filter(Boolean),
      teamStructure: answers.teamStructure,
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
  document.addEventListener("touchstart", (event) => {
    if (getRoute().key === "journey" && event.touches.length === 1) journeyTouchStartX = event.touches[0].clientX;
  }, { passive: true });
  document.addEventListener("touchend", async (event) => {
    if (getRoute().key !== "journey" || journeyTouchStartX === null) return;
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
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !document.body.classList.contains("mobile-menu-open")) return;
    document.body.classList.remove("mobile-menu-open");
    document.querySelector("[data-mobile-menu-toggle]")?.setAttribute("aria-expanded", "false");
    document.querySelector("#mobile-menu")?.setAttribute("aria-hidden", "true");
  });
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
        completed: Number(onboardingForm.dataset.step) === 5,
        completionSeen: onboardingState.completionSeen || false
      });
      if (onboardingState.completed) await completeOnboarding(onboardingState.answers);
      showToast(onboardingState.completed ? "Your playbook is ready." : "Saved.");
      await render();
      return;
    }
    const eodTaskForm = event.target.closest("[data-eod-task-form]");
    if (eodTaskForm) {
      event.preventDefault();
      const values = formValues(eodTaskForm);
      const eodDate = dateOnly();
      const eod = await getEodRecord(database, eodDate) || { id: `eod-${eodDate}`, date: eodDate, status: "in-progress", step: 0, completedTaskIds: [], outstandingTaskIds: [], riskIds: [], tomorrowPriorityIds: [], tomorrowNote: "", handoverNote: "", createdAt: (/* @__PURE__ */ new Date()).toISOString() };
      const task = await saveWorkItem(database, { id: crypto.randomUUID(), type: "action", group: eod.step === 0 ? "now" : "next", title: values.title.trim(), dueDate: values.dueDate || "", priority: values.priority || "Normal", status: eod.step === 0 ? "complete" : "not-started", source: "eod", completedAt: eod.step === 0 ? (/* @__PURE__ */ new Date()).toISOString() : "", subtasks: [] });
      await saveEodRecord(database, { ...eod, status: "in-progress", completedTaskIds: eod.step === 0 ? [.../* @__PURE__ */ new Set([...eod.completedTaskIds || [], task.id])] : eod.completedTaskIds, outstandingTaskIds: eod.step === 1 ? [.../* @__PURE__ */ new Set([...eod.outstandingTaskIds || [], task.id])] : eod.outstandingTaskIds });
      showToast("Task saved locally.");
      await render();
      return;
    }
    const eodRiskForm = event.target.closest("[data-eod-risk-form]");
    if (eodRiskForm) {
      event.preventDefault();
      const values = formValues(eodRiskForm);
      const eodDate = dateOnly();
      const eod = await getEodRecord(database, eodDate) || { id: `eod-${eodDate}`, date: eodDate, status: "in-progress", step: 2, completedTaskIds: [], outstandingTaskIds: [], riskIds: [], tomorrowPriorityIds: [], tomorrowNote: "", handoverNote: "", createdAt: (/* @__PURE__ */ new Date()).toISOString() };
      const risk = await saveWorkItem(database, { id: crypto.randomUUID(), type: "risk", group: "now", title: values.title.trim(), impact: values.impact, riskLevel: values.riskLevel, nextAction: values.nextAction || "", status: "not-started", source: "eod", createdAt: (/* @__PURE__ */ new Date()).toISOString() });
      await saveEodRecord(database, { ...eod, riskIds: [.../* @__PURE__ */ new Set([...eod.riskIds || [], risk.id])] });
      showToast("Risk captured locally.");
      await render();
      return;
    }
    const huddlePickerForm = event.target.closest("[data-huddle-picker-form]");
    if (huddlePickerForm) {
      event.preventDefault();
      const values = formValues(huddlePickerForm);
      const item = currentWorkItems.find((workItem) => workItem.id === values.itemId) || (await getWorkItems(database)).find((workItem) => workItem.id === values.itemId);
      if (!item || item.status === "complete") return;
      const added = await addTasksToHuddle([item], values.huddleDate, item.source || "Work");
      if (!added) {
        showToast(`Already in the ${values.huddleDate} Huddle.`);
        huddlePickerForm.closest("dialog")?.close();
        return;
      }
      huddlePickerForm.closest("dialog")?.close();
      showToast(`Added to the ${values.huddleDate} Huddle.`);
      await render();
      return;
    }
    const eodCarryReviewForm = event.target.closest("[data-eod-carry-review-form]");
    if (eodCarryReviewForm) {
      event.preventDefault();
      const values = formValues(eodCarryReviewForm);
      const ids = new FormData(eodCarryReviewForm).getAll("itemId");
      const selected = currentWorkItems.filter((item) => ids.includes(item.id));
      const added = await addTasksToHuddle(selected, values.huddleDate, "EOD");
      const eodDate = dateOnly();
      const eod = await getEodRecord(database, eodDate);
      if (eod) await saveEodRecord(database, { ...eod, carriedForwardIds: [.../* @__PURE__ */ new Set([...eod.carriedForwardIds || [], ...selected.map((item) => item.id)])], nextHuddleDate: values.huddleDate });
      eodCarryReviewForm.closest("dialog")?.close();
      showToast(added ? `${added} item${added === 1 ? "" : "s"} added to the ${values.huddleDate} Huddle.` : "Selected items are already in that Huddle.");
      await render();
      return;
    }
    const eodHistoryEdit = event.target.closest("[data-eod-history-edit]");
    if (eodHistoryEdit) {
      event.preventDefault();
      const values = formValues(eodHistoryEdit);
      const record = (await getEodRecords(database)).find((item) => item.id === values.id);
      if (record) {
        await saveEodRecord(database, { ...record, tomorrowNote: values.tomorrowNote || "", handoverNote: values.handoverNote || "" });
        eodHistoryEdit.closest("dialog")?.close();
        showToast("EOD changes saved locally.");
        await render();
      }
      return;
    }
    const meetingForm = event.target.closest("[data-meeting-builder-form]");
    if (meetingForm) {
      event.preventDefault();
      const values = formValues(meetingForm);
      currentJourneyState = await saveJourneyState(database, { ...currentJourneyState, meetingPreparation: { purpose: values.purpose, introduction: values.introduction, questions: new FormData(meetingForm).getAll("questions"), expectations: values.expectations, close: values.close } });
      meetingForm.closest("dialog")?.close();
      showToast("Meeting plan saved locally.");
      await render();
      return;
    }
    const l10SegueForm = event.target.closest("[data-l10-segue-form]");
    if (l10SegueForm) {
      event.preventDefault();
      const values = formValues(l10SegueForm);
      currentL10Meeting = await saveL10Record(database, "l10Meetings", { ...currentL10Meeting, segue: values, sectionStatus: { ...currentL10Meeting.sectionStatus, segue: true } });
      showToast("Segue saved locally.");
      await render();
      return;
    }
    const l10ScorecardForm = event.target.closest("[data-l10-scorecard-entry-form]");
    if (l10ScorecardForm) {
      event.preventDefault();
      const values = formValues(l10ScorecardForm);
      const metric = (await getL10Collection(database, "l10ScorecardMetrics")).find((item) => item.id === values.metricId);
      await saveL10Record(database, "l10ScorecardEntries", { id: `entry-${values.metricId}-${currentL10Meeting.weekStart}`, metricId: values.metricId, weekStart: currentL10Meeting.weekStart, goal: Number(values.goal), actual: Number(values.actual), status: scorecardStatus(values.goal, values.actual, metric?.direction), note: values.note || "", addedToIssues: false });
      showToast("Scorecard number saved.");
      await render();
      return;
    }
    const l10MetricForm = event.target.closest("[data-l10-metric-form]");
    if (l10MetricForm) {
      event.preventDefault();
      const values = formValues(l10MetricForm);
      const metricId = l10MetricForm.dataset.editMetric || crypto.randomUUID();
      const existing = l10MetricForm.dataset.editMetric ? (await getL10Collection(database, "l10ScorecardMetrics")).find((item) => item.id === metricId) : {};
      await saveL10Record(database, "l10ScorecardMetrics", { ...existing, id: metricId, name: values.name, area: values.area, direction: values.direction, weeklyGoal: Number(values.weeklyGoal), active: true, order: existing.order || Date.now() });
      showToast(l10MetricForm.dataset.editMetric ? "Scorecard metric updated." : "Scorecard metric added.");
      await render();
      return;
    }
    const l10WeekForm = event.target.closest("[data-l10-week-form]");
    if (l10WeekForm) {
      event.preventDefault();
      const values = formValues(l10WeekForm);
      currentL10Meeting = await saveL10Record(database, "l10Meetings", { ...currentL10Meeting, weekEnd: values.weekEnd });
      showToast("Week ending date saved.");
      await render();
      return;
    }
    const l10SettingsForm = event.target.closest("[data-l10-settings-form]");
    if (l10SettingsForm) {
      event.preventDefault();
      const values = formValues(l10SettingsForm);
      await saveL10Record(database, "l10Settings", { id: "primary", meetingDay: Number(values.meetingDay), meetingTime: values.meetingTime, durationMinutes: 90, teamAreas: values.teamAreas.split(",").map((item) => item.trim()).filter(Boolean), facilitatorArea: values.facilitatorArea, scribeArea: values.scribeArea, ratingTarget: Number(values.ratingTarget) || 8 });
      l10SettingsForm.closest("dialog")?.close();
      showToast("L10 setup saved locally.");
      await render();
      return;
    }
    const meetingScheduleForm = event.target.closest("[data-meeting-schedule-form]");
    if (meetingScheduleForm) {
      event.preventDefault();
      const values = formValues(meetingScheduleForm);
      const scheduleId = meetingScheduleForm.dataset.editSchedule;
      const existing = scheduleId ? currentMeetingSchedules.find((schedule) => schedule.id === scheduleId) : null;
      const updatedSchedule = { ...existing || {}, id: scheduleId || crypto.randomUUID(), name: values.name.trim(), cadence: values.cadence, meetingTime: values.meetingTime, nextDate: values.nextDate, agenda: values.agenda || "", active: existing?.active !== false };
      await saveMeetingSchedule(database, updatedSchedule);
      showToast(scheduleId ? "Recurring meeting updated locally." : "Recurring meeting added locally.");
      if (scheduleId) {
        currentMeetingSchedules = currentMeetingSchedules.map((schedule) => schedule.id === scheduleId ? updatedSchedule : schedule);
        meetingScheduleForm.dataset.originalSchedule = JSON.stringify({ name: updatedSchedule.name, cadence: updatedSchedule.cadence, meetingTime: updatedSchedule.meetingTime, nextDate: updatedSchedule.nextDate, agenda: updatedSchedule.agenda });
        meetingScheduleForm.querySelector(".meeting-schedule-submit").disabled = true;
        return;
      }
      await render();
      return;
    }
    const l10RockForm = event.target.closest("[data-l10-rock-form]");
    if (l10RockForm) {
      event.preventDefault();
      const values = formValues(l10RockForm);
      await saveL10Record(database, "l10Rocks", { id: crypto.randomUUID(), outcome: values.outcome, area: values.area, dueDate: values.dueDate, status: "on-track", addedToIssues: false });
      showToast("Rock added locally.");
      await render();
      return;
    }
    const l10HeadlineForm = event.target.closest("[data-l10-headline-form]");
    if (l10HeadlineForm) {
      event.preventDefault();
      const values = formValues(l10HeadlineForm);
      currentL10Meeting = await saveL10Record(database, "l10Meetings", { ...currentL10Meeting, headlines: [...currentL10Meeting.headlines || [], { id: crypto.randomUUID(), type: values.type, area: values.area, text: values.text, concern: values.concern === "on" }] });
      showToast("Headline saved locally.");
      await render();
      return;
    }
    const l10TodoForm = event.target.closest("[data-l10-todo-form]");
    if (l10TodoForm) {
      event.preventDefault();
      const values = formValues(l10TodoForm);
      currentL10Meeting = await saveL10Record(database, "l10Meetings", { ...currentL10Meeting, todos: [...currentL10Meeting.todos || [], { id: crypto.randomUUID(), title: values.title, area: values.area, dueDate: values.dueDate, status: "not-done" }] });
      showToast("To-Do added locally.");
      await render();
      return;
    }
    const l10IssueForm = event.target.closest("[data-l10-issue-form]");
    if (l10IssueForm) {
      event.preventDefault();
      const values = formValues(l10IssueForm);
      await saveL10Record(database, "l10Issues", { id: crypto.randomUUID(), title: values.title, area: values.area, source: "manual", priorityOrder: Date.now(), status: "open", identify: "", discuss: "", solve: "", createdAt: (/* @__PURE__ */ new Date()).toISOString() });
      showToast("Issue added to IDS.");
      await render();
      return;
    }
    const l10IdsForm = event.target.closest("[data-l10-ids-form]");
    if (l10IdsForm) {
      event.preventDefault();
      const values = formValues(l10IdsForm);
      const issue = (await getL10Collection(database, "l10Issues")).find((item) => item.id === values.id);
      const savedIssue = await saveL10Record(database, "l10Issues", { ...issue, title: values.title, identify: values.identify, discuss: values.discuss, solve: values.solve, status: values.status, solvedAt: values.status === "solved" ? (/* @__PURE__ */ new Date()).toISOString() : issue?.solvedAt });
      if (values.conversion === "decision") await saveWorkItem(database, { id: crypto.randomUUID(), type: "decision", group: "next", title: savedIssue.solve || savedIssue.title, status: "required", sourceL10IssueId: savedIssue.id });
      if (values.conversion === "follow-up") await saveWorkItem(database, { id: crypto.randomUUID(), type: "follow-up", group: "next", title: savedIssue.solve || savedIssue.title, status: "not-started", sourceL10IssueId: savedIssue.id });
      if (values.conversion === "improvement") await saveImprovement(database, { id: crypto.randomUUID(), notWorking: savedIssue.title, change: savedIssue.solve, why: savedIssue.discuss, nextStep: savedIssue.solve, category: "workflow", status: "captured", sourceL10IssueId: savedIssue.id, createdAt: (/* @__PURE__ */ new Date()).toISOString() });
      if (values.conversion === "message") currentL10Meeting = await saveL10Record(database, "l10Meetings", { ...currentL10Meeting, cascadingMessages: [...currentL10Meeting.cascadingMessages || [], savedIssue.solve || savedIssue.title] });
      l10IdsForm.closest("dialog")?.close();
      showToast("IDS outcome saved.");
      await render();
      return;
    }
    const l10ConcludeForm = event.target.closest("[data-l10-conclude-form]");
    if (l10ConcludeForm) {
      event.preventDefault();
      const values = formValues(l10ConcludeForm);
      currentL10Meeting = await saveL10Record(database, "l10Meetings", { ...currentL10Meeting, rating: Number(values.rating), meetingImprovement: values.meetingImprovement, cascadingMessages: values.cascadingMessage ? [...currentL10Meeting.cascadingMessages || [], values.cascadingMessage] : currentL10Meeting.cascadingMessages, completedAt: (/* @__PURE__ */ new Date()).toISOString(), sectionStatus: { ...currentL10Meeting.sectionStatus, conclude: true } });
      showToast("L10 meeting completed locally.");
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
    const meetingScheduleForm = event.target.closest("[data-meeting-schedule-form]");
    if (meetingScheduleForm?.dataset.editSchedule) {
      const current = JSON.stringify({ name: meetingScheduleForm.elements.name.value, cadence: meetingScheduleForm.elements.cadence.value, meetingTime: meetingScheduleForm.elements.meetingTime.value, nextDate: meetingScheduleForm.elements.nextDate.value, agenda: meetingScheduleForm.elements.agenda.value });
      const saveButton = meetingScheduleForm.querySelector(".meeting-schedule-submit");
      if (saveButton) saveButton.disabled = current === meetingScheduleForm.dataset.originalSchedule;
    }
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
  document.addEventListener("focusin", (event) => {
    const outcomeInput = event.target.closest('[data-onboarding-form] input[name^="outcome"]');
    if (outcomeInput) outcomeInput.form.dataset.activeOutcome = outcomeInput.name;
  });
  document.addEventListener("change", (event) => {
    const tomorrowTask = event.target.closest("[data-eod-tomorrow-task]");
    if (tomorrowTask) {
      const eodDate = dateOnly();
      getEodRecord(database, eodDate).then(async (eod) => {
        if (!eod) return;
        const selected = new Set(eod.tomorrowPriorityIds || []);
        if (tomorrowTask.checked && selected.size >= 3) {
          tomorrowTask.checked = false;
          showToast("Choose up to three priorities for tomorrow.");
          return;
        }
        if (tomorrowTask.checked) selected.add(tomorrowTask.dataset.eodTomorrowTask);
        else selected.delete(tomorrowTask.dataset.eodTomorrowTask);
        await saveEodRecord(database, { ...eod, tomorrowPriorityIds: [...selected] });
        await render();
      });
      return;
    }
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
    if (event.target.closest("[data-huddle-dialog-add]")) {
      document.querySelector("#morning-huddle-dialog")?.close();
      addNewItemToHuddle = true;
      openWorkEditor(null, "action");
      return;
    }
    if (event.target.closest("[data-huddle-add-new]")) {
      addNewItemToHuddle = true;
      openWorkEditor(null, "action");
      return;
    }
    const huddleDateButton = event.target.closest("[data-huddle-date]");
    if (huddleDateButton) {
      currentHuddleDate = huddleDateButton.dataset.huddleDate;
      huddleDialogShownDate = "";
      await render();
      return;
    }
    if (event.target.closest("[data-eod-add-all-huddle]")) {
      const huddleDate = getNextWorkday();
      const tasks = currentWorkItems.filter((item) => ["action", "priority"].includes(item.type) && item.status !== "complete");
      const added = await addTasksToHuddle(tasks, huddleDate, "EOD");
      const eodDate = dateOnly();
      const eod = await getEodRecord(database, eodDate);
      if (eod) await saveEodRecord(database, { ...eod, carriedForwardIds: [.../* @__PURE__ */ new Set([...eod.carriedForwardIds || [], ...tasks.map((task) => task.id)])], nextHuddleDate: huddleDate });
      showToast(added ? `Added ${added} item${added === 1 ? "" : "s"} to the ${huddleDate} Huddle.` : `Outstanding work is already in the ${huddleDate} Huddle.`);
      await render();
      return;
    }
    if (event.target.closest("[data-eod-review-items]")) {
      const tasks = currentWorkItems.filter((item) => ["action", "priority"].includes(item.type) && item.status !== "complete");
      document.body.insertAdjacentHTML("beforeend", createEodCarryReviewDialog(tasks, getNextWorkday()));
      document.querySelector("#eod-carry-review-dialog")?.showModal();
      return;
    }
    if (event.target.closest("[data-eod-not-now]")) {
      showToast("Outstanding work remains open for later review.");
      return;
    }
    const huddleAddToday = event.target.closest("[data-huddle-add-today]");
    if (huddleAddToday) {
      const item = currentWorkItems.find((workItem) => workItem.id === huddleAddToday.dataset.huddleAddToday);
      if (!item) return;
      const existing = (await getHuddleItems(database)).find((ref) => ref.itemId === item.id && ref.targetView === "Today" && ref.status !== "removed");
      if (!existing) {
        const now = (/* @__PURE__ */ new Date()).toISOString();
        await saveHuddleItem(database, { id: `today-${item.id}`, itemId: item.id, itemType: "task", sourceView: "Morning Huddle", targetView: "Today", targetDate: dateOnly(), createdAt: now, status: "active" });
        await saveWorkItem(database, { ...item, movementHistory: [...item.movementHistory || [], { id: crypto.randomUUID(), timestamp: now, date: dateOnly(), action: "Added to Today", from: "Morning Huddle", to: "Today", targetDate: dateOnly() }] });
        showToast("Added to Today\u2019s Work.");
      } else showToast("Already added to Today\u2019s Work.");
      return;
    }
    const huddleBlock = event.target.closest("[data-huddle-block]");
    if (huddleBlock) {
      const item = currentWorkItems.find((workItem) => workItem.id === huddleBlock.dataset.huddleBlock);
      if (!item) return;
      if (item.blocked) {
        await saveWorkItem(database, { ...item, blocked: false, blockerNote: "", movementHistory: [...item.movementHistory || [], { id: crypto.randomUUID(), timestamp: (/* @__PURE__ */ new Date()).toISOString(), date: dateOnly(), action: "Unblocked", from: "Blocked", to: item.status }] });
        showToast("Work item unblocked.");
      } else {
        const blockerNote = window.prompt("What\u2019s blocking this?", item.blockerNote || "")?.trim();
        if (!blockerNote) return;
        await saveWorkItem(database, { ...item, blocked: true, blockerNote, movementHistory: [...item.movementHistory || [], { id: crypto.randomUUID(), timestamp: (/* @__PURE__ */ new Date()).toISOString(), date: dateOnly(), action: "Marked Blocked", from: item.status, to: "blocked", note: blockerNote }] });
        showToast("Work item marked blocked.");
      }
      await render();
      return;
    }
    const huddleMove = event.target.closest("[data-huddle-move]");
    if (huddleMove) {
      const item = currentWorkItems.find((workItem) => workItem.id === huddleMove.dataset.huddleMove);
      if (!item) return;
      const targetDate = window.prompt("Move to Huddle date (YYYY-MM-DD)", getNextWorkday())?.trim();
      if (!targetDate || !/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) return;
      const added = await addTasksToHuddle([item], targetDate, "Morning Huddle");
      const currentRefs = await getHuddleItems(database, dateOnly());
      for (const ref of currentRefs.filter((entry) => entry.itemId === item.id && entry.status === "active")) await saveHuddleItem(database, { ...ref, status: "moved", movedToDate: targetDate });
      showToast(added ? `Moved to the ${targetDate} Huddle.` : `Already in the ${targetDate} Huddle.`);
      await render();
      return;
    }
    const addToHuddle = event.target.closest("[data-add-to-huddle]");
    if (addToHuddle) {
      const item = currentWorkItems.find((workItem) => workItem.id === addToHuddle.dataset.addToHuddle);
      if (!item) return;
      document.querySelector("#huddle-picker-dialog")?.remove();
      document.body.insertAdjacentHTML("beforeend", createHuddlePickerDialog(item, getNextWorkday()));
      document.querySelector("#huddle-picker-dialog")?.showModal();
      return;
    }
    if (event.target.closest("[data-huddle-next-workday]")) {
      const input = event.target.closest("dialog")?.querySelector('input[name="huddleDate"]');
      if (input) input.value = getNextWorkday();
      return;
    }
    if (event.target.closest("[data-eod-enter]")) {
      const eodDate = dateOnly();
      const existing = await getEodRecord(database, eodDate);
      if (existing?.status === "closed") {
        showToast("Today\u2019s EOD is already closed.");
        return;
      }
      await saveEodRecord(database, { ...existing || {}, id: `eod-${eodDate}`, date: eodDate, status: "in-progress", step: existing?.step || 0, completedTaskIds: existing?.completedTaskIds || [], outstandingTaskIds: existing?.outstandingTaskIds || [], riskIds: existing?.riskIds || [], tomorrowPriorityIds: existing?.tomorrowPriorityIds || [], tomorrowNote: existing?.tomorrowNote || "", handoverNote: existing?.handoverNote || "", createdAt: existing?.createdAt || (/* @__PURE__ */ new Date()).toISOString() });
      await render();
      return;
    }
    if (event.target.closest("[data-eod-edit-current]")) {
      const eodDate = dateOnly();
      const eod = await getEodRecord(database, eodDate);
      if (eod) {
        await saveEodRecord(database, { ...eod, status: "in-progress", step: 4 });
        await render();
      }
      return;
    }
    if (event.target.closest("[data-eod-next], [data-eod-back]")) {
      const eodDate = dateOnly();
      const eod = await getEodRecord(database, eodDate);
      if (!eod) return;
      const tomorrowNote = document.querySelector("[data-eod-tomorrow-note]")?.value;
      const handoverNote = document.querySelector("[data-eod-handover-note]")?.value;
      const direction = event.target.closest("[data-eod-back]") ? -1 : 1;
      await saveEodRecord(database, { ...eod, step: Math.max(0, Math.min(4, eod.step + direction)), tomorrowNote: tomorrowNote ?? eod.tomorrowNote, handoverNote: handoverNote ?? eod.handoverNote });
      await render();
      return;
    }
    if (event.target.closest("[data-eod-close]")) {
      const eodDate = dateOnly();
      const eod = await getEodRecord(database, eodDate);
      if (!eod) return;
      const risks = currentWorkItems.filter((item) => item.type === "risk" && item.status !== "complete");
      await saveEodRecord(database, { ...eod, status: "closed", completedAt: (/* @__PURE__ */ new Date()).toISOString(), handoverNote: document.querySelector("[data-eod-handover-note]")?.value || eod.handoverNote, riskIds: risks.map((risk) => risk.id) });
      showToast("Day closed. Tomorrow is clearer.");
      await render();
      return;
    }
    const eodFilter = event.target.closest("[data-eod-filter]");
    if (eodFilter) {
      currentEodFilter = eodFilter.dataset.eodFilter;
      await render();
      return;
    }
    if (event.target.closest("[data-eod-clear-filter]")) {
      currentEodFilter = "all";
      await render();
      return;
    }
    const eodCompleteTask = event.target.closest("[data-eod-complete-task]");
    if (eodCompleteTask) {
      const task = currentWorkItems.find((item) => item.id === eodCompleteTask.dataset.eodCompleteTask);
      if (task) {
        await saveWorkItem(database, { ...task, status: task.status === "complete" ? "not-started" : "complete", completedAt: task.status === "complete" ? "" : (/* @__PURE__ */ new Date()).toISOString() });
        await render();
      }
      return;
    }
    if (event.target.closest("[data-eod-history]")) {
      currentEodFilter = "all";
      const history = document.querySelector(".eod-history");
      if (history) history.scrollIntoView({ behavior: "smooth", block: "start" });
      else showToast("No previous EOD records yet.");
      return;
    }
    const eodHistoryButton = event.target.closest("[data-eod-history-id]");
    if (eodHistoryButton) {
      const record = (await getEodRecords(database)).find((item) => item.id === eodHistoryButton.dataset.eodHistoryId);
      if (record) {
        document.body.insertAdjacentHTML("beforeend", createEodHistoryDialog(record));
        openDialog(document.querySelector("#eod-history-dialog"));
      }
      return;
    }
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
    if (event.target.closest("[data-reset-onboarding]")) {
      document.body.insertAdjacentHTML("beforeend", createResetOnboardingDialog());
      openDialog(document.querySelector("#reset-onboarding-dialog"));
      return;
    }
    if (event.target.closest("[data-reset-onboarding-confirm]")) {
      onboardingState = await saveOnboardingState(database, {
        key: "onboarding",
        completed: false,
        completionSeen: false,
        welcomeSeen: false,
        step: 0,
        answers: {}
      });
      await deleteRecord(database, stores.settings, "primary");
      document.querySelector("#reset-onboarding-dialog")?.remove();
      document.querySelector("#settings-dialog")?.close();
      showToast("Onboarding restarted. Your workspace data is unchanged.");
      await render();
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
    const deleteSnapshot = event.target.closest("[data-delete-snapshot]");
    if (deleteSnapshot) {
      const snapshot = currentSnapshots.find((item) => item.id === deleteSnapshot.dataset.deleteSnapshot);
      if (snapshot && window.confirm(`Delete this ${snapshot.snapshotType || "local"} snapshot permanently?`)) {
        await deleteBackupSnapshot(database, snapshot.id);
        currentSnapshots = await getBackupSnapshots(database);
        dataDialog()?.remove();
        document.body.insertAdjacentHTML("beforeend", createDataDialog(currentSnapshots));
        openDialog(document.querySelector("#data-dialog"));
        showToast("Snapshot permanently deleted.");
      }
      return;
    }
    if (event.target.closest("[data-delete-all-data]")) {
      document.body.insertAdjacentHTML("beforeend", createDeleteAllDataDialog());
      openDialog(document.querySelector("#delete-all-data-dialog"));
      return;
    }
    if (event.target.closest("[data-delete-all-export]")) {
      await exportBackup();
      return;
    }
    if (event.target.closest("[data-delete-all-confirm]")) {
      const phrase = document.querySelector("[data-delete-all-phrase]")?.value.trim();
      if (phrase !== "DELETE ALL DATA") {
        showToast("Type DELETE ALL DATA exactly to confirm deletion.");
        document.querySelector("[data-delete-all-phrase]")?.focus();
        return;
      }
      await clearWorkspaceData(database, true);
      document.querySelector("#delete-all-data-dialog")?.remove();
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
    const playbookComplete = event.target.closest("[data-playbook-complete]");
    if (playbookComplete) {
      const topicId = playbookComplete.dataset.playbookComplete;
      const completed = new Set(currentPlaybookState.completedTopicIds || []);
      if (completed.has(topicId)) {
        completed.delete(topicId);
        showToast("Skill marked incomplete.");
      } else {
        completed.add(topicId);
        showToast("Skill marked complete locally.");
      }
      currentPlaybookState.completedTopicIds = [...completed];
      await savePlaybookState(database, currentPlaybookState);
      const dialog = playbookComplete.closest("dialog");
      if (dialog) {
        playbookComplete.setAttribute("aria-pressed", String(completed.has(topicId)));
        playbookComplete.innerHTML = completed.has(topicId) ? "\u2713 Completed" : "Mark complete";
      } else {
        renderPlaybookResults();
      }
      return;
    }
    const closeButton = event.target.closest("[data-close-dialog]");
    if (closeButton) closeButton.closest("dialog")?.close();
    const mobileMenuToggle = event.target.closest("[data-mobile-menu-toggle]");
    if (mobileMenuToggle) {
      const open = document.body.classList.toggle("mobile-menu-open");
      mobileMenuToggle.setAttribute("aria-expanded", String(open));
      document.querySelector("#mobile-menu")?.setAttribute("aria-hidden", String(!open));
      return;
    }
    if (event.target.closest("[data-close-mobile-menu]") || event.target.closest("[data-mobile-menu-link]")) {
      document.body.classList.remove("mobile-menu-open");
      document.querySelector("[data-mobile-menu-toggle]")?.setAttribute("aria-expanded", "false");
      document.querySelector("#mobile-menu")?.setAttribute("aria-hidden", "true");
    }
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
    if (event.target.closest("[data-open-l10-settings]")) {
      document.querySelector("#l10-settings-dialog")?.showModal();
      return;
    }
    if (event.target.closest("[data-open-meeting-schedules]")) {
      document.querySelector("#meeting-schedules-dialog")?.showModal();
      return;
    }
    const editMeeting = event.target.closest("[data-edit-meeting-schedule]");
    if (editMeeting) {
      const schedule = currentMeetingSchedules.find((item) => item.id === editMeeting.dataset.editMeetingSchedule);
      const form = document.querySelector("[data-meeting-schedule-form]");
      if (schedule && form) {
        form.dataset.editSchedule = schedule.id;
        form.dataset.originalSchedule = JSON.stringify({ name: schedule.name || "", cadence: schedule.cadence || "", meetingTime: schedule.meetingTime || "", nextDate: schedule.nextDate || "", agenda: schedule.agenda || "" });
        form.elements.name.value = schedule.name || "";
        form.elements.cadence.value = schedule.cadence || "weekly";
        form.elements.meetingTime.value = schedule.meetingTime || "09:00";
        form.elements.nextDate.value = schedule.nextDate || dateOnly();
        form.elements.agenda.value = schedule.agenda || "";
        const saveButton = form.querySelector(".meeting-schedule-submit");
        saveButton.disabled = true;
        saveButton.classList.add("meeting-schedule-save");
        saveButton.setAttribute("aria-label", "Save meeting changes");
        saveButton.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="9"></circle><path d="m8 12 2.5 2.5L16 9"></path></svg><span>Save changes</span>';
        form.elements.name.focus();
      }
      return;
    }
    const deleteMeeting = event.target.closest("[data-delete-meeting-schedule]");
    if (deleteMeeting) {
      if (window.confirm("Delete this recurring meeting schedule?")) {
        await deleteMeetingSchedule(database, deleteMeeting.dataset.deleteMeetingSchedule);
        showToast("Recurring meeting deleted.");
        await render();
      }
      return;
    }
    const l10HistoryButton = event.target.closest("[data-l10-history-id]");
    if (l10HistoryButton) {
      document.getElementById(`l10-history-${l10HistoryButton.dataset.l10HistoryId}`)?.showModal();
      return;
    }
    const printL10History = event.target.closest("[data-print-l10-history]");
    if (printL10History) {
      document.body.classList.add("print-l10-detail");
      window.addEventListener("afterprint", () => document.body.classList.remove("print-l10-detail"), { once: true });
      window.print();
      return;
    }
    const l10Section = event.target.closest("[data-l10-section]");
    if (l10Section) {
      currentL10Meeting = await saveL10Record(database, "l10Meetings", { ...currentL10Meeting, currentSection: l10Section.dataset.l10Section });
      await render();
      return;
    }
    if (event.target.closest("[data-l10-timer-toggle]")) {
      const current = currentL10Meeting.timer?.sectionId === currentL10Meeting.currentSection ? currentL10Meeting.timer : { sectionId: currentL10Meeting.currentSection, elapsedSeconds: 0, paused: false };
      const elapsed = current.elapsedSeconds + (current.startedAt ? Math.floor((Date.now() - Date.parse(current.startedAt)) / 1e3) : 0);
      const paused = Boolean(current.startedAt);
      currentL10Meeting = await saveL10Record(database, "l10Meetings", { ...currentL10Meeting, timer: { sectionId: currentL10Meeting.currentSection, elapsedSeconds: elapsed, startedAt: paused ? null : (/* @__PURE__ */ new Date()).toISOString(), paused } });
      await render();
      return;
    }
    if (event.target.closest("[data-l10-next]")) {
      const index = Math.max(0, L10_AGENDA.findIndex((item) => item.id === currentL10Meeting.currentSection));
      const next = L10_AGENDA[Math.min(L10_AGENDA.length - 1, index + 1)];
      currentL10Meeting = await saveL10Record(database, "l10Meetings", { ...currentL10Meeting, currentSection: next.id, sectionStatus: { ...currentL10Meeting.sectionStatus, [L10_AGENDA[index].id]: true } });
      await render();
      return;
    }
    const editMetric = event.target.closest("[data-l10-edit-metric]");
    if (editMetric) {
      const metric = (await getL10Collection(database, "l10ScorecardMetrics")).find((item) => item.id === editMetric.dataset.l10EditMetric);
      const form = document.querySelector("[data-l10-metric-form]");
      if (metric && form) {
        form.dataset.editMetric = metric.id;
        form.elements.name.value = metric.name || "";
        form.elements.area.value = metric.area || "";
        form.elements.direction.value = metric.direction || "at-least";
        form.elements.weeklyGoal.value = metric.weeklyGoal ?? "";
        form.querySelector('button[type="submit"]').textContent = "Update metric";
        form.scrollIntoView({ behavior: "smooth", block: "center" });
        form.elements.name.focus();
      }
      return;
    }
    const deleteMetric = event.target.closest("[data-l10-delete-metric]");
    if (deleteMetric) {
      const metric = (await getL10Collection(database, "l10ScorecardMetrics")).find((item) => item.id === deleteMetric.dataset.l10DeleteMetric);
      if (metric && window.confirm(`Delete the scorecard metric \u201C${metric.name}\u201D?`)) {
        await deleteRecord(database, stores.l10ScorecardMetrics, metric.id);
        showToast("Scorecard metric deleted.");
        await render();
      }
      return;
    }
    const metricIssue = event.target.closest("[data-l10-metric-issue]");
    if (metricIssue) {
      const metric = (await getL10Collection(database, "l10ScorecardMetrics")).find((item) => item.id === metricIssue.dataset.l10MetricIssue);
      const entry = (await getL10Collection(database, "l10ScorecardEntries")).find((item) => item.metricId === metric.id && item.weekStart === currentL10Meeting.weekStart);
      await saveL10Record(database, "l10Issues", { id: crypto.randomUUID(), title: `${metric.name} is off track`, area: metric.area, source: "scorecard", priorityOrder: Date.now(), status: "open", identify: entry?.note || "", discuss: "", solve: "", createdAt: (/* @__PURE__ */ new Date()).toISOString() });
      showToast("Scorecard item added to Issues.");
      await render();
      return;
    }
    const rockIssue = event.target.closest("[data-l10-rock-issue]");
    if (rockIssue) {
      const rock = (await getL10Collection(database, "l10Rocks")).find((item) => item.id === rockIssue.dataset.l10RockIssue);
      await saveL10Record(database, "l10Issues", { id: crypto.randomUUID(), title: `${rock.outcome} needs attention`, area: rock.area, source: "rock", priorityOrder: Date.now(), status: "open", identify: "", discuss: "", solve: "", createdAt: (/* @__PURE__ */ new Date()).toISOString() });
      showToast("Rock added to Issues.");
      await render();
      return;
    }
    const openL10Issue = event.target.closest("[data-l10-open-issue]");
    if (openL10Issue) {
      const issue = (await getL10Collection(database, "l10Issues")).find((item) => item.id === openL10Issue.dataset.l10OpenIssue);
      const dialog = document.querySelector("#l10-issue-dialog");
      if (issue && dialog) {
        dialog.querySelector('[name="id"]').value = issue.id;
        ["title", "identify", "discuss", "solve", "status"].forEach((name) => {
          if (dialog.elements[name]) dialog.elements[name].value = issue[name] || "";
        });
        dialog.showModal();
      }
      return;
    }
    const todoToggle = event.target.closest("[data-l10-todo-toggle]");
    if (todoToggle) {
      currentL10Meeting = await saveL10Record(database, "l10Meetings", { ...currentL10Meeting, todos: (currentL10Meeting.todos || []).map((todo) => todo.id === todoToggle.dataset.l10TodoToggle ? { ...todo, status: todo.status === "done" ? "not-done" : "done" } : todo) });
      await render();
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
    if (event.target.closest("[data-primary-action]") && getRoute().key === "huddle") {
      currentHuddleDate = dateOnly();
      await render();
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
    if (event.target.closest("[data-begin-journey], [data-explore-talentis]")) {
      onboardingState = await saveOnboardingState(database, { ...onboardingState, welcomeSeen: true, step: 0 });
      await render();
      return;
    }
    const completeMilestone = event.target.closest("[data-complete-milestone]");
    if (completeMilestone) {
      const id = completeMilestone.dataset.completeMilestone;
      if (!currentJourneyState.completedMilestoneIds.includes(id)) {
        currentJourneyState = await saveJourneyState(database, { ...currentJourneyState, completedMilestoneIds: [...currentJourneyState.completedMilestoneIds, id], completedAt: { ...currentJourneyState.completedAt || {}, [id]: (/* @__PURE__ */ new Date()).toISOString() } });
        selectedJourneyMilestoneId = "";
        showToast("Milestone complete. Keep the next step small.");
        await render();
      }
      return;
    }
    const reopenMilestone = event.target.closest("[data-reopen-milestone]");
    if (reopenMilestone) {
      const id = reopenMilestone.dataset.reopenMilestone;
      currentJourneyState = await saveJourneyState(database, {
        ...currentJourneyState,
        completedMilestoneIds: currentJourneyState.completedMilestoneIds.filter((milestoneId) => milestoneId !== id),
        completedAt: Object.fromEntries(Object.entries(currentJourneyState.completedAt || {}).filter(([milestoneId]) => milestoneId !== id))
      });
      selectedJourneyMilestoneId = id;
      showToast("Milestone added back to your journey.");
      await render();
      return;
    }
    const selectMilestone = event.target.closest("[data-select-milestone]");
    if (selectMilestone) {
      selectedJourneyMilestoneId = selectMilestone.dataset.selectMilestone;
      await render();
      return;
    }
    if (event.target.closest("[data-print-milestone]")) {
      document.body.classList.add("print-journey-milestone");
      window.addEventListener("afterprint", () => document.body.classList.remove("print-journey-milestone"), { once: true });
      window.print();
      return;
    }
    if (event.target.closest("[data-open-meeting-builder]")) {
      const dialog = document.querySelector("#meeting-builder");
      if (dialog && !dialog.open) dialog.showModal();
      dialog?.querySelector("textarea")?.focus();
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
      const form = suggestion.closest("[data-onboarding-form]");
      const outcomeInputs = [...form?.querySelectorAll('input[name^="outcome"]') || []];
      const activeOutcome = form?.elements[form.dataset.activeOutcome];
      const target = activeOutcome || outcomeInputs.find((input) => !input.value);
      if (!target) {
        showToast("All three outcomes are filled. Select an outcome field to replace it.");
        return;
      }
      target.value = suggestion.dataset.fillOutcome;
      target.focus();
      form?.querySelectorAll("[data-fill-outcome]").forEach((button) => {
        const selected = outcomeInputs.some((input) => input.value === button.dataset.fillOutcome);
        button.classList.toggle("suggestion-chip--selected", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
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
  window.addEventListener("hashchange", () => {
    if (getRoute().key !== "huddle" || !document.querySelector(".huddle-command")) {
      currentHuddleDate = "";
      huddleDialogShownDate = "";
    }
    render();
  });
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
        const registration = await navigator.serviceWorker.register(
          new URL("./service-worker.js", document.baseURI)
        );
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
