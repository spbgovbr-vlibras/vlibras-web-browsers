window.addEventListener('load', function () {
  // chrome.runtime.onMessage.addListener(
  //   function (request, sender, sendResponse) {
  //     if (request.selectedText === undefined) return;

  //     window.plugin = (window.plugin || new window.VLibras.Plugin({ enableMoveWindow: false }));
  //     window.plugin.translate(request.selectedText);
  //   });

  // chrome.runtime.sendMessage({ ready: true });

  window.plugin = (window.plugin || new window.VLibras.Plugin({ enableMoveWindow: false }));


  window.plugin.player.on('load', () => {
    setTimeout(() => {
      window.plugin.player.stop();
      const text = new URL(location.href).searchParams.get('text');
      window.plugin.translate(text);
    }, 1000);

  })

});
