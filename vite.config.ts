import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import pkg from "./package.json";

export default defineConfig({
	server: {
		port: 3003,
		hmr: true,
	},
	build: {
		lib: {
			entry: "src/main.tsx",
			name: "vlibras-plugin",
			fileName: "vlibras-plugin-app",
		},
	},
	plugins: [
		preact(),
		tailwindcss(),
		viteStaticCopy({
			targets: [
				{
					src: "src/scripts/vlibras-plugin.js",
					dest: "scripts",
				},
			],
		}),
	],
	define: {
		"process.env": {},
		__APP_NAME__: JSON.stringify(pkg.name),
		__APP_VERSION__: JSON.stringify(pkg.version),
	},
});
