import wordsJson from "@/data/classified_words_reduced.json";

export const getCategories: string[] = Array.from(new Set(wordsJson.flatMap((item) => item.categorias))).sort((a, b) =>
	a.localeCompare(b),
);

export const getSignsByCategory = (category: string): string[] => {
	return wordsJson.filter((item) => item.categorias.includes(category)).map((item) => item.palavra);
};
