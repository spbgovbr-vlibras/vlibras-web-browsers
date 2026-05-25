export interface DictionaryData {
	wordClass?: string;
	pronunciation?: string;
	definitions?: string[];
	etymology?: string;
	gender?: string;
	imgUrl?: string;
	translations?: Record<string, string[]>;
	plural?: string;
}

export type DictionaryFilter = "recents" | "all" | "categories";

export type WordMeaning = {
	definitions?: string[];
};

export type VerbConjugation = {
	original: string;
	prefix: string;
	suffix: string;
	transformed: string;
};

export type VerbGroup = {
	conjugation: VerbConjugation[];
	desambiguation: string[];
};

export type Category = {
	id: number;
	active: boolean;
	name: string;
	description: string | null;
	url: string | undefined;
};
