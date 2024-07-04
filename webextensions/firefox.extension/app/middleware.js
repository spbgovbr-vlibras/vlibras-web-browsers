let isPlayerLoaded = false;

window.addEventListener('load', function () {
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.selectedText === undefined) return;

      window.plugin = (window.plugin || new window.VLibras.Plugin({ enableMoveWindow: false }));
      if (isPlayerLoaded) return window.plugin.translate(request.selectedText);

      window.plugin.player.on('load', () => {
        setTimeout(() => window.plugin.translate(request.selectedText), 2000);
        isPlayerLoaded = true;
      })

    });
  chrome.runtime.sendMessage({ ready: true });
});
