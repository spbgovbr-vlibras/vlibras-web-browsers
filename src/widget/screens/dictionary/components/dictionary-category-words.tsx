import { useMemo } from "preact/hooks";
import { cn } from "@/common/lib/utils";
import { play } from "@/player/actions";
import { Button } from "@/widget/components/ui/button";
import { useTranslate } from "@/widget/hooks/use-translate";
import { ChevronDownIcon } from "@/widget/icons/chevron-down";
import { ChevronUpIcon } from "@/widget/icons/chevron-up";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useHandlePlay } from "../hooks/use-handle-play";
import { useWordMeaning } from "../hooks/use-word-meaning";
import { groupByBase } from "../lib/group-signs";
import { DictionaryCategoryVerbs } from "./dictionary-category-verbs";
import { useDictionaryCtx } from "./dictionary-context";
import { DictionaryWordMeaning } from "./dictionary-word-meaning";

export const DictionaryCategoryWords = () => {
	const { mutateAsync: translate } = useTranslate();
	const handlePlay = useHandlePlay();
	const ctx = useDictionaryCtx();
	const { expandedWord, wordMeanings, loadingMeaning, toggleWordMeaning } = useWordMeaning();

	const handlePlayDefinition = async (text: string) => {
		try {
			const gloss = await translate(text);
			play(gloss);
			useScreensStore.setState({ screen: "main" });
		} catch (error) {
			console.error("Erro ao reproduzir definição: ", error);
		}
	};
	if (ctx.isVerbCategory) return <DictionaryCategoryVerbs />;

	const groupedWords = useMemo(() => groupByBase(ctx.visibleCategoryWords), [ctx.visibleCategoryWords]);
	return (
		<div ref={ctx.listRef} onScroll={ctx.onCategoryScroll} className="h-full overflow-auto">
			<ul className="flex h-full w-full flex-col text-sm">
				{groupedWords.map((group) => {
					const isExpanded = expandedWord === group.base;
					const isLoadingThis = loadingMeaning === group.base;
					const prettyBase = (group.base || "").replace(/_/g, " ");

					return (
						<li key={group.base} className="hover:bg-muted">
							<div className={cn("flex min-w-0 items-center", isExpanded ? "bg-muted" : "")}>
								<button
									type="button"
									onClick={() => handlePlay(group.base)}
									className="w-full cursor-pointer whitespace-normal break-all px-4 py-1.25 text-left text-xs focus:bg-primary focus:text-primary-foreground sm:text-sm"
								>
									{prettyBase}
								</button>
								<Button
									size="icon-sm"
									variant="ghost"
									className="text-muted-foreground"
									onClick={() => toggleWordMeaning(group.base)}
									aria-label={isExpanded ? "Fechar significado" : "Ver significado"}
								>
									{isExpanded ? <ChevronUpIcon className="size-4" /> : <ChevronDownIcon className="size-4" />}
								</Button>
							</div>
							{isExpanded && (
								<>
									<DictionaryWordMeaning
										wordName={group.base}
										meaning={wordMeanings[group.base]}
										isLoading={isLoadingThis}
										onPlayDefinition={handlePlayDefinition}
									/>
									{group.variants.length > 0 && (
										<div className="mt-1">
											<p className="px-4 py-1 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
												Contexto
											</p>
											<ul className="ml-4 border-border/40 border-l">
												{group.variants.map((sign) => {
													const [, suffix] = sign.split("&", 2);
													const prettyBase = (group.base || "").replace(/_/g, " ");
													const prettySuffix = (suffix || "").replace(/_/g, " ");
													return (
														<li key={sign}>
															<button
																type="button"
																onClick={() => {
																	handlePlay(sign);
																}}
																className="flex w-full px-4 py-1 text-left text-xs hover:bg-muted focus:bg-primary focus:text-primary-foreground sm:text-sm"
															>
																{prettyBase} ({prettySuffix})
															</button>
														</li>
													);
												})}
											</ul>
										</div>
									)}
								</>
							)}
							<div className="mx-4 border-border/30 border-t" />
						</li>
					);
				})}
			</ul>
		</div>
	);
};
