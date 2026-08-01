import './styles.css';
import { createAppShell, createToast, getRoute, renderView } from './components.js';

const app = document.querySelector('#app');
const toastRegion = document.querySelector('#toast-region');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const themeQuery = window.matchMedia('(prefers-color-scheme: dark)');

function showToast(message) {
  toastRegion.replaceChildren();
  toastRegion.innerHTML = createToast(message);
  const toast = toastRegion.firstElementChild;
  window.setTimeout(() => toast.remove(), 3600);
}

function resolvedTheme(theme) {
  return theme === 'system' ? (themeQuery.matches ? 'dark' : 'light') : theme;
}

function applyTheme(theme, announce = false) {
  const activeTheme = resolvedTheme(theme);
  try {
    localStorage.setItem('talentisos-theme', theme);
  } catch {
    // Appearance remains available for the current session if storage is unavailable.
  }
  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.resolvedTheme = activeTheme;
  themeMeta.setAttribute('content', activeTheme === 'dark' ? '#101820' : '#f5f7fa');
  document.querySelectorAll('[data-theme-choice]').forEach((button) => {
    const selected = button.dataset.themeChoice === theme;
    button.setAttribute('aria-pressed', String(selected));
  });
  if (announce) showToast(`${theme[0].toUpperCase()}${theme.slice(1)} appearance selected.`);
}

function render() {
  const route = getRoute();
  app.innerHTML = createAppShell(route);
  renderView(route);
  let savedTheme = 'system';
  try {
    savedTheme = localStorage.getItem('talentisos-theme') || 'system';
  } catch {
    // Use system appearance when storage is unavailable.
  }
  applyTheme(document.documentElement.dataset.theme || savedTheme);
  document.title = `${route.label} — TalentisOS`;
}

function openDialog(dialog) {
  dialog.showModal();
  dialog.querySelector('button, [href], input, select')?.focus();
}

document.addEventListener('click', (event) => {
  const themeButton = event.target.closest('[data-theme-choice]');
  if (themeButton) {
    applyTheme(themeButton.dataset.themeChoice, true);
    return;
  }

  const settingsButton = event.target.closest('[data-open-settings]');
  if (settingsButton) {
    openDialog(document.querySelector('#settings-dialog'));
    return;
  }

  const closeButton = event.target.closest('[data-close-dialog]');
  if (closeButton) closeButton.closest('dialog')?.close();

  const collapseButton = event.target.closest('[data-toggle-sidebar]');
  if (collapseButton) {
    const collapsed = document.body.classList.toggle('sidebar-collapsed');
    collapseButton.setAttribute('aria-expanded', String(!collapsed));
    showToast(collapsed ? 'Sidebar collapsed.' : 'Sidebar expanded.');
  }
});

window.addEventListener('hashchange', render);
themeQuery.addEventListener('change', () => {
  if (document.documentElement.dataset.theme === 'system') applyTheme('system');
});

document.documentElement.dataset.appReady = 'true';
render();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      registration.addEventListener('updatefound', () => showToast('A fresh version is ready.'));
      navigator.serviceWorker.addEventListener('controllerchange', () =>
        showToast('TalentisOS is up to date.'),
      );
    } catch {
      showToast('Offline support is unavailable in this browser session.');
    }
  });
}
