import { useMobile } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { Button } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import type { DictionaryFilter as Filter } from "../lib/types";
import { useDictionaryHistoryStore } from "../stores/use-dictionary-history.store";
import { useDictionaryCtx } from "./dictionary-context";

const options: { label: string; value: Filter }[] = [
	{ label: "Categorias", value: "categories" },
	{ label: "A-Z", value: "all" },
	{ label: "Recentes", value: "recents" },
];

export const DictionaryFilter = () => {
	const { setFilter, filter, handleHistoryClear } = useDictionaryCtx();
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
						className={cn("animate-move-down", isMobile ? "p-1" : "p-2")}
						size={isMobile ? "xs" : "sm"}
					>
						{option.label}
					</Button>
				);
			})}

			{filter === "recents" && (
				<Button
					onClick={handleHistoryClear}
					className="text-muted-foreground not-focus:outline-0 outline-destructive hover:text-destructive focus:[&_svg]:text-destructive"
					size={isMobile ? "icon-xs" : "icon-sm"}
					variant="ghost"
					aria-label="Limpar histórico"
				>
					<Icon name="trash" />
				</Button>
			)}
		</div>
	);
};
