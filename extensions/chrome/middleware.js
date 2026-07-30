let initialized = false;
let popupPort = null;

window.addEventListener("load", () => {
  popupPort = chrome.runtime.connect({ name: "vlibras-popup" });

  chrome.runtime.onMessage.addListener((request) => {
    if (!request?.selectedText) return;
    if (initialized) return translate(request.selectedText);

    const interval = setInterval(() => {
      if (!window?.plugin?.player.isLoaded) return;

      translate(request.selectedText);
      initialized = true;
      clearInterval(interval);
    }, 1000);
  });

  chrome.runtime.sendMessage({ ready: true });
});

function translate(text) {
  window.plugin?.translate?.(text);
}
