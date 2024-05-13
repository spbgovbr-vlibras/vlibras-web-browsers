const { ACCESS_COUNT_URL } = require('~constants');

export function sendAccessCount(isExtension) {
  if (!ACCESS_COUNT_URL) return;

  fetch(isExtension ? 'vlibras-plugin' : ACCESS_COUNT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: `{ "s": "${location.hostname}" }`,
  }).catch((err) => console.error(err));
}
