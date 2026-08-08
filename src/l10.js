export const L10_AGENDA = [
  { id: 'segue', label: 'Segue', minutes: 5 },
  { id: 'scorecard', label: 'Scorecard', minutes: 5 },
  { id: 'rocks', label: 'Rock review', minutes: 5 },
  { id: 'headlines', label: 'Headlines', minutes: 5 },
  { id: 'todos', label: 'To-Dos', minutes: 5 },
  { id: 'ids', label: 'IDS', minutes: 60 },
  { id: 'conclude', label: 'Conclude', minutes: 5 },
];

export function l10WeekStart(date = new Date()) {
  const value = new Date(date);
  const day = value.getDay() || 7;
  value.setDate(value.getDate() - day + 1);
  return value.toISOString().slice(0, 10);
}

export function l10WeekEnd(weekStart) {
  const value = new Date(`${weekStart}T12:00:00`);
  value.setDate(value.getDate() + 6);
  return value.toISOString().slice(0, 10);
}

export function scorecardStatus(goal, actual, direction = 'at-least') {
  if (goal === '' || goal == null || actual === '' || actual == null) return 'not-entered';
  const target = Number(goal);
  const value = Number(actual);
  if (!Number.isFinite(target) || !Number.isFinite(value)) return 'not-entered';
  return direction === 'at-most' ? (value <= target ? 'on-track' : 'off-track') : value >= target ? 'on-track' : 'off-track';
}

export function currentAgendaIndex(meeting = {}) {
  return Math.max(0, L10_AGENDA.findIndex((section) => section.id === meeting.currentSection));
}

export function l10RemainingSeconds(meeting, sectionId) {
  const section = L10_AGENDA.find((item) => item.id === sectionId);
  const timer = meeting?.timer?.sectionId === sectionId ? meeting.timer : {};
  const elapsed = (timer.elapsedSeconds || 0) + (timer.startedAt ? Math.floor((Date.now() - Date.parse(timer.startedAt)) / 1000) : 0);
  return Math.max(0, (section?.minutes || 5) * 60 - elapsed);
}

export const defaultL10Settings = {
  id: 'primary', meetingDay: 1, meetingTime: '09:00', durationMinutes: 90,
  teamAreas: [], facilitatorArea: '', scribeArea: '', ratingTarget: 8,
};

export function defaultL10Meeting(weekStart = l10WeekStart()) {
  return {
    id: `l10-${weekStart}`, weekStart, weekEnd: l10WeekEnd(weekStart), meetingAt: `${weekStart}T09:00`, currentSection: 'segue',
    sectionStatus: {}, timer: { sectionId: 'segue', startedAt: null, elapsedSeconds: 0, paused: false }, segue: { leadershipBest: '', businessBest: '', reflection: '' },
    headlines: [], todos: [], issueIds: [], cascadingMessages: [], rating: '', meetingImprovement: '',
    completedAt: null, updatedAt: new Date().toISOString(),
  };
}
