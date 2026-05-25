import { useState } from "preact/hooks";
import type { WordMeaning } from "../lib/types";
import { getDictionaryData } from "../lib/wiktionary";

export const useWordMeaning = () => {
	const [expandedWord, setExpandedWord] = useState<string | null>(null);
	const [wordMeanings, setWordMeanings] = useState<Record<string, WordMeaning | null>>({});
	const [loadingMeaning, setLoadingMeaning] = useState<string | null>(null);

	const toggleWordMeaning = async (wordName: string) => {
		if (expandedWord === wordName) {
			setExpandedWord(null);
			return;
		}

		setExpandedWord(wordName);

		if (wordMeanings[wordName] !== undefined) return;

		setLoadingMeaning(wordName);
		const meaning = await getDictionaryData(wordName);
		setWordMeanings((prev) => ({ ...prev, [wordName]: meaning }));
		setLoadingMeaning(null);
	};

	return {
		expandedWord,
		wordMeanings,
		loadingMeaning,
		toggleWordMeaning,
	};
};
