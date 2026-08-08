export const journeyStages = [
  { id: 'first-7', label: 'First 7 Days', objective: 'Listen, observe and establish clarity', milestones: [
    { id: 'prepare-team-meeting', title: 'Prepare to Meet Your Team', summary: 'Create a calm first conversation that builds trust and makes the next 90 days visible.', checklist: ['Set the purpose and tone', 'Prepare three to five listening questions', 'Share expectations and close with next steps'] },
    { id: 'meet-team', title: 'Meet the team', summary: 'Listen for strengths, friction and what the team needs from you.', checklist: ['Ask what is working', 'Ask what gets in the way', 'Capture themes without promising instant fixes'] },
    { id: 'observe-work', title: 'Observe the work', summary: 'Understand the real workflow before changing it.', checklist: ['Follow one piece of work end to end', 'Notice handovers and waiting points', 'Record questions to revisit'] },
    { id: 'set-first-expectations', title: 'Set first expectations', summary: 'Make communication, ownership and escalation expectations clear.', checklist: ['Name what the team can expect from you', 'Name what you need from the team', 'Agree how issues will be raised'] },
    { id: 'choose-first-focus', title: 'Choose the first focus', summary: 'Select one useful outcome for the first month.', checklist: ['Describe the outcome', 'Explain why it matters', 'Share how progress will be checked'] },
  ] },
  { id: 'first-30', label: 'First 30 Days', objective: 'Understand the operation and establish a reliable leadership rhythm', milestones: [
    { id: 'map-work', title: 'Map the work', summary: 'Make key responsibilities, customers and handovers visible.', checklist: ['List recurring work', 'Clarify responsible areas', 'Identify the most important handovers'] },
    { id: 'build-rhythm', title: 'Build the operating rhythm', summary: 'Use preparation, huddles, follow-up and review consistently.', checklist: ['Prepare the day', 'Run a focused huddle', 'Close the day with a next step'] },
    { id: 'clarify-priorities', title: 'Clarify priorities', summary: 'Turn activity into a small set of visible outcomes.', checklist: ['Define up to three outcomes', 'Make trade-offs explicit', 'Review progress regularly'] },
    { id: 'surface-risks', title: 'Surface risks early', summary: 'Create a safe, practical way to raise risk and blockers.', checklist: ['State impact', 'Name immediate action', 'Escalate before options narrow'] },
    { id: 'review-first-month', title: 'Review the first month', summary: 'Use evidence and team feedback to choose what to keep and change.', checklist: ['Review outcomes', 'Ask what should continue', 'Choose one improvement to test'] },
  ] },
  { id: 'days-31-60', label: 'Days 31–60', objective: 'Strengthen execution, accountability and operational flow', milestones: [
    { id: 'delegate-outcomes', title: 'Delegate outcomes', summary: 'Create ownership with clear authority and check-in points.', checklist: ['Name the outcome', 'Confirm decision boundaries', 'Agree the follow-up point'] },
    { id: 'remove-repeat-blocker', title: 'Remove a repeated blocker', summary: 'Address one constraint that repeatedly slows useful work.', checklist: ['Describe the pattern', 'Find the smallest unlock', 'Check whether movement improves'] },
    { id: 'strengthen-handover', title: 'Strengthen a handover', summary: 'Make the information and ownership needed for a clean handover explicit.', checklist: ['Define the handover point', 'Confirm required information', 'Test it with the receiving area'] },
    { id: 'develop-team-rhythm', title: 'Develop the team rhythm', summary: 'Adjust meetings and communication to support the work.', checklist: ['Keep what helps', 'Remove unnecessary meeting time', 'Make decisions and actions visible'] },
    { id: 'review-day-60', title: 'Review day 60', summary: 'Check whether the leadership system is helping the team deliver.', checklist: ['Review repeated risks', 'Review delayed decisions', 'Choose the next leadership focus'] },
  ] },
  { id: 'days-61-90', label: 'Days 61–90', objective: 'Build a sustainable operating system and establish continuous improvement', milestones: [
    { id: 'set-team-standards', title: 'Set team standards', summary: 'Make the expected way of working clear and usable.', checklist: ['Describe quality and response expectations', 'Agree how exceptions are handled', 'Review standards with the team'] },
    { id: 'build-decision-rhythm', title: 'Build a decision rhythm', summary: 'Prevent important decisions from waiting without a next review date.', checklist: ['Record decisions', 'Name the decision owner', 'Set review dates when deferring'] },
    { id: 'test-improvement', title: 'Test an improvement', summary: 'Run one small improvement through a clear test and review.', checklist: ['State what is not working', 'Try a small change', 'Capture what happened'] },
    { id: 'prepare-next-quarter', title: 'Prepare the next quarter', summary: 'Translate learning into a manageable forward focus.', checklist: ['Name the strongest outcomes', 'Carry forward useful lessons', 'Choose three priorities'] },
    { id: 'complete-90-day-review', title: 'Complete the 90-day review', summary: 'Reflect on trust, clarity, execution and the next leadership chapter.', checklist: ['Review progress', 'Ask the team what changed', 'Set the next leadership focus'] },
  ] },
];

export function getJourneyProgress(state = {}) {
  const completed = new Set(state.completedMilestoneIds || []);
  const milestones = journeyStages.flatMap((stage) => stage.milestones.map((milestone) => ({ ...milestone, stage }))); 
  const current = milestones.find((milestone) => !completed.has(milestone.id)) || milestones[milestones.length - 1];
  return { completed, milestones, current, completedCount: milestones.filter((milestone) => completed.has(milestone.id)).length, total: milestones.length };
}

export const defaultJourneyState = { id: 'primary', startedAt: null, completedMilestoneIds: [], completedAt: {}, meetingPreparation: {} };
