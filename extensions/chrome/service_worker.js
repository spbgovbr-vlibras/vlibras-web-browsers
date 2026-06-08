let selectedText = "";
let textCaptureEnabled = false;
let popupConnections = 0;

const isInjectableUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("http://")) return true;
  if (url.startsWith("https://")) return true;
  if (url.startsWith("file://")) return true;
  return false;
};

const ensureTextCaptureInTab = async (tabId) => {
  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["text-capture.js"],
    });
  } catch {}

  try {
    await chrome.tabs.sendMessage(tabId, { type: "VLibrasTextCaptureEnable" });
  } catch {}
};

const enableTextCaptureForAllTabs = async () => {
  const tabs = await chrome.tabs.query({});
  await Promise.all(
    tabs
      .filter((t) => t?.id && isInjectableUrl(t.url))
      .map((t) => ensureTextCaptureInTab(t.id)),
  );
};

const disableTextCaptureForAllTabs = async () => {
  const tabs = await chrome.tabs.query({});
  await Promise.all(
    tabs
      .filter((t) => t?.id)
      .map((t) =>
        chrome.tabs
          .sendMessage(t.id, { type: "VLibrasTextCaptureDisable" })
          .catch(() => {}),
      ),
  );
};

const setTextCaptureEnabled = async (enabled) => {
  if (textCaptureEnabled === enabled) return;
  textCaptureEnabled = enabled;

  if (enabled) await enableTextCaptureForAllTabs();
  else await disableTextCaptureForAllTabs();
};

const getPopup = async () => {
  const { popupId } = await chrome.storage.local.get("popupId");
  if (!popupId) return null;

  try {
    return await chrome.windows.get(popupId);
  } catch {
    await chrome.storage.local.remove("popupId");
    return null;
  }
};

const createPopup = (text = "") => {
  selectedText = text;
  chrome.windows.create(
    {
      url: "index.html",
      type: "popup",
      top: 10,
      left: 10,
      width: 320,
      height: 480,
    },
    (w) => {
      chrome.storage.local.set({ popupId: w.id });
    },
  );
};

chrome.action.onClicked.addListener(async () => {
  const existingWindow = await getPopup();

  if (existingWindow) {
    chrome.windows.update(existingWindow.id, { focused: true });
    setTextCaptureEnabled(true);
    return;
  }

  createPopup();
  setTextCaptureEnabled(true);
});

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request?.selectedText && sender?.tab?.id) {
    (async () => {
      const existingWindow = await getPopup();

      if (existingWindow) {
        chrome.windows.update(existingWindow.id, { focused: true });
        chrome.runtime.sendMessage({ selectedText: request.selectedText });
        selectedText = "";
        return;
      }

      createPopup(request.selectedText);
      setTextCaptureEnabled(true);
    })();
    return;
  }

  if (request?.ready && selectedText) {
    chrome.runtime.sendMessage({ selectedText });
    selectedText = "";
  }
});

chrome.runtime.onConnect.addListener((port) => {
  if (port?.name !== "vlibras-popup") return;

  popupConnections += 1;
  setTextCaptureEnabled(true);

  port.onDisconnect.addListener(() => {
    popupConnections = Math.max(0, popupConnections - 1);
    if (popupConnections === 0) setTextCaptureEnabled(false);
  });
});

chrome.windows.onRemoved.addListener(async (windowId) => {
  const { popupId } = await chrome.storage.local.get("popupId");
  if (windowId !== popupId) return;
  await chrome.storage.local.remove("popupId");
  popupConnections = 0;
  setTextCaptureEnabled(false);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!textCaptureEnabled) return;
  if (changeInfo?.status !== "complete") return;
  if (!isInjectableUrl(tab?.url)) return;
  ensureTextCaptureInTab(tabId);
});
