const ENV = import.meta.env.MODE || "development";

const REQUEST_TIMEOUT = 10000;

const envConfigs = {
	development: {
		TRANSLATE_URL: "https://traducao2-dev.vlibras.gov.br",
		DICTIONARY_URL: "https://dicionario2-dev.vlibras.gov.br",
		REVIEW_URL: "https://review2-dev.vlibras.gov.br",
		SIGNS_URL: "https://dicionario2.vlibras.gov.br/static/TREES/2018.3.1.json",
	},

	dth: {
		TRANSLATE_URL: "https://traducao2-dth.vlibras.gov.br",
		DICTIONARY_URL: "https://dicionario2.vlibras.gov.br",
		REVIEW_URL: "https://review2.vlibras.gov.br",
		SIGNS_URL: "https://dicionario2.vlibras.gov.br/static/TREES/2018.3.1.json",
	},

	production: {
		TRANSLATE_URL: "https://traducao2.vlibras.gov.br",
		DICTIONARY_URL: "https://dicionario2.vlibras.gov.br",
		REVIEW_URL: "https://review2.vlibras.gov.br",
		SIGNS_URL: "https://dicionario2.vlibras.gov.br/static/TREES/2018.3.1.json",
	},
};

const currentConfig = envConfigs[ENV as keyof typeof envConfigs] || envConfigs.development;

export const config = {
	REQUEST_TIMEOUT,
	...currentConfig,
};
