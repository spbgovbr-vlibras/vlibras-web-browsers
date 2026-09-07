import { beforeEach, describe, expect, it } from "vitest";
import { dictionaryStore, useDictionaryStore } from "@/widget/screens/dictionary/stores/use-dictionary.store";
import {
	dictionaryHistoryStore,
	useDictionaryHistoryStore,
} from "@/widget/screens/dictionary/stores/use-dictionary-history.store";

describe("useDictionaryStore", () => {
	beforeEach(() => {
		sessionStorage.clear();
		useDictionaryStore.setState({ isMaxRetries: false, retriesCount: 0 });
	});

	it("should start without a retry limit", () => {
		expect(dictionaryStore.get().isMaxRetries).toBe(false);
		expect(dictionaryStore.get().retriesCount).toBe(0);
	});

	it("should record retries and the limit", () => {
		dictionaryStore.set({ retriesCount: 3, isMaxRetries: true });

		expect(dictionaryStore.get().retriesCount).toBe(3);
		expect(dictionaryStore.get().isMaxRetries).toBe(true);
	});
});

describe("useDictionaryHistoryStore", () => {
	beforeEach(() => {
		localStorage.clear();
		useDictionaryHistoryStore.setState({ signs: [""] });
	});

	it("should start with the default history", () => {
		expect(dictionaryHistoryStore.get().signs).toEqual([""]);
	});

	it("should store the searched signs", () => {
		dictionaryHistoryStore.set({ signs: ["CASA", "CARRO"] });

		expect(dictionaryHistoryStore.get().signs).toEqual(["CASA", "CARRO"]);
	});
});
