import { cn } from "@/common/lib/utils";
import { MaskIcon } from "@/common/utils/mask-icon";
import { play } from "@/player/actions";
import { useTranslate } from "@/widget/hooks/use-translate";
import arrowRightIcon from "@/widget/icons/arrow-right.webp";
import chevronDownIcon from "@/widget/icons/chevron-down.webp";
import chevronUpIcon from "@/widget/icons/chevron-up.webp";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useHandlePlay } from "../hooks/use-handle-play";
import { useWordMeaning } from "../hooks/use-word-meaning";
import { useDictionaryCtx } from "./dictionary-context";
import { DictionaryWordMeaning } from "./dictionary-word-meaning";

export const DictionaryCategoryVerbs = () => {
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

	return (
		<div ref={ctx.listRef} onScroll={ctx.onVerbScroll} className="h-full overflow-auto">
			<ul className="flex w-full flex-col text-sm">
				{ctx.visibleVerbGroups.map(([verb, group]) => {
					const isExpanded = expandedWord === verb;
					const isLoadingThis = loadingMeaning === verb;

					const conjugations = group.conjugation.slice(verb === group.conjugation[0]?.original ? 1 : 0);

					return (
						<li key={verb}>
							<div className={cn("flex min-w-0 items-center hover:bg-muted", isExpanded && "bg-muted")}>
								<button
									type="button"
									onClick={() => handlePlay(verb)}
									className="flex-1 cursor-pointer whitespace-normal break-all px-4 py-1.25 text-left text-xs focus:bg-primary focus:text-primary-foreground sm:text-sm"
								>
									{verb}
								</button>
								<button
									type="button"
									onClick={() => toggleWordMeaning(verb)}
									className="px-2 py-1.25 hover:cursor-pointer hover:text-foreground"
									aria-label={isExpanded ? "Fechar" : "Expandir"}
								>
									{isExpanded ? <MaskIcon src={chevronUpIcon} /> : <MaskIcon src={chevronDownIcon} />}
								</button>
							</div>

							{isExpanded && (
								<div className="bg-muted pb-1">
									<DictionaryWordMeaning
										wordName={verb}
										meaning={wordMeanings[verb]}
										isLoading={isLoadingThis}
										onPlayDefinition={handlePlayDefinition}
									/>

									{conjugations.length > 0 && (
										<div className="mt-1">
											<p className="px-4 py-1 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
												Concordância verbal
											</p>
											<ul className="ml-4 border-border/40 border-l">
												{conjugations.map((c) => (
													<li key={c.original}>
														<button
															type="button"
															onClick={() => handlePlay(c.original)}
															className="flex w-full items-center gap-2 px-4 py-1.25 text-xs hover:cursor-pointer focus:bg-primary focus:text-primary-foreground sm:text-sm"
														>
															<span className="w-20 shrink-0 text-right text-muted-foreground">{c.prefix}</span>
															<MaskIcon src={arrowRightIcon} />
															<span>{c.suffix}</span>
														</button>
													</li>
												))}
											</ul>
										</div>
									)}
									{group.desambiguation.length > 0 && (
										<div className="mt-1">
											<p className="px-4 py-1 font-semibold text-muted-foreground text-xs uppercase tracking-wide">
												Contexto
											</p>
											<ul className="ml-4 border-border/40 border-l">
												{group.desambiguation.map((sign) => {
													const [mainWord, suffix] = sign.split("&", 2);
													return (
														<li key={sign}>
															<button
																type="button"
																onClick={() => handlePlay(sign)}
																className="flex w-full items-center gap-2 px-4 py-1.25 text-xs hover:bg-muted focus:bg-primary focus:text-primary-foreground sm:text-sm"
															>
																{mainWord} ({suffix})
															</button>
														</li>
													);
												})}
											</ul>
										</div>
									)}
								</div>
							)}

							<div className="mx-4 border-border/30 border-t" />
						</li>
					);
				})}
			</ul>
		</div>
	);
};
