import type { TrieRoot } from "@/common/lib/trie";
import { config } from "@/core/config";
import type { RequestResponse } from "@/core/types";
import { ERROR_MESSAGES } from "./messages";

const timeout = () => {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), config.REQUEST_TIMEOUT);
	return { controller, timeoutId };
};

type TranslateOutput = RequestResponse & { gloss?: string };

export const translate = async (text: string): Promise<TranslateOutput> => {
	const { controller, timeoutId } = timeout();

	try {
		const response = await fetch(config.TRANSLATE_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ text }),
			signal: controller.signal,
		});

		if (!response.ok) throw new Error(`Erro na API: ${response.status}`);

		const gloss = (await response.text()) as string;
		return { gloss, success: true };
	} catch (err) {
		console.error("Falha na tradução: ", err);

		const error = err as Error;
		if (error.name === "AbortError") {
			return {
				success: false,
				error: ERROR_MESSAGES.TRANSLATION_TIMEOUT_ERROR,
				code: "TRANSLATION_TIMEOUT_ERROR",
			};
		}

		return {
			success: false,
			error: ERROR_MESSAGES.TRANSLATION_ERROR,
			code: "TRANSLATION_ERROR",
		};
	} finally {
		clearTimeout(timeoutId);
	}
};

type SignsOutput = RequestResponse & { data?: TrieRoot };

export const getSigns = async (): Promise<SignsOutput> => {
	const { controller, timeoutId } = timeout();

	try {
		const response = await fetch(config.SIGNS_URL, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
			signal: controller.signal,
		});

		if (!response.ok) throw new Error(`Erro na API: ${response.status}`);

		const data = (await response.json()) as TrieRoot;
		return { data, success: true };
	} catch (err) {
		console.error("Falha na tradução: ", err);

		const error = err as Error;
		if (error.name === "AbortError") {
			return {
				success: false,
				error: ERROR_MESSAGES.SIGNS_TIMEOUT_ERROR,
				code: "SIGNS_TIMEOUT_ERROR",
			};
		}

		return {
			success: false,
			error: ERROR_MESSAGES.SIGNS_ERROR,
			code: "SIGNS_ERROR",
		};
	} finally {
		clearTimeout(timeoutId);
	}
};

type SendReviewInput = {
	text: string;
	translation: string;
	review: string;
	rating: "good" | "bad";
};

export const sendReview = async (input: SendReviewInput): Promise<RequestResponse> => {
	const { controller, timeoutId } = timeout();

	try {
		const response = await fetch(config.REVIEW_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(input),
			signal: controller.signal,
		});

		if (!response.ok) throw new Error(`Erro na API: ${response.status}`);

		return { success: true };
	} catch (err) {
		console.error("Falha no envio do feedback: ", err);

		const error = err as Error;
		if (error.name === "AbortError") {
			return {
				success: false,
				error: ERROR_MESSAGES.SEND_REVIEW_TIMEOUT_ERROR,
				code: "SEND_REVIEW_TIMEOUT_ERROR",
			};
		}

		return {
			success: false,
			error: ERROR_MESSAGES.SEND_REVIEW_ERROR,
			code: "SEND_REVIEW_ERROR",
		};
	} finally {
		clearTimeout(timeoutId);
	}
};
