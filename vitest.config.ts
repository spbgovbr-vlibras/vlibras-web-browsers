import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	define: {
		__IS_EXTENSION__: false,
		__VLIBRAS_APP_VERSION__: JSON.stringify("0.0.0-test"),
	},
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./src/test/setup.ts"],
		server: {
			deps: {
				inline: ["zustand"],
			},
		},
		include: ["src/**/*.test.{ts,tsx}", "src/**/*.spec.{ts,tsx}"],
		pool: "vmThreads",
		coverage: {
			provider: "v8",
			include: ["src/**/*.{ts,tsx}"],
			reporter: ["text", "lcov", "html", "json-summary"],
			thresholds: {
				statements: 28,
				branches: 20,
				functions: 28,
				lines: 30,
			},
			exclude: [
				"**/node_modules/**",
				"**/test/**",
				"src/test/**",
				"src/@types/**",
				"**/*.d.ts",
				"**/*.test.{ts,tsx}",
				"**/*.spec.{ts,tsx}",
			],
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@/public": path.resolve(__dirname, "./public"),
			react: "preact/compat",
			"react-dom": "preact/compat",
		},
	},
});
