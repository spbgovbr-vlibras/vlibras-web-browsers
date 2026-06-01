import { create } from "zustand";
import type { PlayerOptions } from "../types";

export const usePlayerOptionsStore = create<PlayerOptions>(() => ({}));

export const playerOptionsStore = {
	get: usePlayerOptionsStore.getState,
	set: usePlayerOptionsStore.setState,
	subscribe: usePlayerOptionsStore.subscribe,
};
