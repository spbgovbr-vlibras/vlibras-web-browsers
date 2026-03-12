import { create } from "zustand";
import type { OnlyState } from "@/common/types";
import type { UNITY_METHODS, UNITY_OBJECTS } from "./constants/unity";
import type { PlayerAvatar, PlayerStatus } from "./types";

export interface PlayerStoreState {
	instance?: UnityInstance;
	status: PlayerStatus;
	avatar: PlayerAvatar;
	gloss?: string;
	text?: string;
	speed: number;
	progress: number;
	isLoaded: boolean;
	send: (object: UNITY_OBJECTS, method: UNITY_METHODS, params?: unknown) => void;
	reset: () => void;
}

const defaults: OnlyState<PlayerStoreState> = {
	isLoaded: false,
	avatar: "icaro",
	status: "idle",
	gloss: undefined,
	text: undefined,
	speed: 1,
	progress: 0,
};

export const usePlayerStore = create<PlayerStoreState>((set) => ({
	...defaults,
	send: () => {},
	reset: () => set((state) => ({ ...defaults, avatar: state.avatar })),
}));
