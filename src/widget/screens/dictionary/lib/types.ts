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

export type CategoryName =
	| "Comidas e Bebidas"
	| "Animais"
	| "Aparelho ou Máquina"
	| "Corpo"
	| "Esporte ou Diversão"
	| "Família"
	| "Saúde/Higiene"
	| "País/Estado/Cidade"
	| "Natureza"
	| "Profissão ou Trabalho"
	| "Sentimentos"
	| "Verbos"
	| "Letras"
	| "Números"
	| "Lugares"
	| "Medidas"
	| "Indefinidos";

export type Category = {
	name: CategoryName;
	icon: string;
};
