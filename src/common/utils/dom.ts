export const $ = <T extends HTMLElement>(selectors: string, scope?: HTMLElement | ShadowRoot): T | null => {
	return (scope || document).querySelector<T>(selectors) as T | null;
};

export const $$ = <T extends HTMLElement>(selectors: string, scope?: HTMLElement | ShadowRoot): T[] | null => {
	return Array.from((scope || document).querySelectorAll<T>(selectors)) as T[] | null;
};

export function injectShadowStyles(shadow: ShadowRoot | HTMLElement, styles: string[]) {
	const css = styles.join("\n").replace(/:root/g, ":host");

	const propertyRules: string[] = [];
	const shadowCss = css.replace(/@property\s+[^{]+\{[^}]*\}/g, (match) => {
		propertyRules.push(match);
		return "";
	});

	if (propertyRules.length > 0) {
		const propStyle = document.createElement("style");
		propStyle.textContent = propertyRules.join("\n");
		document.head.appendChild(propStyle);
	}

	const style = document.createElement("style");
	style.textContent = shadowCss;

	if (shadow.firstChild) shadow.insertBefore(style, shadow.firstChild);
	else shadow.appendChild(style);
}
