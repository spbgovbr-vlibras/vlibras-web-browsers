import type { ComponentChildren } from "preact";
import { create } from "zustand";
import type { OnlyState } from "@/common/types";

interface CallbackStoreState {
	action?: () => void;
	content?: ComponentChildren;
	auto?: boolean;
}

const defaultState: OnlyState<CallbackStoreState> = {
	content: undefined,
	action: undefined,
	auto: false,
};

export const useCallbackStore = create<CallbackStoreState>()(() => ({
	...defaultState,
}));

export const resetCallback = () => useCallbackStore.setState(defaultState);
export const createCallback = (state: CallbackStoreState) => {
	setTimeout(() => useCallbackStore.setState(state), 300);
};

export const callbackStore = {
	get: useCallbackStore.getState,
	set: useCallbackStore.setState,
};
