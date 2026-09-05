import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('app shell has exactly the four public navigation destinations', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const routes = [...html.matchAll(/data-route="([^"]+)"/g)].map(([, route]) => route);
  assert.deepEqual(routes, ['today', 'meetings', 'insights', 'settings']);
  assert.match(html, /type="module" src="\.\/src\/main\.js"/);
  assert.match(html, /<main id="app"/);
  assert.match(html, /id="toast"/);
});

test('service worker remains cache-free during the bootstrap phase', async () => {
  const worker = await readFile(new URL('../sw.js', import.meta.url), 'utf8');
  assert.doesNotMatch(worker, /caches\.(open|match|keys)/);
});
