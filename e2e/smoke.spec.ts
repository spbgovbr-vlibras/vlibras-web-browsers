import { expect, test } from "@playwright/test";

const onMenuOptionClick = async (page: import("@playwright/test").Page, optionName: string) => {
	await page.getByRole("button", { name: "Menu de opções" }).click();
	await page.getByRole("menuitem", { name: optionName }).first().click();
};

test("demo page loads with the widget", async ({ page }) => {
	await page.goto("/");

	await expect(page.getByRole("heading", { name: "VLibras Widget" })).toBeVisible();
	await expect(page.locator("#vlibras-app-root")).toBeAttached();
});

test("widget opens and closes", async ({ page }) => {
	await page.goto("/");

	await expect(page.getByRole("heading", { name: "VLibras Widget" })).toBeVisible();

	const toggleButton = page.locator('[aria-label="Fechar"]').first();
	await expect(toggleButton).toBeVisible();
	await toggleButton.click();

	await expect(page.locator("#vlibras-app")).toHaveAttribute("inert", "");
});

test("can navigate to the dictionary and back", async ({ page }) => {
	await page.goto("/");

	await expect(page.getByRole("heading", { name: "VLibras Widget" })).toBeVisible();

	await onMenuOptionClick(page, "Dicionário");
	await expect(page.getByRole("heading", { name: "Dicionário" })).toBeVisible();
	const closeButton = page.getByRole("button", { name: "Voltar" });
	await expect(closeButton).toBeVisible();
	await closeButton.click();
});

test("can navigate to the about screen and back", async ({ page }) => {
	await page.goto("/");

	await expect(page.getByRole("heading", { name: "VLibras Widget" })).toBeVisible();

	await onMenuOptionClick(page, "Sobre");
	await expect(page.getByRole("heading", { name: "Sobre" })).toBeVisible();
	const closeButton = page.getByRole("button", { name: "Voltar" });
	await expect(closeButton).toBeVisible();
	await closeButton.click();
});

test("can open/close the translator component", async ({ page }) => {
	await page.goto("/");

	await expect(page.getByRole("heading", { name: "VLibras Widget" })).toBeVisible();

	await onMenuOptionClick(page, "Tradutor");
	await expect(page.getByRole("heading", { name: "Tradutor" })).toBeVisible();
	const closeButton = page.getByRole("button", { name: "Fechar tradutor" });
	await expect(closeButton).toBeVisible();
	await closeButton.click();
});

// @TODO: Criar estrutura de mocks
// test("pode buscar uma palavra no dicionário", async ({ page }) => {
// 	await page.goto("/");

// 	await expect(page.getByRole("heading", { name: "VLibras Widget" })).toBeVisible();

// 	await openDictionary(page);

// 	const searchInput = page.getByPlaceholder("Pesquisar");
// 	await expect(searchInput).toBeVisible();
// 	await searchInput.fill("AJUDAR");

// 	const results = page.locator("text=AJUDAR");
// 	await expect(results.first()).toBeVisible();
// });
