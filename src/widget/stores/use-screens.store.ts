import { create } from "zustand";

export type Screen = "main" | "about" | "dictionary";

interface ScreensStoreState {
	screen: Screen;
	callbackScreen?: Screen;
	open: (_screen: Screen) => void;
	closeAll: () => void;
}

export const useScreensStore = create<ScreensStoreState>()((set) => ({
	screen: "main",
	open: (screen) => set({ screen }),
	closeAll: () => set({ screen: "main", callbackScreen: undefined }),
}));

export const screenStore = {
	get: useScreensStore.getState,
	set: useScreensStore.setState,
	subscribe: useScreensStore.subscribe,
};
