import path from "node:path";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import pkg from "./package.json";
import { minifyCode } from "./vite.config.utils";

export default defineConfig(({ mode }) => {
	return {
		server: {
			port: 3003,
			hmr: true,
			open: true,
		},
		build: {
			outDir: "app",
			lib: {
				entry: "src/main.tsx",
				name: "vlibras-plugin",
				fileName: "vlibras-plugin-app",
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
						transform: async (content) => minifyCode({ mode, content }),
					},
				],
			}),
		],
		define: {
			"process.env": {},
			__VLIBRAS_APP_NAME__: JSON.stringify(pkg.name),
			__VLIBRAS_APP_VERSION__: JSON.stringify(pkg.version),
		},
	};
});
