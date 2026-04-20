import type { ComponentChildren } from "preact";
import { create } from "zustand";
import type { OnlyState } from "@/common/types";

interface callbackStoreState {
	action?: () => void;
	content?: ComponentChildren;
}

const defaultState: OnlyState<callbackStoreState> = {
	content: undefined,
	action: undefined,
};

export const useCallbackButtonStore = create<callbackStoreState>()(() => ({
	...defaultState,
}));

export const resetCallback = () => useCallbackButtonStore.setState(defaultState);
export const createCallback = useCallbackButtonStore.setState;
