import { minify } from "vite";

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
	version: string;
};

export const minifyCode = async ({ mode, content, version }: MinifyCodeOptions) => {
	let code = content;

	const isExtension = mode === "extension";
	const isProd = mode === "production";
	const appRoot = appRoots[mode];

	if (appRoot) code = code.replace("__APP_ROOT__", appRoot);
	code = code.replace("__APP_VERSION__", version);

	code = code.replace(/`([\s\S]*?)`/g, (_, p1) => {
		return `\`${p1
			.replace(/\r?\n/g, "")
			.replace(/\s{2,}/g, " ")
			.replaceAll("	", "")
			.replaceAll(" />", "/>")
			.trim()}\``;
	});

	if (isProd || isExtension) {
		const minified = await minify("index.js", code, { compress: true, mangle: true });
		code = minified.code;
	}

	return code;
};

type VersionUnityManifestOptions = {
	content: string;
	version: string;
};

export const versionUnityManifest = ({ content, version }: VersionUnityManifestOptions) => {
	return content.replace(
		/("(?:dataUrl|wasmCodeUrl|wasmFrameworkUrl)"\s*:\s*")([^"]+)(")/g,
		(_, pre, url, post) => `${pre}${url}?v=${version}${post}`,
	);
};
