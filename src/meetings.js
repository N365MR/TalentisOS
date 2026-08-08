export const meetingCadences = [
  ['weekly', 'Weekly'],
  ['fortnightly', 'Fortnightly'],
  ['monthly', 'Monthly'],
];

export function dateOnly(date = new Date()) {
  const value = new Date(date);
  return value.toISOString().slice(0, 10);
}

export function advanceMeetingDate(date, cadence) {
  const value = new Date(`${date}T12:00:00`);
  if (cadence === 'monthly') value.setMonth(value.getMonth() + 1);
  else value.setDate(value.getDate() + (cadence === 'fortnightly' ? 14 : 7));
  return dateOnly(value);
}

export function nextMeetingDate(schedule, today = dateOnly()) {
  let nextDate = schedule.nextDate;
  while (nextDate && nextDate < today) nextDate = advanceMeetingDate(nextDate, schedule.cadence);
  return nextDate || today;
}

export function daysUntil(date, today = dateOnly()) {
  const start = new Date(`${today}T12:00:00`);
  const end = new Date(`${date}T12:00:00`);
  return Math.max(0, Math.round((end - start) / 86400000));
}

export function getNextWorkday(value = new Date()) {
  const date = new Date(`${dateOnly(value)}T12:00:00`);
  const day = date.getDay();
  const offset = day === 5 ? 3 : day === 6 ? 2 : day === 0 ? 1 : 1;
  date.setDate(date.getDate() + offset);
  return dateOnly(date);
}
