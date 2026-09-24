import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useDictionaryHistoryStore = create<{ signs: string[] }>()(
	persist(() => ({ signs: [""] }), {
		name: "@vlibras/dictionary-history",
		version: 1,
		partialize: (state) => state,
	}),
);

export const dictionaryHistoryStore = {
	get: useDictionaryHistoryStore.getState,
	set: useDictionaryHistoryStore.setState,
	subscribe: useDictionaryHistoryStore.subscribe,
};
