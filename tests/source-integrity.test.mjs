import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('app shell is the restrained Phase 00A foundation', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /<nav\b/i);
  assert.doesNotMatch(html, /data-route=/);
  assert.match(html, /type="module" src="\.\/src\/main\.js"/);
  assert.match(html, /<main id="app"/);
  assert.match(html, /Your Daily Leadership Playbook/);
  assert.match(html, /Foundation Ready/);
});

test('service worker precaches only the foundation application shell', async () => {
  const worker = await readFile(new URL('../public/sw.js', import.meta.url), 'utf8');
  assert.match(worker, /caches\.open/);
  assert.match(worker, /caches\.match/);
  assert.doesNotMatch(worker, /api|sync|indexeddb/i);
});

test('PWA public assets are present and correctly referenced', async () => {
  const manifest = JSON.parse(await readFile(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8'));
  assert.equal(manifest.start_url, '/');
  assert.equal(manifest.icons.length, 2);
  for (const icon of manifest.icons) {
    await readFile(new URL(`../public${icon.src}`, import.meta.url), 'utf8');
  }
});
