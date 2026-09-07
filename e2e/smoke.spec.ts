import { expect, test } from "@playwright/test";

test("página de demonstração carrega com o widget", async ({ page }) => {
	await page.goto("/");

	await expect(page.getByRole("heading", { name: "VLibras Widget" })).toBeVisible();
	await expect(page.locator("#vlibras-app-root")).toBeAttached();
});

test("widget abre e fecha", async ({ page }) => {
	await page.goto("/");

	await expect(page.getByRole("heading", { name: "VLibras Widget" })).toBeVisible();

	const toggleButton = page.locator('[aria-label="Fechar"]').first();
	await expect(toggleButton).toBeVisible();
	await toggleButton.click();

	// The widget panel isn't removed from the DOM when closed, it's marked inert (see
	// `inert={!isOpen}` in src/widget/app.tsx) — Playwright still considers it "visible" in that
	// state, so we assert on the actual mechanism instead of visibility.
	await expect(page.locator("#vlibras-app")).toHaveAttribute("inert", "");
});

const openDictionary = async (page: import("@playwright/test").Page) => {
	// "Dicionário" is a MenuOption inside the "Menu de opções" dropdown (src/widget/components/header/components/menu.tsx)
	// — it isn't a top-level nav item and isn't role="menuitem", so the dropdown has to be opened first.
	// MenuOption (menu-option.tsx) renders both an aria-labeled icon button and a decorative,
	// non-focusable (tabindex=-1) text button with the same onClick, so two elements match this
	// name — .first() picks the real interactive one.
	await page.getByRole("button", { name: "Menu de opções" }).click();
	await page.getByRole("button", { name: "Dicionário" }).first().click();
};

test("pode navegar para o dicionário", async ({ page }) => {
	await page.goto("/");

	await expect(page.getByRole("heading", { name: "VLibras Widget" })).toBeVisible();

	await openDictionary(page);
	await expect(page.getByRole("heading", { name: "Dicionário" })).toBeVisible();
});

// NOTE: this test depends on live network access to the real VLibras dictionary API
// (config.DICTIONARY_CATEGORIES_URL, called from src/widget/screens/dictionary/actions/index.ts).
// It isn't wired into .gitlab-ci.yml yet — if it ever is, that endpoint will need to be mocked
// with page.route(), since sandboxed/offline runners can't reach it (CORS-blocked from a
// localhost origin) and the search will always come back with zero results.
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
