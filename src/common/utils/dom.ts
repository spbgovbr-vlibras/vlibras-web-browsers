import global from "@/common/styles/global.css?inline";

export const $ = <T extends HTMLElement>(selectors: string, scope?: HTMLElement | ShadowRoot): T | null => {
	return (scope || document).querySelector<T>(selectors) as T | null;
};

export const $$ = <T extends HTMLElement>(selectors: string, scope?: HTMLElement | ShadowRoot): T[] | null => {
	return Array.from((scope || document).querySelectorAll<T>(selectors)) as T[] | null;
};

export function setupWidgetStyles(shadow: ShadowRoot | HTMLElement, onLoad?: () => void) {
	if (shadow.querySelector("style[data-widget-styles]")) {
		if (onLoad) requestAnimationFrame(() => onLoad());
		return;
	}

	const css = global.replace(/:root/g, ":host");

	const propertyRules: string[] = [];
	const shadowCss = css.replace(/@property\s+[^{]+\{[^}]*\}/g, (match) => {
		propertyRules.push(match);
		return "";
	});

	if (propertyRules.length > 0) {
		if (!document.head.querySelector("style[data-widget-properties]")) {
			const propStyle = document.createElement("style");
			propStyle.setAttribute("data-widget-properties", "true");
			propStyle.textContent = propertyRules.join("\n");
			document.head.appendChild(propStyle);
		}
	}

	const style = document.createElement("style");
	style.setAttribute("data-widget-styles", "true");
	style.textContent = shadowCss;

	if (onLoad) requestAnimationFrame(() => onLoad());

	if (shadow.firstChild) shadow.insertBefore(style, shadow.firstChild);
	else shadow.appendChild(style);
}
