import { initializeWorkspaceStorage } from './state/storage.js';

// Future phases can map route constants to view modules. Phase 00 deliberately
// renders one restrained foundation screen and creates no domain state.
initializeWorkspaceStorage().catch(error => {
  console.warn('Workspace metadata storage is unavailable.', error);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(error => {
    console.warn('Service worker registration failed.', error);
  }));
}
