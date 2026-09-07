import { expect, test } from "@playwright/test";

test("página de demonstração carrega com o widget", async ({ page }) => {
	await page.goto("/");

	await expect(page.getByRole("heading", { name: "VLibras Widget" })).toBeVisible();
	await expect(page.locator("#vlibras-app-root")).toBeAttached();
});
