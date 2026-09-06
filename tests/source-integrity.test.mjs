import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('app shell loads the Phase 01 application foundation', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /type="module" src="\.\/src\/main\.js\?v=phase05-1"/);
  assert.match(html, /<div id="app"/);
  const render = await readFile(new URL('../src/ui/render.js', import.meta.url), 'utf8');
  assert.match(render, /Your Daily Leadership Playbook/);
  assert.match(render, /Morning Huddle/);
  assert.match(render, /Nothing needs your attention here yet/);
  assert.match(render, /createElement/);
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  assert.match(main, /showModal/);
  assert.match(main, /confirmAction/);
});

test('service worker provides a versioned same-origin application shell cache', async () => {
  const worker = await readFile(new URL('../public/sw.js', import.meta.url), 'utf8');
  assert.match(worker, /caches\.open/);
  assert.match(worker, /caches\.match/);
  assert.match(worker, /talentisos-shell-v11/);
  assert.match(worker, /self\.location\.origin/);
});

test('storage and transfer layers remain separate from views', async () => {
  const storage = await readFile(new URL('../src/state/storage.js', import.meta.url), 'utf8');
  const transfer = await readFile(new URL('../src/state/transfer.js', import.meta.url), 'utf8');
  assert.match(storage, /createObjectStore\(STORE_NAMES\.tasks/);
  assert.match(storage, /createObjectStore\(STORE_NAMES\.settings/);
  assert.match(storage, /createRecord/);
  assert.match(storage, /updateRecord/);
  assert.match(storage, /deleteRecord/);
  assert.match(transfer, /parseImport/);
});

test('startup renders a shell if workspace retrieval fails and task domain normalises legacy records', async () => {
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  const tasks = await readFile(new URL('../src/state/tasks.js', import.meta.url), 'utf8');
  assert.match(main, /Promise\.all\(\[listTasks\(\), getEndOfDay/);
  assert.match(main, /renderApp\(root, getRoute\(\), tasks, endOfDay/);
  assert.match(main, /assembleMorningHuddle/);
  assert.match(tasks, /export function normaliseTask/);
  assert.match(tasks, /subtasks: Array\.isArray\(task\.subtasks\)/);
});

test('task detail editing and destructive task deletion use a confirmed canonical flow', async () => {
  const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
  const tasks = await readFile(new URL('../src/state/tasks.js', import.meta.url), 'utf8');
  assert.match(main, /openTaskDialog/);
  assert.match(main, /Delete this task/);
  assert.match(main, /deleting \? 'Delete task' : 'Replace data'/);
  assert.match(tasks, /REFERENCE_TYPES/);
  assert.match(tasks, /carryHistory/);
  assert.match(tasks, /sameReference/);
});

test('PWA public assets are present and correctly referenced', async () => {
  const manifest = JSON.parse(await readFile(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8'));
  assert.equal(manifest.start_url, './');
  assert.equal(manifest.icons.length, 2);
  for (const icon of manifest.icons) {
    await readFile(new URL(`../public/${icon.src.slice(2)}`, import.meta.url), 'utf8');
  }
});
