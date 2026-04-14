import { cn } from "@/common/lib/utils";
import { ChevronDownIcon } from "@/widget/icons/chevron-down";
import { ChevronUpIcon } from "@/widget/icons/chevron-up";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useHandlePlay } from "../hooks/use-handle-play";
import { useWordMeaning } from "../hooks/use-word-meaning";
import { useDictionaryCtx } from "./dictionary-context";
import { DictionaryWordMeaning } from "./dictionary-word-meaning";

const handlePlayDefinition = (text: string) => {
	// playFromText(text); // equivalente ao translatePtBr do mobile
	useScreensStore.setState({ screen: "main" });
};

export const DictionaryCategoryWords = () => {
	const handlePlay = useHandlePlay();
	const ctx = useDictionaryCtx();
	const { expandedWord, wordMeanings, loadingMeaning, toggleWordMeaning } = useWordMeaning();

	return (
		<div ref={ctx.listRef} className="h-full overflow-auto">
			<ul className="flex h-full w-full flex-col text-sm">
				{ctx.filteredCategoryWords.map((sign) => {
					const isExpanded = expandedWord === sign;
					const isLoadingThis = loadingMeaning === sign;

					return (
						<li key={sign} className="hover:bg-muted">
							<div className={cn("flex min-w-0 items-center", isExpanded ? "bg-muted" : "")}>
								<button
									type="button"
									onClick={() => handlePlay(sign)}
									className="w-full cursor-pointer whitespace-normal break-all px-4 py-1.25 text-left text-xs focus:bg-primary focus:text-primary-foreground sm:text-sm"
								>
									{sign}
								</button>
								<button
									type="button"
									onClick={() => toggleWordMeaning(sign)}
									className="px-2 py-1.25 hover:cursor-pointer hover:text-foreground"
									aria-label={isExpanded ? "Fechar significado" : "Ver significado"}
								>
									{isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
									{/* <ChevronUpIcon
                                        className={cn(
                                            "size-3.5 transition-transform duration-200",
                                            isExpanded ? "" : "rotate-180",
                                            // chevron down quando fechado, up quando aberto
                                        )}
                                    /> */}
								</button>
							</div>
							{isExpanded && (
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
		</div>
	);
};
