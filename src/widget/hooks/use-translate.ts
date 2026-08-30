import { useTranslateRequest } from "@/core/actions/hooks";
import { playerStore } from "@/player/stores/use-player.store";
import { widgetStore } from "@/widget/stores/use-widget.store";

export const useTranslate = (showTranslating = true) => {
	return useTranslateRequest({
		onMutate: (text) => {
			widgetStore.set({ text, isTranslating: showTranslating });
		},
		onSettled: (gloss) => {
			playerStore.set({ gloss, isGlossTranslated: !!gloss });
			widgetStore.set({ isTranslating: false });
		},
	});
};
