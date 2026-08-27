import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { OnlyState } from "@/common/types";
import { pick } from "@/common/utils";
import { type Emotion, emotionsMap } from "@/data/emotions";
import { type Region, regions } from "@/data/regionalism";
import type { UNITY_METHODS, UNITY_OBJECTS } from "../constants/unity";
import type { CountGloss, PlayerAvatar, PlayerConfig, PlayerStatus } from "../types";

export interface PlayerStoreState {
	config: PlayerConfig;
	instance?: UnityInstance;
	status: PlayerStatus;
	avatar: PlayerAvatar;
	gloss?: string;
	isGlossTranslated?: boolean;
	speed: number;
	progress: number;
	isLoaded: boolean;
	isMounted: boolean;
	isPlayingWelcome: boolean;
	isWelcomeFinished: boolean;
	showSubtitles: boolean;
	countGloss: CountGloss;
	region: Region;
	emotion: Emotion;
	isBroken: boolean;
	send: (object: UNITY_OBJECTS, method: UNITY_METHODS, params?: unknown) => void;
	retryLoad: () => void;
	reset: () => void;
}

const defaults: OnlyState<PlayerStoreState> = {
	countGloss: { count: 0, max: 0 },
	config: { baseUrl: "", personalizationUrl: "" },
	avatar: "icaro",
	status: "idle",
	speed: 1,
	progress: 0,
	gloss: undefined,
	instance: undefined,
	isBroken: false,
	showSubtitles: true,
	isPlayingWelcome: true,
	isWelcomeFinished: false,
	isLoaded: false,
	isMounted: true,
	region: regions[0],
	emotion: emotionsMap.default,
};

export const usePlayerStore = create<PlayerStoreState>()(
	persist(
		(set) => ({
			...defaults,
			send: () => {},
			retryLoad: () => {},
			reset: () => set((state) => ({ ...defaults, avatar: state.avatar })),
		}),
		{
			name: "@vlibras/player",
			version: 1,
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => pick(state, "speed", "showSubtitles", "avatar", "config"),
		},
	),
);

export const playerStore = {
	get: usePlayerStore.getState,
	set: usePlayerStore.setState,
	subscribe: usePlayerStore.subscribe,
};
