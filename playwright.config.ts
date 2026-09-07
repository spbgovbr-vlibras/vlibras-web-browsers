import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	retries: process.env.CI ? 2 : 0,
	use: {
		baseURL: "http://localhost:3003",
		trace: "on-first-retry",
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
	webServer: {
		command: "pnpm dev",
		url: "http://localhost:3003",
		reuseExistingServer: !process.env.CI,
		timeout: 120000,
	},
});
