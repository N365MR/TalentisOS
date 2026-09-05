import { getRoute } from './ui/router.js';
import { render } from './ui/render.js';

const root = document.querySelector('#app');

function renderRoute() {
  render(root, getRoute());
}

window.addEventListener('hashchange', renderRoute);
renderRoute();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(error => {
    console.warn('Service worker registration failed.', error);
  }));
}
