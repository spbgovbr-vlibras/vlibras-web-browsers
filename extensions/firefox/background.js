let selectedText = "";
let textCaptureEnabled = false;
let popupConnections = 0;

const CONTEXT_MENU_ID = "vlibras-open-widget";
const DEFAULT_CONTEXT_MENU_TITLE = "Abrir VLibras Widget";
const MAX_SELECTION_IN_TITLE = 48;

const isInjectableUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("http://")) return true;
  if (url.startsWith("https://")) return true;
  if (url.startsWith("file://")) return true;
  return false;
};

const getSelectionTitle = (text) => {
  const normalized = String(text ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return DEFAULT_CONTEXT_MENU_TITLE;
  const clipped =
    normalized.length > MAX_SELECTION_IN_TITLE
      ? `${normalized.slice(0, MAX_SELECTION_IN_TITLE - 1)}…`
      : normalized;
  return `Traduzir "${clipped}" para Libras`;
};

const setupContextMenu = () => {
  try {
    browser.menus.removeAll();
  } catch {}

  try {
    browser.menus.create({
      id: CONTEXT_MENU_ID,
      title: DEFAULT_CONTEXT_MENU_TITLE,
      contexts: ["all"],
    });
  } catch {}
};

const ensureTextCaptureInTab = async (tabId) => {
  try {
    await browser.tabs.executeScript(tabId, { file: "text-capture.js" });
  } catch {}

  try {
    await browser.tabs.sendMessage(tabId, { type: "VLibrasTextCaptureEnable" });
  } catch {}
};

const enableTextCaptureForAllTabs = async () => {
  const tabs = await browser.tabs.query({});
  await Promise.all(
    tabs
      .filter((t) => t?.id && isInjectableUrl(t.url))
      .map((t) => ensureTextCaptureInTab(t.id)),
  );
};

const disableTextCaptureForAllTabs = async () => {
  const tabs = await browser.tabs.query({});
  await Promise.all(
    tabs
      .filter((t) => t?.id)
      .map((t) =>
        browser.tabs
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
  const { popupId } = await browser.storage.local.get("popupId");
  if (!popupId) return null;

  try {
    return await browser.windows.get(popupId);
  } catch {
    await browser.storage.local.remove("popupId");
    return null;
  }
};

const createPopup = async (text = "") => {
  selectedText = text;
  const w = await browser.windows.create({
    url: browser.runtime.getURL("index.html"),
    type: "popup",
    width: 320,
    height: 480,
  });
  if (w?.id) await browser.storage.local.set({ popupId: w.id });
};

try {
  setupContextMenu();
} catch {}

browser.runtime.onInstalled.addListener(() => {
  try {
    setupContextMenu();
  } catch {}
});

if (browser.runtime.onStartup) {
  browser.runtime.onStartup.addListener(() => {
    try {
      setupContextMenu();
    } catch {}
  });
}

if (browser.menus.onShown && browser.menus.refresh) {
  browser.menus.onShown.addListener((info) => {
    try {
      browser.menus.update(CONTEXT_MENU_ID, {
        title: getSelectionTitle(info?.selectionText),
      });
      browser.menus.refresh();
    } catch {}
  });
}

browser.menus.onClicked.addListener(async (info) => {
  if (info?.menuItemId !== CONTEXT_MENU_ID) return;

  const selectionText = info?.selectionText || "";
  const existingWindow = await getPopup();

  if (existingWindow?.id) {
    await browser.windows.update(existingWindow.id, { focused: true });
    await setTextCaptureEnabled(true);
    if (selectionText) {
      await browser.runtime
        .sendMessage({ selectedText: selectionText })
        .catch(() => {});
    }
    return;
  }

  await createPopup(selectionText);
  await setTextCaptureEnabled(true);
});

browser.browserAction.onClicked.addListener(async () => {
  const existingWindow = await getPopup();

  if (existingWindow?.id) {
    await browser.windows.update(existingWindow.id, { focused: true });
    await setTextCaptureEnabled(true);
    return;
  }

  await createPopup();
  await setTextCaptureEnabled(true);
});

browser.runtime.onMessage.addListener((request, sender) => {
  if (request?.selectedText && sender?.tab?.id) {
    void (async () => {
      const existingWindow = await getPopup();

      if (existingWindow?.id) {
        await browser.windows.update(existingWindow.id, { focused: true });
        await browser.runtime
          .sendMessage({ selectedText: request.selectedText })
          .catch(() => {});
        selectedText = "";
        return;
      }

      await createPopup(request.selectedText);
      await setTextCaptureEnabled(true);
    })();
    return;
  }

  if (request?.ready && selectedText) {
    void browser.runtime.sendMessage({ selectedText }).catch(() => {});
    selectedText = "";
  }
});

browser.runtime.onConnect.addListener((port) => {
  if (port?.name !== "vlibras-popup") return;

  popupConnections += 1;
  void setTextCaptureEnabled(true);

  port.onDisconnect.addListener(() => {
    popupConnections = Math.max(0, popupConnections - 1);
    if (popupConnections === 0) void setTextCaptureEnabled(false);
  });
});

browser.windows.onRemoved.addListener(async (windowId) => {
  const { popupId } = await browser.storage.local.get("popupId");
  if (windowId !== popupId) return;
  await browser.storage.local.remove("popupId");
  popupConnections = 0;
  await setTextCaptureEnabled(false);
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!textCaptureEnabled) return;
  if (changeInfo?.status !== "complete") return;
  if (!isInjectableUrl(tab?.url)) return;
  void ensureTextCaptureInTab(tabId);
});
