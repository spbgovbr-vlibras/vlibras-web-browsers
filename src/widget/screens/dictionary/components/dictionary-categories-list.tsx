import { Fragment } from "preact/jsx-runtime";
import { DictionaryCategoryHeader } from "./dictionary-category-header";
import { DictionaryCategoryWords } from "./dictionary-category-words";
import { useDictionaryCtx } from "./dictionary-context";
import { DictionaryLoading } from "./dictionary-loading";

export const DictionaryCategoryList = () => {
	const isLoadingCategorySigns = useDictionaryCtx((s) => s.isLoadingCategorySigns);

	return (
		<Fragment>
			<DictionaryCategoryHeader />
			{isLoadingCategorySigns ? <DictionaryLoading /> : <DictionaryCategoryWords />}
		</Fragment>
	);
};
