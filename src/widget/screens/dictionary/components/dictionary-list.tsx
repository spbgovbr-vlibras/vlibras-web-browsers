import { DictionaryAllWords } from "./dictionary-all-words";
import { DictionaryCategories } from "./dictionary-categories";
import { DictionaryCategoryHeader } from "./dictionary-category-header";
import { DictionaryCategoryWords } from "./dictionary-category-words";
import { useDictionaryCtx } from "./dictionary-context";
import { DictionaryError } from "./dictionary-error";
import { DictionaryFilter } from "./dictionary-filter";
import { DictionaryLetterHeader } from "./dictionary-letter-head";
import { DictionaryLetterWords } from "./dictionary-letter-words";
import { DictionaryLoading } from "./dictionary-loading";
import { DictionarySearch } from "./dictionary-search";

export const DictionaryList = () => {
	const ctx = useDictionaryCtx();

	if (ctx.isLoading) return <DictionaryLoading />;
	if (!ctx.data) return <DictionaryError onRetry={ctx.retry} isMaxRetries={ctx.isMaxRetries} />;

	const isAllLetterSelected = ctx.filter === "all" && !!ctx.selectedLetter;

	const isEmpty = isAllLetterSelected
		? !ctx.filteredLetterWords.length && !!ctx.search
		: ctx.filter === "categories"
			? ctx.selectedCategory
				? !ctx.filteredCategoryWords.length && !!ctx.search
				: false
			: !ctx.filteredSigns.length && !!ctx.search;

	return (
		<div className="flex h-full flex-col gap-2 overflow-hidden text-primary dark:text-white">
			<DictionarySearch />
			<DictionaryFilter />

			{ctx.filter === "categories" &&
				!ctx.selectedCategory &&
				(ctx.isLoadingCategories ? <DictionaryLoading /> : <DictionaryCategories />)}
			{ctx.filter === "categories" && ctx.selectedCategory && <DictionaryCategoryHeader />}
			{ctx.filter === "categories" &&
				ctx.selectedCategory &&
				!isEmpty &&
				(ctx.isLoadingCategorySigns ? <DictionaryLoading /> : <DictionaryCategoryWords />)}

			{isAllLetterSelected && <DictionaryLetterHeader />}
			{isAllLetterSelected && !isEmpty && <DictionaryLetterWords />}

			{ctx.filter !== "categories" && !isAllLetterSelected && !isEmpty && <DictionaryAllWords />}

			{isEmpty && (
				<p className="break-all px-4 font-semibold mobile:text-xs text-muted-foreground text-sm">
					Sem resultados para <q className="text-foreground">{ctx.search}</q>
				</p>
			)}
		</div>
	);
};
