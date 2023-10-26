let isLoaded = false;

window.addEventListener('load', () => {
  window.plugin = (window.plugin || new window.VLibras.Plugin({ enableMoveWindow: false }));
});

window.addEventListener('message', ({ data }) => {
  if (!isLoaded) boundTranslate(data);
  else translate(data);
});

function boundTranslate(text) {
  window.plugin.player.on('load', () => {
    setTimeout(() => translate(text), 4000);
    isLoaded = true;
  })
}

function translate(text) {
  window.plugin.player.translate(text);
}
