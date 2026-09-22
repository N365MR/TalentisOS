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
  assert.deepEqual([...source.matchAll(/id: '([^']+)'/g)].map((match) => match[1]), [
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
  assert.match(source, /talentisos-shell-v5/)
  assert.match(source, /key\.startsWith\('talentisos-shell-'\) && key !== CACHE_VERSION/)
  assert.match(source, /caches\.delete\(key\)/)
})

test('service worker bypasses Vite development modules without changing production cache paths', () => {
  const source = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8')
  const bypass = "if (isViteDevelopmentRequest(url)) {\n    event.respondWith(fetch(event.request))\n    return\n  }"

  assert.match(source, /url\.pathname\.startsWith\('\/src\/'\)/)
  assert.match(source, /url\.pathname\.startsWith\('\/@vite\/'\)/)
  assert.match(source, /url\.pathname\.startsWith\('\/@id\/'\)/)
  assert.match(source, /url\.pathname\.startsWith\('\/node_modules\/\.vite\/'\)/)
  assert.ok(source.includes(bypass))
  assert.ok(source.indexOf(bypass) < source.indexOf("if (event.request.mode === 'navigate')"))
  assert.ok(source.indexOf(bypass) < source.indexOf('event.respondWith(caches.match(event.request)'))
  assert.match(source, /cache\.put\('\.\/\', copy\)/)
  assert.match(source, /caches\.match\('\.\/'\)\.then\(\(response\) => response \|\| caches\.match\('\.\/index\.html'\)\)/)
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

test('database schema retains additive migrations through the Phase 05 Needs attention stores', () => {
  const source = readFileSync(new URL('../src/persistence/database.js', import.meta.url), 'utf8')
  assert.equal(DATABASE_VERSION, 7)
  assert.match(source, /event\.oldVersion < 2/)
  assert.match(source, /event\.oldVersion < 3/)
  assert.match(source, /event\.oldVersion < 4/)
  assert.match(source, /event\.oldVersion < 5/)
  assert.match(source, /event\.oldVersion < 7/)
  assert.match(source, /TASKS_STORE/)
  assert.match(source, /EODS_STORE/)
  assert.match(source, /HUDDLES_STORE/)
  assert.match(source, /RISKS_STORE/)
})
