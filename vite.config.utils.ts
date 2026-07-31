import { transformWithEsbuild } from "vite";

const appRoots = {
	development: "http://localhost:3003",
	homolog: "https://vlibras.gov.br/app2",
	production: "https://vlibras.gov.br/app",
	extension: null, // Definido em use-config.ts
};

export type AppMode = keyof typeof appRoots;

type MinifyCodeOptions = {
	mode: AppMode;
	content: string;
};

export const minifyCode = async ({ mode, content }: MinifyCodeOptions) => {
	let code = content;

	const isExtension = mode === "extension";
	const isProd = mode === "production";
	const appRoot = appRoots[mode];

	if (appRoot) code = code.replace("__APP_ROOT__", appRoot);

	code = code.replace(/`([\s\S]*?)`/g, (_, p1) => {
		return `\`${p1
			.replace(/\r?\n/g, "")
			.replace(/\s{2,}/g, " ")
			.replaceAll("	", "")
			.replaceAll(" />", "/>")
			.trim()}\``;
	});

	if (isProd || isExtension) {
		const minified = await transformWithEsbuild(code, "index.js", {
			minify: true,
			minifyWhitespace: true,
			loader: "js",
		});

		code = minified.code;
	}

	return code;
};
