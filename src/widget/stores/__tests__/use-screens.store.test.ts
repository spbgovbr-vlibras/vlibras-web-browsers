import { act } from "@testing-library/preact";
import { beforeEach, describe, expect, it } from "vitest";
import { useScreensStore } from "@/widget/stores/use-screens.store";

describe("useScreensStore", () => {
	beforeEach(() => {
		useScreensStore.setState({ screen: "main" });
	});

	it("should start with screen 'main'", () => {
		const state = useScreensStore.getState();
		expect(state.screen).toBe("main");
	});

	it("should open a specific screen", () => {
		act(() => {
			useScreensStore.getState().open("dictionary");
		});

		expect(useScreensStore.getState().screen).toBe("dictionary");
	});

	it("should close all screens back to 'main'", () => {
		useScreensStore.getState().open("about");
		expect(useScreensStore.getState().screen).toBe("about");

		act(() => {
			useScreensStore.getState().closeAll();
		});

		expect(useScreensStore.getState().screen).toBe("main");
	});
});
