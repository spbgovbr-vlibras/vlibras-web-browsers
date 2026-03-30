import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { useDebouncedCallback } from "@/common/hooks";
import { Trie } from "@/common/lib/trie";
import { pickKeys } from "@/common/utils";
import { useDictionarySigns } from "@/core/actions/hooks";

type DictionaryState = {
	filteredSigns: string[];
	search: string;
	visibleCount: number;
};

const ITEMS_PER_PAGE = 50;

const useDictionaryStore = create<{ isMaxRetries: boolean; retriesCount: number }>()(
	persist((_) => ({ isMaxRetries: false, retriesCount: 0 }), {
		name: "@vlibras/dictionary",
		version: 1,
		storage: createJSONStorage(() => sessionStorage),
		partialize: (state) => pickKeys(state, "isMaxRetries"),
		onRehydrateStorage: () => (state) => {
			if (state) {
				state.retriesCount = 0;
				state.isMaxRetries = false;
			}
		},
	}),
);

export const useDictionary = () => {
	const loaderRef = useRef<HTMLDivElement>(null);
	const searchRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLDivElement>(null);

	const { data, isLoading, refetch } = useDictionarySigns();
	const store = useDictionaryStore();

	const retry = async () => {
		await refetch();

		const retriesCount = store.retriesCount + 1;
		useDictionaryStore.setState({ retriesCount });
		if (retriesCount >= 5) useDictionaryStore.setState({ isMaxRetries: true });
	};

	const allSigns = useMemo(() => {
		if (!data) return [];
		const trieInstance = new Trie(data);
		return trieInstance.searchSigns("");
	}, [data]);

	const [{ filteredSigns, visibleCount, search }, setState] = useState<DictionaryState>({
		filteredSigns: [],
		search: "",
		visibleCount: ITEMS_PER_PAGE,
	});

	const onSearchChange = (term: string) => {
		const searchTerm = term.toUpperCase().trim();
		const filtered = allSigns.filter((sign) => sign.toUpperCase().includes(searchTerm));

		setState((p) => ({
			...p,
			search: term,
			filteredSigns: filtered,
			visibleCount: ITEMS_PER_PAGE,
		}));

		if (listRef.current) listRef.current.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleSearchChange = useDebouncedCallback(onSearchChange, 500);

	const handleClearSearch = () => {
		if (!searchRef.current) return;

		onSearchChange("");
		searchRef.current.value = "";
		searchRef.current.focus();
	};

	useEffect(() => {
		if (allSigns.length > 0) setState((p) => ({ ...p, filteredSigns: allSigns }));
	}, [allSigns]);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && filteredSigns.length > visibleCount) {
					setState((p) => ({ ...p, visibleCount: p.visibleCount + ITEMS_PER_PAGE }));
				}
			},
			{ threshold: 0.1 },
		);

		if (loaderRef.current) observer.observe(loaderRef.current);
		return () => observer.disconnect();
	}, [filteredSigns.length, visibleCount]);

	const visibleSigns = filteredSigns.slice(0, visibleCount);

	return {
		search,
		isLoading,
		filteredSigns,
		visibleSigns,
		visibleCount,
		loaderRef,
		listRef,
		searchRef,
		handleSearchChange,
		handleClearSearch,
		data,
		retry,
		...store,
	};
};
