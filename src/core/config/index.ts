import type { Environment } from "@/core/types";
import type { EnvConfig } from "./types";

const REQUEST_TIMEOUT = 10000;

// URLS do dicionário devem terminar com barra (/)

const envConfigs: Record<Environment, EnvConfig> = {
	development: {
		TRANSLATE_URL: "https://traducao2-dth.vlibras.gov.br/translate",
		DICTIONARY_URL: "https://dicionario2-dth.vlibras.gov.br/2018.3.1/WEBGL/",
		DICTIONARY_STATIC_URL: "https://dicionario2-dth.vlibras.gov.br/static/BUNDLES/2018.3.1/WEBGL/",
		DICTIONARY_CATEGORIES_URL: "https://repositorio-dth.vlibras.lavid.ufpb.br/api",
		SIGNS_URL: "https://dicionario2-dth.vlibras.gov.br/signs?version=2018.3.1",
		REVIEW_URL: "https://traducao2-dth.vlibras.gov.br/review",
		BUNDLES_URL: "https://dicionario2-dth.vlibras.gov.br/bundles",
	},

	homolog: {
		TRANSLATE_URL: "https://traducao2-dth.vlibras.gov.br/translate",
		DICTIONARY_URL: "https://dicionario2-dth.vlibras.gov.br/2018.3.1/WEBGL/",
		DICTIONARY_STATIC_URL: "https://dicionario2-dth.vlibras.gov.br/static/BUNDLES/2018.3.1/WEBGL/",
		DICTIONARY_CATEGORIES_URL: "https://repositorio-dth.vlibras.lavid.ufpb.br/api",
		SIGNS_URL: "https://dicionario2-dth.vlibras.gov.br/signs?version=2018.3.1",
		REVIEW_URL: "https://traducao2-dth.vlibras.gov.br/review",
		BUNDLES_URL: "https://dicionario2-dth.vlibras.gov.br/bundles",
	},

	production: {
		TRANSLATE_URL: "https://traducao2.vlibras.gov.br/translate",
		DICTIONARY_URL: "https://dicionario2.vlibras.gov.br/2018.3.1/WEBGL/",
		DICTIONARY_STATIC_URL: "https://dicionario2.vlibras.gov.br/static/BUNDLES/2018.3.1/WEBGL/",
		DICTIONARY_CATEGORIES_URL: "https://repositorio-dth.vlibras.lavid.ufpb.br/api",
		SIGNS_URL: "https://dicionario2.vlibras.gov.br/static/TREES/2018.3.1.json",
		REVIEW_URL: "https://traducao2.vlibras.gov.br/review",
		BUNDLES_URL: "https://dicionario2.vlibras.gov.br/bundles",
	},
};

const MODE = (import.meta.env.MODE || "development") as Environment;
const currentConfig = envConfigs[MODE as keyof typeof envConfigs] || envConfigs.development;

export const config = {
	...import.meta.env,
	...currentConfig,
	REQUEST_TIMEOUT,
	MODE,
};
