import { useMemo } from "preact/hooks";
import { useShallow } from "zustand/shallow";
import { omit, pick } from "../utils";

export const usePick = <T, K extends keyof T>(...keys: K[]) => {
	const selector = useMemo(() => (s: T) => pick(s, ...keys), [JSON.stringify(keys)]);
	return useShallow(selector);
};

export const useOmit = <T, K extends keyof T>(...keys: K[]) => {
	const selector = useMemo(() => (s: T) => omit(s, ...keys), [JSON.stringify(keys)]);
	return useShallow(selector);
};
