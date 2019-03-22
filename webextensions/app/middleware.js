window.addEventListener('load', function() {
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.selectedText === undefined) return;

      window.plugin = (window.plugin || new VLibras.Plugin({enableMoveWindow: false}));
      window.plugin.translate(request.selectedText);
    });

  chrome.runtime.sendMessage({ready: true});
});
