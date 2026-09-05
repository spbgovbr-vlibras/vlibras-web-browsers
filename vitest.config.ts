import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./src/test/setup.ts"],
		include: ["src/**/*.test.ts", "src/**/*.spec.ts"],
		coverage: {
			reporter: ["text", "html"],
			exclude: ["**/node_modules/**", "**/test/**", "**/*.test.ts", "**/*.spec.ts"],
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@/public": path.resolve(__dirname, "./public"),
		},
	},
});
