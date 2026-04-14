import { useMobile } from "@/common/hooks";
import { ChevronDownIcon } from "@/widget/icons/chevron-down";
import { CategoriesList } from "@/widget/screens/dictionary/lib/constants";
import { useDictionaryCtx } from "./dictionary-context";

export const DictionaryCategories = () => {
	const ctx = useDictionaryCtx();
	const { search, setSelectedCategory } = useDictionaryCtx();
	const isMobile = useMobile();

	const filtered = CategoriesList.filter((cat) => cat.name.toLowerCase().includes(search.toLocaleLowerCase())).sort(
		(a, b) => a.name.localeCompare(b.name),
	);

	if (!filtered.length) return null;

	return (
		<div ref={ctx.listRef} className="h-full overflow-auto">
			<ul className="flex flex-col">
				{filtered.map((category) => (
					<li key={category}>
						<button
							type="button"
							onClick={() => setSelectedCategory(category)}
							className={`flex w-full items-center justify-between px-4 hover:cursor-pointer hover:bg-muted ${isMobile ? "py-2 text-xs" : "py-1.5 text-sm"}`}
						>
							<div className="flex items-center justify-start gap-2">
								<ChevronDownIcon />
								<category.icon />
								<span>{category.name}</span>
							</div>
						</button>
						<div className="mx-4 border-border/30 border-t" />
					</li>
				))}
			</ul>
		</div>
	);
};
