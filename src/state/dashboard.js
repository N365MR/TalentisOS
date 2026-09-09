// Read-only Home projection. It deliberately accepts snapshots rather than reading or writing storage.
const open = task => task?.status === 'open' && !task.someday;
const byPriority = (a, b) => String(a.dueDate || '9999-12-31').localeCompare(String(b.dueDate || '9999-12-31')) || String(a.title).localeCompare(String(b.title));
const taskAction = (task, reason, kind = 'task') => ({ kind, title: task.title, reason, href: '#tasks', label: 'Open task', task });

export function dashboardProjection({ tasks = [], huddle = null, endOfDay = null, todayWork = null, scorecard = [], conversationsDue = [], issuesAttention = [], date } = {}) {
  const active = tasks.filter(open);
  const corrective = scorecard.filter(item => item.status === 'off-track').flatMap(item => item.corrective?.linked || []).filter(open).sort(byPriority);
  const overdueUrgent = active.filter(task => task.urgent || (task.dueDate && task.dueDate < date)).sort((a, b) => Number(b.urgent) - Number(a.urgent) || byPriority(a, b));
  const blockedWaiting = active.filter(task => task.blocked || task.waiting).sort(byPriority);
  const commitments = active.filter(task => (huddle?.commitmentTaskIds || []).includes(task.id)).sort(byPriority);
  const huddleItems = ['risks', 'customerIssues', 'decisions'].flatMap(section => (huddle?.[section] || []).map(item => ({ ...item, section })));
  const top = (todayWork?.top || []).filter(entry => open(entry.task));
  const action = issuesAttention[0] ? { kind: 'issue', title: issuesAttention[0].title, reason: `${issuesAttention[0].priority} priority issue needs attention.`, href: '#issues?view=attention', label: 'Open Issues' }
    : conversationsDue[0] ? { kind: 'conversation-follow-up', title: conversationsDue[0].title, reason: `Follow-up ${conversationsDue[0].followUpDate < date ? 'is overdue' : 'is due'} for a leadership conversation.`, href: '#conversations?view=follow-up', label: 'Open Conversations' }
    : corrective[0] ? taskAction(corrective[0], 'Open corrective action for an off-track KPI.', 'kpi-corrective')
    : overdueUrgent[0] ? taskAction(overdueUrgent[0], overdueUrgent[0].urgent ? 'Urgent work needs your attention.' : 'This task is overdue.', 'overdue-urgent')
    : blockedWaiting[0] ? taskAction(blockedWaiting[0], blockedWaiting[0].blocked ? 'This task is blocked and needs follow-up.' : 'This task is waiting for follow-up.', 'blocked-waiting')
    : commitments[0] ? taskAction(commitments[0], 'An open Morning Huddle commitment needs follow-up.', 'huddle-commitment')
    : huddleItems[0] ? { kind: 'huddle-item', title: huddleItems[0].title, reason: `${huddleItems[0].section === 'customerIssues' ? 'Customer issue' : huddleItems[0].section.slice(0, -1)} captured in the Morning Huddle.`, href: '#morning-huddle', label: 'Open Morning Huddle' }
    : top[0] ? taskAction(top[0].task, 'An incomplete Top 3 priority is ready for your focus.', 'top-3')
    : !huddle ? { kind: 'prepare-huddle', title: 'Prepare the Morning Huddle', reason: 'Align the day’s priorities and commitments.', href: '#morning-huddle', label: 'Open Morning Huddle' }
    : endOfDay?.status !== 'complete' ? { kind: 'end-of-day', title: 'Prepare End of Day', reason: 'Close the day and prepare the next workday.', href: '#end-of-day', label: 'Open End of Day' }
    : { kind: 'aligned', title: 'You are aligned for today', reason: 'No current exception needs action. Keep the rhythm steady.', href: '#today', label: 'View Today’s Work' };
  const taskAttention = active.filter(task => task.urgent || task.blocked || task.waiting || (task.dueDate && task.dueDate < date)).sort((a, b) => Number(b.urgent) - Number(a.urgent) || byPriority(a, b));
  const kpiExceptions = scorecard.filter(item => item.status === 'off-track' || item.status === 'at-risk');
  const completed = tasks.filter(task => task.status === 'completed' && task.completedAt?.slice(0, 10) === date);
  return { action, taskAttention, top, kpiExceptions, conversationsDue, issuesAttention, huddleItems, commitments, huddleAttention: [...commitments, ...huddleItems], completed,
    rhythm: { endOfDay: endOfDay?.status === 'complete' ? 'Complete' : endOfDay?.status === 'in-progress' ? 'In progress' : 'Ready to prepare', huddle: !huddle ? 'Ready to prepare' : huddle.status === 'completed' ? 'Complete' : `${(huddle.top3TaskIds || []).length} Top 3 aligned`, today: `${todayWork?.progress?.completed || 0} of ${todayWork?.progress?.total || 0} complete` } };
}
