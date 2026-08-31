import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { usePick } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { play } from "@/player/actions";
import { Button } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import { useTranslate } from "@/widget/hooks/use-translate";
import { createCallback } from "@/widget/stores/use-callback.store";
import { screenStore } from "@/widget/stores/use-screens.store";
import { useHandlePlay } from "../hooks/use-handle-play";
import { useWordMeaning } from "../hooks/use-word-meaning";
import { useDictionaryCtx } from "./dictionary-context";
import { DictionaryWordMeaning } from "./dictionary-word-meaning";

const ITEMS_PER_PAGE = 50;

export const DictionaryAllWords = () => {
	const ctx = useDictionaryCtx(
		usePick("filteredSigns", "search", "filter", "listRef", "visibleSigns", "setSelectedLetter", "groupedSigns"),
	);

	const handlePlay = useHandlePlay();
	const { mutateAsync: translate } = useTranslate();
	const { expandedWord, wordMeanings, loadingMeaning, toggleWordMeaning } = useWordMeaning();

	const handlePlayDefinition = async (text: string) => {
		try {
			const gloss = await translate(text);
			play(gloss || text);

			createCallback({
				action: () => screenStore.set({ screen: "dictionary" }),
				content: (
					<Fragment>
						<Icon name="dictionary" />
						Reabrir Dicionário
					</Fragment>
				),
			});
		} catch (error) {
			console.error("Erro ao reproduzir definição: ", error);
		}
	};

	const [searchVisibleCount, setSearchVisibleCount] = useState(ITEMS_PER_PAGE);
	const searchSentinelRef = useRef<HTMLLIElement>(null);

	useEffect(() => {
		if (!ctx.search) return;
		const sentinel = searchSentinelRef.current;
		if (!sentinel) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				setSearchVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, ctx.filteredSigns.length));
			},
			{ threshold: 0.1 },
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [ctx.search, ctx.filteredSigns.length]);

	useEffect(() => {
		setSearchVisibleCount(ITEMS_PER_PAGE);
	}, [ctx.search]);

	if (ctx.filter === "recents") {
		return (
			<div ref={ctx.listRef} className="h-full overflow-auto">
				<ul className="flex flex-col text-sm">
					{ctx.visibleSigns.map((sign) => {
						const prettySign = (sign || "").replace(/_/g, " ");
						return (
							<li key={sign}>
								<button
									type="button"
									onClick={() => handlePlay(sign)}
									className="block w-full bg-background px-4 py-1.5 text-left mobile:text-xs text-sm hover:cursor-pointer hover:bg-muted"
								>
									{prettySign}
								</button>
								<div className="mx-4 border-border/30 border-t" />
							</li>
						);
					})}
				</ul>
			</div>
		);
	}
	const renderSignItem = (sign: string) => {
		const isWordExpanded = expandedWord === sign;
		const isLoadingThis = loadingMeaning === sign;
		const prettySign = (sign || "").replace(/_/g, " ");

		return (
			<li key={sign} className="hover:bg-muted">
				<div className={cn("flex min-w-0 items-center", isWordExpanded ? "bg-muted" : "")}>
					<button
						type="button"
						onClick={() => handlePlay(sign)}
						className="w-full cursor-pointer whitespace-normal break-all px-6 py-1.25 text-left mobile:text-xs text-sm focus:bg-primary focus:text-primary-foreground"
					>
						{prettySign}
					</button>
					<Button
						size="icon-sm"
						variant="ghost"
						className="text-muted-foreground"
						onClick={() => toggleWordMeaning(sign)}
						aria-label={isWordExpanded ? "Fechar significado" : "Ver significado"}
					>
						<Icon name={isWordExpanded ? "chevron-up" : "chevron-down"} className="size-4" />
					</Button>
				</div>

				{isWordExpanded && (
					<DictionaryWordMeaning
						wordName={sign}
						meaning={wordMeanings[sign]}
						isLoading={isLoadingThis}
						onPlayDefinition={handlePlayDefinition}
					/>
				)}
				<div className="mx-4 border-border/30 border-t" />
			</li>
		);
	};
	const handleSearchScroll = useCallback(
		(e: React.UIEvent<HTMLDivElement>) => {
			const el = e.currentTarget;
			const isBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 100;
			if (!isBottom) return;
			setSearchVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, ctx.filteredSigns.length));
		},
		[ctx.filteredSigns.length],
	);

	if (ctx.search) {
		return (
			<div ref={ctx.listRef} className="h-full overflow-auto" onScroll={handleSearchScroll}>
				<ul className="flex flex-col text-sm">
					{ctx.filteredSigns.slice(0, searchVisibleCount).map((sign) => renderSignItem(sign))}
					{searchVisibleCount < ctx.filteredSigns.length && (
						<li ref={searchSentinelRef} className="py-2 text-center text-muted-foreground text-xs">
							Carregando...
						</li>
					)}
				</ul>
			</div>
		);
	}

	return (
		<div ref={ctx.listRef} className="h-full overflow-auto">
			<ul className="flex flex-col text-sm">
				{ctx.groupedSigns.map(({ letter, items }) => {
					return (
						<li key={letter}>
							<button
								type="button"
								onClick={() => ctx.setSelectedLetter(letter)}
								className="flex w-full items-center justify-between px-4 py-2 text-left font-semibold mobile:text-xs text-sm hover:cursor-pointer hover:bg-muted"
							>
								<span>{letter === "#" ? "0–9" : letter}</span>
								<span className="font-normal text-muted-foreground text-xs">{items.length}</span>
							</button>
							<div className="mx-4 border-border/30 border-t" />
						</li>
					);
				})}
			</ul>
		</div>
	);
};
