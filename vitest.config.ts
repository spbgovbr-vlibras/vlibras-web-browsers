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
				// zustand importa o react real; inline aplica o alias react -> preact/compat.
				// (não incluir "preact" aqui: duplicaria a instância e quebraria os hooks)
				inline: ["zustand"],
			},
		},
		include: ["src/**/*.test.{ts,tsx}", "src/**/*.spec.{ts,tsx}"],
		coverage: {
			provider: "v8",
			all: true,
			include: ["src/**/*.{ts,tsx}"],
			reporter: ["text", "lcov", "html"],
			thresholds: {
				statements: 21,
				branches: 13,
				functions: 20,
				lines: 22,
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
