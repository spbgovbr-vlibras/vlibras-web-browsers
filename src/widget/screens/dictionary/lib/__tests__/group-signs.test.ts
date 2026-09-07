import { describe, expect, it } from "vitest";
import { groupByBase, groupVerbs } from "@/widget/screens/dictionary/lib/group-signs";

describe("groupByBase", () => {
	it("should mark hasBase when the sign exists without a variant", () => {
		expect(groupByBase(["CASA"])).toEqual([{ base: "CASA", variants: [], hasBase: true }]);
	});

	it("should group variants with '&' under the same base", () => {
		expect(groupByBase(["CASA", "CASA&1", "CASA&2"])).toEqual([
			{ base: "CASA", variants: ["CASA&1", "CASA&2"], hasBase: true },
		]);
	});

	it("should create a group with only variants when the base does not exist", () => {
		expect(groupByBase(["CASA&1"])).toEqual([{ base: "CASA", variants: ["CASA&1"], hasBase: false }]);
	});

	it("should group different bases separately", () => {
		expect(groupByBase(["CASA", "CARRO&1"])).toEqual([
			{ base: "CASA", variants: [], hasBase: true },
			{ base: "CARRO", variants: ["CARRO&1"], hasBase: false },
		]);
	});

	it("should return an empty array when there are no signs", () => {
		expect(groupByBase([])).toEqual([]);
	});
});

describe("groupVerbs", () => {
	it("should place the infinitive at the start of the conjugation", () => {
		const result = groupVerbs(["AMAR"]);

		expect(result.AMAR.conjugation).toEqual([{ original: "AMAR", transformed: "AMAR", prefix: "", suffix: "" }]);
		expect(result.AMAR.desambiguation).toEqual([]);
	});

	it("should transform the conjugated form to 'PREFIXO PARA SUFIXO'", () => {
		const result = groupVerbs(["1S_AMAR_2S"]);

		expect(result.AMAR.conjugation).toEqual([
			{
				original: "1S_AMAR_2S",
				transformed: "EU PARA VOCÊ",
				prefix: "EU",
				suffix: "VOCÊ",
			},
		]);
	});

	it("should sort the conjugation by canonical order", () => {
		const result = groupVerbs(["1S_AMAR_2S", "1S_AMAR_1S"]);

		expect(result.AMAR.conjugation.map((c) => c.transformed)).toEqual(["EU PARA MIM", "EU PARA VOCÊ"]);
	});

	it("should separate disambiguations with '&'", () => {
		const result = groupVerbs(["AMAR", "AMAR&1"]);

		expect(result.AMAR.desambiguation).toEqual(["AMAR&1"]);
		expect(result.AMAR.conjugation).toHaveLength(1);
	});

	it("should sort verbs alphabetically", () => {
		const result = groupVerbs(["CORRER", "AMAR"]);

		expect(Object.keys(result)).toEqual(["AMAR", "CORRER"]);
	});

	it("should return an empty object when there are no signs", () => {
		expect(groupVerbs([])).toEqual({});
	});
});
