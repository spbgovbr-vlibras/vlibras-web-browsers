import { useTranslateRequest } from "@/core/actions/hooks";
import { playerStore } from "@/player/stores/use-player.store";
import { widgetStore } from "@/widget/stores/use-widget.store";

export const useTranslate = () => {
	return useTranslateRequest({
		onMutate: (text) => {
			widgetStore.set({ text, isTranslating: true });
		},
		onSettled: (gloss) => {
			playerStore.set({ gloss, isGlossTranslated: !!gloss });
			widgetStore.set({ isTranslating: false });
		},
	});
};
