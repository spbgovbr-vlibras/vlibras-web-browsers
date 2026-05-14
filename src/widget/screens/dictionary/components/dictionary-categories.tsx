import { useMobile } from "@/common/hooks";
import { CategoriesList } from "../lib/constants";
import { useDictionaryCtx } from "./dictionary-context";

export const DictionaryCategories = () => {
	const isMobile = useMobile();
	const ctx = useDictionaryCtx();
	const { search, setSelectedCategory, categories } = useDictionaryCtx();

	const filtered = categories
		.filter((cat) => cat.name.toLowerCase().includes(search.toLocaleLowerCase()))
		.sort((a, b) => a.name.localeCompare(b.name));

	if (!filtered.length) return null;
	const categoriesMap = Object.fromEntries(CategoriesList.map((category) => [category.id, category]));

	return (
		<div ref={ctx.listRef} className="h-full overflow-auto">
			<ul className="flex flex-col">
				{filtered.map((category) => {
					const Icon = categoriesMap[category.id].icon;
					return (
						<li key={category.id}>
							<button
								type="button"
								onClick={() => setSelectedCategory(category)}
								className={`flex w-full items-center justify-between px-4 hover:cursor-pointer hover:bg-muted ${isMobile ? "py-2 text-xs" : "py-1.5 text-sm"}`}
							>
								<div className="flex items-center justify-start gap-2">
									<img src={category.url} alt="" />
									<Icon />
									<span>{category.name.replace(/_/g, " ")}</span>
								</div>
							</button>
							<div className="mx-4 border-border/30 border-t" />
						</li>
					);
				})}
			</ul>
		</div>
	);
};
