import { describe, expect, it } from "vitest";
import { groupByAlphabet } from "@/widget/screens/dictionary/lib/alphabet";
import { ALPHABET } from "@/widget/screens/dictionary/lib/constants";

describe("groupByAlphabet", () => {
	it("should group words by their first uppercase letter", () => {
		const result = groupByAlphabet(["casa", "Carro", "bola"]);

		expect(result).toEqual([
			{ letter: "B", items: ["bola"] },
			{ letter: "C", items: ["Carro", "casa"] },
		]);
	});

	it("should group words starting with a number under '#'", () => {
		const result = groupByAlphabet(["2 patos", "10 anos", "amor"]);

		expect(result).toEqual([
			{ letter: "#", items: ["10 anos", "2 patos"] },
			{ letter: "A", items: ["amor"] },
		]);
	});

	it("should sort items in each group with localeCompare", () => {
		const result = groupByAlphabet(["banana", "abacaxi", "amora"]);

		expect(result).toEqual([
			{ letter: "A", items: ["abacaxi", "amora"] },
			{ letter: "B", items: ["banana"] },
		]);
	});

	it("should ignore leading spaces when determining the letter", () => {
		const result = groupByAlphabet(["  casa"]);

		expect(result).toEqual([{ letter: "C", items: ["  casa"] }]);
	});

	it("should return an empty array when there are no words", () => {
		expect(groupByAlphabet([])).toEqual([]);
	});

	it("should return only letters present in the alphabet", () => {
		const result = groupByAlphabet(["casa"]);

		expect(result).toHaveLength(1);
		expect(result[0].letter).toBe("C");
		expect(ALPHABET).toContain("C");
	});
});
