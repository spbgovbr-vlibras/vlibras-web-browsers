import type { TrieRoot } from "@/common/lib/trie";
import { config } from "@/core/config";
import type { RequestResponse } from "@/core/types";
import { ERROR_MESSAGES } from "./messages";

const timeout = () => {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), config.REQUEST_TIMEOUT);
	return { controller, timeoutId };
};

let latestTranslateRequestId = 0;
let abortActiveTranslate: (() => void) | null = null;

export const translate = async (text: string): Promise<RequestResponse<string>> => {
	abortActiveTranslate?.();

	const requestId = ++latestTranslateRequestId;
	const { controller, timeoutId } = timeout();
	abortActiveTranslate = () => controller.abort();

	try {
		const response = await fetch(config.TRANSLATE_URL, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ text }),
			signal: controller.signal,
		});

		if (!response.ok) throw new Error(`Erro na API: ${response.status}`);

		const data = await response.text();

		if (requestId !== latestTranslateRequestId) {
			return {
				success: false,
				error: ERROR_MESSAGES.TRANSLATION_SUPERSEDED_ERROR,
				code: "TRANSLATION_SUPERSEDED_ERROR",
			};
		}

		return { data, success: true };
	} catch (err) {
		const error = err as Error;

		if (error.name === "AbortError" && requestId !== latestTranslateRequestId) {
			return {
				success: false,
				error: ERROR_MESSAGES.TRANSLATION_SUPERSEDED_ERROR,
				code: "TRANSLATION_SUPERSEDED_ERROR",
			};
		}

		if (config.DEV) console.error("Falha na tradução: ", err);

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

export const getSigns = async (): Promise<RequestResponse<TrieRoot>> => {
	const { controller, timeoutId } = timeout();

	try {
		const response = await fetch(config.SIGNS_URL, {
			method: "GET",
			signal: controller.signal,
		});

		if (!response.ok) throw new Error(`Erro na API: ${response.status}`);

		const data = (await response.json()) as TrieRoot;
		return { data, success: true };
	} catch (err) {
		if (config.DEV) console.error("Falha na tradução: ", err);

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

export type SendFeedbackProps = {
	text: string;
	translation: string;
	review: string;
	rating: "good" | "bad";
};

export const sendFeedback = async (input: SendFeedbackProps): Promise<RequestResponse<void>> => {
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
		if (config.DEV) console.error("Falha no envio do feedback: ", err);

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
