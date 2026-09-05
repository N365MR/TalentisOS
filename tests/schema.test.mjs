import assert from 'node:assert/strict';
import test from 'node:test';
import { SCHEMA_VERSION, createEmptyWorkspace, isWorkspaceSnapshot } from '../src/state/schema.js';

test('creates a valid empty workspace snapshot', () => {
  const workspace = createEmptyWorkspace();
  assert.equal(workspace.schemaVersion, SCHEMA_VERSION);
  assert.deepEqual(workspace.tasks, []);
  assert.deepEqual(workspace.eod, { completed: '', outstanding: '', risks: '', handovers: '', top3: '' });
  assert.deepEqual(workspace.l10, { section: 'segue', running: false, rating: null });
  assert.equal(isWorkspaceSnapshot(workspace), true);
});

test('does not share nested values between empty workspace snapshots', () => {
  const first = createEmptyWorkspace();
  const second = createEmptyWorkspace();
  first.tasks.push({ id: 'task-1' });
  assert.deepEqual(second.tasks, []);
});
