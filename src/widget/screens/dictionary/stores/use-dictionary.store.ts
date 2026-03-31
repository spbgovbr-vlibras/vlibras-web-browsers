import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { pickKeys } from "@/common/utils";

export const useDictionaryStore = create<{ isMaxRetries: boolean; retriesCount: number }>()(
	persist((_) => ({ isMaxRetries: false, retriesCount: 0 }), {
		name: "@vlibras/dictionary",
		version: 1,
		storage: createJSONStorage(() => sessionStorage),
		partialize: (state) => pickKeys(state, "isMaxRetries"),
		onRehydrateStorage: () => (state) => {
			if (state) {
				state.retriesCount = 0;
				state.isMaxRetries = false;
			}
		},
	}),
);
