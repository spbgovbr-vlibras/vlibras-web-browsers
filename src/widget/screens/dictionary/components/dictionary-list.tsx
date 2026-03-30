import { usePlayer } from "@/player/use-player";
import { useDictionaryContext } from "./dictionary-context";
import { DictionaryError } from "./dictionary-error";
import { DictionaryLoading } from "./dictionary-loading";
import { DictionarySearch } from "./dictionary-search";

export const DictionaryList = () => {
	const {
		isLoading,
		isMaxRetries,
		filteredSigns,
		data,
		retry,
		visibleSigns,
		visibleCount,
		loaderRef,
		listRef,
		search,
	} = useDictionaryContext();
	const { play } = usePlayer();

	if (isLoading) return <DictionaryLoading />;
	if (!data) return <DictionaryError onRetry={retry} isMaxRetries={isMaxRetries} />;

	if (!filteredSigns.length) {
		return (
			<p className="break-all px-4 font-semibold text-muted-foreground text-sm">
				Sem resultados para <q className="text-foreground">{search}</q>
			</p>
		);
	}

	return (
		<div>
			<DictionarySearch />

			<div ref={listRef} className="h-full overflow-auto">
				<ul className="flex h-full w-max min-w-full flex-col font-semibold text-sm">
					{visibleSigns.map((sign) => (
						<li>
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
		</div>
	);
};
