import { ChevronLeftIcon } from "@/widget/icons/chevron-left-icon";
import { CategoriesList } from "../lib/constants";
import { useDictionaryCtx } from "./dictionary-context";

export const DictionaryCategoryHeader = () => {
	const ctx = useDictionaryCtx();
	const categoryIconUrl = CategoriesList.find((item) => item.id === ctx.selectedCategory?.id)?.icon;

	return (
		ctx.filter === "categories" &&
		ctx.selectedCategory && (
			<div className="flex min-h-15 w-full items-center gap-1 bg-primary/20 px-4">
				<button
					type="button"
					onClick={() => ctx.setSelectedCategory(null)}
					className="flex h-full w-full items-center justify-start gap-2 text-xs hover:cursor-pointer dark:text-white"
				>
					<ChevronLeftIcon />
					<img src={categoryIconUrl} alt="" className="h-6 w-6 dark:brightness-0 dark:invert" />
					<span className="font-semibold text-sm">{ctx.selectedCategory.name}</span>
				</button>
			</div>
		)
	);
};
