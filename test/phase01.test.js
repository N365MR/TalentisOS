import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'
import { DATABASE_VERSION, validateTimezone } from '../src/persistence/database.js'
import viteConfig from '../vite.config.js'

test('Phase 01 validates a leadership workday timezone', () => {
  assert.equal(validateTimezone('Australia/Melbourne'), 'Australia/Melbourne')
  assert.throws(() => validateTimezone('not-a-timezone'), /recognised IANA timezone/)
})

test('Phase 01 registers only the approved Core navigation destinations', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  const routes = source.match(/const routes = \[(.*?)\]\nconst app/s)?.[1] || ''
  assert.deepEqual([...routes.matchAll(/id: '([^']+)'/g)].map((match) => match[1]), [
    'today', 'prepare-tomorrow', 'start-day', 'conversations', 'tasks',
  ])
})

test('Phase 01 PWA metadata and home-screen assets are present', () => {
  const manifest = JSON.parse(readFileSync(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8'))
  assert.equal(manifest.display, 'standalone')
  assert.equal(manifest.icons.length, 2)
  for (const asset of ['public/icons/icon-192.png', 'public/icons/icon-512.png', 'public/icons/apple-touch-icon.png']) {
    assert.equal(existsSync(new URL(`../${asset}`, import.meta.url)), true, `${asset} is missing`)
  }
})

test('production shell caching uses Vite’s generated entry asset manifest', () => {
  const source = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8')
  assert.equal(viteConfig.build.manifest, 'asset-manifest.json')
  assert.match(source, /BUILD_MANIFEST = '\.\/asset-manifest\.json'/)
  assert.match(source, /entry\.isEntry/)
  assert.match(source, /entry\.css/)
  assert.match(source, /talentisos-shell-v7/)
  assert.match(source, /key\.startsWith\('talentisos-shell-'\) && key !== CACHE_VERSION/)
  assert.match(source, /caches\.delete\(key\)/)
})

test('service worker serves the cached production shell before background navigation revalidation', () => {
  const source = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8')
  const bypass = "if (isViteDevelopmentRequest(url)) {\n    event.respondWith(fetch(event.request))\n    return\n  }"

  assert.match(source, /url\.pathname\.startsWith\('\/src\/'\)/)
  assert.match(source, /url\.pathname\.startsWith\('\/@vite\/'\)/)
  assert.match(source, /url\.pathname\.startsWith\('\/@id\/'\)/)
  assert.match(source, /url\.pathname\.startsWith\('\/node_modules\/\.vite\/'\)/)
  assert.ok(source.includes(bypass))
  assert.ok(source.indexOf(bypass) < source.indexOf("if (event.request.mode === 'navigate')"))
  assert.ok(source.indexOf(bypass) < source.indexOf('event.respondWith(caches.match(event.request)'))
  assert.match(source, /function revalidateShell\(request\)/)
  assert.match(source, /const shell = caches\.open\(CACHE_VERSION\)\.then\(\(cache\) => cache\.match\('\.\/'\)\)/)
  assert.match(source, /event\.respondWith\(shell\.then\(\(cached\) => cached \|\| fetch\(event\.request\)/)
  assert.match(source, /event\.waitUntil\(shell\.then\(\(cached\) => cached \? revalidateShell\(event\.request\) : undefined\)\)/)
  assert.ok(source.indexOf("cache.match('./')") < source.indexOf('fetch(event.request).then'))
})

test('startup shell is visible before IndexedDB startup completes', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  assert.match(html, /id="app"><main class="recovery-state startup-state" role="status" aria-live="polite" aria-busy="true"><h1>Opening your workspace…<\/h1>/)
  assert.match(source, /if \(!\('indexedDB' in window\)\) \{ app\.innerHTML = '<main class="recovery-state">/)
})

test('service worker registration does not miss an already-complete document', () => {
  const source = readFileSync(new URL('../src/pwa.js', import.meta.url), 'utf8')
  assert.match(source, /let registrationStarted = false/)
  assert.match(source, /if \(!\('serviceWorker' in navigator\) \|\| registrationStarted\) return/)
  assert.match(source, /registrationStarted = true/)
  assert.match(source, /navigator\.serviceWorker\.register\('\.\/sw\.js'\)/)
  assert.match(source, /if \(document\.readyState === 'complete'\) register\(\)/)
  assert.match(source, /window\.addEventListener\('load', register, \{ once: true \}\)/)
})

test('service worker registration starts independently of persistence bootstrap', () => {
  const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8')
  assert.equal([...source.matchAll(/\bregisterServiceWorker\(\)/g)].length, 1)
  assert.match(source, /registerServiceWorker\(\); start\(\)/)
})

test('database schema retains additive migrations through the Phase 07 stores', () => {
  const source = readFileSync(new URL('../src/persistence/database.js', import.meta.url), 'utf8')
  assert.equal(DATABASE_VERSION, 9)
  assert.match(source, /event\.oldVersion < 2/)
  assert.match(source, /event\.oldVersion < 3/)
  assert.match(source, /event\.oldVersion < 4/)
  assert.match(source, /event\.oldVersion < 5/)
  assert.match(source, /event\.oldVersion < 7/)
  assert.match(source, /event\.oldVersion < 8/)
  assert.match(source, /event\.oldVersion < 9/)
  assert.match(source, /TASKS_STORE/)
  assert.match(source, /EODS_STORE/)
  assert.match(source, /HUDDLES_STORE/)
  assert.match(source, /RISKS_STORE/)
  assert.match(source, /ORIENTATION_STORE/)
  assert.match(source, /CONVERSATIONS_STORE/)
  assert.match(source, /WEEKLY_REVIEWS_STORE/)
})
