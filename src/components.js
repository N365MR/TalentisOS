import { journeyStages, getJourneyProgress } from './journey.js';
import { L10_AGENDA, scorecardStatus } from './l10.js';
import { meetingCadences, daysUntil, dateOnly, nextMeetingDate } from './meetings.js';

const routes = {
  journey: { label: 'Journey', eyebrow: 'Your first 90 days', title: 'Build the leadership rhythm.', description: 'A practical path for listening, clarity, execution and improvement.', action: 'Continue journey' },
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
  eod: {
    label: 'End of Day',
    eyebrow: 'Review · Prepare',
    title: 'Close today. Prepare tomorrow.',
    description: 'A calm close-out assistant for completed work, open loops, risk, and tomorrow’s focus.',
    prompt: 'Capture what matters before you leave the day.',
    action: 'Enter End of Day',
  },
  improve: {
    label: 'Improve',
    eyebrow: 'Learn and refine',
    title: 'Improve the rhythm.',
    description: 'Turn small observations into practical changes to the way you lead.',
    prompt: 'Improvement capture will be introduced in a later phase.',
    action: 'Capture improvement',
  },
  playbook: {
    label: 'Playbook',
    eyebrow: 'Guidance when it matters',
    title: 'Lead with a clear next move.',
    description: 'Short, practical guidance for the moments that shape the day.',
    prompt: 'Search for a topic or open guidance from the workflow you are in.',
    action: 'Open Playbook',
  },
};

const navigation = [
  ['today', 'Today', '◷'],
  ['journey', 'Journey', '◌'],
  ['huddle', 'Huddle', '＋'],
  ['work', 'Work', '□'],
  ['review', 'Review', '✓'],
  ['eod', 'End of Day', '◒'],
];

export const playbookTopics = [
  ['new-leader', 'Starting as a new leader', 'Start well', 'Set expectations, learn the work, and make the first commitments visible.', 'When you are new to a team or role.', 'Listen first. Name what you are learning. Agree the few outcomes that matter now.', 'I am here to understand the work, support the team, and make our priorities clear.', 'Avoid changing everything before you understand the system.', 'People know what matters, what to expect from you, and how to raise concerns.'],
  ['prepare-day', 'Preparing the day', 'Plan the day', 'Create a small, useful shape for the day before interruptions arrive.', 'At the start of each workday.', 'Choose up to three outcomes. Surface risks, decisions, and follow-ups. Protect time for the most important one.', 'By the end of today, what result must be different?', 'Avoid turning the plan into a complete task list.', 'The team can see the focus, the risks, and the next actions.'],
  ['morning-huddle', 'Running a morning huddle', 'Align quickly', 'Use a short huddle to align action, ownership, and risk.', 'At the start of a shared workday or shift.', 'Confirm the priority, ask what is blocked, assign the next action, and record the due point.', 'What needs to move today, who owns the next action, and what could get in the way?', 'Avoid solving every issue in the huddle.', 'People leave knowing the action, responsible area, and due point.'],
  ['set-priorities', 'Setting priorities', 'Choose what matters', 'Make the outcome visible so activity does not become the goal.', 'When work is competing for attention.', 'Define the result, why it matters, and the due point. Keep the list to the few outcomes you can actively lead.', 'The outcome I need by [due point] is ____. It matters because ____.', 'Avoid describing only the activity.', 'The priority can be understood and checked without extra explanation.'],
  ['delegate-clearly', 'Delegating clearly', 'Create ownership', 'Transfer a clear outcome with enough context and authority to act.', 'When another person or area will carry the work.', 'State the outcome, decision boundaries, support available, and check-in point. Confirm understanding.', 'Please own [outcome] by [due point]. You can decide ____. Let us check in at ____.', 'Avoid handing over a task without an outcome or authority.', 'The owner can explain what good looks like and what happens next.'],
  ['following-up', 'Following up', 'Close the loop', 'Follow up on commitments without creating unnecessary chasing.', 'When an action is due, waiting, or at risk of slipping.', 'Reference the commitment, ask for the current position, and agree the next step and date.', 'Checking in on [commitment]. What is the current position and next date?', 'Avoid vague reminders with no specific ask.', 'The commitment has a clear status and next action.'],
  ['managing-risk', 'Managing risk', 'Make risk actionable', 'Turn a concern into an impact and an immediate action.', 'When something could affect an outcome, customer, team, or deadline.', 'State what is at risk, the impact if it happens, the risk level, and the immediate action.', 'The risk is ____. The impact would be ____. The immediate action is ____.', 'Avoid recording a risk without an owner or action.', 'The risk is visible early and someone knows what to do next.'],
  ['escalate-early', 'Escalating early', 'Raise the right signal', 'Escalate while there are still useful options.', 'When impact, authority, timing, or capability exceeds the current team.', 'State the situation, impact, action already taken, options, and the decision or support needed.', 'Here is the situation, the impact, what we have tried, and the support needed now.', 'Avoid escalating only the problem or waiting for certainty.', 'The right person can make a timely decision with enough context.'],
  ['make-decisions', 'Making decisions', 'Decide with clarity', 'Make the decision, the reason, and the resulting action visible.', 'When work is waiting on a choice or trade-off.', 'Clarify the decision required, options, criteria, owner, due point, and next action. If deferring, record why and the next review date.', 'The decision is ____. We chose it because ____. The next action is ____ by ____.', 'Avoid leaving a decision in discussion without a date.', 'People know what was decided, why, and what happens next.'],
  ['remove-blockers', 'Removing blockers', 'Restore movement', 'Focus on the constraint that is stopping useful work.', 'When progress has stopped or a team is repeatedly waiting.', 'Name the blocker, who can remove it, the smallest action to unlock movement, and when to check again.', 'What is the smallest thing we can remove to let this move?', 'Avoid adding more work around the blocker.', 'The work is moving again or the constraint is escalated with a clear ask.'],
  ['lead-meetings', 'Leading meetings', 'Make the time useful', 'Give every meeting a purpose, decision path, and close.', 'Before and during a meeting.', 'State the outcome needed, keep discussion on that outcome, capture decisions and actions, and close with owners and dates.', 'By the end of this meeting we need to ____.', 'Avoid meetings with no outcome or undocumented actions.', 'The meeting ends with fewer open questions and visible commitments.'],
  ['competing-priorities', 'Handling competing priorities', 'Make the trade-off', 'Choose deliberately when everything appears urgent.', 'When two or more important outcomes compete for the same time or people.', 'Compare impact, timing, risk, and reversibility. Choose what moves first and name what will wait.', 'If we do this first, [other outcome] will move to ____. Is that the right trade-off?', 'Avoid silently accepting every priority.', 'The trade-off is explicit and stakeholders know what changes.'],
  ['close-day', 'Closing the day', 'Leave tomorrow clearer', 'Close commitments, capture learning, and prepare the next useful step.', 'At the end of the workday.', 'Review what was completed, what remains open, what changed, and the small set of items for tomorrow.', 'What changed today, what carries forward, and what does tomorrow need first?', 'Avoid carrying work forward without a next action.', 'Tomorrow starts with fewer surprises and a clear first move.'],
  ['weekly-review', 'Running a weekly review', 'Learn from the rhythm', 'Use the week to identify patterns and choose the next three priorities.', 'At the end of the week or start of the next one.', 'Review achievements, carryover, repeated risks, delayed decisions, wasted time, and one change to test.', 'What did the week teach us, and what will we do differently next week?', 'Avoid turning the review into a large report.', 'Next week has three priorities, one operating improvement, and one leadership focus.'],
  ['capture-improvement', 'Capturing improvements', 'Make one change testable', 'Turn a practical observation into a small next step.', 'When a workflow, handover, meeting, or customer outcome is not working well.', 'Describe what is not working, what should change, why it helps, and the next step. Choose one category and status.', 'The small change we will test is ____. We expect it to help by ____.', 'Avoid capturing an improvement without a next step.', 'The change is small enough to test and has a clear owner or next action.'],
].map(([id, title, group, summary, when, what, say, avoid, success]) => ({ id, title, group, summary, when, what, say, avoid, success }));

playbookTopics.push(
  { id: 'first-7-days', title: 'Leading the first 7 days', group: 'First 90 days', summary: 'Listen, observe and establish clarity before making large changes.', when: 'When you are starting in a new leadership role.', what: 'Meet the team, observe the work, set first expectations and choose one useful focus.', say: 'I will listen first, make the work visible and share what I learn.', avoid: 'Avoid promising fixes before understanding the system.', success: 'The team knows what to expect and the first focus is visible.' },
  { id: 'first-30-days', title: 'Leading the first 30 days', group: 'First 90 days', summary: 'Build a reliable operating rhythm and make responsibilities clear.', when: 'At the end of your first month.', what: 'Map the work, clarify priorities, surface risks and review what to keep or change.', say: 'What is helping us deliver, and where is the rhythm creating friction?', avoid: 'Avoid treating the first month as a performance report.', success: 'The team has a useful rhythm and one improvement to test.' },
  { id: 'first-90-days', title: 'Completing the first 90 days', group: 'First 90 days', summary: 'Turn the first three months of learning into a sustainable leadership focus.', when: 'At the end of the first 90 days.', what: 'Review trust, clarity, execution and improvement; then choose the next three priorities.', say: 'What changed because of how we led, and what should happen next?', avoid: 'Avoid adding a large plan when three priorities will do.', success: 'The next leadership chapter has a clear focus and operating rhythm.' },
);

const onboardingSteps = [
  {
    title: 'What is your leadership situation?',
    explanation: 'This helps tailor the first 90 days to where you are starting.',
  },
  {
    title: 'What kind of work does your team do?',
    explanation: 'We use this to keep guidance close to the work you lead.',
  },
  {
    title: 'How should guidance be structured?',
    explanation: 'Choose the amount of structure that will help you act.',
  },
  {
    title: 'What time does your workday normally begin?',
    explanation: 'We use this only to frame your daily rhythm.',
  },
  {
    title: 'What time should the end-of-day review be suggested?',
    explanation: 'Choose a calm moment to close the loop and prepare tomorrow.',
  },
  {
    title: 'Set up the team you lead',
    explanation: 'Use role and team-area labels to make your leadership context visible. Do not add names or personal details.',
  },
];

const leadershipSituationOptions = ['First-time leader', 'Experienced leader', 'New team', 'Changed role', 'Building a better system'];
const workTypeOptions = ['Operations or service', 'Office or administration', 'Projects or professional services', 'Sales or customer experience', 'Technical or digital', 'Other'];
const guidanceOptions = ['Step-by-step', 'Key milestones', 'Independent'];
const promptLibrary = [
  'Define the outcome, not only the activity.',
  'Communicate risk early.',
  'Do not leave a commitment without a next action.',
  'Remove the blocker before adding more work.',
  'Finish the day by preparing tomorrow.',
];

export function escapeHtml(value = '') {
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
  if (!state.welcomeSeen) return `<main class="onboarding-screen welcome-screen" aria-labelledby="welcome-title"><div class="onboarding-brand">TalentisOS</div><p class="eyebrow">Your first 90 days</p><h1 id="welcome-title">Welcome to leadership.</h1><p>Build a clear, practical rhythm for the first 90 days of leading your team.</p><div class="onboarding-actions"><button class="primary-action" type="button" data-begin-journey>Build My First 90 Days <span aria-hidden="true">→</span></button><button class="text-button" type="button" data-explore-talentis>Explore TalentisOS</button></div></main>`;
  if (state.completed && !state.completionSeen) {
    return `<main class="onboarding-screen onboarding-complete" aria-labelledby="onboarding-complete-title"><div class="completion-mark" aria-hidden="true">✓</div><p class="eyebrow">Your first 90 days</p><h1 id="onboarding-complete-title">Your leadership journey is ready.</h1><p>Start with the foundations and build the rhythm one useful step at a time.</p><button class="primary-action" type="button" data-start-today>Begin Day 1 <span aria-hidden="true">→</span></button></main>`;
  }
  const step = Math.max(0, Math.min(state.step || 0, onboardingSteps.length - 1));
  const current = onboardingSteps[step];
  return `<main class="onboarding-screen" aria-labelledby="onboarding-title"><div class="onboarding-top"><span class="onboarding-brand">TalentisOS</span><button class="text-button" type="button" data-onboarding-save>Save &amp; resume later</button></div><div class="onboarding-progress" aria-label="Onboarding progress"><span>Step ${step + 1} of ${onboardingSteps.length}</span><div class="progress-track"><span style="width:${((step + 1) / onboardingSteps.length) * 100}%"></span></div></div><section class="onboarding-card"><p class="eyebrow">Set up your daily rhythm</p><h1 id="onboarding-title">${current.title}</h1><p class="onboarding-explanation">${current.explanation}</p><form data-onboarding-form data-step="${step}">${onboardingFields(step, state)}<div class="onboarding-actions">${step > 0 ? '<button class="secondary-action" type="button" data-onboarding-back>Back</button>' : '<span></span>'}<button class="primary-action" type="submit">${step === onboardingSteps.length - 1 ? 'Finish setup' : 'Continue'} <span aria-hidden="true">→</span></button></div></form></section></main>`;
}

