const copy = {
  today: ['TODAY', 'A private leadership rhythm, ready when you are.', 'Prepare, align, execute, review, and improve from one calm local workspace.'],
  meetings: ['MEETINGS', 'Weekly conversations will turn into owned work.', 'The meeting cadence and issue-solving tools arrive in a later phase.'],
  insights: ['INSIGHTS', 'Attention will follow the exceptions.', 'KPI and work exceptions will be introduced after the state and workflow foundations.'],
  settings: ['SETTINGS', 'Your workspace stays yours.', 'Local storage, backup, and restore controls are introduced in the next foundation phase.']
};

export function render(root, route) {
  const [eyebrow, title, lede] = copy[route];
  root.innerHTML = `<p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p class="lede">${lede}</p>`;
  document.querySelectorAll('[data-route]').forEach(link => {
    if (link.dataset.route === route) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}
