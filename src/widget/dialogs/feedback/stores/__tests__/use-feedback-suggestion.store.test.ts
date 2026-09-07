import { describe, expect, it } from "vitest";
import { feedbackSuggestionStore, useFeedbackSuggestionStore } from "../use-feedback-suggestion.store";

describe("useFeedbackSuggestionStore", () => {
	it("should default to reopen false and no draft value", () => {
		expect(feedbackSuggestionStore.get()).toMatchObject({ reopen: false, draftValue: undefined });
	});

	it("should merge partial updates for both reopen and draftValue", () => {
		feedbackSuggestionStore.set({ reopen: true, draftValue: "OI TUDO BEM" });

		expect(useFeedbackSuggestionStore.getState()).toMatchObject({
			reopen: true,
			draftValue: "OI TUDO BEM",
		});
	});
});
