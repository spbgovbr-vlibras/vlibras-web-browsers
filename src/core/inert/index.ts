const INERT_ATTR = "inert";
const PREV_TABINDEX_ATTR = "data-inert-prev-tabindex";

const FOCUSABLE_SELECTOR =
	"a[href], area[href], button, input, select, textarea, iframe, object, embed, [contenteditable], [tabindex]";

const inertObservers = new WeakMap<HTMLElement, MutationObserver>();

const focusableTargets = (el: HTMLElement) => [
	...(el.matches(FOCUSABLE_SELECTOR) ? [el] : []),
	...el.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
];

const neutralizeFocus = (node: HTMLElement) => {
	if (node.hasAttribute(PREV_TABINDEX_ATTR)) return;
	node.setAttribute(PREV_TABINDEX_ATTR, node.getAttribute("tabindex") ?? "");
	node.setAttribute("tabindex", "-1");
};

const restoreFocus = (node: HTMLElement) => {
	const prevTabIndex = node.getAttribute(PREV_TABINDEX_ATTR);
	if (prevTabIndex) node.setAttribute("tabindex", prevTabIndex);
	else node.removeAttribute("tabindex");
	node.removeAttribute(PREV_TABINDEX_ATTR);
};

const applyInert = (el: HTMLElement) => {
	el.setAttribute("aria-hidden", "true");
	for (const node of focusableTargets(el)) neutralizeFocus(node);

	const observer = new MutationObserver((mutations) => {
		for (const { addedNodes } of mutations) {
			for (const node of addedNodes) {
				if (node instanceof HTMLElement) for (const target of focusableTargets(node)) neutralizeFocus(target);
			}
		}
	});
	observer.observe(el, { childList: true, subtree: true });
	inertObservers.set(el, observer);
};

const removeInert = (el: HTMLElement) => {
	el.removeAttribute("aria-hidden");
	inertObservers.get(el)?.disconnect();
	inertObservers.delete(el);

	if (el.hasAttribute(PREV_TABINDEX_ATTR)) restoreFocus(el);
	for (const node of el.querySelectorAll<HTMLElement>(`[${PREV_TABINDEX_ATTR}]`)) restoreFocus(node);
};

let isPolyfilled = false;

export const applyInertPolyfill = (root: ShadowRoot) => {
	if (isPolyfilled || typeof HTMLElement === "undefined" || INERT_ATTR in HTMLElement.prototype) return;
	isPolyfilled = true;

	const style = document.createElement("style");
	style.textContent = `[${INERT_ATTR}] { pointer-events: none !important; user-select: none !important; }`;
	root.appendChild(style);

	root.addEventListener(
		"focusin",
		(event) => {
			const target = event.target;
			if (target instanceof HTMLElement && target.closest(`[${INERT_ATTR}]`)) target.blur();
		},
		true,
	);

	Object.defineProperty(HTMLElement.prototype, INERT_ATTR, {
		configurable: true,
		get(this: HTMLElement) {
			return this.hasAttribute(INERT_ATTR);
		},
		set(this: HTMLElement, value: boolean) {
			if (value) {
				this.setAttribute(INERT_ATTR, "");
				applyInert(this);
			} else {
				this.removeAttribute(INERT_ATTR);
				removeInert(this);
			}
		},
	});
};
