import { Fragment } from "preact/jsx-runtime";
import { usePick } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { play } from "@/player/actions";
import { Icon } from "@/widget/components/ui/icon";
import { useTranslate } from "@/widget/hooks/use-translate";
import { createCallback } from "@/widget/stores/use-callback.store";
import { screenStore } from "@/widget/stores/use-screens.store";
import { useHandlePlay } from "../hooks/use-handle-play";
import { useWordMeaning } from "../hooks/use-word-meaning";
import { useDictionaryCtx } from "./dictionary-context";
import { DictionaryWordMeaning } from "./dictionary-word-meaning";

export const DictionaryCategoryVerbs = () => {
	const handlePlay = useHandlePlay();
	const ctx = useDictionaryCtx(usePick("visibleVerbGroups", "onVerbScroll", "listRef"));

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
									className="flex-1 cursor-pointer whitespace-normal break-all px-4 py-1.25 text-left mobile:text-xs text-sm focus:bg-primary focus:text-primary-foreground"
								>
									{verb}
								</button>
								<button
									type="button"
									onClick={() => toggleWordMeaning(verb)}
									className="px-2 py-1.25 hover:cursor-pointer hover:text-foreground"
									aria-label={isExpanded ? "Fechar" : "Expandir"}
								>
									<Icon name={isExpanded ? "chevron-up" : "chevron-down"} aria-hidden="true" className="size-4" />
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
															className="flex w-full items-center gap-2 px-4 py-1.25 mobile:text-xs text-sm hover:cursor-pointer focus:bg-primary focus:text-primary-foreground"
														>
															<span className="w-20 shrink-0 text-right text-muted-foreground">{c.prefix}</span>
															<Icon name="arrow-right" className="size-4" />
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
																className="flex w-full items-center gap-2 px-4 py-1.25 mobile:text-xs text-sm hover:bg-muted focus:bg-primary focus:text-primary-foreground"
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
