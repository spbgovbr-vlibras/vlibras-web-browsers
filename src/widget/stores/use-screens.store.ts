import { create } from "zustand";

type Screen = "main" | "settings" | "about";

interface ScreensStoreState {
	screen: Screen;
	openScreen: (_screen: Screen) => void;
	closeAllScreens: () => void;
}

export const useScreensStore = create<ScreensStoreState>()((set) => ({
	screen: "main",
	openScreen: (screen) => set({ screen }),
	closeAllScreens: () => set({ screen: "main" }),
}));
