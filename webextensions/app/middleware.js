window.addEventListener('load', function () {
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.selectedText === undefined) return;

      window.plugin = (window.plugin || new window.VLibras.Plugin({ enableMoveWindow: false }));

      window.plugin.player.on('load', () => {
        setTimeout(() => window.plugin.translate(request.selectedText), 3000);
      })

    });
  chrome.runtime.sendMessage({ ready: true });
});
