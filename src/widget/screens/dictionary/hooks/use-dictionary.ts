import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { useDebouncedCallback } from "@/common/hooks";
import { Trie } from "@/common/lib/trie";
import { useDictionarySigns } from "@/core/actions/hooks";
import { getCategories, getCategorySigns } from "../actions";
import { groupVerbs } from "../lib/group-signs";
import type { Category, DictionaryFilter } from "../lib/types";
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

	const [filter, setFilter] = useState<DictionaryFilter>("categories");
	const { data, isLoading, refetch } = useDictionarySigns();
	const { signs } = useDictionaryHistoryStore();

	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoadingCategories, setIsLoadingCategories] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
	const [categorySigns, setCategorySigns] = useState<string[]>([]);
	const [isLoadingCategorySigns, setIsLoadingCategorySigns] = useState(false);

	useEffect(() => {
		const load = async () => {
			setIsLoadingCategories(true);
			try {
				const data = await getCategories();
				setCategories(data);
			} finally {
				setIsLoadingCategories(false);
			}
		};

		load();
	}, []);

	useEffect(() => {
		const loadCategorySigns = async () => {
			if (!selectedCategory) {
				setCategorySigns([]);
				return;
			}
			setIsLoadingCategorySigns(true);
			try {
				const data = await getCategorySigns(selectedCategory.name);
				console.log(data.signs);
				const filteredSigns = data.signs.filter((sign: string) => sign !== "1S_FARTAR1S" && sign !== "2S_ESCOLHER__1S");
				setCategorySigns(filteredSigns);
			} finally {
				setIsLoadingCategorySigns(false);
			}
		};

		loadCategorySigns();
	}, [selectedCategory]);

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
		console.log(categorySigns);
		return categorySigns.filter(
			(sign) => allSignsSet.has(sign) && (searchTerm === "" || sign.toLowerCase().includes(searchTerm)),
		);
	}, [selectedCategory, allSigns, search, categorySigns]);

	const onSearchChange = useCallback(
		(term: string) => {
			const searchTerm = term.toUpperCase().trim();
			const filtered = (filter === "all" ? allSigns : signs).filter((sign) => sign.toUpperCase().includes(searchTerm));

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
	const isVerbCategory = selectedCategory?.name === "VERBOS";

	const verbGroups = useMemo(
		() => (isVerbCategory ? groupVerbs(filteredCategoryWords) : {}),
		[filteredCategoryWords, isVerbCategory],
	);

	const verbGroupEntries = useMemo(() => Object.entries(verbGroups), [verbGroups]);

	const [visibleVerbCount, setVisibleVerbCount] = useState(ITEMS_PER_PAGE);
	useEffect(() => {
		setCategoryVisibleCount(ITEMS_PER_PAGE);
		setVisibleVerbCount(20);
	}, [selectedCategory]);
	const visibleVerbGroups = verbGroupEntries.slice(0, visibleVerbCount);

	const onVerbScroll = useCallback(
		(e: Event) => {
			const el = e.currentTarget as HTMLElement;
			const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
			if (!isBottom) return;
			setVisibleVerbCount((p) => Math.min(p + 20, verbGroupEntries.length));
		},
		[verbGroupEntries.length],
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

	const [categoryVisibleCount, setCategoryVisibleCount] = useState(ITEMS_PER_PAGE);

	const visibleCategoryWords = useMemo(() => {
		return filteredCategoryWords.slice(0, categoryVisibleCount);
	}, [filteredCategoryWords, categoryVisibleCount]);

	const onCategoryScroll = useCallback(
		(e: Event) => {
			const el = e.currentTarget as HTMLElement;

			const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;

			if (!isBottom) return;

			setCategoryVisibleCount((p) => {
				if (p >= filteredCategoryWords.length) return p;
				return p + ITEMS_PER_PAGE;
			});
		},
		[filteredCategoryWords.length],
	);

	useEffect(() => {
		setCategoryVisibleCount(ITEMS_PER_PAGE);
	}, [selectedCategory]);

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
		onCategoryScroll,
		visibleCategoryWords,
		isVerbCategory,
		visibleVerbGroups,
		verbGroupEntries,
		onVerbScroll,
		categories,
		isLoadingCategories,
		isLoadingCategorySigns,
		...store,
	};
};
