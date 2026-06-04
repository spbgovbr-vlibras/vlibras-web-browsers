import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/common/lib/utils";
import { MaskIcon } from "@/common/utils/mask-icon";
import { useTranslate } from "@/core/actions/hooks";
import { play } from "@/player/actions";
import { Button } from "@/widget/components/ui/button";
import chevronDownIcon from "@/widget/icons/chevron-down.webp";
import chevronUpIcon from "@/widget/icons/chevron-up.webp";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useHandlePlay } from "../hooks/use-handle-play";
import { useWordMeaning } from "../hooks/use-word-meaning";
import { groupByAlphabet } from "../lib/alphabet";
import { useDictionaryCtx } from "./dictionary-context";
import { DictionaryWordMeaning } from "./dictionary-word-meaning";

const ITEMS_PER_PAGE = 50;

export const DictionaryAllWords = () => {
	const ctx = useDictionaryCtx();
	const handlePlay = useHandlePlay();
	const { mutateAsync: translate } = useTranslate();
	const { expandedWord, wordMeanings, loadingMeaning, toggleWordMeaning } = useWordMeaning();

	const [expandedLetter, setExpandedLetter] = useState<string | null>(null);
	const letterRefs = useRef<Map<string, HTMLLIElement>>(new Map());

	const [letterVisibleCount, setLetterVisibleCount] = useState(ITEMS_PER_PAGE);
	const sentinelRef = useRef<HTMLLIElement>(null);

	useEffect(() => {
		setLetterVisibleCount(ITEMS_PER_PAGE);
	}, [expandedLetter]);

	useEffect(() => {
		if (!expandedLetter) return;
		const li = letterRefs.current.get(expandedLetter);
		li?.scrollIntoView({ block: "start", behavior: "smooth" });
	}, [expandedLetter]);

	const handlePlayDefinition = async (text: string) => {
		try {
			const gloss = await translate(text);
			play(gloss);
			useScreensStore.setState({ screen: "main" });
		} catch (error) {
			console.error("Erro ao reproduzir definição: ", error);
		}
	};

	const grouped = useMemo(() => {
		return groupByAlphabet(ctx.filteredSigns);
	}, [ctx.filteredSigns]);

	const [searchVisibleCount, setSearchVisibleCount] = useState(ITEMS_PER_PAGE);
	const searchSentinelRef = useRef<HTMLLIElement>(null);

	useEffect(() => {
		if (ctx.search || !expandedLetter) return;
		const sentinel = sentinelRef.current;
		if (!sentinel) return;

		const group = grouped.find(({ letter }) => letter === expandedLetter);
		if (!group) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				setLetterVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, group.items.length));
			},
			{ root: ctx.listRef?.current, threshold: 0.1 },
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [ctx.search, expandedLetter, grouped, ctx.listRef]);

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
									className="block w-full bg-background px-4 py-1.5 text-left text-xs hover:cursor-pointer hover:bg-muted sm:text-sm"
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
						className="w-full cursor-pointer whitespace-normal break-all px-6 py-1.25 text-left text-xs focus:bg-primary focus:text-primary-foreground sm:text-sm"
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
						{isWordExpanded ? <MaskIcon src={chevronUpIcon} /> : <MaskIcon src={chevronDownIcon} />}
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
			{expandedLetter && (
				<div className="sticky top-0 z-9 flex h-9 w-full items-center justify-between bg-background px-4 py-2 text-left font-semibold hover:cursor-pointer" />
			)}
			<ul className="flex flex-col text-sm">
				{grouped.map(({ letter, items }) => {
					const isLetterExpanded = expandedLetter === letter;

					return (
						<li
							key={letter}
							ref={(el) => {
								if (el) letterRefs.current.set(letter, el);
								else letterRefs.current.delete(letter);
							}}
						>
							<button
								type="button"
								onClick={() => setExpandedLetter(isLetterExpanded ? null : letter)}
								className={cn(
									"sticky top-0 z-10 flex w-full items-center justify-between bg-background px-4 py-2 text-left font-semibold hover:cursor-pointer",
									isLetterExpanded ? "bg-primary/20" : "hover:bg-muted",
								)}
							>
								{letter === "#" ? "0–9" : letter}
								{isLetterExpanded ? <MaskIcon src={chevronUpIcon} /> : <MaskIcon src={chevronDownIcon} />}
							</button>
							{isLetterExpanded && (
								<ul className="flex flex-col">
									{items.slice(0, letterVisibleCount).map((sign) => {
										return renderSignItem(sign);
									})}
									{letterVisibleCount < items.length && (
										<li ref={sentinelRef} className="py-2 text-center text-muted-foreground text-xs">
											Carregando...
										</li>
									)}
								</ul>
							)}
						</li>
					);
				})}
			</ul>
		</div>
	);
};
