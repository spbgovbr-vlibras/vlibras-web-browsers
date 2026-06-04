import { useMobile } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { MaskIcon } from "@/common/utils/mask-icon";
import { Button } from "@/widget/components/ui/button";
import trashIcon from "@/widget/icons/trash.webp";
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

						{/* {isActive && option.value !== "categories" && !!filteredSigns.length && (
							<span className="text-xs leading-0">({filteredSigns.length})</span>
						)}
						{isActive && option.value === "categories" && !!CategoriesList.length && (
							<span className="text-xs leading-0">({CategoriesList.length})</span>
						)} */}
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
					<MaskIcon src={trashIcon} />
				</Button>
			)}
		</div>
	);
};
