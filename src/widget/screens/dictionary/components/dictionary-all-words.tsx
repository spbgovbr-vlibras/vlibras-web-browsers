import { cn } from "@/common/lib/utils";
import { useHandlePlay } from "../hooks/use-handle-play";
import { useDictionaryCtx } from "./dictionary-context";

export const DictionaryAllWords = () => {
	const ctx = useDictionaryCtx();
	const handlePlay = useHandlePlay();

	return (
		<div ref={ctx.listRef} className={cn("h-full overflow-auto", !ctx.filteredSigns.length && "hidden")}>
			<ul className="flex h-full min-w-full flex-col text-sm">
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
	);
};
