import { create } from "zustand";
import { omitKeys } from "@/common/utils";

type Screen = keyof Omit<ScreensStoreState, "open">;

interface ScreensStoreState {
	main?: boolean;
	settings?: boolean;
	about?: boolean;
	open: (_screen: Screen) => void;
}

const defaultState: ScreensStoreState = {
	main: true,
	settings: false,
	about: false,
	open: () => {},
};

const allClosed = { ...omitKeys(defaultState, "main", "open"), main: false };

export const useScreensStore = create<ScreensStoreState>()((set) => ({
	...defaultState,
	open: (screen) => set({ ...allClosed, [screen]: true }),
}));
