const routes = new Set(['today', 'meetings', 'insights', 'settings']);

export function getRoute(hash = window.location.hash) {
  const route = hash.replace(/^#/, '').split('/')[0];
  return routes.has(route) ? route : 'today';
}
