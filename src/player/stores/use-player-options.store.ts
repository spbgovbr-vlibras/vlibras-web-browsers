import { create } from "zustand";
import type { PlayerOptions } from "../types";

interface PlayerOptionsStore extends PlayerOptions {
	isInitialized: boolean;
}

export const usePlayerOptionsStore = create<PlayerOptionsStore>(() => ({
	isInitialized: false,
}));

export const playerOptionsStore = {
	get: usePlayerOptionsStore.getState,
	set: usePlayerOptionsStore.setState,
	subscribe: usePlayerOptionsStore.subscribe,
};
