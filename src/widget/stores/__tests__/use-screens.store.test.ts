import { act } from "@testing-library/preact";
import { beforeEach, describe, expect, it } from "vitest";
import { useScreensStore } from "@/widget/stores/use-screens.store";

describe("useScreensStore", () => {
	beforeEach(() => {
		useScreensStore.setState({ screen: "main" });
	});

	it("deve ter screen inicial como 'main'", () => {
		const state = useScreensStore.getState();
		expect(state.screen).toBe("main");
	});

	it("deve abrir uma tela específica", () => {
		act(() => {
			useScreensStore.getState().open("dictionary");
		});

		expect(useScreensStore.getState().screen).toBe("dictionary");
	});

	it("deve fechar todas as telas voltando para 'main'", () => {
		useScreensStore.getState().open("about");
		expect(useScreensStore.getState().screen).toBe("about");

		act(() => {
			useScreensStore.getState().closeAll();
		});

		expect(useScreensStore.getState().screen).toBe("main");
	});
});
