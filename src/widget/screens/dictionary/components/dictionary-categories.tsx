import { useMemo } from "preact/hooks";
import { cn } from "@/common/lib/utils";
import { Icon } from "@/widget/components/ui/icon";
import type { IconName } from "@/widget/icons/types";
import { categoryIcons } from "../lib/constants";
import type { Category } from "../lib/types";
import { useDictionaryCtx } from "./dictionary-context";

export const DictionaryCategories = () => {
	const { search, setSelectedCategory, categories, listRef } = useDictionaryCtx();

	const filtered = useMemo(() => {
		return categories
			.filter((cat: Category) => cat.name.toLowerCase().includes(search.toLocaleLowerCase()))
			.sort((a: Category, b: Category) => a.name.localeCompare(b.name));
	}, [categories, search]);

	if (!filtered.length) return null;

	return (
		<div ref={listRef} className="h-full overflow-auto">
			<ul className="flex flex-col">
				{filtered.map((category: Category) => {
					const icon: IconName = categoryIcons[category.id] || "categories/undefined";

					return (
						<li key={category.id}>
							<button
								type="button"
								onClick={() => setSelectedCategory(category)}
								className={cn(
									"flex w-full items-center justify-between px-4 mobile:py-2 py-0 mobile:text-xs text-sm hover:cursor-pointer hover:bg-muted",
								)}
							>
								<div className="flex items-center gap-2 py-2">
									<Icon name={icon} className="mobile:size-5 size-6 shrink-0 dark:bg-foreground" />
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
