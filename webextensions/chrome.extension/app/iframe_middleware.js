window.addEventListener('load', function () {
  const iframe = document.querySelector('iframe');

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.selectedText === undefined) return;
      iframe.contentWindow.postMessage(request.selectedText, '*');
    });
  chrome.runtime.sendMessage({ ready: true });
});
