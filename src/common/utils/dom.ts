export const $ = <T extends HTMLElement>(selectors: string, scope?: HTMLElement | ShadowRoot): T => {
	return (scope || document).querySelector<T>(selectors) as T;
};

export const $$ = <T extends HTMLElement>(selectors: string, scope?: HTMLElement | ShadowRoot): T[] => {
	return Array.from((scope || document).querySelectorAll<T>(selectors)) as T[];
};

export const randomStr = () => Math.random().toString(36).slice(2, 8);
