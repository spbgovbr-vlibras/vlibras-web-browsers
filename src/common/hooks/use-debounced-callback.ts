import { useRef } from "preact/hooks";

export function useDebouncedCallback<T>(callback: (params: T) => void, delay: number) {
	const timeout = useRef<NodeJS.Timeout>(null);

	return (params: T) => {
		if (timeout.current) clearTimeout(timeout.current);
		timeout.current = setTimeout(() => callback(params), delay);
	};
}
