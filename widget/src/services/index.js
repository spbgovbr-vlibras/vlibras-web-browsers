const { ACCESS_URL_BASE } = require('~constants');

export function sendAccessCount() {
  if (!ACCESS_URL_BASE) return;

  fetch(ACCESS_URL_BASE + '/widget', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: `{ "s": "${location.hostname}" }`,
  }).catch((err) => console.error(err));
}
