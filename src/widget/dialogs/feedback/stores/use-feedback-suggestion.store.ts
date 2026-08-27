import { create } from "zustand";
import type { OnlyState } from "@/common/types";

interface FeedbackSuggestionStoreState {
	reopen: boolean;
	draftValue?: string;
}

const defaultState: OnlyState<FeedbackSuggestionStoreState> = {
	reopen: false,
	draftValue: undefined,
};

export const useFeedbackSuggestionStore = create<FeedbackSuggestionStoreState>()(() => ({
	...defaultState,
}));

export const feedbackSuggestionStore = {
	get: useFeedbackSuggestionStore.getState,
	set: useFeedbackSuggestionStore.setState,
};
