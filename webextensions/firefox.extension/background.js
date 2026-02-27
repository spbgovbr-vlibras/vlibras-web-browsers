let selectedText = undefined;
let popupId = null;

const createPopup = () => {
  chrome.windows.create(
    {
      url: 'index.html',
      top: 10,
      left: 10,
      width: 320,
      height: 500,
      type: 'popup',
    },
    (w) => {
      popupId = w.id;
      chrome.storage.local.set({ popupId: popupId });
    }
  );
};

const updatePopup = () => {
  chrome.windows.update(popupId, { focused: true }, () => {
    if (chrome.runtime.lastError) {
      popupId = null;
      chrome.storage.local.remove('popupId');
      return;
    }

    chrome.runtime.sendMessage({ selectedText });
    selectedText = undefined;
  });
};

chrome.storage.local.get('popupId', ({ popupId: stored }) => {
  popupId = stored ?? null;
});

chrome.contextMenus.create(
  {
    id: 'translate_contextmenu',
    title: "Traduzir '%s' para Libras",
    contexts: ['selection'],
  },
  () => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
    }
  }
);

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (!info.selectionText) return;

  selectedText = info.selectionText;

  let exists = false;
  if (popupId !== null) {
    try {
      await chrome.windows.get(popupId);
      exists = true;
    } catch (e) {
      exists = false;
      popupId = null;
      chrome.storage.local.remove('popupId');
    }
  }

  if (!exists) createPopup();
  else updatePopup();
});

chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === popupId) {
    popupId = null;
    chrome.storage.local.remove('popupId');
  }
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.ready && selectedText) {
    chrome.runtime.sendMessage({ selectedText });
    selectedText = undefined;
  }
});
