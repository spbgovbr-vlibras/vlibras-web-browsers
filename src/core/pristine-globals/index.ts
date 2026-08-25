const RESTORABLE_METHODS = ["startsWith", "endsWith", "includes"] as const;

type RestorableMethod = (typeof RESTORABLE_METHODS)[number];

const isStringPrototypeCorrupted = () => {
	try {
		return !"[".startsWith("[") || !"]".endsWith("]") || !"[]".includes("[");
	} catch {
		return true;
	}
};

const getPristineStringPrototype = (): Record<RestorableMethod, unknown> | null => {
	try {
		const iframe = document.createElement("iframe");
		iframe.style.display = "none";
		iframe.setAttribute("aria-hidden", "true");
		document.documentElement.appendChild(iframe);

		const contentWindow = iframe.contentWindow as (Window & typeof globalThis) | null;
		const pristine = contentWindow?.String.prototype ?? null;
		iframe.remove();

		return pristine as Record<RestorableMethod, unknown> | null;
	} catch {
		return null;
	}
};

let isRestored = false;

/**
 * Some host pages replace String.prototype methods (eg. startsWith/endsWith) with broken
 * regex-based polyfills that throw on inputs like "[" (unterminated character class).
 * Since the widget script runs in the page's own realm, this restores clean
 * implementations from a throwaway iframe when corruption is detected, and locks them
 * as non-writable/non-configurable so the host page can't re-patch them again later
 * (eg. from a plugin that re-applies its patch on every init, after our own check ran).
 */
export const restorePristineStringMethods = () => {
	if (isRestored) return;
	isRestored = true;

	const corrupted = isStringPrototypeCorrupted();
	const pristine = corrupted ? getPristineStringPrototype() : null;

	// Corrupted now and no clean implementation available: nothing safe to lock in.
	if (corrupted && !pristine) return;

	for (const method of RESTORABLE_METHODS) {
		try {
			const implementation = pristine ? pristine[method] : String.prototype[method];
			if (typeof implementation !== "function") continue;

			Object.defineProperty(String.prototype, method, {
				value: implementation,
				writable: false,
				configurable: false,
				enumerable: false,
			});
		} catch {}
	}
};
