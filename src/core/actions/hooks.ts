import {
	type UseMutationOptions,
	type UseMutationResult,
	type UseQueryOptions,
	type UseQueryResult,
	useMutation,
	useQuery,
} from "@tanstack/preact-query";
import type { TrieRoot } from "@/common/lib/trie";
import { getSigns, type SendFeedbackProps, sendFeedback, translate } from ".";
import { ERROR_MESSAGES } from "./messages";

export const useDictionarySigns = (opts?: UseQueryOptions<TrieRoot, Error>): UseQueryResult<TrieRoot, Error> => {
	return useQuery({
		...opts,
		queryKey: ["dictionary_signs"],
		queryFn: async () => {
			const result = await getSigns();

			if (result.error) throw new Error(result.error);
			if (!result.data) throw new Error(ERROR_MESSAGES.SIGNS_EMPTY_ERROR);

			return result.data;
		},
	});
};

export const useSendFeedback = (
	opts?: UseMutationOptions<boolean, Error, SendFeedbackProps>,
): UseMutationResult<boolean, Error, SendFeedbackProps> => {
	return useMutation({
		...opts,
		mutationFn: async (input: SendFeedbackProps) => {
			const result = await sendFeedback(input);

			if (result.error) throw new Error(result.error);

			return true;
		},
	});
};

export const useTranslateRequest = (
	opts?: UseMutationOptions<string, Error, string>,
): UseMutationResult<string, Error, string> => {
	return useMutation({
		...opts,
		mutationFn: async (text: string) => {
			const result = await translate(text);

			if (result.error) console.error(result.error);
			if (!result.data) console.error(ERROR_MESSAGES.TRANSLATION_EMPTY_ERROR);

			return result.data || text;
		},
	});
};
