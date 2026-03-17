import type { Dispatch, StateUpdater } from "preact/hooks";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OnlyState } from "@/common/types";
import { omitKeys } from "@/common/utils";
import type { WidgetPosition } from "@/widget/types";
import { resolveValue } from "./utils";

export const defaultState: OnlyState<WidgetStoreState> = {
	position: "right",
	isOpenWidget: false,
	isExpanded: false,
	isLoaded: false,
	isActive: false,
};

export interface WidgetStoreState {
	position: WidgetPosition;
	isOpenWidget: boolean;
	isExpanded: boolean;
	isLoaded: boolean;
	isActive: boolean;
	setExpanded: Dispatch<StateUpdater<boolean>>;
	setOpenWidget: Dispatch<StateUpdater<boolean>>;
	setLoaded: (isLoaded: boolean) => void;
	reset: () => void;
}

export const useWidgetStore = create<WidgetStoreState>()(
	persist(
		(set) => ({
			...defaultState,
			setLoaded: (isLoaded: boolean) => set({ isLoaded }),
			setExpanded: (value) => set((state) => ({ isExpanded: resolveValue(value, state.isExpanded) })),
			setOpenWidget: (value) => set((state) => ({ isOpenWidget: resolveValue(value, state.isOpenWidget) })),
			reset: () => set(defaultState),
		}),
		{
			name: "@vlibras-widget",
			partialize: (state) => omitKeys(state, "isLoaded", "position"),
			version: 1,
		},
	),
);
