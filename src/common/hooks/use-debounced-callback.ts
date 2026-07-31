import { useEffect, useRef } from "preact/hooks";

export function useDebouncedCallback<T = string>(callback: (params: T) => void, delay: number) {
	const timeout = useRef<NodeJS.Timeout>(null);

	useEffect(() => {
		return () => {
			if (timeout.current) clearTimeout(timeout.current);
		};
	}, []);

	return (params: T) => {
		if (timeout.current) clearTimeout(timeout.current);
		timeout.current = setTimeout(() => callback(params), delay);
	};
}
