import { appConfig } from "@/common/hooks/use-config";

export function omit<T, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
	const result = { ...obj };
	for (const key of keys) delete result[key];
	return result;
}

export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
	const result = {} as Pick<T, K>;
	for (const key of keys) result[key] = obj[key];
	return result;
}

export const capitalize = (str: string) => {
	return str
		.split(" ")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const sanitizeUrl = (url: string): string => {
	const [, protocol = "", rest = url] = url.match(/^([a-z][a-z\d+.-]*:\/\/)(.*)$/i) ?? [];
	return protocol + rest.replace(/\/+/g, "/");
};

// Resolve um caminho relativo (ex: "icons/menu.webp") contra o path de config do widget,
// pra servir imagens como arquivo estático em vez de embutir como base64 no bundle.
export const getAssetUrl = (relativePath: string): string => {
	const { path } = appConfig.getState();
	return sanitizeUrl(`${path}/assets/${relativePath}`);
};

export const randomStr = () => Math.random().toString(36).slice(2, 8);
