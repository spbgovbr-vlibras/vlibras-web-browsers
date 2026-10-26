type NonFunctionKeys<T> = {
	[K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export type OnlyState<T> = Pick<T, NonFunctionKeys<T>>;

export type StrictOmit<T, K extends keyof T> = {
	[P in keyof T as P extends K ? never : P]: T[P];
};
