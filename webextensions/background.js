var popup = undefined;
var selectedText = undefined;

// Creates the context menu to translate texts
chrome.contextMenus.create({
  id: 'translate_contextmenu',
  title: 'Traduzir \'%s\' para LIBRAS',
  contexts: ['selection'],
}, () => {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError.message);
  }
});

// Listening the event click
chrome.contextMenus.onClicked.addListener( function (info) {
  selectedText = info.selectionText;

  // Creates the window if it exists
  if (popup === undefined) {
    chrome.windows.create(
      {
        url: "app/player/index.html",
        top: 10,
        left: 10,
        width: 540,
        height: 450,
        type: "popup"
      },
      w => (popup = w),
    );
  } else {
    chrome.windows.update(popup.id, { focused: true }, () => {
      chrome.runtime.sendMessage({ selectedText });
      selectedText = undefined;
    });
  }
});

// Frees variable if the popup doesn't to exist anymore
chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId == popup.id) {
    popup = undefined;
  }
});

// Listening the ready event of the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.ready === true && selectedText !== undefined) {
    chrome.runtime.sendMessage({ selectedText });
    selectedText = undefined;
  }
});
