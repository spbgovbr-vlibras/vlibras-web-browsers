import type { HTMLTagNames } from "./types";

const ROOT_ID = "vlibras-app-root";
const ROOT_OVERLAY_ID = "vlibras-root-overlay";

const memoizedRoots: Record<string, HTMLElement> = {};
const memoizedStyles: Record<string, HTMLStyleElement> = {};

const createRootOverlay = (): ShadowRoot => {
	if (!memoizedRoots[ROOT_OVERLAY_ID]) {
		const rootOverlay = document.createElement("div");
		rootOverlay.id = ROOT_OVERLAY_ID;
		document.body.appendChild(rootOverlay);
		memoizedRoots[ROOT_OVERLAY_ID] = rootOverlay;
	}

	const rootOverlay = memoizedRoots[ROOT_OVERLAY_ID];
	return rootOverlay.shadowRoot || rootOverlay.attachShadow({ mode: "open" });
};

export const createOverlay = (id: string, inDocument = false): HTMLElement => {
	if (!memoizedRoots[id]) {
		const overlay = document.createElement("div");
		overlay.id = id;

		if (inDocument) document.body.appendChild(overlay);
		else createRootOverlay().appendChild(overlay);

		memoizedRoots[id] = overlay;
		return overlay;
	}
	return memoizedRoots[id];
};

export const createRoot = () => {
	if (!memoizedRoots[ROOT_ID]) {
		let root = document.getElementById(ROOT_ID);

		if (!root) {
			root = document.createElement("div");
			root.id = ROOT_ID;
			root.style.zIndex = "2147483647";
			document.body.appendChild(root);
		}
		memoizedRoots[ROOT_ID] = root;
	}

	const root = memoizedRoots[ROOT_ID] as HTMLDivElement;
	const shadowRoot = root.shadowRoot || root.attachShadow({ mode: "open" });
	const isRootActive = () => root.getAttribute("data-active") === "true";

	return { root, shadowRoot, isRootActive };
};

export const createStyle = (css: string, id: string, callback?: () => void) => {
	const existingStyle = memoizedStyles[id];
	if (existingStyle) return existingStyle;

	const style = document.createElement("style");
	style.id = id;
	style.innerHTML = css;
	memoizedStyles[id] = style;
	document.head.appendChild(style);

	callback?.();
};

export const removeStyle = (id: string) => {
	const style = memoizedStyles[id];
	if (style) {
		document.head.removeChild(style);
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
