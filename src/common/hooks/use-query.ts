import { useEffect, useRef, useState } from "preact/hooks";

type QueryKey = readonly unknown[];

type CacheEntry<TData> = {
	data?: TData;
	error?: Error;
	timestamp: number;
	promise?: Promise<TData>;
	listeners: Set<() => void>;
};

const cache = new Map<string, CacheEntry<unknown>>();

const getEntry = <TData>(key: string): CacheEntry<TData> => {
	let entry = cache.get(key) as CacheEntry<TData> | undefined;
	if (!entry) {
		entry = { timestamp: 0, listeners: new Set() };
		cache.set(key, entry);
	}
	return entry;
};

const fetchAndCache = <TData>(key: string, queryFn: () => Promise<TData>) => {
	const entry = getEntry<TData>(key);
	if (entry.promise) return entry.promise;

	entry.promise = queryFn()
		.then((data) => {
			entry.data = data;
			entry.error = undefined;
			entry.timestamp = Date.now();
			return data;
		})
		.catch((err) => {
			entry.error = err instanceof Error ? err : new Error(String(err));
			throw entry.error;
		})
		.finally(() => {
			entry.promise = undefined;
			for (const listener of entry.listeners) listener();
		});

	return entry.promise;
};

export type UseQueryOptions<TData, TSelected = TData> = {
	queryKey: QueryKey;
	queryFn: () => Promise<TData>;
	enabled?: boolean;
	select?: (data: TData) => TSelected;
	staleTime?: number;
};

export type UseQueryResult<TSelected> = {
	data: TSelected | undefined;
	error: Error | null;
	isLoading: boolean;
	isFetching: boolean;
	refetch: () => Promise<void>;
};

const DEFAULT_STALE_TIME = 1000 * 60 * 5;

export const useQuery = <TData, TSelected = TData>({
	queryKey,
	queryFn,
	enabled = true,
	select,
	staleTime = DEFAULT_STALE_TIME,
}: UseQueryOptions<TData, TSelected>): UseQueryResult<TSelected> => {
	const key = JSON.stringify(queryKey);
	const [, rerender] = useState(0);
	const selectedRef = useRef<{ source?: TData; result?: TSelected }>({});

	useEffect(() => {
		if (!enabled) return;

		const entry = getEntry<TData>(key);
		if (Date.now() - entry.timestamp > staleTime) fetchAndCache(key, queryFn).catch(() => {});

		const listener = () => rerender((n) => n + 1);
		entry.listeners.add(listener);
		return () => entry.listeners.delete(listener);
	}, [key, enabled, staleTime]);

	const entry = getEntry<TData>(key);
	const isFetching = enabled && Boolean(entry.promise);

	let data: TSelected | undefined;
	if (entry.data === undefined) data = undefined;
	else if (!select) data = entry.data as unknown as TSelected;
	else if (selectedRef.current.source === entry.data) data = selectedRef.current.result;
	else {
		data = select(entry.data);
		selectedRef.current = { source: entry.data, result: data };
	}

	return {
		data: enabled ? data : undefined,
		error: enabled ? (entry.error ?? null) : null,
		isLoading: enabled && entry.data === undefined && isFetching,
		isFetching,
		refetch: async () => {
			await fetchAndCache(key, queryFn).catch(() => {});
		},
	};
};
