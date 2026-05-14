import { useMemo, useState } from "react";
import { cn } from "@/common/lib/utils";
import { usePlayer } from "@/player/use-player";
import { ChevronDownIcon } from "@/widget/icons/chevron-down";
import { ChevronUpIcon } from "@/widget/icons/chevron-up";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useHandlePlay } from "../hooks/use-handle-play";
import { useWordMeaning } from "../hooks/use-word-meaning";
import { groupByAlphabet } from "../lib/alphabet";
import { useDictionaryCtx } from "./dictionary-context";
import { DictionaryWordMeaning } from "./dictionary-word-meaning";

export const DictionaryAllWords = () => {
	const ctx = useDictionaryCtx();
	const handlePlay = useHandlePlay();
	const { playText } = usePlayer();
	const { expandedWord, wordMeanings, loadingMeaning, toggleWordMeaning } = useWordMeaning();

	const [expandedLetter, setExpandedLetter] = useState<string | null>(null);

	const handlePlayDefinition = (text: string) => {
		playText(text);
		useScreensStore.setState({ screen: "main" });
	};

	const grouped = useMemo(() => {
		return groupByAlphabet(ctx.filteredSigns);
	}, [ctx.filteredSigns]);
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

	return (
		<div ref={ctx.listRef} className="h-full overflow-auto">
			<ul className="flex flex-col text-sm">
				{grouped.map(({ letter, items }) => {
					const isLetterExpanded = expandedLetter === letter;

					return (
						<li key={letter}>
							<button
								type="button"
								onClick={() => setExpandedLetter(isLetterExpanded ? null : letter)}
								className={cn(
									"flex w-full items-center justify-between bg-background px-4 py-2 text-left font-semibold hover:cursor-pointer",
									isLetterExpanded ? "bg-primary/20" : "hover:bg-muted",
								)}
							>
								{letter === "#" ? "0–9" : letter}
								{isLetterExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
							</button>

							{isLetterExpanded && (
								<ul className="flex flex-col">
									{items.map((sign) => {
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
													<button
														type="button"
														onClick={() => toggleWordMeaning(sign)}
														className="px-2 py-1.25 hover:cursor-pointer hover:text-foreground"
														aria-label={isWordExpanded ? "Fechar significado" : "Ver significado"}
													>
														{isWordExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
													</button>
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
									})}
								</ul>
							)}
						</li>
					);
				})}
			</ul>
		</div>
	);
};
