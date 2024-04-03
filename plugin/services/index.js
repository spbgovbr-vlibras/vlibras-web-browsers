const { ACCESS_URL_PLUGIN } = require('~constants');

export function sendAccessCount() {
  if (!ACCESS_URL_PLUGIN) return;

  fetch(ACCESS_URL_PLUGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: `{ "s": "${location.hostname}" }`,
  }).catch((err) => console.error(err));
}
