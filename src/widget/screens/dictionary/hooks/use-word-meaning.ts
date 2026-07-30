import { useQuery } from "@tanstack/preact-query";
import { useState } from "preact/hooks";
import type { WordMeaning } from "../lib/types";
import { getDictionaryData } from "../lib/wiktionary";

export const useWordMeaning = () => {
	const [expandedWord, setExpandedWord] = useState<string | null>(null);

	const { data: meaning, isFetching } = useQuery<WordMeaning | null>({
		queryKey: ["wordMeaning", expandedWord],
		queryFn: () => getDictionaryData(expandedWord ?? ""),
		enabled: !!expandedWord,
	});

	const toggleWordMeaning = (wordName: string) => {
		setExpandedWord((prev) => (prev === wordName ? null : wordName));
	};

	const wordMeanings = expandedWord && meaning !== undefined ? { [expandedWord]: meaning } : {};
	const loadingMeaning = isFetching ? expandedWord : null;

	return {
		expandedWord,
		wordMeanings,
		loadingMeaning,
		toggleWordMeaning,
	};
};
