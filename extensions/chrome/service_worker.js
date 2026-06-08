let selectedText = "";

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
			selectedText = text;
		},
	);
};

chrome.contextMenus.create({
	id: "translate_contextmenu_vlibras",
	title: 'Traduzir "%s" para Libras',
	contexts: ["selection"],
});

chrome.contextMenus.onClicked.addListener(async (info) => {
	if (!info.selectionText) return;

	const existingWindow = await getPopup();

	if (existingWindow) {
		chrome.windows.update(existingWindow.id, { focused: true });
		chrome.runtime.sendMessage({ selectedText: info.selectionText });
	} else createPopup(info.selectionText);
});

chrome.action.onClicked.addListener(async () => {
	const existingWindow = await getPopup();

	if (existingWindow) {
		chrome.windows.update(existingWindow.id, { focused: true });
		return;
	}

	createPopup();
});

chrome.runtime.onMessage.addListener((request) => {
	if (request.ready && selectedText) {
		chrome.runtime.sendMessage({ selectedText });
		selectedText = "";
	}
});

chrome.windows.onRemoved.addListener(async (windowId) => {
	const { popupId } = await chrome.storage.local.get("popupId");
	if (windowId === popupId) chrome.storage.local.remove("popupId");
});
