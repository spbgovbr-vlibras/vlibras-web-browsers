import {
	type UseMutationOptions,
	type UseMutationResult,
	type UseQueryResult,
	useMutation,
	useQuery,
} from "@/common/hooks";
import type { TrieRoot } from "@/common/lib/trie";
import { getSigns, type SendFeedbackProps, sendFeedback, translate } from ".";
import { ERROR_MESSAGES } from "./messages";

export const useDictionarySigns = (): UseQueryResult<TrieRoot> => {
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

export const useSendFeedback = (): UseMutationResult<boolean, SendFeedbackProps> => {
	return useMutation({
		mutationFn: async (input: SendFeedbackProps) => {
			const result = await sendFeedback(input);

			if (result.error) throw new Error(result.error);

			return true;
		},
	});
};

export const useTranslateRequest = (
	opts?: Pick<UseMutationOptions<string | undefined, string>, "onMutate" | "onSettled">,
): UseMutationResult<string | undefined, string> => {
	return useMutation({
		...opts,
		mutationFn: async (text: string) => {
			const result = await translate(text);

			if (result.code === "TRANSLATION_SUPERSEDED_ERROR") return undefined;

			if (result.error) console.error(result.error);
			if (!result.data) console.error(ERROR_MESSAGES.TRANSLATION_EMPTY_ERROR);

			return result.data;
		},
	});
};
