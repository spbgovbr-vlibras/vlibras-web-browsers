import { useMemo } from "preact/hooks";
import { usePick } from "@/common/hooks";
import { DictionaryAllWords } from "./dictionary-all-words";
import { DictionaryCategories } from "./dictionary-categories";
import { DictionaryCategoryList } from "./dictionary-categories-list";
import { useDictionaryCtx } from "./dictionary-context";
import { DictionaryError } from "./dictionary-error";
import { DictionaryFilter } from "./dictionary-filter";
import { DictionaryLetterList } from "./dictionary-letter-list";
import { DictionaryLoading } from "./dictionary-loading";
import { DictionarySearch } from "./dictionary-search";

export const DictionaryList = () => {
	const ctx = useDictionaryCtx(
		usePick(
			"isLoading",
			"data",
			"filter",
			"search",
			"selectedLetter",
			"selectedCategory",
			"retry",
			"isMaxRetries",
			"filteredLetterWords",
			"filteredCategoryWords",
			"filteredSigns",
		),
	);

	if (ctx.isLoading) return <DictionaryLoading />;
	if (!ctx.data && ctx.filter === "all") return <DictionaryError onRetry={ctx.retry} isMaxRetries={ctx.isMaxRetries} />;

	const isAllLetterSelected = ctx.filter === "all" && !!ctx.selectedLetter;
	const isEmpty = useMemo(() => {
		return isAllLetterSelected
			? !ctx.filteredLetterWords.length && !!ctx.search
			: ctx.filter === "categories"
				? ctx.selectedCategory
					? !ctx.filteredCategoryWords.length && !!ctx.search
					: false
				: !ctx.filteredSigns.length && !!ctx.search;
	}, [ctx]);

	return (
		<div className="flex h-full flex-col gap-2 overflow-hidden text-primary dark:text-white">
			<DictionarySearch />
			<DictionaryFilter />

			{ctx.filter === "categories" && !ctx.selectedCategory && <DictionaryCategories />}
			{ctx.filter === "categories" && ctx.selectedCategory && <DictionaryCategoryList />}
			{isAllLetterSelected && <DictionaryLetterList />}
			{ctx.filter !== "categories" && !isAllLetterSelected && !isEmpty && <DictionaryAllWords />}

			{isEmpty && (
				<p className="break-all px-4 font-semibold mobile:text-xs text-muted-foreground text-sm">
					Sem resultados para <q className="text-foreground">{ctx.search}</q>
				</p>
			)}
		</div>
	);
};
