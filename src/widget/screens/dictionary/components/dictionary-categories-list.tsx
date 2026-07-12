import { Fragment } from "preact/jsx-runtime";
import { DictionaryCategoryHeader } from "./dictionary-category-header";
import { DictionaryCategoryWords } from "./dictionary-category-words";
import { useDictionaryCtx } from "./dictionary-context";
import { DictionaryLoading } from "./dictionary-loading";

export const DictionaryCategoryList = () => {
	const ctx = useDictionaryCtx();

	return (
		<Fragment>
			<DictionaryCategoryHeader />
			{ctx.isLoadingCategorySigns ? <DictionaryLoading /> : <DictionaryCategoryWords />}
		</Fragment>
	);
};
