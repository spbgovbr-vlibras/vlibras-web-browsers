const { PING_URL } = require('~constants');

export function sendPluginPing() {
  fetch(PING_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: `{ "s": "${location.hostname}" }`,
  }).catch((err) => console.error(err));
}
