import path from "node:path";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import pkg from "./package.json" with { type: "json" };
import { type AppMode, minifyCode } from "./vite.config.utils.ts";

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
