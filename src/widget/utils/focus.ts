import { rootStore } from "@/widget/stores/use-root.store";

const FOCUSABLE_SELECTOR = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	'[tabindex]:not([tabindex="-1"])',
].join(",");

const isFocusable = (el: HTMLElement) => el.closest("[inert]") === null && el.getClientRects().length > 0;

const getActiveElement = (): Element | null => {
	const { shadowRoot } = rootStore.get();
	return shadowRoot?.activeElement ?? document.activeElement;
};

/** Prende o Tab/Shift+Tab dentro de `container`, evitando que o foco escape para a página host. */
export const trapTabFocus = (container: HTMLElement | null | undefined, e: KeyboardEvent) => {
	if (e.key !== "Tab" || !container) return;
	e.stopPropagation();

	const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isFocusable);
	if (!focusable.length) {
		e.preventDefault();
		return;
	}

	const first = focusable[0];
	const last = focusable[focusable.length - 1];
	const active = getActiveElement();
	const atBoundary = e.shiftKey
		? active === first || !container.contains(active)
		: active === last || !container.contains(active);

	if (!atBoundary) return;

	e.preventDefault();
	(e.shiftKey ? last : first).focus({ preventScroll: true });
};

export const focusAccessButton = () => {
	const wrapper = document.querySelector("#vlibras-access-wrapper");
	const button = wrapper?.shadowRoot?.querySelector<HTMLButtonElement>("#vlibras-button");
	button?.focus({ preventScroll: true });
};

export const focusWidgetPanel = () => {
	const panel =
		document.querySelector<HTMLElement>("#vlibras-app-panel") ??
		document.querySelector<HTMLElement>("#vlibras-app-content");
	panel?.focus({ preventScroll: true });
};

export const getWidgetTrigger = (): HTMLElement | null => {
	const active = document.activeElement as HTMLElement | null;
	if (active && active !== document.body) return active;
	return null;
};

export const restoreFocus = (target: HTMLElement | null | undefined, fallback?: () => void) => {
	if (target?.isConnected) {
		target.focus({ preventScroll: true });
		return;
	}
	fallback?.();
};
