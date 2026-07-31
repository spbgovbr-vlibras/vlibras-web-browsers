import type { UseMutationResult } from "@/common/hooks";
import { useTranslateRequest } from "@/core/actions/hooks";
import { playerStore } from "@/player/use-player.store";
import { widgetStore } from "@/widget/stores/use-widget.store";

export const useTranslate = (): UseMutationResult<string, string> => {
	return useTranslateRequest({
		onMutate: (text) => {
			widgetStore.set({ text, isTranslating: true });
		},
		onSettled: () => {
			playerStore.set({ gloss: undefined });
			widgetStore.set({ isTranslating: false });
		},
	});
};
