import { initializeWorkspaceStorage } from './state/storage.js';
import { createExportEnvelope, importEnvelope, parseImport } from './state/transfer.js';
import { getRoute } from './ui/router.js';
import { renderApp } from './ui/render.js';

const root = document.querySelector('#app');
let storageReady = false;
async function start() { try { await initializeWorkspaceStorage(); storageReady = true; } catch (error) { console.warn('TalentisOS local storage is unavailable.', error); } render(); }
function render() { renderApp(root, getRoute()); document.querySelector('[data-action="export"]')?.addEventListener('click', exportData); document.querySelector('[data-action="import"]')?.addEventListener('change', importData); }
async function exportData() { if (!storageReady) return notify('Local storage is unavailable. Export cannot run.', 'error'); try { const envelope = await createExportEnvelope(); const blob = new Blob([JSON.stringify(envelope, null, 2)], { type: 'application/json' }); const link = document.createElement('a'); link.href = URL.createObjectURL(blob); link.download = `talentisos-backup-${envelope.exportedAt.slice(0, 10)}.json`; link.click(); URL.revokeObjectURL(link.href); notify('Your local backup is ready.'); } catch { notify('Could not create a backup. Please try again.', 'error'); } }
async function importData(event) { const file = event.target.files?.[0]; event.target.value = ''; if (!file || !storageReady) return; try { const envelope = parseImport(await file.text()); if (!window.confirm('Replace the current local tasks and preferences with this backup? This cannot be undone.')) return; await importEnvelope(envelope); notify('Your backup has been imported.'); } catch (error) { notify(error.message || 'This backup could not be imported.', 'error'); } }
function notify(message, type = 'success') { const region = document.querySelector('#toast-region'); if (!region) return; const toast = document.createElement('p'); toast.className = `toast toast--${type}`; toast.textContent = message; region.replaceChildren(toast); window.setTimeout(() => toast.remove(), 5000); }
window.addEventListener('hashchange', render); start();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(error => console.warn('Service worker registration failed.', error)));
