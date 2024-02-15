const { PING_URL } = require('~widget-constants');

export function sendWidgetPing() {
  fetch(PING_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: `{ "site": "${location.hostname}" }`,
  }).catch((err) => console.error(err));
}
