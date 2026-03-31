import { useMobile } from "@/common/hooks";
import { Button } from "@/widget/components/ui/button";
import { TrashIcon } from "@/widget/icons";
import type { DictionaryFilter as Filter } from "../hooks/use-dictionary";
import { useDictionaryHistoryStore } from "../stores/use-dictionary-history.store";
import { useDictionaryCtx } from "./dictionary-context";

const options: { label: string; value: Filter }[] = [
	{ label: "Todos", value: "all" },
	{ label: "Recentes", value: "recents" },
];

export const DictionaryFilter = () => {
	const { setFilter, filter, filteredSigns, handleHistoryClear } = useDictionaryCtx();
	const { signs } = useDictionaryHistoryStore();

	const isMobile = useMobile();
	const isEmptyRecent = !signs.length;

	return (
		<div className="flex items-center gap-2 px-4 [&_button]:rounded-full">
			{options.map((option) => {
				const isActive = filter === option.value;
				if (isEmptyRecent && option.value === "recents") return null;

				return (
					<Button
						inert={isActive}
						variant={isActive ? "default" : "outline"}
						onClick={() => setFilter(option.value)}
						key={option.value}
						className="animate-move-down"
						size={isMobile ? "xs" : "sm"}
					>
						{option.label}

						{isActive && !!filteredSigns.length && <span className="text-xs leading-0">({filteredSigns.length})</span>}
					</Button>
				);
			})}

			{filter === "recents" && (
				<Button
					onClick={handleHistoryClear}
					className="ml-auto text-muted-foreground hover:text-destructive"
					size={isMobile ? "icon-xs" : "icon-sm"}
					variant="ghost"
					aria-label="Limpar histórico"
				>
					<TrashIcon />
				</Button>
			)}
		</div>
	);
};
