import type { HTMLTagNames } from "./types";

const ROOT_ID = "vlibras-app-root";
const ROOT_OVERLAY_ID = "vlibras-root-overlay";

const memoizedRoots: Record<string, HTMLElement> = {};
const memoizedStyles: Record<string, HTMLStyleElement> = {};

// SPAs hospedeiras podem remover/recriar partes do <head>/<body> por fora do nosso controle;
// sem essa checagem, reaproveitaríamos (ou tentaríamos remover) um elemento já desconectado.
const isDetached = (el: Element) => !el.isConnected;

const createRootOverlay = (): ShadowRoot => {
	let rootOverlay = memoizedRoots[ROOT_OVERLAY_ID];

	if (!rootOverlay || isDetached(rootOverlay)) {
		if (!rootOverlay) {
			rootOverlay = document.createElement("div");
			rootOverlay.id = ROOT_OVERLAY_ID;
		}
		document.body.appendChild(rootOverlay);
		memoizedRoots[ROOT_OVERLAY_ID] = rootOverlay;
	}

	return rootOverlay.shadowRoot || rootOverlay.attachShadow({ mode: "open" });
};

export const createOverlay = (id: string, inDocument = false): HTMLElement => {
	let overlay = memoizedRoots[id];

	if (!overlay || isDetached(overlay)) {
		if (!overlay) {
			overlay = document.createElement("div");
			overlay.id = id;
		}

		if (inDocument) document.body.appendChild(overlay);
		else createRootOverlay().appendChild(overlay);

		memoizedRoots[id] = overlay;
	}

	return overlay;
};

export const createRoot = () => {
	let root = memoizedRoots[ROOT_ID] as HTMLDivElement | undefined;

	if (!root || isDetached(root)) {
		root = (document.getElementById(ROOT_ID) as HTMLDivElement | null) ?? undefined;

		if (!root || isDetached(root)) {
			root = document.createElement("div");
			root.id = ROOT_ID;
			root.style.zIndex = "2147483647";
		}

		document.body.appendChild(root);
		memoizedRoots[ROOT_ID] = root;
	}

	const shadowRoot = root.shadowRoot || root.attachShadow({ mode: "open" });
	const isRootActive = () => root.getAttribute("data-active") === "true";

	return { root, shadowRoot, isRootActive };
};

export const createStyle = (css: string, id: string, callback?: () => void) => {
	const existingStyle = memoizedStyles[id];
	if (existingStyle && !isDetached(existingStyle)) return existingStyle;

	const style = existingStyle ?? document.createElement("style");
	style.id = id;
	style.innerHTML = css;
	memoizedStyles[id] = style;
	document.head.appendChild(style);

	callback?.();
};

export const removeStyle = (id: string) => {
	const style = memoizedStyles[id];
	if (style) {
		style.remove();
		delete memoizedStyles[id];
	}
};

export const isValidElement = (element: Element, ignore?: [keyof HTMLElementTagNameMap]) => {
	const _default: HTMLTagNames = ["html", "input", "head", "script", "style", "iframe", "meta", "canvas", "noscript"];

	const ignoreElements: Array<keyof HTMLElementTagNameMap> = ignore || _default;
	const tagName = element.tagName.toLowerCase() as keyof HTMLElementTagNameMap;

	const hasIgnoredTag = ignoreElements.includes(tagName);
	const hasIgnoreClass = element.classList.contains("vlibras-ignore");
	const isInsideWidget = element.closest(`#${ROOT_ID}`);

	return element.id !== ROOT_ID && !hasIgnoredTag && !hasIgnoreClass && !isInsideWidget;
};
