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

	it("should only persist isMaxRetries, not retriesCount", () => {
		dictionaryStore.set({ retriesCount: 3, isMaxRetries: true });

		const raw = sessionStorage.getItem("@vlibras/dictionary");
		expect(raw).not.toBeNull();

		const persisted = JSON.parse(raw as string).state;
		expect(persisted).toEqual({ isMaxRetries: true });
		expect(persisted).not.toHaveProperty("retriesCount");
	});

	it("should reset retriesCount and isMaxRetries on rehydrate", async () => {
		dictionaryStore.set({ retriesCount: 5, isMaxRetries: true });

		await useDictionaryStore.persist.rehydrate();

		expect(dictionaryStore.get().retriesCount).toBe(0);
		expect(dictionaryStore.get().isMaxRetries).toBe(false);
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
