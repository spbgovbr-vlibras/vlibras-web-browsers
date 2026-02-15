export type SetterValue<T> = T | ((prevState: T) => T);

export const resolveValue = <T>(value: SetterValue<T>, currentValue: T): T => {
	return value instanceof Function ? value(currentValue) : value;
};
