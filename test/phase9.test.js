import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('service worker uses versioned caches, offline fallback, and user-confirmed updates', async () => {
  const serviceWorker = await read('public/service-worker.js');
  assert.match(serviceWorker, /talentisos-shell-v6/);
  assert.match(serviceWorker, /offline\.html/);
  assert.match(serviceWorker, /SKIP_WAITING/);
  assert.doesNotMatch(serviceWorker, /install[\s\S]{0,300}skipWaiting\(\)/);
  assert.match(serviceWorker, /caches\.delete/);
  assert.match(serviceWorker, /if \(cached\) return cached/);
  assert.match(serviceWorker, /event\.waitUntil\(caches\.open/);
  assert.match(serviceWorker, /\['font', 'image', 'manifest', 'script', 'style'\]/);
});

test('standalone shell exposes install metadata and a restrictive local CSP', async () => {
  const index = await read('index.html');
  const manifest = await read('public/manifest.webmanifest');
  assert.match(index, /apple-mobile-web-app-capable/);
  assert.match(index, /Content-Security-Policy/);
  assert.match(index, /default-src 'self'/);
  assert.match(manifest, /"display": "standalone"/);
  assert.match(manifest, /"orientation": "any"/);
});

test('accessibility and iPad layout safeguards are present', async () => {
  const html = await read('index.html');
  const css = await read('src/styles.css');
  assert.match(html, /Skip to main content/);
  assert.match(html, /aria-live="polite"/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /forced-colors/);
  assert.match(css, /env\(--?safe-area-inset-top|env\(safe-area-inset-top/);
  assert.match(css, /focus-visible/);
});

test('source keeps imported values sanitized and rendered through escaped text', async () => {
  const backup = await read('src/backup.js');
  const components = await read('src/components.js');
  assert.match(backup, /sanitizeImportedValue/);
  assert.match(components, /export function escapeHtml/);
  assert.doesNotMatch(backup, /innerHTML/);
});

test('core daily workflow pathways remain wired for regression coverage', async () => {
  const main = await read('src/main.js');
  const components = await read('src/components.js');
  for (const marker of ['completeOnboarding', 'currentPriorities.length >= 3', 'finishReview', 'saveTomorrowPlan', 'getWeeklyReview', 'data-improvement-from-risk', 'huddleDiscussions']) {
    assert.match(main, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  for (const marker of ['data-priority-form', 'data-work-form', 'data-review-action', 'data-weekly-answer', 'data-improvement-form']) {
    assert.match(components, new RegExp(marker));
  }
});

test('active L10 timers are stopped before any route render', async () => {
  const main = await read('src/main.js');
  assert.match(main, /async function render\(\) \{\s+stopL10Timer\(\);/);
  assert.match(main, /function stopL10Timer\(\)[\s\S]{0,160}clearInterval\(l10TimerInterval\)/);
});

test('local snapshots expose restore only', async () => {
  const components = await read('src/components.js');
  assert.match(components, /data-restore-snapshot="\$\{escapeHtml\(snapshot\.id\)\}">Restore/);
  assert.doesNotMatch(components, /data-delete-snapshot/);
});

test('Pages deployment is configured for the repository subpath', async () => {
  const viteConfig = await read('vite.config.js');
  const workflow = await read('.github/workflows/deploy-pages.yml');
  const manifest = await read('public/manifest.webmanifest');
  const serviceWorker = await read('public/service-worker.js');
  assert.match(viteConfig, /base:\s*['"]\/TalentisOS\/['"]/);
  assert.match(workflow, /branches:\s*\[main\]/);
  assert.match(workflow, /npm test/);
  assert.match(workflow, /npm run build/);
  assert.match(workflow, /upload-pages-artifact/);
  assert.match(workflow, /deploy-pages/);
  assert.match(manifest, /"start_url": "\.\/#today"/);
  assert.match(manifest, /"src": "\.\/icons\/icon-192\.svg"/);
  assert.match(serviceWorker, /self\.registration\.scope/);
});
