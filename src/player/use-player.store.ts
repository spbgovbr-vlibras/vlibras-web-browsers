import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { OnlyState } from "@/common/types";
import { pickKeys } from "@/common/utils";
import type { UNITY_METHODS, UNITY_OBJECTS } from "./constants/unity";
import type { PlayerAvatar, PlayerConfig, PlayerStatus } from "./types";

export interface PlayerStoreState {
	config: PlayerConfig;
	instance?: UnityInstance;
	status: PlayerStatus;
	avatar: PlayerAvatar;
	gloss?: string;
	text?: string;
	speed: number;
	progress: number;
	isLoaded: boolean;
	isPlayingWelcome: boolean;
	showSubtitles: boolean;
	region?: string;
	opacity: Number;
	send: (object: UNITY_OBJECTS, method: UNITY_METHODS, params?: unknown) => void;
	reset: () => void;
}

const defaults: OnlyState<PlayerStoreState> = {
	config: { baseUrl: "", personalizationUrl: "" },
	showSubtitles: false,
	avatar: "icaro",
	status: "idle",
	gloss: undefined,
	text: undefined,
	instance: undefined,
	speed: 1,
	progress: 0,
	isPlayingWelcome: false,
	isLoaded: false,
	opacity: 100,
};

export const usePlayerStore = create<PlayerStoreState>()(
	persist(
		(set) => ({
			...defaults,
			send: () => {},
			reset: () => set((state) => ({ ...defaults, avatar: state.avatar })),
		}),
		{
			name: "@vlibras/player",
			version: 1,
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => pickKeys(state, "speed", "showSubtitles", "avatar", "config"),
		},
	),
);
