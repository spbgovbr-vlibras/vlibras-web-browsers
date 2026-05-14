import { ChevronLeftIcon } from "@/widget/icons/chevron-left-icon";
import { useDictionaryCtx } from "./dictionary-context";

export const DictionaryCategoryHeader = () => {
	const ctx = useDictionaryCtx();

	return (
		ctx.filter === "categories" &&
		ctx.selectedCategory && (
			<div className="flex h-20 w-full items-center gap-1 bg-primary/20 px-4">
				<button
					type="button"
					onClick={() => ctx.setSelectedCategory(null)}
					className="flex h-full w-full items-center justify-start gap-2 text-xs hover:cursor-pointer dark:text-white"
				>
					<ChevronLeftIcon />
					{/* <ctx.selectedCategory.icon /> */}
					<span className="font-semibold text-sm">{ctx.selectedCategory.name}</span>
				</button>
			</div>
		)
	);
};
