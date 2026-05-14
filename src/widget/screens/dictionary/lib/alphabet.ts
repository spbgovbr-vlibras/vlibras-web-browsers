import { ALPHABET } from "../lib/constants";

export function groupByAlphabet(words: string[]) {
	const grouped: Record<string, string[]> = {};

	for (const word of words) {
		const raw = word.trim();
		let firstChar = raw.charAt(0).toUpperCase();

		if (/[0-9]/.test(firstChar)) {
			firstChar = "#";
		}

		if (!grouped[firstChar]) {
			grouped[firstChar] = [];
		}

		grouped[firstChar].push(word);
	}

	for (const key in grouped) {
		grouped[key].sort((a, b) => a.localeCompare(b));
	}

	return ALPHABET.map((letter) => ({
		letter,
		items: grouped[letter] || [],
	})).filter((group) => group.items.length > 0);
}
