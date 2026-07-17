import { usePick } from "@/common/hooks";
import { Icon } from "@/widget/components/ui/icon";
import { categoryIcons } from "../lib/constants";
import { useDictionaryCtx } from "./dictionary-context";

export const DictionaryCategoryHeader = () => {
	const { selectedCategory, setSelectedCategory } = useDictionaryCtx(
		usePick("selectedCategory", "setSelectedCategory"),
	);

	if (!selectedCategory) return null;

	const categoryIcon = categoryIcons[selectedCategory.id] || "categories/undefined";

	return (
		selectedCategory && (
			<div className="flex w-full animate-move-up items-center gap-1 bg-primary/20 mobile:px-3 px-4 mobile:py-2 py-3">
				<button
					type="button"
					aria-label="Voltar para a lista de categorias"
					onClick={() => setSelectedCategory(null)}
					className="group flex h-full w-full items-center justify-start gap-2 text-xs hover:cursor-pointer"
				>
					<Icon
						aria-hidden="true"
						name="chevron-left"
						className="size-4 bg-muted-foreground group-hover:bg-foreground"
					/>
					<Icon aria-hidden="true" name={categoryIcon} className="mobile:size-5 size-6 shrink-0" />
					<span className="font-semibold mobile:text-xs text-sm">{selectedCategory.name.replace(/_/g, " ")}</span>
				</button>
			</div>
		)
	);
};
