import './style.css'
import { getSettings, openDatabase, updateLeadershipTimezone } from './persistence/database.js'
import { registerServiceWorker } from './pwa.js'

const routes = [
  { id: 'today', label: 'Today', title: 'Today', description: 'A calm place to begin your leadership day.' },
  { id: 'prepare-tomorrow', label: 'Prepare tomorrow', title: 'Prepare tomorrow', description: 'Set yourself up for the next workday.' },
  { id: 'start-day', label: 'Start the day', title: 'Start the day', description: 'Begin with a clear leadership rhythm.' },
  { id: 'conversations', label: 'Conversations', title: 'Conversations', description: 'Prepare for the conversations that matter.' },
  { id: 'tasks', label: 'Tasks', title: 'Tasks', description: 'Keep your commitments in one reliable place.' },
]

const app = document.querySelector('#app')
let settings
let menuButton
let navigation
let connectionCheck = 0

function currentRoute() {
  const routeId = window.location.hash.replace('#/', '') || 'today'
  return routes.find((route) => route.id === routeId) || routes[0]
}

function buildNavigation(route) {
  return routes.map(({ id, label }) => `
    <li><a href="#/${id}" ${id === route.id ? 'aria-current="page"' : ''}>${label}</a></li>
  `).join('')
}

function render() {
  const route = currentRoute()
  document.title = `${route.title} · TalentisOS`
  app.innerHTML = `
    <a class="skip-link" href="#main-content">Skip to content</a>
    <header class="site-header">
      <a class="brand" href="#/today" aria-label="TalentisOS, Today"><span class="brand-mark" aria-hidden="true">T</span><span>TalentisOS</span></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation"><span aria-hidden="true">☰</span><span>Menu</span></button>
      <nav id="primary-navigation" class="primary-navigation" aria-label="Core navigation"><ul>${buildNavigation(route)}</ul></nav>
    </header>
    <main id="main-content" tabindex="-1">
      <section class="intro" aria-labelledby="page-title">
        <p class="eyebrow"><span aria-hidden="true">●</span> Private, local workspace</p>
        <h1 id="page-title">${route.title}</h1>
        <p class="lede">${route.description}</p>
      </section>
      <section class="foundation-panel" aria-labelledby="foundation-title">
        <div><p class="status-label"><span aria-hidden="true">✓</span> Foundation ready</p><h2 id="foundation-title">Your workspace is prepared</h2><p>This early version establishes the dependable shell, local storage and offline support. Leadership workflows will appear only when they are complete and approved.</p></div>
        <dl class="foundation-details"><div><dt>Storage</dt><dd><span aria-hidden="true">✓</span> Stored on this device</dd></div><div><dt>Connection</dt><dd id="connection-status"><span aria-hidden="true">●</span> Checking connection</dd></div></dl>
      </section>
      <section class="preference-panel" aria-labelledby="timezone-title">
        <div><p class="eyebrow">Workday preference</p><h2 id="timezone-title">Leadership workday timezone</h2><p>Used for future workday calculations. Changing it will never move existing work between days.</p></div>
        <form id="timezone-form" class="timezone-form"><label for="timezone">Timezone</label><div class="timezone-control"><input id="timezone" name="timezone" list="timezone-options" autocomplete="off" required /><datalist id="timezone-options"></datalist><button type="submit">Save preference</button></div><p id="timezone-message" class="form-message" role="status" aria-live="polite"></p></form>
      </section>
    </main>
    <footer class="site-footer"><p id="update-notice" class="update-notice" role="status" hidden>A newer version is ready. Refresh when you are ready to use it.</p><p>TalentisOS keeps your information in this browser on this device.</p></footer>
  `
  menuButton = app.querySelector('.menu-toggle')
  navigation = app.querySelector('.primary-navigation')
  menuButton.addEventListener('click', toggleMenu)
  navigation.addEventListener('click', closeMenu)
  populateTimezoneForm()
  updateConnectionStatus()
}

function toggleMenu() {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true'
  menuButton.setAttribute('aria-expanded', String(!isOpen))
  navigation.classList.toggle('is-open', !isOpen)
}

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false')
  navigation.classList.remove('is-open')
}

async function updateConnectionStatus() {
  const element = app.querySelector('#connection-status')
  if (!element) return
  const checkId = ++connectionCheck
  element.innerHTML = navigator.onLine
    ? '<span aria-hidden="true">●</span> Checking connection'
    : '<span aria-hidden="true">○</span> Browser reports offline — checking connection'

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), 3000)
  try {
    const probeUrl = new URL('./asset-manifest.json', window.location.href)
    probeUrl.searchParams.set('talentisos-connection-check', '1')
    const response = await fetch(probeUrl, { cache: 'no-store', signal: controller.signal })
    if (!response.ok) throw new Error('Connection probe was unsuccessful.')
    if (checkId === connectionCheck && element.isConnected) element.innerHTML = '<span aria-hidden="true">●</span> Online'
  } catch {
    if (checkId === connectionCheck && element.isConnected) element.innerHTML = '<span aria-hidden="true">○</span> Offline — shell available'
  } finally {
    window.clearTimeout(timeout)
  }
}

function populateTimezoneForm() {
  const input = app.querySelector('#timezone')
  const list = app.querySelector('#timezone-options')
  input.value = settings.leadershipWorkdayTimezone
  const timezones = typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : ['UTC', settings.leadershipWorkdayTimezone]
  list.innerHTML = [...new Set(['UTC', ...timezones])].map((timezone) => `<option value="${timezone}"></option>`).join('')
  app.querySelector('#timezone-form').addEventListener('submit', saveTimezone)
}

async function saveTimezone(event) {
  event.preventDefault()
  const input = app.querySelector('#timezone')
  const message = app.querySelector('#timezone-message')
  try {
    settings = await updateLeadershipTimezone(input.value.trim())
    input.value = settings.leadershipWorkdayTimezone
    message.textContent = 'Saved on this device. It applies to future workday calculations.'
  } catch (error) { message.textContent = error.message }
}

function renderFailure(message) {
  app.innerHTML = `<main class="recovery-state"><p class="eyebrow"><span aria-hidden="true">!</span> Storage unavailable</p><h1>TalentisOS cannot safely save information here.</h1><p>${message}</p><p>Use a current Safari, Chrome, Edge or Firefox browser with site storage enabled. If you have existing TalentisOS data, return to the browser where it was created and export it before clearing browser data.</p></main>`
}

async function start() {
  if (!('indexedDB' in window) || !('Promise' in window)) return renderFailure('This browser does not support the local storage required by TalentisOS.')
  try {
    await openDatabase()
    settings = await getSettings()
    render()
    window.addEventListener('hashchange', render)
    window.addEventListener('online', updateConnectionStatus)
    window.addEventListener('offline', updateConnectionStatus)
    window.addEventListener('visibilitychange', () => {
      if (!document.hidden) updateConnectionStatus()
    })
  } catch (error) {
    renderFailure('Browser storage could not be opened. No information has been saved by TalentisOS in this session.')
    console.error('TalentisOS storage bootstrap failed:', error)
  }
}

registerServiceWorker()
start()
