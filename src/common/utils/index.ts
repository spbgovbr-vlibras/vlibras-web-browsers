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
	return url.replace(/(?<!:)\/+/g, "/");
};

export const randomStr = () => Math.random().toString(36).slice(2, 8);
