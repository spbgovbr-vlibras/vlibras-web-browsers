import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { useDebouncedCallback } from "@/common/hooks";
import { Trie } from "@/common/lib/trie";
import { useDictionarySigns } from "@/core/actions/hooks";
import { usePlayer } from "@/player/use-player";
import { Button } from "@/widget/components/ui/button";
import { Spinner } from "@/widget/components/ui/spinner";
import { XIcon } from "@/widget/icons";
import { Screen, ScreenContent, ScreenHeader, ScreenTitle } from "../components";

type DictionaryState = {
	filteredSigns: string[];
	search: string;
	visibleCount: number;
};

const ITEMS_PER_PAGE = 50;

export const DictionaryScreen = () => {
	const loaderRef = useRef<HTMLDivElement>(null);
	const searchRef = useRef<HTMLInputElement>(null);

	const { play } = usePlayer();
	const { data, isLoading } = useDictionarySigns();

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

	return (
		<Screen>
			<ScreenHeader close>
				<ScreenTitle>Dicionário</ScreenTitle>
			</ScreenHeader>

			<ScreenContent className="overflow-hidden p-0">
				<div className="relative flex items-center p-4 pb-0">
					<input
						ref={searchRef}
						type="text"
						placeholder="Pesquisar (ex: AJUDAR)..."
						onInput={(e) => handleSearchChange(e.currentTarget.value)}
						className="h-9 w-full rounded-md border p-2 pr-8 outline-primary focus:outline-2 focus:outline-solid"
					/>

					{search && (
						<Button
							onClick={handleClearSearch}
							aria-label="Limpar busca"
							variant="ghost"
							size="icon-xs"
							className="absolute right-5 rounded-sm bg-transparent! text-muted-foreground outline-destructive hover:text-destructive focus:text-destructive"
						>
							<XIcon />
						</Button>
					)}
				</div>

				{isLoading && <Spinner />}
				{!filteredSigns.length && (
					<p className="break-all px-4 font-semibold text-muted-foreground text-sm">
						Sem resultados para <q className="text-foreground">{search}/</q>
					</p>
				)}

				{!!filteredSigns.length && (
					<div className="h-full overflow-auto">
						<ul className="flex h-full w-max min-w-full flex-col font-semibold text-sm">
							{visibleSigns.map((sign) => (
								<li key={sign}>
									<button
										type="button"
										onClick={() => play(sign)}
										className="w-full cursor-pointer whitespace-nowrap px-4 py-1.25 text-left hover:bg-muted focus:bg-primary focus:text-primary-foreground"
									>
										{sign}
									</button>
								</li>
							))}

							{filteredSigns.length > visibleCount && <div ref={loaderRef} className="py-2" />}
						</ul>
					</div>
				)}
			</ScreenContent>
		</Screen>
	);
};
