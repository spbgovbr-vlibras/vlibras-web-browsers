const { ACCESS_URL } = require('~widget-constants');

export function sendAccessCount() {
  if (!ACCESS_URL) return;

  fetch(ACCESS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: `{ "s": "${location.hostname}" }`,
  }).catch((err) => console.error(err));
}