function onboardingFields(step, state) {
  if (step === 0)
    return `<div class="option-grid">${leadershipSituationOptions.map((option) => `<label class="select-option"><input type="radio" name="leadershipSituation" value="${escapeHtml(option)}" ${state.answers?.leadershipSituation === option ? 'checked' : ''} required><span>${option}</span></label>`).join('')}</div>`;
  if (step === 1)
    return `<div class="option-grid">${workTypeOptions.map((option) => `<label class="select-option"><input type="radio" name="workType" value="${escapeHtml(option)}" ${state.answers?.workType === option ? 'checked' : ''} required><span>${option}</span></label>`).join('')}</div>`;
  if (step === 2)
    return `<div class="option-grid option-grid--three">${guidanceOptions.map((option) => `<label class="select-option"><input type="radio" name="guidanceLevel" value="${escapeHtml(option)}" ${state.answers?.guidanceLevel === option ? 'checked' : ''} required><span>${option}</span></label>`).join('')}</div>`;
  if (step === 3)
    return `<label class="large-field">Workday start time<input type="time" name="startTime" value="${onboardingAnswer(state, 'startTime')}" required></label>`;
  if (step === 4)
    return `<label class="large-field">Suggested review time<input type="time" name="reviewTime" value="${onboardingAnswer(state, 'reviewTime')}" required></label>`;
  return `<div class="onboarding-team-setup"><label class="large-field">Your leadership role<input name="leaderRole" value="${onboardingAnswer(state, 'leaderRole')}" placeholder="e.g. Operations lead" required></label><label class="large-field">Roles or team areas reporting to you<small>Use one role or area per line. Names are not needed.</small><textarea name="reportingRoles" rows="4" placeholder="Operations\nCustomer experience\nProjects" required>${onboardingAnswer(state, 'reportingRoles')}</textarea></label><label class="large-field">How is the team structured?<select name="teamStructure" required><option value="" disabled ${!state.answers?.teamStructure ? 'selected' : ''}>Choose a structure</option>${['Functional areas', 'Cross-functional team', 'Small, cross-functional team', 'Distributed or matrix', 'Small direct team'].map((option) => `<option value="${escapeHtml(option)}" ${state.answers?.teamStructure === option ? 'selected' : ''}>${option}</option>`).join('')}</select></label></div>`;
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

export function createJourneyView(state = {}, selectedMilestoneId = '') {
  const progress = getJourneyProgress(state);
  const stageIndex = journeyStages.findIndex((stage) => stage.id === progress.current.stage.id);
  const currentIndex = progress.current.stage.milestones.findIndex((item) => item.id === progress.current.id);
  const visible = progress.current.stage.milestones.slice(currentIndex, currentIndex + 3);
  const selected = progress.milestones.find((milestone) => milestone.id === selectedMilestoneId) || progress.current;
  const selectedCompleted = progress.completed.has(selected.id);
  const completed = progress.milestones.filter((milestone) => progress.completed.has(milestone.id));
  const completedSection = completed.length
    ? `<details class="journey-history"><summary>Review completed steps <span>${completed.length}</span></summary><div class="journey-history-list">${completed.map((milestone) => `<article><div class="journey-history-heading"><button class="journey-complete-toggle" type="button" data-reopen-milestone="${milestone.id}" aria-label="Mark ${escapeHtml(milestone.title)} incomplete" title="Mark incomplete">✓</button><div><p class="eyebrow">${escapeHtml(milestone.stage.label)}</p><h3>${escapeHtml(milestone.title)}</h3><p>${escapeHtml(milestone.summary)}</p>${state.completedAt?.[milestone.id] ? `<small>Completed ${escapeHtml(new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(state.completedAt[milestone.id])))}</small>` : ''}</div></div><ul class="journey-checklist">${milestone.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article>`).join('')}</div></details>`
    : '';
  return `<section class="journey-command" aria-labelledby="journey-title"><div class="journey-intro"><p class="eyebrow">First 90 Days Journey</p><h2 id="journey-title">Build the leadership rhythm.</h2><p class="secondary-text">${escapeHtml(progress.current.stage.objective)}. Progress is saved on this device.</p><div class="journey-progress" aria-label="${progress.completedCount} of ${progress.total} milestones complete"><div class="progress-track"><span style="width:${(progress.completedCount / progress.total) * 100}%"></span></div><span>${progress.completedCount} of ${progress.total} milestones</span></div></div><div class="journey-stage-tabs" role="list">${journeyStages.map((stage, index) => `<div class="journey-stage-tab ${index === stageIndex ? 'journey-stage-tab--current' : index < stageIndex ? 'journey-stage-tab--done' : ''}" role="listitem"><span>${index + 1}</span><strong>${stage.label}</strong></div>`).join('')}</div><section class="journey-current journey-selected-milestone" aria-labelledby="current-milestone-title"><p class="eyebrow">${selectedCompleted ? 'Completed milestone' : selected.id === progress.current.id ? 'Current milestone' : 'Selected milestone'} · ${escapeHtml(selected.stage.label)}</p><h2 id="current-milestone-title">${escapeHtml(selected.title)}</h2><p>${escapeHtml(selected.summary)}</p><ul class="journey-checklist">${selected.checklist.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul><div class="modal__actions">${selectedCompleted ? '<span class="status-chip status-chip--success">Completed</span>' : `<button class="primary-action" type="button" data-complete-milestone="${selected.id}">Mark milestone complete <span aria-hidden="true">→</span></button>`}<button class="secondary-action" type="button" data-print-milestone>Print milestone</button>${selected.id === 'prepare-team-meeting' ? '<button class="secondary-action" type="button" data-open-meeting-builder>Open meeting builder</button>' : ''}</div></section><section class="journey-next" aria-labelledby="journey-next-title"><p class="eyebrow">Keep moving</p><h2 id="journey-next-title">Next milestones</h2><div class="journey-next-list">${visible.slice(1).map((milestone) => `<article><button class="journey-milestone-select" type="button" data-select-milestone="${milestone.id}"><span class="status-chip status-chip--neutral">Next</span><h3>${escapeHtml(milestone.title)}</h3><p>${escapeHtml(milestone.summary)}</p><span class="journey-select-label">View milestone →</span></button></article>`).join('')}</div></section>${completedSection}</section>`;
}

export function createMeetingBuilderDialog(state = {}) {
  const meeting = state.meetingPreparation || {};
  return `<dialog id="meeting-builder" class="modal" aria-labelledby="meeting-builder-title"><div class="modal__header"><div><p class="eyebrow">First 7 Days</p><h2 id="meeting-builder-title">Prepare to Meet Your Team</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close meeting builder">×</button></div><form class="modal__body" data-meeting-builder-form><p class="secondary-text">Create a simple first conversation. You can change this later.</p><label>Purpose<textarea name="purpose" rows="2" required>${escapeHtml(meeting.purpose || 'Listen, understand the work and agree how we will work together.')}</textarea></label><label>Introduction<textarea name="introduction" rows="2" required>${escapeHtml(meeting.introduction || 'I am here to understand the work, support the team and make our priorities clear.')}</textarea></label><fieldset><legend>Questions to ask</legend>${['What is working well?', 'What gets in the way?', 'What should I understand before changing anything?', 'Where do customers or colleagues feel friction?', 'What would make the next 90 days useful?'].map((question) => `<label class="check-option"><input type="checkbox" name="questions" value="${escapeHtml(question)}" ${(meeting.questions || []).includes(question) ? 'checked' : ''}><span>${question}</span></label>`).join('')}</fieldset><label>Expectations to share<textarea name="expectations" rows="2" required>${escapeHtml(meeting.expectations || 'We will be clear about priorities, raise risk early and close the loop on commitments.')}</textarea></label><label>How to close<textarea name="close" rows="2" required>${escapeHtml(meeting.close || 'Thank you. I will share what I heard, the next actions and when we will check back in.')}</textarea></label><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Cancel</button><button class="primary-action" type="submit">Save meeting plan</button></div></form></dialog>`;
}

export function createMeetingScheduleCard(schedules = []) {
  const today = dateOnly();
  const upcoming = schedules.filter((schedule) => schedule.active !== false).map((schedule) => ({ ...schedule, nextDate: nextMeetingDate(schedule, today) })).sort((a, b) => a.nextDate.localeCompare(b.nextDate));
  const next = upcoming[0];
  if (!next) return `<section class="meeting-schedule-card meeting-schedule-card--empty" aria-labelledby="meeting-schedule-title"><div><p class="eyebrow">Meeting rhythm</p><h2 id="meeting-schedule-title">Set your next meeting.</h2><p class="secondary-text">Keep recurring leadership meetings visible without adding them to your task list.</p></div><button type="button" class="secondary-action" data-open-meeting-schedules>Set up meetings <span aria-hidden="true">→</span></button></section>`;
  const days = daysUntil(next.nextDate, today);
  const countdown = days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`;
  const agendaPreview = next.agenda ? `<p class="meeting-agenda-preview"><strong>Agenda</strong> · ${escapeHtml(next.agenda.split('\n').filter(Boolean).slice(0, 2).join(' · '))}</p>` : '';
  return `<section class="meeting-schedule-card" aria-labelledby="meeting-schedule-title"><div><p class="eyebrow">Next meeting</p><h2 id="meeting-schedule-title">${escapeHtml(next.name)}</h2><p class="secondary-text">${escapeHtml(next.cadenceLabel || meetingCadences.find(([value]) => value === next.cadence)?.[1] || 'Recurring')} · ${escapeHtml(next.meetingTime || 'Time not set')}</p>${agendaPreview}</div><div class="meeting-countdown"><strong>${countdown}</strong><span>${new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(`${next.nextDate}T12:00:00`))}</span></div><button type="button" class="secondary-action" data-open-meeting-schedules>Manage meetings</button></section>`;
}

export function createMeetingScheduleDialog(schedules = []) {
  const rows = schedules.map((schedule) => `<li><span><strong>${escapeHtml(schedule.name)}</strong><small>${escapeHtml(meetingCadences.find(([value]) => value === schedule.cadence)?.[1] || schedule.cadence)} · next ${escapeHtml(schedule.nextDate)}</small>${schedule.agenda ? `<small class="meeting-agenda-line">Agenda: ${escapeHtml(schedule.agenda.split('\n').filter(Boolean).join(' · '))}</small>` : ''}</span><div class="meeting-schedule-row-actions"><button type="button" class="text-button" data-edit-meeting-schedule="${escapeHtml(schedule.id)}">Edit</button><button type="button" class="icon-button meeting-schedule-delete" data-delete-meeting-schedule="${schedule.id}" aria-label="Delete ${escapeHtml(schedule.name)}" title="Delete meeting"><svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg></button></div></li>`).join('');
  return `<dialog id="meeting-schedules-dialog" class="modal" aria-labelledby="meeting-schedules-title"><div class="modal__header"><div><p class="eyebrow">Today · Meeting rhythm</p><h2 id="meeting-schedules-title">Recurring meetings</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close recurring meetings">×</button></div><div class="modal__body meeting-schedule-dialog-body"><p class="secondary-text">Set the next date for a recurring meeting. Dates and schedules stay on this device.</p><form data-meeting-schedule-form class="work-form meeting-schedule-form"><label>Meeting name<input name="name" placeholder="e.g. Weekly leadership meeting" required></label><div class="form-two-col"><label>Cadence<select name="cadence">${meetingCadences.map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}</select></label><label>Meeting time<input name="meetingTime" type="time" value="09:00"></label></div><label>Next meeting date<input name="nextDate" type="date" value="${dateOnly()}" required></label><label>Agenda<small>Use one topic per line.</small><textarea name="agenda" rows="3" placeholder="Scorecard\nPriority review\nDecisions and next actions"></textarea></label><button class="primary-action meeting-schedule-submit" type="submit">Add recurring meeting</button></form><section class="meeting-schedule-list"><h3>Saved schedules</h3><ul class="history-list">${rows || '<li class="section-empty"><p>No recurring meetings yet.</p></li>'}</ul></section></div></dialog>`;
}

export function createTodayView(plan, priorities, workItems = [], todayReferences = []) {
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
  const todayWork = todayReferences.map((ref) => workItems.find((item) => item.id === ref.itemId)).filter((item) => item && item.status !== 'complete');
  const todayWorkSection = todayWork.length ? `<section class="today-section" aria-labelledby="huddle-work-title"><div class="section-heading"><div><p class="eyebrow">Morning Huddle</p><h2 id="huddle-work-title">Added to Today</h2></div><span class="section-count">${todayWork.length}</span></div><div class="work-list">${todayWork.map((item) => `<article class="work-card"><div class="work-card__top"><div><span class="work-type">${escapeHtml(item.priority || 'Action')}</span><h3>${escapeHtml(item.title || item.outcome)}</h3></div><span class="status-chip status-chip--neutral">${escapeHtml(workStatusLabel(item.status))}</span></div><div class="work-card__meta"><span>Raised ${escapeHtml(workDateLabel(item.raisedDate || item.createdAt?.slice(0, 10)))}</span>${item.dueDate ? `<span>Due ${escapeHtml(workDateLabel(item.dueDate))}</span>` : ''}</div><div class="work-card__actions"><button type="button" class="text-button" data-complete-work="${escapeHtml(item.id)}">Complete</button><button type="button" class="text-button" data-edit-work="${escapeHtml(item.id)}">Open details</button></div></article>`).join('')}</div></section>` : '';
  return `<section class="today-command" aria-labelledby="today-focus-title"><div class="today-greeting"><p class="eyebrow">${new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</p><h2 id="today-focus-title">Good morning.</h2><p class="secondary-text">Here is the shape of your leadership day.</p></div><section class="daily-focus"><div><p class="card-kicker">Daily focus</p><h3>${escapeHtml(focus)}</h3></div><span class="focus-card__icon" aria-hidden="true">✦</span></section><section class="today-section" aria-labelledby="priorities-title"><div class="section-heading"><div><p class="eyebrow">What matters now?</p><h2 id="priorities-title">Top three priorities</h2></div><button class="secondary-action" type="button" data-add-priority ${priorities.length >= 3 ? 'disabled' : ''}>${priorities.length >= 3 ? 'Three set' : 'Add priority'}</button></div><div class="priority-list">${priorityCards}</div></section>${todayWorkSection}<div class="today-grid"><section class="today-section compact-section" aria-labelledby="carryover-title"><div class="section-heading"><h2 id="carryover-title">Carryover</h2><span class="section-count">${plan.carryover?.length || 0}</span></div>${plan.carryover?.length ? plan.carryover.map((item) => `<p>${escapeHtml(item)}</p>`).join('') : empty('Nothing carried over.')}</section><section class="today-section compact-section" aria-labelledby="risk-title"><div class="section-heading"><h2 id="risk-title">At risk</h2><span class="section-count section-count--warning">${criticalRisks.length}</span></div>${signalList(criticalRisks, 'No critical risks surfaced.')}</section><section class="today-section compact-section" aria-labelledby="decision-title"><div class="section-heading"><h2 id="decision-title">Decisions</h2><span class="section-count">${dueDecisions.length}</span></div>${signalList(dueDecisions, 'No decisions due.')}</section><section class="today-section compact-section" aria-labelledby="follow-up-title"><div class="section-heading"><h2 id="follow-up-title">Follow-ups due</h2><span class="section-count">${overdueFollowUps.length}</span></div>${signalList(overdueFollowUps, 'No overdue follow-ups.')}</section></div><section class="today-section meetings-section" aria-labelledby="meetings-title"><div class="section-heading"><h2 id="meetings-title">Meetings</h2><span class="section-count">${plan.meetings?.length || 0}</span></div>${plan.meetings?.length ? plan.meetings.map((item) => `<p>${escapeHtml(item)}</p>`).join('') : empty('No meetings added.')}</section><section class="leadership-prompt" aria-labelledby="prompt-title"><p class="eyebrow">Leadership prompt</p><h2 id="prompt-title">${prompt}</h2></section><section class="end-day-status" aria-labelledby="end-day-title"><div><p class="eyebrow">End-of-day status</p><h2 id="end-day-title">${plan.endOfDayStatus === 'complete' ? 'Review complete.' : 'Not reviewed yet.'}</h2></div><span class="status-chip status-chip--${plan.endOfDayStatus === 'complete' ? 'success' : 'neutral'}">${plan.endOfDayStatus === 'complete' ? 'Complete' : 'Open'}</span></section></section>${createPrioritySheet()}`;
}

function eodTaskProgress(task) {
  const subtasks = task.subtasks || [];
  const completed = subtasks.filter((item) => item.completed).length;
  const total = subtasks.length;
  return { completed, total, remaining: total ? total - completed : task.status === 'complete' ? 0 : 1, percent: total ? Math.round((completed / total) * 100) : task.status === 'complete' ? 100 : 0 };
}

function eodTaskCard(task, action = 'complete', selectedIds = []) {
  const progress = eodTaskProgress(task);
  return `<article class="eod-task-card"><div><span class="work-type">${escapeHtml(task.priority || 'Normal')}</span><h3>${escapeHtml(task.title || task.outcome || 'Untitled task')}</h3><p>${task.raisedDate || task.createdAt ? `Raised ${escapeHtml(String(task.raisedDate || task.createdAt).slice(0, 10))} · ` : ''}${task.completedDate ? `Completed ${escapeHtml(task.completedDate)} · ` : ''}${task.dueDate ? `Due ${escapeHtml(task.dueDate)} · ` : ''}${progress.total ? `${progress.completed} of ${progress.total} subtasks complete` : 'No subtasks'}</p><div class="eod-progress"><span style="width:${progress.percent}%"></span></div></div>${action === 'complete' ? `<div class="eod-task-actions"><button type="button" class="secondary-action" data-eod-complete-task="${escapeHtml(task.id)}">${task.status === 'complete' ? 'Completed' : 'Complete'}</button>${task.status !== 'complete' ? `<button type="button" class="text-button" data-add-to-huddle="${escapeHtml(task.id)}">Add to Huddle</button>` : ''}</div>` : `<label class="eod-task-select"><input type="checkbox" data-eod-tomorrow-task="${escapeHtml(task.id)}" ${selectedIds.includes(task.id) ? 'checked' : ''}><span>Make priority</span></label>`}</article>`;
}

export function createEodView({ eod, date, workItems = [], history = [], filter = 'all' }) {
  const tasks = workItems.filter((item) => ['action', 'priority'].includes(item.type) || item.source === 'eod');
  const outstandingTasks = tasks.filter((item) => item.status !== 'complete');
  const completedTasks = tasks.filter((item) => item.status === 'complete' && String(item.completedAt || '').startsWith(date));
  const completedSubtasks = completedTasks.reduce((count, task) => count + (task.subtasks || []).filter((subtask) => subtask.completed && String(subtask.completedAt || '').startsWith(date)).length, 0);
  const outstandingSubtasks = outstandingTasks.reduce((count, task) => count + eodTaskProgress(task).remaining, 0);
  const risks = workItems.filter((item) => item.type === 'risk' && item.status !== 'complete');
  const tomorrowIds = eod.tomorrowPriorityIds || [];
  const tomorrowTasks = tomorrowIds.map((id) => tasks.find((task) => task.id === id)).filter(Boolean);
  const visibleTasks = filter === 'completed' ? completedTasks : filter === 'outstanding' ? outstandingTasks : tasks;
  const filterPanel = filter === 'all' ? '' : `<section class="eod-filter-panel" aria-labelledby="eod-filter-title"><div class="section-heading"><div><p class="eyebrow">Filtered view</p><h2 id="eod-filter-title">${filter === 'outstanding' ? 'Outstanding Work' : filter === 'risks' ? 'Active Risks' : filter === 'tomorrow' ? "Tomorrow’s Priorities" : 'Completed Today'}</h2><p class="secondary-text">${filter === 'outstanding' ? `${outstandingTasks.length} tasks · ${outstandingSubtasks} subtasks still open.` : filter === 'risks' ? 'Open and watching risks that may affect tomorrow.' : filter === 'tomorrow' ? 'The work selected for the next leadership day.' : 'Work completed during today’s close-out.'}</p></div><button type="button" class="secondary-action" data-eod-clear-filter>Back to EOD</button></div>${filter === 'risks' ? `<div class="eod-risk-list">${risks.length ? risks.map((risk) => `<article class="eod-risk-card"><div><span class="status-chip status-chip--${risk.riskLevel === 'critical' ? 'warning' : 'neutral'}">${escapeHtml(risk.riskLevel || 'medium')}</span><h3>${escapeHtml(risk.title)}</h3><p><strong>Impact:</strong> ${escapeHtml(risk.impact || 'Not specified')} · <strong>Next:</strong> ${escapeHtml(risk.nextAction || 'Not recorded')}</p></div></article>`).join('') : '<div class="section-empty"><p>No active risks.</p><small>Nothing currently needs escalation.</small></div>'}</div>` : filter === 'tomorrow' ? `<div class="eod-filter-list">${tomorrowTasks.length ? tomorrowTasks.map((task, index) => `<article class="eod-filter-item"><strong>${index + 1}</strong><div><h3>${escapeHtml(task.title || task.outcome)}</h3><p>${escapeHtml(task.priority || 'Normal')} · ${task.dueDate ? `Due ${escapeHtml(task.dueDate)}` : 'No due date'}</p></div></article>`).join('') : '<div class="section-empty"><p>No priorities selected.</p><small>Choose up to three things that matter most tomorrow.</small></div>'}</div>` : `<div class="eod-filter-list">${visibleTasks.length ? visibleTasks.map((task) => `<article class="eod-filter-item"><div><h3>${escapeHtml(task.title || task.outcome)}</h3><p>${escapeHtml(task.priority || 'Normal')} · ${task.dueDate ? `Due ${escapeHtml(task.dueDate)}` : 'No due date'}${(task.subtasks || []).length ? ` · ${eodTaskProgress(task).completed} of ${task.subtasks.length} subtasks complete` : ''}</p>${filter === 'outstanding' && (task.subtasks || []).length ? `<ul>${task.subtasks.filter((subtask) => !subtask.completed).map((subtask) => `<li>${escapeHtml(subtask.title)}</li>`).join('')}</ul>` : ''}</div><button type="button" class="secondary-action" data-eod-complete-task="${escapeHtml(task.id)}">${filter === 'completed' ? 'Completed' : 'Complete'}</button></article>`).join('') : `<div class="section-empty"><p>${filter === 'completed' ? 'Nothing completed yet.' : 'Nothing outstanding.'}</p><small>${filter === 'completed' ? 'Completed work will appear here.' : 'You’re clear for tomorrow.'}</small></div>`}</div>`}</section>`;
  const active = eod.status === 'in-progress' && eod.step > 0 ? 'Continue End of Day' : eod.status === 'closed' ? "View Today's EOD" : 'Enter End of Day';
  const tile = (key, value, label, detail) => `<button type="button" class="eod-summary-tile eod-summary-tile--${key}" data-eod-filter="${key}"><strong>${value}</strong><span>${label}</span><small>${detail}</small></button>`;
  let wizard = '';
  if (eod.status === 'in-progress') {
    const step = Math.max(0, Math.min(4, eod.step || 0));
    const titles = ['Review Today', 'Outstanding Work', 'Risks', 'Tomorrow', 'Close Day'];
    let content = '';
    if (step === 0) content = `<p class="secondary-text">Review today’s work and close anything finished.</p><div class="eod-task-list">${visibleTasks.length ? visibleTasks.map((task) => eodTaskCard(task)).join('') : '<div class="section-empty"><p>Nothing recorded yet. Add a completed task below if you need to.</p></div>'}</div><form class="eod-inline-form" data-eod-task-form><input name="title" placeholder="Task completed today" required><input name="dueDate" type="date" aria-label="Due date"><button class="secondary-action" type="submit">+ Add completed task</button></form>`;
    if (step === 1) content = `<p class="secondary-text">Keep the open work visible without carrying it in your head.</p><div class="eod-task-list">${outstandingTasks.length ? outstandingTasks.map((task) => eodTaskCard(task)).join('') : '<div class="section-empty"><p>Nothing outstanding.</p><small>You’re clear for tomorrow.</small></div>'}</div><form class="eod-inline-form" data-eod-task-form><input name="title" placeholder="Add a task" required><input name="dueDate" type="date" aria-label="Due date"><select name="priority"><option>Normal</option><option>Low</option><option>High</option><option>Critical</option></select><button class="secondary-action" type="submit">+ Add Task</button></form>`;
    if (step === 2) content = `<p class="secondary-text">Capture anything that could affect tomorrow.</p><div class="eod-risk-list">${risks.length ? risks.map((risk) => `<article class="eod-risk-card"><div><span class="status-chip status-chip--${risk.riskLevel === 'critical' ? 'warning' : 'neutral'}">${escapeHtml(risk.riskLevel || 'medium')}</span><h3>${escapeHtml(risk.title)}</h3><p>${escapeHtml(risk.nextAction || 'No next action recorded.')}</p></div></article>`).join('') : '<div class="section-empty"><p>No active risks.</p><small>Nothing currently needs escalation.</small></div>'}</div><form class="eod-risk-form" data-eod-risk-form><input name="title" placeholder="What is at risk?" required><select name="impact"><option>Customer</option><option>People</option><option>Delivery</option><option>Operational</option><option>Financial</option><option>Other</option></select><select name="riskLevel"><option value="at-risk">Medium</option><option value="critical">High</option><option value="monitor">Low</option></select><textarea name="nextAction" rows="2" placeholder="What needs to happen next?"></textarea><button class="secondary-action" type="submit">+ Add Risk</button></form>`;
    if (step === 3) content = `<p class="secondary-text">Choose up to three things that matter most tomorrow.</p><div class="eod-task-list">${outstandingTasks.length ? outstandingTasks.map((task) => eodTaskCard(task, 'tomorrow', tomorrowIds)).join('') : '<div class="section-empty"><p>No priorities selected.</p><small>Choose up to three things that matter most tomorrow.</small></div>'}</div><div class="eod-tomorrow-selected"><h3>Tomorrow’s priorities</h3>${tomorrowTasks.length ? tomorrowTasks.map((task, index) => `<p><strong>${index + 1}</strong>${escapeHtml(task.title || task.outcome)}</p>`).join('') : '<p class="secondary-text">No priorities selected.</p>'}</div><label class="eod-handover-field">Tomorrow note<textarea data-eod-tomorrow-note rows="3" placeholder="Anything you need to remember before tomorrow begins…">${escapeHtml(eod.tomorrowNote || '')}</textarea></label>`;
    if (step === 4) content = `<div class="eod-close-summary"><div><strong>${completedTasks.length}</strong><span>Completed</span></div><div><strong>${outstandingTasks.length}</strong><span>Outstanding</span></div><div><strong>${outstandingSubtasks}</strong><span>Subtasks</span></div><div><strong>${risks.length}</strong><span>Risks</span></div></div>${risks.some((risk) => risk.riskLevel === 'critical') ? '<div class="eod-high-risk-warning"><strong>You have unresolved high-priority risks.</strong><span>You can review them or close anyway.</span></div>' : ''}<h3>Tomorrow</h3><ol class="eod-tomorrow-list">${tomorrowTasks.map((task) => `<li>${escapeHtml(task.title || task.outcome)}</li>`).join('') || '<li>No priorities selected.</li>'}</ol><label class="eod-handover-field">Handover note<textarea data-eod-handover-note rows="4" placeholder="What would someone need to know if you were unavailable tomorrow?">${escapeHtml(eod.handoverNote || '')}</textarea></label>`;
    wizard = `<section class="eod-wizard" aria-labelledby="eod-wizard-title"><div class="eod-wizard__top"><div><p class="eyebrow">Step ${step + 1} of 5</p><h2 id="eod-wizard-title">${titles[step]}</h2></div><div class="eod-progress-track"><span style="width:${((step + 1) / 5) * 100}%"></span></div></div>${content}<div class="eod-wizard-actions">${step > 0 ? '<button type="button" class="secondary-action" data-eod-back>Back</button>' : '<span></span>'}${step === 4 ? '<button type="button" class="primary-action" data-eod-close>Close My Day</button>' : '<button type="button" class="primary-action" data-eod-next>Continue <span aria-hidden="true">→</span></button>'}</div></section>`;
  }
  const historyMarkup = history.length ? `<section class="eod-history"><div class="section-heading"><div><p class="eyebrow">Past close-outs</p><h2>EOD History</h2></div></div><div class="eod-history-list">${history.map((item) => `<article><div><strong>${escapeHtml(item.date)}</strong><span>${item.status === 'closed' ? 'Closed' : 'In progress'} · ${item.completedTaskIds?.length || 0} completed · ${item.carriedForwardIds?.length || 0} carried to Huddle · ${item.riskIds?.length || 0} risks</span></div><button type="button" class="text-button" data-eod-history-id="${escapeHtml(item.id)}">View summary</button></article>`).join('')}</div></section>` : '';
  if (eod.status === 'closed') wizard = `<section class="eod-closed-state"><div class="completion-mark" aria-hidden="true">✓</div><p class="eyebrow">Today’s close-out</p><h2>Day Closed</h2><p class="secondary-text">Tomorrow is already clearer.</p><div class="eod-close-summary"><div><strong>${completedTasks.length}</strong><span>Completed</span></div><div><strong>${outstandingTasks.length}</strong><span>Outstanding</span></div><div><strong>${risks.length}</strong><span>Risks</span></div><div><strong>${tomorrowTasks.length}</strong><span>Tomorrow</span></div></div><div class="eod-closed-actions"><button type="button" class="secondary-action" data-eod-filter="completed">View Summary</button><button type="button" class="secondary-action" data-eod-edit-current>Edit Today’s EOD</button></div></section>`;
  return `<section class="eod-command" aria-labelledby="eod-title"><div class="eod-intro"><div><p class="eyebrow">Review · Prepare</p><h2 id="eod-title">End of Day</h2><p class="secondary-text">Close today. Prepare tomorrow.</p></div><div class="eod-date">${escapeHtml(date)}</div></div><div class="eod-actions"><button type="button" class="primary-action" data-eod-enter>${active} <span aria-hidden="true">→</span></button><button type="button" class="secondary-action" data-eod-history>EOD History</button></div><div class="eod-summary-grid">${tile('outstanding', outstandingTasks.length + outstandingSubtasks, 'Outstanding', `${outstandingTasks.length} tasks · ${outstandingSubtasks} subtasks`)}${tile('risks', risks.length, 'Risks', 'Active risks and issues')}${tile('tomorrow', tomorrowTasks.length, "Tomorrow’s Priorities", 'Selected for tomorrow')}${tile('completed', completedTasks.length + completedSubtasks, 'Completed Today', `${completedTasks.length} tasks · ${completedSubtasks} subtasks`)}</div>${outstandingTasks.length ? `<section class="eod-carry-forward"><div><p class="eyebrow">Continuity</p><h2>Carry outstanding work forward</h2><p class="secondary-text">Add ${outstandingTasks.length} tasks and ${outstandingSubtasks} subtasks to the next Morning Huddle without creating duplicates.</p></div><div class="eod-carry-forward__actions"><button type="button" class="primary-action" data-eod-add-all-huddle>Add all to next Huddle <span aria-hidden="true">→</span></button><button type="button" class="secondary-action" data-eod-review-items>Review items</button><button type="button" class="text-button" data-eod-not-now>Not now</button></div></section>` : ''}${filterPanel}${wizard}${historyMarkup}</section>`;
}

export function createEodHistoryDialog(record = {}) {
  return `<dialog id="eod-history-dialog" class="modal eod-history-dialog" aria-labelledby="eod-history-title"><div class="modal__header"><div><p class="eyebrow">EOD History · ${escapeHtml(record.status === 'closed' ? 'Closed' : 'In progress')}</p><h2 id="eod-history-title">${escapeHtml(record.date || 'End of Day')}</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close EOD history">×</button></div><form class="modal__body" data-eod-history-edit><input type="hidden" name="id" value="${escapeHtml(record.id || '')}"><div class="eod-close-summary"><div><strong>${record.completedTaskIds?.length || 0}</strong><span>Completed</span></div><div><strong>${record.outstandingTaskIds?.length || 0}</strong><span>Outstanding</span></div><div><strong>${record.riskIds?.length || 0}</strong><span>Risks</span></div><div><strong>${record.tomorrowPriorityIds?.length || 0}</strong><span>Tomorrow</span></div></div><label class="eod-handover-field">Tomorrow note<textarea name="tomorrowNote" rows="3">${escapeHtml(record.tomorrowNote || '')}</textarea></label><label class="eod-handover-field">Handover note<textarea name="handoverNote" rows="4">${escapeHtml(record.handoverNote || '')}</textarea></label><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Cancel</button><button type="submit" class="primary-action">Save EOD changes</button></div></form></dialog>`;
}

export function createPrioritySheet() {
  return `<dialog id="priority-sheet" class="modal bottom-sheet-dialog" aria-labelledby="priority-sheet-title"><div class="modal__header"><div><p class="eyebrow">One clear commitment</p><h2 id="priority-sheet-title">Add a priority</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close priority editor">×</button></div><form class="modal__body priority-form" data-priority-form><input type="hidden" name="id"><label>Outcome<input name="outcome" maxlength="120" required placeholder="What result matters most?"></label>${createContextualGuidance('set-priorities', 'See how to set priorities')}<label>Why it matters<textarea name="why" maxlength="220" rows="3" placeholder="What will this make possible?"></textarea></label><label>Due point<input name="duePoint" maxlength="80" placeholder="For example, before Friday's review"></label><label>Status<select name="status"><option value="not-started">Not started</option><option value="in-progress">In progress</option><option value="done">Complete</option></select></label><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Cancel</button><button type="submit" class="primary-action">Save priority</button></div></form></dialog>`;
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
  const raised = item.raisedDate ? `<span>Raised ${escapeHtml(workDateLabel(item.raisedDate))}</span>` : '';
  const completed = item.completedDate ? `<span>Completed ${escapeHtml(workDateLabel(item.completedDate))}</span>` : '';
  const age = item.status !== 'complete' && item.raisedDate ? `<span class="work-age work-age--${workAgeClass(item.raisedDate)}">${workAge(item.raisedDate)}</span>` : '';
  return `<article class="work-card ${item.status === 'complete' ? 'work-card--complete' : ''}" data-work-id="${item.id}"><div class="work-card__top"><div><span class="work-type">${workTypes[item.type] || 'Action'}</span><h3>${escapeHtml(item.title || item.outcome || 'Untitled work item')}</h3></div><span class="status-chip status-chip--${statusClass}">${escapeHtml(workStatusLabel(item.status))}</span></div><p class="work-card__outcome">${escapeHtml(item.outcome || item.nextAction || item.impact || 'No outcome added yet.')}</p><div class="work-card__meta">${raised}${completed}${age}<span>${item.dueDate ? escapeHtml(workDateLabel(item.dueDate)) : 'No due point'}</span>${item.responsible ? `<span>With ${escapeHtml(item.responsible)}</span>` : ''}${item.group === 'waiting' ? `<span class="waiting-note">Awaiting ${escapeHtml(item.followedUpWith || item.responsible || 'a response')} · next follow-up ${escapeHtml(workDateLabel(item.dueDate))}</span>` : ''}${item.relatedItemIds?.length ? `<span>${item.relatedItemIds.length} related</span>` : ''}</div><div class="work-card__actions"><button class="text-button" type="button" data-edit-work="${item.id}">Open details</button>${item.status === 'complete' ? '<button class="text-button" type="button" data-undo-work>Undo</button>' : `<button class="text-button" type="button" data-complete-work="${item.id}">Complete</button><button class="text-button" type="button" data-add-to-huddle="${item.id}">Add to Huddle</button>`}<button class="text-button text-button--quiet" type="button" data-delete-work="${item.id}">Delete</button></div></article>`;
}

function workAgeClass(raisedDate) {
  const days = Math.max(0, Math.round((new Date(`${dateOnly()}T12:00:00`) - new Date(`${raisedDate}T12:00:00`)) / 86400000));
  return days >= 6 ? 'attention' : days >= 3 ? 'warning' : 'normal';
}

function workAge(raisedDate) {
  const days = Math.max(0, Math.round((new Date(`${dateOnly()}T12:00:00`) - new Date(`${raisedDate}T12:00:00`)) / 86400000));
  return `Open ${days} day${days === 1 ? '' : 's'}`;
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
    return `<div class="type-fields">${createContextualGuidance('managing-risk')}<label>What is at risk?<textarea name="whatAtRisk" rows="2">${escapeHtml(item.whatAtRisk || '')}</textarea></label><label>Impact<textarea name="impact" rows="2">${escapeHtml(item.impact || '')}</textarea></label><label>Immediate action<textarea name="immediateAction" rows="2">${escapeHtml(item.immediateAction || '')}</textarea></label><label>What is required?<textarea name="required" rows="2">${escapeHtml(item.required || '')}</textarea></label><label>Review date<input type="date" name="reviewDate" value="${escapeHtml(item.reviewDate || '')}"></label><label class="check-row"><input type="checkbox" name="escalationRequired" ${item.escalationRequired ? 'checked' : ''}> Escalation required</label></div>`;
  if (type === 'decision')
    return `<div class="type-fields">${createContextualGuidance('make-decisions')}<label>Decision required<textarea name="decisionRequired" rows="2">${escapeHtml(item.decisionRequired || '')}</textarea></label><label>Why it matters<textarea name="whyMatters" rows="2">${escapeHtml(item.whyMatters || '')}</textarea></label><label>Options<textarea name="options" rows="3" placeholder="One option per line">${escapeHtml(item.options || '')}</textarea></label><label>Decision made<textarea name="decisionMade" rows="2">${escapeHtml(item.decisionMade || '')}</textarea></label><label>Resulting action<textarea name="resultingAction" rows="2">${escapeHtml(item.resultingAction || '')}</textarea></label></div>`;
  if (type === 'follow-up')
    return `<div class="type-fields">${createContextualGuidance('following-up')}<label>What needs to happen?<textarea name="whatNeedsToHappen" rows="2">${escapeHtml(item.whatNeedsToHappen || '')}</textarea></label><label>Who or what is being followed up?<input name="followedUpWith" value="${escapeHtml(item.followedUpWith || '')}"></label><label>Why?<textarea name="why" rows="2">${escapeHtml(item.why || '')}</textarea></label><label>Result<textarea name="result" rows="2">${escapeHtml(item.result || '')}</textarea></label></div>`;
  return '';
}

export function createWorkDetailSheet(item = {}) {
  const type = item.type || 'action';
  const subtasks = item.subtasks || [];
  const subtaskProgress = subtasks.length ? Math.round((subtasks.filter((subtask) => subtask.completed).length / subtasks.length) * 100) : item.status === 'complete' ? 100 : 0;
  const taskProgress = ['action', 'priority'].includes(type) ? `<section class="task-progress-panel"><div class="section-heading"><div><p class="eyebrow">Task progress</p><h3>Subtasks</h3></div><strong>${subtaskProgress}%</strong></div><div class="task-progress-bar"><span style="width:${subtaskProgress}%"></span></div><p class="secondary-text">${subtasks.filter((subtask) => subtask.completed).length} of ${subtasks.length} subtasks complete</p><label>Subtasks <span class="field-hint">one per line</span><textarea name="subtasksText" rows="4" placeholder="Add the steps that make this outcome complete">${escapeHtml(subtasks.map((subtask) => subtask.title).join('\n'))}</textarea></label></section>` : '';
  const history = (item.movementHistory || []).slice().sort((a, b) => String(a.timestamp).localeCompare(String(b.timestamp)));
  const historyMarkup = item.id ? `<details class="work-history"><summary>History</summary><div class="work-history__timeline">${history.length ? history.map((event) => `<div><time>${escapeHtml(workDateLabel(event.date || event.timestamp?.slice(0, 10)))}</time><p><strong>${escapeHtml(event.action)}</strong>${event.note ? ` · ${escapeHtml(event.note)}` : ''}</p></div>`).join('') : '<p class="secondary-text">No history recorded yet.</p>'}</div></details>` : '';
  const metadata = item.id ? `<dl class="work-detail-meta"><div><dt>Raised</dt><dd>${escapeHtml(item.raisedDate || 'Not recorded')}</dd></div><div><dt>Completed</dt><dd>${escapeHtml(item.completedDate || 'Open')}</dd></div></dl>` : '';
  return `<dialog id="work-detail" class="modal work-detail-dialog" aria-labelledby="work-detail-title"><div class="modal__header"><div><p class="eyebrow">${item.id ? 'Work item' : 'Quick add'}</p><h2 id="work-detail-title">${item.id ? 'Work item details' : 'Add work item'}</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close work item">×</button></div><form class="modal__body work-form" data-work-form><input type="hidden" name="id" value="${escapeHtml(item.id || '')}"><div class="form-two-col"><label>Type<select name="type"><option value="action" ${type === 'action' ? 'selected' : ''}>Action</option><option value="priority" ${type === 'priority' ? 'selected' : ''}>Priority</option><option value="risk" ${type === 'risk' ? 'selected' : ''}>Risk</option><option value="decision" ${type === 'decision' ? 'selected' : ''}>Decision</option><option value="follow-up" ${type === 'follow-up' ? 'selected' : ''}>Follow-up</option></select></label><label>Group<select name="group"><option value="now" ${item.group === 'now' ? 'selected' : ''}>Now</option><option value="next" ${!item.group || item.group === 'next' ? 'selected' : ''}>Next</option><option value="later" ${item.group === 'later' ? 'selected' : ''}>Later</option><option value="waiting" ${item.group === 'waiting' ? 'selected' : ''}>Waiting</option></select></label></div><label>Title<input name="title" maxlength="140" value="${escapeHtml(item.title || '')}" required placeholder="What needs your leadership?"></label><label>Outcome<textarea name="outcome" rows="2" placeholder="What will be different when this is done?">${escapeHtml(item.outcome || '')}</textarea></label><div class="form-two-col"><label>Responsible person or area <span class="field-hint">optional plain text</span><input name="responsible" value="${escapeHtml(item.responsible || '')}"></label><label>Due date or time<input type="date" name="dueDate" value="${escapeHtml(item.dueDate || '')}"></label></div><div class="form-two-col"><label>Status<select name="status">${workStatusOptions(type, item.status)}</select></label><label>Risk level<select name="riskLevel"><option value="monitor" ${item.riskLevel === 'monitor' ? 'selected' : ''}>Monitor</option><option value="at-risk" ${item.riskLevel === 'at-risk' ? 'selected' : ''}>At risk</option><option value="critical" ${item.riskLevel === 'critical' ? 'selected' : ''}>Critical</option></select></label></div>${metadata}${taskProgress}<label class="check-row"><input type="checkbox" name="blocked" ${item.blocked ? 'checked' : ''}> Blocked</label><label>What’s blocking this?<textarea name="blockerNote" rows="2" placeholder="Optional short blocker note">${escapeHtml(item.blockerNote || '')}</textarea></label><label>Waiting on <input name="waitingOn" value="${escapeHtml(item.waitingOn || '')}" placeholder="Optional person, area or dependency"></label><label>Next action<textarea name="nextAction" rows="2">${escapeHtml(item.nextAction || '')}</textarea></label><label>Notes<textarea name="notes" rows="3">${escapeHtml(item.notes || '')}</textarea></label><label>Related item IDs <span class="field-hint">optional, comma separated</span><input name="relatedItemIds" value="${escapeHtml((item.relatedItemIds || []).join(', '))}"></label><div data-type-fields>${workTypeFields(type, item)}</div>${item.id && item.status !== 'complete' ? '<button type="button" class="secondary-action" data-add-to-huddle="' + escapeHtml(item.id) + '">Add to Huddle</button>' : ''}${historyMarkup}<p class="autosave-note" data-autosave-note>Changes save automatically.</p><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Close</button><button type="submit" class="primary-action">Save item</button></div></form></dialog>`;
}

export function createHuddlePickerDialog(item = {}, nextWorkday = dateOnly()) {
  return `<dialog id="huddle-picker-dialog" class="modal" aria-labelledby="huddle-picker-title"><div class="modal__header"><div><p class="eyebrow">Morning Huddle</p><h2 id="huddle-picker-title">Add to Huddle</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close Huddle date picker">×</button></div><form class="modal__body" data-huddle-picker-form><input type="hidden" name="itemId" value="${escapeHtml(item.id || '')}"><p class="secondary-text">Keep the existing work item and make it visible on the selected Huddle date.</p><label>Huddle date<input type="date" name="huddleDate" value="${escapeHtml(nextWorkday)}" required></label><div class="modal__actions"><button type="button" class="secondary-action" data-huddle-next-workday>Next Workday</button><button type="button" class="secondary-action" data-close-dialog>Cancel</button><button type="submit" class="primary-action">Add to Huddle</button></div></form></dialog>`;
}

export function createEodCarryReviewDialog(tasks = [], nextWorkday = dateOnly()) {
  return `<dialog id="eod-carry-review-dialog" class="modal" aria-labelledby="eod-carry-review-title"><div class="modal__header"><div><p class="eyebrow">Carry Forward</p><h2 id="eod-carry-review-title">Review items for the next Huddle</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close carry-forward review">×</button></div><form class="modal__body" data-eod-carry-review-form><p class="secondary-text">All outstanding work is selected. Deselect anything that does not need Huddle visibility.</p><label>Huddle date<input type="date" name="huddleDate" value="${escapeHtml(nextWorkday)}" required></label><div class="carry-review-list">${tasks.map((task) => `<label class="carry-review-item"><input type="checkbox" name="itemId" value="${escapeHtml(task.id)}" checked><span><strong>${escapeHtml(task.title || task.outcome)}</strong><small>${escapeHtml(task.priority || 'Standard')} · ${task.subtasks?.filter((item) => !item.completed).length || 0} incomplete subtasks${task.blocked ? ' · Blocked' : task.status === 'waiting' ? ' · Waiting' : ''}</small></span></label>`).join('')}</div><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Cancel</button><button type="submit" class="primary-action">Add selected</button></div></form></dialog>`;
}

export function createHuddleView(date, workItems, huddleItems, availableDates = []) {
  const refs = huddleItems.map((ref) => {
    const parent = workItems.find((item) => item.id === (ref.parentItemId || ref.itemId));
    const subtask = ref.itemType === 'subtask' ? parent?.subtasks?.find((item) => item.id === ref.itemId) : null;
    return { ref, item: subtask ? { ...parent, id: ref.itemId, title: subtask.title, status: subtask.completed ? 'complete' : 'not-started', raisedDate: subtask.raisedDate || parent.raisedDate, completedDate: subtask.completedDate } : parent };
  }).filter(({ item }) => item);
  const grouped = refs.reduce((groups, { ref, item }) => { const key = item.id; if (!groups[key]) groups[key] = { ref, item }; return groups; }, {});
  const dateSwitcher = `<button type="button" class="primary-action" data-huddle-add-new>Add work item <span aria-hidden="true">＋</span></button>${availableDates.length ? `<div class="huddle-date-switcher" role="group" aria-label="Huddle dates">${availableDates.map((availableDate) => `<button type="button" class="text-button ${availableDate === date ? 'text-button--selected' : ''}" data-huddle-date="${escapeHtml(availableDate)}">${escapeHtml(workDateLabel(availableDate))}</button>`).join('')}</div>` : ''}`;
  return `<section class="huddle-command" aria-labelledby="huddle-title"><div class="review-intro"><div><p class="eyebrow">Prepare · Align</p><h2 id="huddle-title">Morning Huddle</h2><p class="secondary-text">${escapeHtml(workDateLabel(date))} · Carried work stays connected to the original item.</p></div>${dateSwitcher}</div><section class="today-section" aria-labelledby="carried-forward-title"><div class="section-heading"><div><p class="eyebrow">Continuity</p><h2 id="carried-forward-title">Carried forward</h2></div><span class="section-count">${Object.keys(grouped).length}</span></div>${Object.keys(grouped).length ? `<div class="work-list">${Object.values(grouped).map(({ item }) => { const incomplete = (item.subtasks || []).filter((subtask) => !subtask.completed); const carryCount = (item.movementHistory || []).filter((event) => ['Copied to Huddle', 'Carried Forward', 'Moved to Huddle'].includes(event.action)).length; return `<article class="work-card ${item.status === 'complete' ? 'work-card--complete' : ''}"><div class="work-card__top"><div><span class="work-type">${escapeHtml(item.priority || item.type || 'Action')}</span><h3>${escapeHtml(item.title || item.outcome)}</h3></div><span class="status-chip status-chip--${item.status === 'complete' ? 'success' : item.blocked ? 'warning' : 'neutral'}">${item.status === 'complete' ? 'Completed' : item.blocked ? 'Blocked' : item.status === 'waiting' ? 'Waiting' : 'Open'}</span></div><div class="work-card__meta"><span>Raised ${escapeHtml(workDateLabel(item.raisedDate || item.createdAt?.slice(0, 10)))}</span><span>Open ${escapeHtml(workAge(item.raisedDate || item.createdAt?.slice(0, 10)).replace('Open ', ''))}</span>${item.dueDate ? `<span>Due ${escapeHtml(workDateLabel(item.dueDate))}</span>` : ''}${carryCount > 1 ? `<span>Carried forward ${carryCount} times</span>` : ''}</div>${incomplete.length ? `<p class="work-card__outcome">${incomplete.length} incomplete subtask${incomplete.length === 1 ? '' : 's'}: ${escapeHtml(incomplete.map((subtask) => subtask.title).join(' · '))}</p>` : ''}<div class="work-card__actions">${item.status === 'complete' ? '' : `<button type="button" class="text-button" data-complete-work="${escapeHtml(item.id)}">Complete</button><button type="button" class="text-button" data-huddle-add-today="${escapeHtml(item.id)}">Add to Today</button><button type="button" class="text-button" data-huddle-block="${escapeHtml(item.id)}">${item.blocked ? 'Unblock' : 'Block'}</button><button type="button" class="text-button" data-huddle-move="${escapeHtml(item.id)}">Move</button>`}<button type="button" class="text-button" data-edit-work="${escapeHtml(item.id)}">Open details</button></div></article>`; }).join('')}</div>` : '<div class="section-empty"><p>No carried-forward work for this Huddle.</p><small>Add an outstanding item from Work or End of Day.</small></div>'}</section></section>${createWorkDetailSheet()}`;
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

export function createL10MetricChart(metric, entries) {
  const points = entries
    .filter((entry) => entry.metricId === metric.id && Number.isFinite(Number(entry.actual)))
    .sort((a, b) => String(a.weekStart).localeCompare(String(b.weekStart)))
    .slice(-8)
    .map((entry) => ({
      label: String(entry.weekStart || '').slice(5),
      actual: Number(entry.actual),
      goal: Number(entry.goal ?? metric.weeklyGoal),
    }));
  const chartLabel = `${metric.name} weekly actual versus goal`;
  if (!points.length) return `<article class="l10-chart l10-chart--empty"><div class="l10-chart__heading"><div><span class="work-type">${escapeHtml(metric.area || 'Team area')}</span><h3>${escapeHtml(metric.name)}</h3></div><span class="secondary-text">No weekly data yet</span></div><p class="secondary-text">Save a weekly number to start the local trend.</p></article>`;
  const width = 560;
  const height = 190;
  const pad = { top: 18, right: 18, bottom: 32, left: 42 };
  const maxValue = Math.max(...points.flatMap((point) => [point.actual, point.goal]), 1);
  const minValue = Math.min(...points.flatMap((point) => [point.actual, point.goal]), 0);
  const range = Math.max(maxValue - minValue, 1);
  const x = (index) => pad.left + (points.length === 1 ? (width - pad.left - pad.right) / 2 : index * (width - pad.left - pad.right) / (points.length - 1));
  const y = (value) => pad.top + (maxValue - value) * (height - pad.top - pad.bottom) / range;
  const actualLine = points.map((point, index) => `${x(index)},${y(point.actual)}`).join(' ');
  const goalLine = points.map((point, index) => `${x(index)},${y(point.goal)}`).join(' ');
  const labels = points.map((point, index) => `<text x="${x(index)}" y="${height - 9}" text-anchor="middle">${escapeHtml(point.label)}</text>`).join('');
  const dots = points.map((point, index) => `<circle class="l10-chart__dot" cx="${x(index)}" cy="${y(point.actual)}" r="4"><title>${escapeHtml(point.label)}: actual ${point.actual}, goal ${point.goal}</title></circle>`).join('');
  const latest = points[points.length - 1];
  const status = scorecardStatus(latest.goal, latest.actual, metric.direction);
  const statusLabel = status === 'on-track' ? 'On track' : 'Off track';
  const light = status === 'on-track' ? 'green' : 'red';
  return `<article class="l10-chart" aria-label="${escapeHtml(chartLabel)}"><div class="l10-chart__heading"><div><span class="work-type">${escapeHtml(metric.area || 'Team area')}</span><h3>${escapeHtml(metric.name)}</h3></div><span class="l10-traffic-light l10-traffic-light--${light}" role="img" aria-label="Latest result: ${statusLabel}"><span aria-hidden="true">●</span><strong>${statusLabel}</strong></span></div><svg class="l10-chart__svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(chartLabel)}"><line class="l10-chart__axis" x1="${pad.left}" y1="${height - pad.bottom}" x2="${width - pad.right}" y2="${height - pad.bottom}"></line><polyline class="l10-chart__goal" points="${goalLine}"></polyline><polyline class="l10-chart__actual" points="${actualLine}"></polyline>${dots}${labels}</svg><div class="l10-chart__legend"><span><i class="l10-chart__legend-line l10-chart__legend-line--actual"></i>Actual</span><span><i class="l10-chart__legend-line l10-chart__legend-line--goal"></i>Goal</span><span>Latest: ${latest.actual}</span></div></article>`;
}

export function createL10View({ settings, meeting, metrics, entries, rocks, issues, history, weekStart }) {
  const active = meeting?.currentSection || 'segue';
  const agenda = L10_AGENDA.map((section, index) => `<button type="button" class="l10-agenda-item ${active === section.id ? 'l10-agenda-item--active' : ''} ${meeting?.sectionStatus?.[section.id] ? 'l10-agenda-item--done' : ''}" data-l10-section="${section.id}"><span>${index + 1}</span><strong>${section.label}</strong><small>${section.minutes} min</small></button>`).join('');
  const currentEntries = entries.filter((entry) => entry.weekStart === weekStart);
  const metricRows = metrics.filter((metric) => metric.active !== false).map((metric) => {
    const entry = currentEntries.find((item) => item.metricId === metric.id) || {};
    const status = scorecardStatus(entry.goal ?? metric.weeklyGoal, entry.actual, metric.direction);
    const statusLabel = status === 'on-track' ? 'On track' : status === 'off-track' ? 'Off track' : 'Not entered';
    const light = status === 'on-track' ? 'green' : status === 'off-track' ? 'red' : 'amber';
    return `<article class="l10-record-card"><div><span class="work-type">${escapeHtml(metric.area || 'Team area')}</span><h3>${escapeHtml(metric.name)}</h3><p>Goal: ${escapeHtml(entry.goal ?? metric.weeklyGoal ?? 'Not set')} · Actual: ${escapeHtml(entry.actual ?? 'Not entered')}</p></div><span class="l10-traffic-light l10-traffic-light--${light}" role="img" aria-label="${statusLabel}"><span aria-hidden="true">●</span><strong>${statusLabel}</strong></span><div class="l10-record-actions"><button type="button" class="text-button" data-l10-edit-metric="${metric.id}">Edit</button><button type="button" class="text-button text-button--quiet" data-l10-delete-metric="${metric.id}">Delete</button><button type="button" class="text-button" data-l10-metric-issue="${metric.id}">Add to Issues</button></div></article>`;
  }).join('');
  const rockRows = rocks.map((rock) => `<article class="l10-record-card"><div><span class="work-type">${escapeHtml(rock.area || 'Team area')}</span><h3>${escapeHtml(rock.outcome)}</h3><p>Due ${escapeHtml(rock.dueDate || 'Not set')}</p></div><span class="status-chip status-chip--${rock.status === 'on-track' ? 'success' : rock.status === 'off-track' ? 'warning' : 'neutral'}">${escapeHtml(rock.status || 'on-track')}</span><button type="button" class="text-button" data-l10-rock-issue="${rock.id}">Add to Issues</button></article>`).join('');
  const issueRows = issues.sort((a, b) => (a.priorityOrder || 0) - (b.priorityOrder || 0)).map((issue) => `<article class="l10-record-card"><div><span class="work-type">${escapeHtml(issue.source || 'manual')}</span><h3>${escapeHtml(issue.title)}</h3><p>${escapeHtml(issue.status || 'open')}</p></div><button type="button" class="secondary-action" data-l10-open-issue="${issue.id}">Work in IDS</button></article>`).join('');
  let sectionContent = '';
  if (active === 'segue') sectionContent = `<form class="l10-section-form" data-l10-segue-form><label>Leadership best<textarea name="leadershipBest" rows="2">${escapeHtml(meeting.segue?.leadershipBest || '')}</textarea></label><label>Business, customer, or community best<textarea name="businessBest" rows="2">${escapeHtml(meeting.segue?.businessBest || '')}</textarea></label><label>Optional reflection<textarea name="reflection" rows="2">${escapeHtml(meeting.segue?.reflection || '')}</textarea></label><button class="primary-action" type="submit">Save and continue</button></form>`;
  if (active === 'scorecard') sectionContent = `<div class="l10-section-form"><p class="secondary-text">Review the weekly numbers only. Add off-track items to IDS for discussion.</p><section class="l10-chart-grid" aria-label="Scorecard trends">${metrics.filter((metric) => metric.active !== false).map((metric) => createL10MetricChart(metric, entries)).join('') || '<div class="section-empty"><p>Add a scorecard metric below to start plotting trends.</p></div>'}</section><div class="l10-record-list">${metricRows || '<div class="section-empty"><p>No scorecard metrics yet.</p></div>'}</div><form data-l10-scorecard-entry-form><label>Metric<select name="metricId">${metrics.map((metric) => `<option value="${metric.id}">${escapeHtml(metric.name)}</option>`).join('')}</select></label><div class="form-two-col"><label>Goal<input name="goal" type="number" step="any" required></label><label>Actual<input name="actual" type="number" step="any" required></label></div><label>Note<textarea name="note" rows="2"></textarea></label><button class="secondary-action" type="submit">Save weekly number</button></form></div>`;
  if (active === 'rocks') sectionContent = `<div class="l10-section-form"><div class="l10-record-list">${rockRows || '<div class="section-empty"><p>No Rocks yet.</p></div>'}</div><form data-l10-rock-form><label>Outcome<input name="outcome" required></label><div class="form-two-col"><label>Area<input name="area"></label><label>Due date<input name="dueDate" type="date"></label></div><button class="secondary-action" type="submit">Add Rock</button></form></div>`;
  if (active === 'headlines') sectionContent = `<form class="l10-section-form" data-l10-headline-form><label>Headline type<select name="type"><option value="customer">Customer/community</option><option value="team">Team area</option><option value="operating">Operating</option></select></label><label>Area<input name="area"></label><label>Headline<textarea name="text" rows="2" required></textarea></label><label><input type="checkbox" name="concern"> This needs attention</label><button class="primary-action" type="submit">Save headline</button></form><div class="l10-headline-list">${(meeting.headlines || []).map((headline) => `<p><strong>${escapeHtml(headline.type)}</strong> · ${escapeHtml(headline.text)}</p>`).join('')}</div>`;
  if (active === 'todos') sectionContent = `<div class="l10-section-form"><div class="l10-record-list">${(meeting.todos || []).map((todo) => `<article class="l10-record-card"><div><h3>${escapeHtml(todo.title)}</h3><p>${escapeHtml(todo.area || 'Team area')} · due ${escapeHtml(todo.dueDate || 'Not set')}</p></div><button type="button" class="text-button" data-l10-todo-toggle="${todo.id}">${todo.status === 'done' ? 'Done' : 'Not done'}</button></article>`).join('') || '<div class="section-empty"><p>No previous To-Dos.</p></div>'}</div><form data-l10-todo-form><label>To-Do<input name="title" required></label><div class="form-two-col"><label>Area<input name="area"></label><label>Due date<input name="dueDate" type="date"></label></div><button class="secondary-action" type="submit">Add To-Do</button></form></div>`;
  if (active === 'ids') sectionContent = `<div class="l10-section-form"><div class="l10-record-list">${issueRows || '<div class="section-empty"><p>No Issues yet. Add one from the form below.</p></div>'}</div><form data-l10-issue-form><label>Issue<input name="title" required placeholder="State the issue, not only the symptom"></label><label>Area<input name="area"></label><button class="secondary-action" type="submit">Add issue to IDS</button></form></div>`;
  if (active === 'conclude') sectionContent = `<form class="l10-section-form" data-l10-conclude-form><label>Cascading message<textarea name="cascadingMessage" rows="2"></textarea></label><label>Meeting improvement<textarea name="meetingImprovement" rows="2">${escapeHtml(meeting.meetingImprovement || '')}</textarea></label><label>Meeting rating (1–10)<input name="rating" type="number" min="1" max="10" value="${escapeHtml(meeting.rating || '')}" required></label><button class="primary-action" type="submit">Complete L10 meeting</button></form>`;
  return `<section class="l10-command" aria-labelledby="l10-title"><div class="l10-intro"><div><p class="eyebrow">Weekly leadership meeting</p><h2 id="l10-title">L10 Meeting</h2><p class="secondary-text">${escapeHtml(weekStart)} · week ending ${escapeHtml(meeting.weekEnd || '')} · 90 minutes · local-only workspace</p></div><span class="review-time">${L10_AGENDA.reduce((total, section) => total + section.minutes, 0)} min</span></div><div class="review-switcher" role="group" aria-label="Review period"><a href="#review" class="secondary-action">Daily review</a><a href="#review/weekly" class="secondary-action">Weekly review</a><a href="#review/l10" class="secondary-action review-switcher--active">L10 meeting</a></div><div class="l10-layout"><aside class="l10-agenda" aria-label="L10 agenda">${agenda}</aside><section class="l10-active-section" aria-labelledby="l10-section-title"><p class="eyebrow">${L10_AGENDA.find((item) => item.id === active)?.minutes} minutes</p><h2 id="l10-section-title">${L10_AGENDA.find((item) => item.id === active)?.label}</h2>${sectionContent}<button type="button" class="secondary-action" data-l10-next>Save section and continue</button></section></div><section class="l10-resources"><div class="section-heading"><div><p class="eyebrow">Operating setup</p><h2>Scorecard and team areas</h2></div></div><form data-l10-metric-form class="form-two-col"><label>New scorecard metric<input name="name" placeholder="e.g. Follow-ups completed on time" required></label><label>Area<input name="area" placeholder="Operations"></label><label>Direction<select name="direction"><option value="at-least">At least</option><option value="at-most">At most</option></select></label><label>Weekly goal<input name="weeklyGoal" type="number" step="any" required></label><button class="secondary-action" type="submit">Add metric</button></form><p class="secondary-text">${settings.teamAreas?.length ? `Areas: ${settings.teamAreas.map(escapeHtml).join(' · ')}` : 'Use team areas rather than employee profiles.'}</p></section><details class="l10-history"><summary>Previous L10 meetings (${history.length})</summary><div>${history.map((item) => `<article class="l10-history-row"><div><p>${escapeHtml(item.weekStart)}${item.weekEnd ? ` – ${escapeHtml(item.weekEnd)}` : ''} · ${item.completedAt ? 'Complete' : 'In progress'} · rating ${escapeHtml(item.rating || 'Not rated')}</p></div><button type="button" class="secondary-action" data-l10-history-id="${item.id}">View details</button></article>`).join('') || '<p>No previous meetings yet.</p>'}</div></details></section>`;
}

export function createL10IssueDialog(issue = {}) {
  return `<dialog id="l10-issue-dialog" class="modal work-detail-dialog" aria-labelledby="l10-issue-title"><div class="modal__header"><div><p class="eyebrow">IDS</p><h2 id="l10-issue-title">Work the issue</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close issue">×</button></div><form class="modal__body work-form" data-l10-ids-form><input type="hidden" name="id" value="${escapeHtml(issue.id || '')}"><label>Issue title<input name="title" value="${escapeHtml(issue.title || '')}" required></label><label>Identify<textarea name="identify" rows="3">${escapeHtml(issue.identify || '')}</textarea></label><label>Discuss<textarea name="discuss" rows="3">${escapeHtml(issue.discuss || '')}</textarea></label><label>Solve<textarea name="solve" rows="3">${escapeHtml(issue.solve || '')}</textarea></label><div class="form-two-col"><label>Status<select name="status">${['open', 'in-discussion', 'solved', 'carried-forward'].map((value) => `<option value="${value}" ${issue.status === value ? 'selected' : ''}>${value}</option>`).join('')}</select></label><label>Convert solution<select name="conversion"><option value="">No conversion</option><option value="decision">Create decision</option><option value="follow-up">Create follow-up</option><option value="improvement">Create improvement</option><option value="message">Cascading message</option></select></label></div><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Cancel</button><button type="submit" class="primary-action">Save IDS outcome</button></div></form></dialog>`;
}

export function createL10SettingsDialog(settings = {}) {
  return `<dialog id="l10-settings-dialog" class="modal" aria-labelledby="l10-settings-title"><div class="modal__header"><div><p class="eyebrow">L10 setup</p><h2 id="l10-settings-title">Meeting setup</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close meeting setup">×</button></div><form class="modal__body work-form" data-l10-settings-form><label>Meeting day<select name="meetingDay">${['Monday','Tuesday','Wednesday','Thursday','Friday'].map((day, index) => `<option value="${index + 1}" ${Number(settings.meetingDay) === index + 1 ? 'selected' : ''}>${day}</option>`).join('')}</select></label><label>Meeting time<input type="time" name="meetingTime" value="${escapeHtml(settings.meetingTime || '09:00')}"></label><label>Team areas<input name="teamAreas" value="${escapeHtml((settings.teamAreas || []).join(', '))}" placeholder="Operations, Customer, Leadership"></label><div class="form-two-col"><label>Facilitator area<input name="facilitatorArea" value="${escapeHtml(settings.facilitatorArea || '')}"></label><label>Scribe area<input name="scribeArea" value="${escapeHtml(settings.scribeArea || '')}"></label></div><label>Meeting rating target<input type="number" name="ratingTarget" min="1" max="10" value="${escapeHtml(settings.ratingTarget || 8)}"></label><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Cancel</button><button type="submit" class="primary-action">Save setup</button></div></form></dialog>`;
}

export function createL10MeetingDetailDialog(meeting = {}) {
  const todoList = (meeting.todos || []).map((todo) => `<li>${todo.status === 'done' ? '✓' : '○'} ${escapeHtml(todo.title)} · ${escapeHtml(todo.area || 'Team area')} · due ${escapeHtml(todo.dueDate || 'Not set')}</li>`).join('');
  const headlineList = (meeting.headlines || []).map((headline) => `<li><strong>${escapeHtml(headline.type)}</strong> · ${escapeHtml(headline.text)}</li>`).join('');
  const messages = (meeting.cascadingMessages || []).map((message) => `<li>${escapeHtml(message)}</li>`).join('');
  return `<dialog id="l10-history-${escapeHtml(meeting.id)}" class="modal l10-detail-dialog" aria-labelledby="l10-detail-title-${escapeHtml(meeting.id)}"><div class="modal__header"><div><p class="eyebrow">Previous L10 meeting</p><h2 id="l10-detail-title-${escapeHtml(meeting.id)}">${escapeHtml(meeting.weekStart || 'Meeting details')}</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close meeting details">×</button></div><div class="modal__body l10-detail-body"><div class="l10-detail-summary"><span>Week ending</span><strong>${escapeHtml(meeting.weekEnd || 'Not recorded')}</strong><span>Rating</span><strong>${escapeHtml(meeting.rating || 'Not rated')} / 10</strong></div><section><h3>Segue</h3><p><strong>Leadership best:</strong> ${escapeHtml(meeting.segue?.leadershipBest || 'Not recorded')}</p><p><strong>Business/customer/community best:</strong> ${escapeHtml(meeting.segue?.businessBest || 'Not recorded')}</p></section><section><h3>Headlines</h3><ul>${headlineList || '<li>None recorded.</li>'}</ul></section><section><h3>To-Dos</h3><ul>${todoList || '<li>None recorded.</li>'}</ul></section><section><h3>Cascading messages</h3><ul>${messages || '<li>None recorded.</li>'}</ul></section><section><h3>Meeting improvement</h3><p>${escapeHtml(meeting.meetingImprovement || 'None recorded.')}</p></section><div class="modal__actions"><button type="button" class="secondary-action" data-print-l10-history="${escapeHtml(meeting.id)}">Print meeting</button><button type="button" class="primary-action" data-close-dialog>Done</button></div></div></dialog>`;
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

function playbookTopicById(id) {
  return playbookTopics.find((topic) => topic.id === id);
}

function playbookTopicCard(topic, state) {
  const saved = state.savedTopicIds?.includes(topic.id);
  const completed = state.completedTopicIds?.includes(topic.id);
  return `<article class="playbook-card ${completed ? 'playbook-card--completed' : ''}"><div class="playbook-card__top"><span class="work-type">${escapeHtml(topic.group)}</span><div class="playbook-card__badges">${saved ? '<span class="status-chip status-chip--success">Saved</span>' : ''}${completed ? '<span class="status-chip status-chip--success">Completed</span>' : ''}</div></div><h3>${escapeHtml(topic.title)}</h3><p>${escapeHtml(topic.summary)}</p><div class="playbook-card__actions"><button type="button" class="secondary-action" data-open-playbook-topic="${topic.id}">Open guidance <span aria-hidden="true">→</span></button><button type="button" class="playbook-complete" data-playbook-complete="${topic.id}" aria-pressed="${completed}" aria-label="${completed ? 'Mark skill incomplete' : 'Mark skill complete'}"><span aria-hidden="true">${completed ? '✓' : '○'}</span>${completed ? 'Completed' : 'Complete skill'}</button></div></article>`;
}

export function createPlaybookView(topics, state, query = '', group = 'All topics') {
  const normalizedQuery = query.trim().toLowerCase();
  const matching = topics.filter((topic) => {
    const matchesGroup = group === 'All topics' || topic.group === group;
    const haystack = `${topic.title} ${topic.group} ${topic.summary} ${topic.when} ${topic.what} ${topic.say} ${topic.avoid} ${topic.success}`.toLowerCase();
    return matchesGroup && (!normalizedQuery || haystack.includes(normalizedQuery));
  });
  const groups = ['All topics', ...new Set(topics.map((topic) => topic.group))];
  const savedTopics = (state.savedTopicIds || []).map(playbookTopicById).filter(Boolean);
  const recentTopics = (state.recentTopicIds || []).map(playbookTopicById).filter(Boolean);
  const completedTopics = (state.completedTopicIds || []).map(playbookTopicById).filter(Boolean);
  const groupButtons = groups
    .map((name) => `<button type="button" class="work-filter ${group === name ? 'work-filter--active' : ''}" data-playbook-group="${escapeHtml(name)}" aria-pressed="${group === name}">${escapeHtml(name)}</button>`)
    .join('');
  const smallSection = (label, items) => `<section class="playbook-section playbook-section--compact"><div class="section-heading"><div><p class="eyebrow">${label}</p><h2>${label}</h2></div><span class="section-count">${items.length}</span></div>${items.length ? `<div class="playbook-grid">${items.slice(0, 4).map((topic) => playbookTopicCard(topic, state)).join('')}</div>` : '<div class="section-empty"><span aria-hidden="true">—</span><p>No topics here yet.</p></div>'}</section>`;
  const content = matching.length
    ? `<div class="playbook-grid">${matching.map((topic) => playbookTopicCard(topic, state)).join('')}</div>`
    : `<div class="section-empty"><span aria-hidden="true">—</span><p>No guidance matches “${escapeHtml(query)}”. Try a simpler phrase.</p></div>`;
  return `<section class="playbook-command" aria-labelledby="playbook-title"><div class="work-intro"><div><p class="eyebrow">Guidance when it matters</p><h2 id="playbook-title">Lead with a clear next move.</h2><p class="secondary-text">Short, practical guidance for the moments that shape the day. Everything is available offline.</p></div></div><label class="playbook-search">Search the Playbook<input type="search" data-playbook-search value="${escapeHtml(query)}" placeholder="Try “risk”, “delegate”, or “weekly review”" autocomplete="off"></label><div class="work-filters playbook-filters" role="group" aria-label="Playbook topic groups">${groupButtons}</div>${smallSection('Saved topics', savedTopics)}${smallSection('Recently viewed', recentTopics)}${smallSection('Completed skills', completedTopics)}<section class="playbook-section" aria-labelledby="all-playbook-topics"><div class="section-heading"><div><p class="eyebrow">Topic groups</p><h2 id="all-playbook-topics">${normalizedQuery ? 'Search results' : group}</h2></div><span class="section-count">${matching.length}</span></div>${content}</section></section>`;
}

export function createPlaybookDialog(topic, saved = false, completed = false) {
  if (!topic) return '';
  return `<dialog id="playbook-detail" class="modal playbook-dialog" aria-labelledby="playbook-detail-title"><div class="modal__header"><div><p class="eyebrow">${escapeHtml(topic.group)}</p><h2 id="playbook-detail-title">${escapeHtml(topic.title)}</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close guidance">×</button></div><div class="modal__body playbook-detail"><p class="secondary-text">${escapeHtml(topic.summary)}</p><dl><div><dt>When to use it</dt><dd>${escapeHtml(topic.when)}</dd></div><div><dt>What to do</dt><dd>${escapeHtml(topic.what)}</dd></div><div><dt>What to say</dt><dd>${escapeHtml(topic.say)}</dd></div><div><dt>What to avoid</dt><dd>${escapeHtml(topic.avoid)}</dd></div><div><dt>What success looks like</dt><dd>${escapeHtml(topic.success)}</dd></div></dl><div class="modal__actions"><button type="button" class="secondary-action" data-playbook-save="${topic.id}">${saved ? 'Remove from saved' : 'Save topic'}</button><button type="button" class="playbook-complete" data-playbook-complete="${topic.id}" aria-pressed="${completed}"><span aria-hidden="true">${completed ? '✓' : '○'}</span>${completed ? 'Completed' : 'Mark complete'}</button><button type="button" class="primary-action" data-close-dialog>Done</button></div></div></dialog>`;
}

export function createContextualGuidance(topicId, label = 'Playbook guidance') {
  const topic = playbookTopicById(topicId);
  return topic ? `<p class="contextual-guidance"><span aria-hidden="true">✦</span><span>${escapeHtml(topic.summary)}</span><button type="button" class="text-button" data-open-playbook-topic="${topic.id}">${escapeHtml(label)}</button></p>` : '';
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
        `<a class="nav-item ${className}" data-mobile-menu-link href="#${key}" ${
          currentKey === key ? 'aria-current="page"' : ''
        }><span class="nav-item__icon" aria-hidden="true">${icon}</span><span>${label}</span></a>`,
    )
    .join('');
  return `${items}${currentKey === 'review' ? '<a class="nav-item nav-item--subtle" href="#review/weekly"><span class="nav-item__icon" aria-hidden="true">↳</span><span>Weekly review</span></a><a class="nav-item nav-item--subtle" href="#review/l10"><span class="nav-item__icon" aria-hidden="true">↳</span><span>L10 meeting</span></a>' : ''}`;
}

function settingsDialog() {
  return `<dialog id="settings-dialog" class="modal" aria-labelledby="settings-title">
    <div class="modal__header"><div><p class="eyebrow">Preferences</p><h2 id="settings-title">Settings</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close settings">×</button></div>
    <div class="modal__body"><p class="secondary-text">Tune the interface to the way you work. Your records stay on this device unless you export them.</p>
      ${createSegmentedControl('Appearance', [
        ['light', 'Light'],
        ['system', 'System'],
        ['dark', 'Dark'],
      ])}
      <div class="settings-actions"><button type="button" class="secondary-action settings-data-button" data-open-data>Data</button><button type="button" class="secondary-action" data-reset-onboarding>Restart onboarding</button></div>
    </div>
  </dialog>`;
}

export function createDataDialog(snapshots = []) {
  const snapshotList = snapshots.length
    ? snapshots.map((snapshot) => `<li><span><strong>${escapeHtml(new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(snapshot.createdAt)))}</strong><small>${escapeHtml(snapshot.snapshotType)} snapshot · ${snapshot.recordCount || 0} records</small></span><div class="snapshot-actions"><button type="button" class="text-button" data-restore-snapshot="${escapeHtml(snapshot.id)}">Restore</button><button type="button" class="icon-button snapshot-delete" data-delete-snapshot="${escapeHtml(snapshot.id)}" aria-label="Delete ${escapeHtml(snapshot.snapshotType)} snapshot" title="Delete snapshot"><svg aria-hidden="true" viewBox="0 0 24 24" focusable="false"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg></button></div></li>`).join('')
    : '<li class="section-empty"><span aria-hidden="true">—</span><p>No local snapshots yet.</p></li>';
  return `<dialog id="data-dialog" class="modal data-dialog" aria-labelledby="data-title"><div class="modal__header"><div><p class="eyebrow">Settings · Data</p><h2 id="data-title">Protect your workspace.</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close data settings">×</button></div><div class="modal__body data-manager"><p class="secondary-text">Backups, restores, and imports happen locally. Nothing is uploaded.</p><section class="data-section"><h3>JSON backup</h3><p>Export everything needed to rebuild this workspace on another device.</p><button type="button" class="primary-action" data-export-backup>Export backup</button><label class="file-picker">Restore backup<input type="file" accept="application/json,.json" data-restore-file></label><div class="restore-preview" data-restore-preview hidden></div></section><section class="data-section"><h3>CSV tools</h3><div class="form-two-col"><label>Dataset<select data-csv-type><option value="priorities">Priorities</option><option value="risks">Risks</option><option value="decisions">Decisions</option><option value="followUps">Follow-ups</option><option value="improvements">Improvements</option><option value="l10ScorecardMetrics">L10 Scorecard metrics</option><option value="l10ScorecardEntries">L10 Scorecard entries</option><option value="l10Rocks">L10 Rocks</option><option value="l10Issues">L10 Issues</option><option value="l10Todos">L10 To-Dos</option><option value="l10Meetings">L10 meetings</option><option value="dailySummaries">Daily summaries</option><option value="weeklySummaries">Weekly summaries</option></select></label><div class="data-actions"><button type="button" class="secondary-action" data-export-csv>Export CSV</button><button type="button" class="text-button" data-download-csv-template>Download template</button></div></div><label class="file-picker">Import CSV<input type="file" accept="text/csv,.csv" data-csv-file></label><div class="csv-preview" data-csv-preview hidden></div></section><section class="data-section"><h3>Local snapshots</h3><p>Automatic daily and weekly snapshots rotate on this device.</p><ul class="history-list snapshot-list">${snapshotList}</ul></section><section class="data-section data-danger"><h3>Delete all data</h3><p>This removes workspace records and cannot be undone. Export a backup first.</p><button type="button" class="primary-action destructive-action" data-delete-all-data>Delete all data</button></section><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Done</button></div></div></dialog>`;
}

export function createSnapshotDeleteDialog(snapshot = {}) {
  const snapshotLabel = `${snapshot.snapshotType || 'local'} snapshot`;
  return `<dialog id="snapshot-delete-dialog" class="modal snapshot-delete-dialog" aria-labelledby="snapshot-delete-title"><div class="modal__header"><div><p class="eyebrow">Local snapshot</p><h2 id="snapshot-delete-title">Delete this snapshot?</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close delete snapshot dialog">×</button></div><div class="modal__body"><div class="snapshot-warning"><span class="snapshot-warning__icon" aria-hidden="true">!</span><div><strong>This will be permanently deleted.</strong><p>The ${escapeHtml(snapshotLabel)} contains ${snapshot.recordCount || 0} saved records. Deleting it will not affect your current workspace.</p></div></div><p class="secondary-text">If you may need this snapshot later, export a backup before deleting it.</p><div class="modal__actions snapshot-delete-actions"><button type="button" class="secondary-action" data-snapshot-delete-cancel>Cancel</button><button type="button" class="secondary-action" data-snapshot-export-delete="${escapeHtml(snapshot.id || '')}">Export first, then delete</button><button type="button" class="primary-action snapshot-delete-confirm" data-snapshot-delete-confirm="${escapeHtml(snapshot.id || '')}">Delete permanently</button></div></div></dialog>`;
}

export function createResetOnboardingDialog() {
  return `<dialog id="reset-onboarding-dialog" class="modal reset-onboarding-dialog" aria-labelledby="reset-onboarding-title"><div class="modal__header"><div><p class="eyebrow">Settings · Onboarding</p><h2 id="reset-onboarding-title">Restart onboarding?</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close restart onboarding dialog">×</button></div><div class="modal__body"><div class="snapshot-warning"><span class="snapshot-warning__icon" aria-hidden="true">↻</span><div><strong>Your setup answers will be cleared.</strong><p>Your existing priorities, work items, reviews, improvements, L10 records, and journey progress will remain on this device.</p></div></div><p class="secondary-text">You will return to the Welcome screen and can complete the setup again with a different leadership context.</p><div class="modal__actions"><button type="button" class="secondary-action" data-close-dialog>Cancel</button><button type="button" class="primary-action" data-reset-onboarding-confirm>Restart onboarding</button></div></div></dialog>`;
}

export function createDeleteAllDataDialog() {
  return `<dialog id="delete-all-data-dialog" class="modal delete-all-data-dialog" aria-labelledby="delete-all-data-title"><div class="modal__header"><div><p class="eyebrow">Settings · Data</p><h2 id="delete-all-data-title">Delete all workspace data?</h2></div><button class="icon-button" type="button" data-close-dialog aria-label="Close delete all data dialog">×</button></div><div class="modal__body"><div class="danger-warning"><span class="danger-warning__icon" aria-hidden="true">!</span><div><strong>This action is permanent.</strong><p>All priorities, work items, reviews, improvements, journey progress, L10 records, playbook progress, schedules, and local snapshots will be removed from this device.</p></div></div><p class="secondary-text">Export a JSON backup first if you may need to recover this workspace later.</p><div class="modal__actions delete-all-data-actions"><button type="button" class="secondary-action" data-delete-all-export>Export backup first</button><button type="button" class="secondary-action" data-close-dialog>Cancel</button></div><label class="delete-confirmation-field">Type <strong>DELETE ALL DATA</strong> to confirm<input type="text" data-delete-all-phrase autocomplete="off" spellcheck="false" placeholder="DELETE ALL DATA"></label><div class="modal__actions"><button type="button" class="primary-action destructive-action" data-delete-all-confirm>Delete all data</button></div></div></dialog>`;
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
  return `<div class="app-layout ${route.key === 'eod' ? 'app-layout--eod' : ''}">
    <header class="top-header" aria-label="Application header"><a class="brand" href="#today" aria-label="TalentisOS home"><span class="brand-mark" aria-hidden="true">T</span><span class="brand-wordmark">Talentis<span>OS</span></span></a><nav class="top-nav" aria-label="Primary navigation">${navItems(route.key, 'top-nav__links')}</nav><div class="top-header__actions">${['review', 'playbook'].includes(route.key) ? '' : `<button class="primary-action top-header__cta" type="button" data-primary-action>${route.action}<span aria-hidden="true">→</span></button>`}<button class="secondary-action top-header__settings" type="button" data-open-settings>Settings</button><button class="icon-button menu-toggle" type="button" data-mobile-menu-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="Open navigation menu"><span aria-hidden="true">☰</span></button></div></header>
    <div class="mobile-menu-backdrop" data-close-mobile-menu></div><aside id="mobile-menu" class="mobile-menu" aria-label="Mobile navigation" aria-hidden="true"><div class="mobile-menu__header"><span class="eyebrow">Workspace</span><button class="icon-button" type="button" data-close-mobile-menu aria-label="Close navigation menu">×</button></div><nav>${navItems(route.key, 'mobile-menu__link')}</nav><button class="nav-item mobile-menu__settings" type="button" data-open-settings data-close-mobile-menu><span class="nav-item__icon" aria-hidden="true">⚙</span><span>Settings</span></button></aside>
    <main id="main-content" class="content-area"><div class="content-inner"><header class="page-header"><div><p class="eyebrow">${route.eyebrow}</p><h1>${route.label}</h1></div><div class="page-header__meta"><span class="date-label">${new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date())}</span><span class="status-dot" aria-label="Offline-ready shell"></span></div></header><div id="view-root"></div></div></main>
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
