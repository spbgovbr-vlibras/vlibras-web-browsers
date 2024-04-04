const { ACCESS_URL_BASE } = require('~constants');

export function sendAccessCount() {
  if (!ACCESS_URL_BASE || hasSendAccess()) return;
  else localStorage.setItem('@vp-send-access', 'true');

  fetch(ACCESS_URL_BASE + '/widget', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: `{ "s": "${location.hostname}" }`,
  }).catch((err) => console.error(err));
}

function hasSendAccess() {
  return localStorage.getItem('@vp-send-access') === 'true';
}
