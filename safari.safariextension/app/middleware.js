window.resizeTo(540, 470);

safari.self.addEventListener('message', function (request) {
  if (request.name !== 'plugin:selectedText' && request.message === undefined) return;
  
  window.plugin = (window.plugin || new VLibras.Plugin());
  window.plugin.translate(request.message);
});

safari.self.tab.dispatchMessage('page:ready', true);
