import type { Dispatch, StateUpdater } from "preact/hooks";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { OnlyState } from "@/common/types";
import { pickKeys } from "@/common/utils";
import type { WidgetPosition } from "@/widget/types";
import { resolveValue } from "./utils";

export const defaultState: OnlyState<WidgetStoreState> = {
	position: "right",
	isOpen: false,
	isExpanded: false,
	isLoaded: false,
	isActive: false,
	isTranslating: false,
};

export interface WidgetStoreState {
	position: WidgetPosition;
	isOpen: boolean;
	isExpanded: boolean;
	isLoaded: boolean;
	isActive: boolean;
	isTranslating: boolean;
	setExpanded: Dispatch<StateUpdater<boolean>>;
	setOpen: Dispatch<StateUpdater<boolean>>;
	setLoaded: (isLoaded: boolean) => void;
	reset: () => void;
}

export const useWidgetStore = create<WidgetStoreState>()(
	persist(
		(set) => ({
			...defaultState,
			setLoaded: (isLoaded: boolean) => set({ isLoaded }),
			setExpanded: (value) => set((state) => ({ isExpanded: resolveValue(value, state.isExpanded) })),
			setOpen: (value) => set((state) => ({ isOpen: resolveValue(value, state.isOpen) })),
			reset: () => set(defaultState),
		}),
		{
			name: "@vlibras-widget",
			partialize: (state) => pickKeys(state, "position", "isExpanded", "isActive", "isOpen"),
			version: 1,
		},
	),
);
