import { create } from "zustand";

type Screen = "main" | "settings" | "about" | "dictionary";

interface ScreensStoreState {
	screen: Screen;
	open: (_screen: Screen) => void;
	closeAll: () => void;
}

export const useScreensStore = create<ScreensStoreState>()((set) => ({
	screen: "main",
	open: (screen) => set({ screen }),
	closeAll: () => set({ screen: "main" }),
}));
