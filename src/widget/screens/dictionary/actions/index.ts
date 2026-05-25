import { ERROR_MESSAGES } from "@/core/actions/messages";
import { config } from "@/core/config";

const timeout = () => {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), config.REQUEST_TIMEOUT);
	return { controller, timeoutId };
};

export const getCategories = async () => {
	const { controller, timeoutId } = timeout();

	try {
		const response = await fetch(`${config.DICTIONARY_CATEGORIES_URL}/tags`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
			signal: controller.signal,
		});

		if (!response.ok) throw new Error(`Erro na API: ${response.status}`);

		const data = await response.json();
		return { data, success: true };
	} catch (err) {
		console.error("Falha na busca pelas categorias: ", err);
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

export const getCategorySigns = async (category: string) => {
	const { controller, timeoutId } = timeout();

	try {
		const response = await fetch(`${config.DICTIONARY_CATEGORIES_URL}/tagsigns?tag=${category}`, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
			signal: controller.signal,
		});

		const data = await response.json();

		return { data, success: true };
	} catch (err) {
		console.error("Falha na busca pelos sinais da categoria: ", err);
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
