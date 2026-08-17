import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { brotliCompress, gzip } from "node:zlib";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import type { Plugin } from "vite";
import { defineConfig } from "vite";
import { compression } from "vite-plugin-compression2";
import { viteStaticCopy } from "vite-plugin-static-copy";
import pkg from "./package.json" with { type: "json" };
import { type AppMode, minifyCode } from "./vite.config.utils.ts";

const gzipAsync = promisify(gzip);
const brotliAsync = promisify(brotliCompress);

function compressStaticLoader(): Plugin {
	const filePath = path.resolve(import.meta.dirname, "app/vlibras-plugin.js");

	return {
		name: "compress-static-loader",
		apply: "build",
		async closeBundle() {
			if (!existsSync(filePath)) return;

			const content = await readFile(filePath);
			await Promise.all([
				writeFile(`${filePath}.gz`, await gzipAsync(content)),
				writeFile(`${filePath}.br`, await brotliAsync(content)),
			]);
		},
	};
}

export default defineConfig(({ mode }) => {
	return {
		server: {
			port: 3003,
			hmr: true,
			open: true,
		},
		build: {
			outDir: "app",
			minify: "oxc",
			lib: {
				entry: "src/main.tsx",
				name: "vlibras-plugin",
				fileName: "vlibras-plugin-app",
				formats: ["es"],
			},
			rollupOptions: {
				output: {
					minify: {
						compress: true,
						mangle: true,
					},
					codeSplitting: {
						groups: [
							{
								name: "vlibras-initial",
								tags: ["$initial"],
							},
						],
					},
					chunkFileNames: (chunkInfo) => {
						if (chunkInfo.name === "index" && chunkInfo.facadeModuleId) {
							const dir = path.basename(path.dirname(chunkInfo.facadeModuleId));
							return `${dir}-[hash].js`;
						}

						return "[name]-[hash].js";
					},
				},
			},
		},
		resolve: {
			alias: {
				"@/public": path.resolve(import.meta.dirname, "./public"),
				"@": path.resolve(import.meta.dirname, "./src"),
			},
		},
		plugins: [
			preact(),
			tailwindcss(),
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
						rename: { stripBase: true },
					},
					{
						src: "src/loader/index.js",
						rename: { stripBase: true, name: "vlibras-plugin.js" },
						dest: ".",
						transform: async (content) => minifyCode({ mode: mode as AppMode, content, version: pkg.version }),
					},
				],
			}),
			compression({
				algorithms: ["gzip", "brotliCompress"],
				include: /\.(js|css|html|svg)$/,
				threshold: 1024,
			}),
			compressStaticLoader(),
		],
		define: {
			"process.env": {},
			__IS_EXTENSION__: mode === "extension",
			__VLIBRAS_APP_NAME__: JSON.stringify(pkg.name),
			__VLIBRAS_APP_VERSION__: JSON.stringify(pkg.version),
		},
	};
});
