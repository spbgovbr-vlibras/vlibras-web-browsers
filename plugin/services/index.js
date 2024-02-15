const { PING_URL } = require('~constants');

const PLUGIN_PING_KEY = '@plugin-pinged';

export function sendPluginPing() {
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
    return localStorage.getItem(PLUGIN_PING_KEY) === 'true';
  }

  function setPinged() {
    localStorage.setItem(PLUGIN_PING_KEY, 'true');
  }
}
