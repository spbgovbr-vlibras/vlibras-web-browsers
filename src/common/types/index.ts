type NonFunctionKeys<T> = {
	[K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

export type OnlyState<T> = Pick<T, NonFunctionKeys<T>>;
