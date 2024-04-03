const { ACCESS_URL_WIDGET } = require('~constants');

export function sendAccessCount() {
  if (!ACCESS_URL_WIDGET) return;

  fetch(ACCESS_URL_WIDGET, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: `{ "s": "${location.hostname}" }`,
  }).catch((err) => console.error(err));
}
