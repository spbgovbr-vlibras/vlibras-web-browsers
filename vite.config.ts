import path from "node:path";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, transformWithEsbuild } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import pkg from "./package.json";
import { type AppMode, minifyCode } from "./vite.config.utils";

const forceMinifyOutput = () => ({
	name: "force-minify-lib-output",
	async generateBundle(_options: unknown, bundle: Record<string, { type: string; code?: string; fileName: string }>) {
		for (const file of Object.values(bundle)) {
			if (file.type !== "chunk" || !file.code) continue;

			const result = await transformWithEsbuild(file.code, file.fileName, {
				minify: true,
				minifyWhitespace: true,
				minifyIdentifiers: true,
				minifySyntax: true,
				loader: "js",
			});

			file.code = result.code;
		}
	},
});

export default defineConfig(({ mode }) => {
	return {
		server: {
			port: 3003,
			hmr: true,
			open: true,
		},
		build: {
			outDir: "app",
			minify: "esbuild",
			lib: {
				entry: "src/main.tsx",
				name: "vlibras-plugin",
				fileName: "vlibras-plugin-app",
				formats: ["es"],
			},
			rollupOptions: {
				output: {
					compact: true,
				},
			},
		},
		resolve: {
			alias: {
				"@/public": path.resolve(__dirname, "./public"),
				"@": path.resolve(__dirname, "./src"),
			},
		},
		plugins: [
			preact(),
			tailwindcss(),
			forceMinifyOutput(),
			visualizer({
				filename: "stats.html",
				brotliSize: true,
				gzipSize: true,
			}),
			viteStaticCopy({
				targets: [
					{
						src: "demo/index.html",
						dest: ".",
					},
					{
						src: "src/loader/index.js",
						rename: "vlibras-plugin.js",
						dest: ".",
						transform: async (content) => minifyCode({ mode: mode as AppMode, content }),
					},
				],
			}),
		],
		define: {
			"process.env": {},
			__IS_EXTENSION__: mode === "extension",
			__VLIBRAS_APP_NAME__: JSON.stringify(pkg.name),
			__VLIBRAS_APP_VERSION__: JSON.stringify(pkg.version),
		},
	};
});
