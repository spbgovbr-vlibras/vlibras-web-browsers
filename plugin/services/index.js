const { ACCESS_COUNT_URL } = require('~constants');

export function sendAccessCount() {
  if (!ACCESS_COUNT_URL) return;

  fetch(ACCESS_COUNT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: `{ "s": "${location.hostname}" }`,
  }).catch((err) => console.error(err));
}
