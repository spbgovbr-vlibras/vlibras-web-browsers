const { PING_URL } = require('~widget-constants');

const WIDGET_PING_KEY = '@widget-pinged';

export function sendWidgetPing() {
  if (hasPinged()) return;

  fetch(PING_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: `{ "site": "${location.hostname}" }`,
  })
    .then((res) => res.json())
    .then(() => setPinged())
    .catch((err) => console.error(err));

  function hasPinged() {
    return localStorage.getItem(WIDGET_PING_KEY) === 'true';
  }

  function setPinged() {
    localStorage.setItem(WIDGET_PING_KEY, 'true');
  }
}
