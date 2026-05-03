import { transformWithEsbuild } from "vite";

const appRoots = {
	development: "http://localhost:3003",
	homolog: "https://portal-dth.vlibras.lavid.ufpb.br/app/",
	production: "https://vlibras.com/app/v7",
};

type MinifyCodeOptions = {
	mode: string;
	content: string;
};

export const minifyCode = async ({ mode, content }: MinifyCodeOptions) => {
	const isProd = mode === "production";
	const appRoot = appRoots?.[mode as keyof typeof appRoots] || appRoots.production;
	let code = content;

	if (appRoot) code = code.replace("__APP_ROOT__", appRoot);

	code = code.replace(/`([\s\S]*?)`/g, (_, p1) => {
		return `\`${p1
			.replace(/\r?\n/g, "")
			.replace(/\s{2,}/g, " ")
			.replaceAll("	", "")
			.replaceAll(" />", "/>")
			.trim()}\``;
	});

	if (isProd) {
		const minified = await transformWithEsbuild(code, "index.js", {
			minify: true,
			minifyWhitespace: true,
			loader: "js",
		});

		code = minified.code;
	}

	return code;
};
