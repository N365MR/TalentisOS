import test from 'node:test';
import assert from 'node:assert/strict';
import { createBackup, validateBackup, BACKUP_COLLECTIONS } from '../src/backup.js';
import { L10_AGENDA, defaultL10Meeting, l10WeekStart, scorecardStatus } from '../src/l10.js';
import { advanceMeetingDate, daysUntil, nextMeetingDate, getNextWorkday } from '../src/meetings.js';

test('L10 uses the fixed seven-part 90-minute agenda', () => {
  assert.deepEqual(L10_AGENDA.map((item) => item.id), ['segue', 'scorecard', 'rocks', 'headlines', 'todos', 'ids', 'conclude']);
  assert.equal(L10_AGENDA.reduce((total, item) => total + item.minutes, 0), 90);
  assert.equal(defaultL10Meeting('2026-08-03').currentSection, 'segue');
});

test('scorecard calculates at-least and at-most status locally', () => {
  assert.equal(scorecardStatus(90, 95, 'at-least'), 'on-track');
  assert.equal(scorecardStatus(90, 80, 'at-least'), 'off-track');
  assert.equal(scorecardStatus(2, 1, 'at-most'), 'on-track');
  assert.equal(scorecardStatus(2, 4, 'at-most'), 'off-track');
  assert.equal(scorecardStatus('', '', 'at-least'), 'not-entered');
});

test('L10 collections are included in versioned backups and older backups receive defaults', () => {
  const backup = createBackup({ l10Meetings: [{ id: 'l10-1', weekStart: '2026-08-03' }] });
  const restored = validateBackup(backup);
  assert.equal(restored.data.l10Meetings.length, 1);
  assert.ok(BACKUP_COLLECTIONS.includes('l10Issues'));
  assert.ok(BACKUP_COLLECTIONS.includes('l10ScorecardEntries'));
  assert.equal(l10WeekStart(new Date('2026-08-05T12:00:00Z')), '2026-08-03');
});

test('recurring meeting dates advance locally and expose a countdown', () => {
  assert.equal(advanceMeetingDate('2026-08-03', 'weekly'), '2026-08-10');
  assert.equal(advanceMeetingDate('2026-08-03', 'fortnightly'), '2026-08-17');
  assert.equal(nextMeetingDate({ nextDate: '2026-08-03', cadence: 'weekly' }, '2026-08-04'), '2026-08-10');
  assert.equal(daysUntil('2026-08-10', '2026-08-07'), 3);
});

test('EOD records are included in local backup collections', () => {
  const backup = createBackup({ eodRecords: [{ id: 'eod-2026-08-07', date: '2026-08-07', status: 'closed' }] });
  const restored = validateBackup(backup);
  assert.equal(restored.data.eodRecords[0].status, 'closed');
  assert.ok(BACKUP_COLLECTIONS.includes('eodRecords'));
});

test('next workday skips weekends and Huddle references are backed up', () => {
  assert.equal(getNextWorkday('2026-08-07'), '2026-08-10');
  assert.equal(getNextWorkday('2026-08-08'), '2026-08-10');
  const backup = createBackup({ huddleItems: [{ id: 'h-1', huddleDate: '2026-08-10', itemType: 'task', itemId: 'task-1' }] });
  assert.equal(validateBackup(backup).data.huddleItems.length, 1);
  assert.ok(BACKUP_COLLECTIONS.includes('huddleItems'));
});
