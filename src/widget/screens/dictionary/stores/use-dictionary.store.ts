import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { pick } from "@/common/utils";

export const useDictionaryStore = create<{ isMaxRetries: boolean; retriesCount: number }>()(
	persist((_) => ({ isMaxRetries: false, retriesCount: 0 }), {
		name: "@vlibras/dictionary",
		version: 1,
		storage: createJSONStorage(() => sessionStorage),
		partialize: (state) => pick(state, "isMaxRetries"),
		onRehydrateStorage: () => (state) => {
			if (state) {
				state.retriesCount = 0;
				state.isMaxRetries = false;
			}
		},
	}),
);

export const dictionaryStore = {
	get: useDictionaryStore.getState,
	set: useDictionaryStore.setState,
	subscribe: useDictionaryStore.subscribe,
};
