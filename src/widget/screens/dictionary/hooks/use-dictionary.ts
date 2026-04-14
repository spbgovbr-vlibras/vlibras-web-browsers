import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { useDebouncedCallback } from "@/common/hooks";
import { Trie } from "@/common/lib/trie";
import { useDictionarySigns } from "@/core/actions/hooks";
import { getSignsByCategory } from "../lib/categories";
import type { CategoriesList } from "../lib/constants";
import type { DictionaryFilter } from "../lib/types";
import { useDictionaryStore } from "../stores/use-dictionary.store";
import { useDictionaryHistoryStore } from "../stores/use-dictionary-history.store";

type DictionaryState = {
	filteredSigns: string[];
	search: string;
	visibleCount: number;
};

const ITEMS_PER_PAGE = 50;

export const useDictionary = () => {
	const loaderRef = useRef<HTMLDivElement>(null);
	const searchRef = useRef<HTMLInputElement>(null);
	const listRef = useRef<HTMLDivElement>(null);
	const store = useDictionaryStore();

	const [filter, setFilter] = useState<DictionaryFilter>("all");
	const { data, isLoading, refetch } = useDictionarySigns();
	const { signs } = useDictionaryHistoryStore();
	const [selectedCategory, setSelectedCategory] = useState<(typeof CategoriesList)[0] | null>(null);

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

	const filteredCategoryWords = useMemo(() => {
		if (!selectedCategory) return [];
		const searchTerm = search.toLowerCase().trim();
		const allSignsSet = new Set(allSigns);
		return getSignsByCategory(selectedCategory.name).filter(
			(sign) => allSignsSet.has(sign) && (searchTerm === "" || sign.toLowerCase().includes(searchTerm)),
		);
	}, [selectedCategory, allSigns, search]);

	const onSearchChange = useCallback(
		(term: string) => {
			const searchTerm = term.toUpperCase().trim();
			const filtered = (filter !== "recents" ? allSigns : signs).filter((sign) =>
				sign.toUpperCase().includes(searchTerm),
			);

			setState((p) => ({
				...p,
				search: term,
				filteredSigns: filtered,
				visibleCount: ITEMS_PER_PAGE,
			}));

			if (listRef.current) listRef.current.scrollTo({ top: 0, behavior: "smooth" });
		},
		[filter, signs, allSigns],
	);

	const handleSearchChange = useDebouncedCallback(onSearchChange, 500);

	const handleClearSearch = () => {
		if (!searchRef.current) return;

		onSearchChange("");
		searchRef.current.value = "";
		searchRef.current.focus();
	};

	const handleHistoryClear = () => {
		useDictionaryHistoryStore.setState({ signs: [] });

		if (filter === "recents") {
			setFilter("all");
			setState((p) => ({ ...p, filteredSigns: [] }));
		}
	};

	useEffect(() => {
		setSelectedCategory(null);
		onSearchChange(search);
	}, [filter]);

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
	const count = { all: allSigns.length, recents: signs.length };

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
		handleHistoryClear,
		data,
		retry,
		filter,
		setFilter,
		count,
		selectedCategory,
		setSelectedCategory,
		filteredCategoryWords,
		...store,
	};
};
