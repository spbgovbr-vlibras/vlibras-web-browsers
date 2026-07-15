import { useMemo } from "preact/hooks";
import { cn } from "@/common/lib/utils";
import { Icon } from "@/widget/components/ui/icon";
import type { IconName } from "@/widget/icons/types";
import { categoryIcons } from "../lib/constants";
import type { Category } from "../lib/types";
import { useDictionaryCtx } from "./dictionary-context";
import { DictionaryLoading } from "./dictionary-loading";

export const DictionaryCategories = () => {
	const { search, setSelectedCategory, categories, listRef, setFilter, isLoadingCategories } = useDictionaryCtx();

	if (isLoadingCategories) return <DictionaryLoading />;

	const filtered = useMemo(() => {
		return categories
			.filter((cat: Category) => cat.name.toLowerCase().includes(search.toLocaleLowerCase()))
			.sort((a: Category, b: Category) => a.name.localeCompare(b.name));
	}, [categories, search]);

	if (!categories.length) {
		return (
			<div className="flex h-full w-full items-start justify-center p-6">
				Sem conexão com a internet. Não é possível estabelecer conexão com o banco de sinais.
			</div>
		);
	}
	if (!filtered.length) {
		return <div className="flex h-10 items-center justify-center">Nenhuma categoria encontrada</div>;
	}

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
				<li key="all-signs">
					<button
						type="button"
						onClick={() => setFilter("all")}
						className={cn(
							"flex w-full items-center justify-between px-4 mobile:py-2 py-0 mobile:text-xs text-sm hover:cursor-pointer hover:bg-muted",
						)}
					>
						<div className="flex items-center gap-2 py-2">
							<Icon name={"categories/all"} className="mobile:size-5 size-6 shrink-0 dark:bg-foreground" />
							<span>TODOS</span>
						</div>
					</button>
					<div className="mx-4 border-border/30 border-t" />
				</li>
			</ul>
		</div>
	);
};
