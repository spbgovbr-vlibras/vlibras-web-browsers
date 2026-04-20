import { Fragment } from "preact/jsx-runtime";
import { posthogg } from "@/common/lib/posthog";
import { cn } from "@/common/lib/utils";
import { usePlayer } from "@/player/use-player";
import { DictionaryIcon } from "@/widget/icons/dictionary";
import { createCallback } from "@/widget/stores/use-callback.store";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useDictionaryHistoryStore } from "../stores/use-dictionary-history.store";
import { useDictionaryCtx } from "./dictionary-context";
import { DictionaryError } from "./dictionary-error";
import { DictionaryFilter } from "./dictionary-filter";
import { DictionaryLoading } from "./dictionary-loading";
import { DictionarySearch } from "./dictionary-search";

export const DictionaryList = () => {
	const { play } = usePlayer();

	const ctx = useDictionaryCtx();
	const signs = useDictionaryHistoryStore((s) => s.signs);
	const open = useScreensStore((s) => s.open);

	const handlePlay = (sign: string) => {
		play(sign);

		const newSigns = [sign, ...signs.filter((s) => s !== sign)];

		useDictionaryHistoryStore.setState({ signs: newSigns });
		useScreensStore.setState({ screen: "main" });

		createCallback({
			action: () => open("dictionary"),
			content: (
				<Fragment>
					<DictionaryIcon />
					Reabrir Dicionário
				</Fragment>
			),
		});

		posthogg.trackEvent("dictionary_gloss", { sign });
	};

	if (ctx.isLoading) return <DictionaryLoading />;
	if (!ctx.data) return <DictionaryError onRetry={ctx.retry} isMaxRetries={ctx.isMaxRetries} />;

	const isEmpty = !ctx.filteredSigns.length && !!ctx.search;

	return (
		<div className="flex h-full flex-col gap-2 overflow-hidden">
			<DictionarySearch />
			<DictionaryFilter />

			{isEmpty && (
				<p className="break-all px-4 font-semibold text-muted-foreground text-xs sm:text-sm">
					Sem resultados para <q className="text-foreground">{ctx.search}</q>
				</p>
			)}

			<div ref={ctx.listRef} className={cn("h-full overflow-auto", !ctx.filteredSigns.length && "hidden")}>
				<ul className="flex h-full w-max min-w-full flex-col text-sm">
					{ctx.visibleSigns.map((sign) => (
						<li key={sign}>
							<button
								type="button"
								onClick={() => handlePlay(sign)}
								className="w-full cursor-pointer whitespace-nowrap px-4 py-1.25 text-left text-xs hover:bg-muted focus:bg-primary focus:text-primary-foreground sm:text-sm"
							>
								{sign}
							</button>
						</li>
					))}

					<div ref={ctx.loaderRef} className={cn("py-2", ctx.filteredSigns.length <= ctx.visibleCount && "hidden")} />
				</ul>
			</div>
		</div>
	);
};
