import { describe, expect, it, vi } from "vitest";
import { Trie, type TrieNode, type TrieRoot } from "@/common/lib/trie";

function buildRoot(words: string[]): TrieRoot {
	const root: TrieNode = { children: {}, end: false };
	for (const word of words) {
		let node = root;
		for (const char of word) {
			node.children[char] ??= { children: {}, end: false };
			node = node.children[char];
		}
		node.end = true;
	}
	return { root };
}

describe("Trie", () => {
	it("should find words by prefix", () => {
		const trie = new Trie(buildRoot(["CASA", "CASADO", "CARRO"]));
		expect(trie.searchSigns("CAS")).toEqual(["CASA", "CASADO"]);
	});

	it("should be case-insensitive", () => {
		const trie = new Trie(buildRoot(["CASA", "CASADO"]));
		expect(trie.searchSigns("cas")).toEqual(["CASA", "CASADO"]);
	});

	it("should return an empty array for an unknown prefix", () => {
		const trie = new Trie(buildRoot(["CASA"]));
		expect(trie.searchSigns("XYZ")).toEqual([]);
	});

	it("should call the callback for each matched word", () => {
		const trie = new Trie(buildRoot(["CASA", "CASADO"]));
		const onMatch = vi.fn();
		trie.loadSigns("CAS", onMatch);
		expect(onMatch).toHaveBeenCalledTimes(2);
		expect(onMatch).toHaveBeenCalledWith("CASA");
		expect(onMatch).toHaveBeenCalledWith("CASADO");
	});

	it("should return all words for an empty prefix", () => {
		const trie = new Trie(buildRoot(["CASA", "CARRO"]));
		expect(trie.searchSigns("")).toEqual(["CASA", "CARRO"]);
	});

	it("should accept the root object directly", () => {
		const trie = new Trie(buildRoot(["CASA"]));
		expect(trie.searchSigns("CASA")).toEqual(["CASA"]);
	});

	it("should return an empty array when the tree is empty", () => {
		const trie = new Trie({ root: { children: {}, end: false } });
		expect(trie.searchSigns("")).toEqual([]);
		expect(trie.searchSigns("CAS")).toEqual([]);
	});

	it("should accept valid JSON as input", () => {
		const json = JSON.stringify(buildRoot(["CASA"]));
		const trie = new Trie(json);
		expect(trie.searchSigns("CAS")).toEqual(["CASA"]);
	});

	it("should use an empty root when the JSON is invalid", () => {
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		const trie = new Trie("json-invalido");
		expect(trie.searchSigns("CAS")).toEqual([]);
		expect(consoleSpy).toHaveBeenCalledOnce();
		consoleSpy.mockRestore();
	});
});
