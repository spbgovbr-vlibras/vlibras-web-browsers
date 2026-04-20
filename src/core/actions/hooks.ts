import { type UseMutationResult, type UseQueryResult, useMutation, useQuery } from "@tanstack/preact-query";
import type { TrieRoot } from "@/common/lib/trie";
import { playerStore } from "@/player/use-player.store";
import { widgetStore } from "@/widget/stores/use-widget.store";
import { getSigns, type SendFeedbackProps, sendFeedback, translate } from ".";
import { ERROR_MESSAGES } from "./messages";

export const useDictionarySigns = (): UseQueryResult<TrieRoot, Error> => {
	return useQuery({
		queryKey: ["dictionary_signs"],
		queryFn: async () => {
			const result = await getSigns();

			if (result.error) throw new Error(result.error);
			if (!result.data) throw new Error(ERROR_MESSAGES.SIGNS_EMPTY_ERROR);

			return result.data;
		},
	});
};

export const useSendFeedback = (): UseMutationResult<boolean, Error, SendFeedbackProps> => {
	return useMutation({
		mutationFn: async (input: SendFeedbackProps) => {
			const result = await sendFeedback(input);

			if (result.error) throw new Error(result.error);

			return true;
		},
	});
};

export const useTranslate = (): UseMutationResult<string, Error, string> => {
	return useMutation({
		mutationFn: async (text: string) => {
			try {
				widgetStore.set({ text, isTranslating: true });

				const result = await translate(text);

				if (result.error) throw new Error(result.error);
				if (!result.data) throw new Error(ERROR_MESSAGES.TRANSLATION_EMPTY_ERROR);

				return result.data;
			} finally {
				playerStore.set({ gloss: undefined });
				widgetStore.set({ isTranslating: false });
			}
		},
	});
};
