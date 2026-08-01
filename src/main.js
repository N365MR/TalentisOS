import './styles.css';

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.dataset.appReady = 'true';

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Offline support is progressive; the shell remains usable if registration fails.
      });
    });
  }
});
