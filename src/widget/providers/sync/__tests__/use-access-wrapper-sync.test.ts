import { act, renderHook } from "@testing-library/preact";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useAccessWrapperSync } from "@/widget/providers/sync/use-access-wrapper-sync";
import { defaultState, useWidgetStore } from "@/widget/stores/use-widget.store";

function createAccessWrapper() {
	const host = document.createElement("div");
	host.id = "vlibras-access-wrapper";
	document.body.appendChild(host);

	const shadowRoot = host.attachShadow({ mode: "open" });
	const wrapper = document.createElement("div");
	wrapper.id = "vlibras-access";
	shadowRoot.appendChild(wrapper);

	return wrapper;
}

describe("useAccessWrapperSync", () => {
	beforeEach(() => {
		useWidgetStore.setState(defaultState);
	});

	afterEach(() => {
		document.body.innerHTML = "";
	});

	it("should set display none when the widget is open", () => {
		const wrapper = createAccessWrapper();
		useWidgetStore.setState({ isOpen: true });

		renderHook(() => useAccessWrapperSync());

		expect(wrapper.style.display).toBe("none");
	});

	it("should set display flex when the widget is closed", () => {
		const wrapper = createAccessWrapper();
		useWidgetStore.setState({ isOpen: false });

		renderHook(() => useAccessWrapperSync());

		expect(wrapper.style.display).toBe("flex");
	});

	it("should update display when isOpen changes after mount", () => {
		const wrapper = createAccessWrapper();
		useWidgetStore.setState({ isOpen: false });

		renderHook(() => useAccessWrapperSync());
		expect(wrapper.style.display).toBe("flex");

		act(() => {
			useWidgetStore.setState({ isOpen: true });
		});
		expect(wrapper.style.display).toBe("none");
	});

	it("should not throw when the access wrapper is not present in the DOM", () => {
		renderHook(() => useAccessWrapperSync());
		expect(() => {
			act(() => {
				useWidgetStore.setState({ isOpen: true });
			});
		}).not.toThrow();
	});
});
