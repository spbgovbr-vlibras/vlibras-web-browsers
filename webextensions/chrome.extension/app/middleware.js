let isLoaded = false;

window.addEventListener('load', () => {
  window.plugin =
    window.plugin ||
    new window.VLibras.Plugin({
      enableMoveWindow: false,
      personalization: 'https://vlibras.gov.br/config/default_logo.json',
    });
});

window.addEventListener('message', ({ data }) => {
  if (!isLoaded) boundTranslate(data);
  else translate(data);
});

function boundTranslate(text) {
  window.plugin.player.on('load', () => {
    const interval = setInterval(() => {
      if (isLoadedControls()) {
        isLoaded = true;
        setTimeout(() => translate(text), 1000);
        clearInterval(interval);
      }
    }, 500);
  });
}

function translate(text) {
  window.plugin.player.translate(text);
}

function isLoadedControls() {
  return !!document.querySelector('[vp-controls].vpw-controls');
}
