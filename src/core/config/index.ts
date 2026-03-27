import type { Environment } from "../types";

const ENV = import.meta.env.MODE || "development";

const REQUEST_TIMEOUT = 10000;

const envConfigs = {
	development: {
		TRANSLATE_URL: "https://traducao2-dth.vlibras.gov.br/translate",
		DICTIONARY_URL: "https://dicionario2-dth.vlibras.gov.br/2018.3.1/WEBGL/",
		DICTIONARY_STATIC_URL: "https://dicionario2-dth.vlibras.gov.br/static/BUNDLES/2018.3.1/WEBGL",
		SIGNS_URL: "https://dicionario2.vlibras.gov.br/static/TREES/2018.3.1.json",
		REVIEW_URL: "https://review2-dev.vlibras.gov.br",
		BUNDLES_URL: "https://dicionario2-dth.vlibras.gov.br/bundles",
	},

	dth: {
		TRANSLATE_URL: "https://traducao2-dth.vlibras.gov.br/translate",
		DICTIONARY_URL: "https://dicionario2-dth.vlibras.gov.br/2018.3.1/WEBGL",
		DICTIONARY_STATIC_URL: "https://dicionario2-dth.vlibras.gov.br/static/BUNDLES/2018.3.1/WEBGL",
		SIGNS_URL: "https://dicionario2.vlibras.gov.br/static/TREES/2018.3.1.json",
		REVIEW_URL: "https://traducao2-dth.vlibras.gov.br/dl/review",
		BUNDLES_URL: "https://dicionario2-dth.vlibras.gov.br/bundles",
	},

	production: {
		TRANSLATE_URL: "https://traducao2.vlibras.gov.br/translate",
		DICTIONARY_URL: "https://dicionario2.vlibras.gov.br/2018.3.1/WEBGL",
		DICTIONARY_STATIC_URL: "https://dicionario2.vlibras.gov.br/static/BUNDLES/2018.3.1/WEBGL",
		SIGNS_URL: "https://dicionario2.vlibras.gov.br/static/TREES/2018.3.1.json",
		REVIEW_URL: "https://traducao2.vlibras.gov.br/review",
		BUNDLES_URL: "https://dicionario2.vlibras.gov.br/bundles",
	},
};

const currentConfig = envConfigs[ENV as keyof typeof envConfigs] || envConfigs.development;

export const config = {
	mode: ENV as Environment,
	REQUEST_TIMEOUT,
	...currentConfig,
};
