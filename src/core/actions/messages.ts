export const ERROR_MESSAGES = {
	TRANSLATION_ERROR: "Erro ao traduzir o texto.",
	TRANSLATION_EMPTY_ERROR: "Nenhum dado recebido do servidor.",
	TRANSLATION_TIMEOUT_ERROR: "A tradução demorou muito e foi cancelada.",

	SEND_REVIEW_ERROR: "Não foi possível enviar seu feedback.",
	SEND_REVIEW_TIMEOUT_ERROR: "O envio do feedback demorou muito e foi cancelado.",

	SIGNS_ERROR: "Erro ao buscar os sinais.",
	SIGNS_EMPTY_ERROR: "Nenhum dado recebido do servidor.",
	SIGNS_TIMEOUT_ERROR: "A busca dos sinais demorou muito e foi cancelada.",

	UNKNOWN_ERROR: "Erro desconhecido.",
};

export const ERROR_CODES = Object.keys(ERROR_MESSAGES) as (keyof typeof ERROR_MESSAGES)[];

export type ErrorCode = (typeof ERROR_CODES)[number];
