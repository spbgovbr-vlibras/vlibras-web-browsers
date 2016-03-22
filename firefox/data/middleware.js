document.addEventListener('plugin:selectedText', function(e) {
  if (e.detail === undefined) return;

  window.plugin = (window.plugin || new VLibras.Plugin());
  window.plugin.translate(e.detail);
});
