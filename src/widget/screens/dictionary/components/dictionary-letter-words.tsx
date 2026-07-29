import { Fragment } from "preact/jsx-runtime";
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

export const DictionaryLetterWords = () => {
	const ctx = useDictionaryCtx(usePick("visibleLetterWords", "onLetterScroll", "listRef"));
	const handlePlay = useHandlePlay();
	const { mutateAsync: translate } = useTranslate();
	const { expandedWord, wordMeanings, loadingMeaning, toggleWordMeaning } = useWordMeaning();

	const handlePlayDefinition = async (text: string) => {
		try {
			const gloss = await translate(text);
			play(gloss);

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
		<div ref={ctx.listRef} onScroll={ctx.onLetterScroll} className="h-full overflow-auto">
			<ul className="flex h-full w-full flex-col text-sm">
				{ctx.visibleLetterWords.map((sign: string) => {
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
									<Icon name={isWordExpanded ? "chevron-up" : "chevron-down"} className="size-4" aria-hidden="true" />
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
				})}
			</ul>
		</div>
	);
};
