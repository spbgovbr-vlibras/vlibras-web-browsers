window.addEventListener('load', function () {
  const iframe = document.querySelector('iframe');
  const src = 'app/player/index.html';

  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      if (request.selectedText === undefined) return;
      iframe.src = src + '?text=' + request.selectedText;
    });
  chrome.runtime.sendMessage({ ready: true });
});
