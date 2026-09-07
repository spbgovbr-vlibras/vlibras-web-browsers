import { act, renderHook } from "@testing-library/preact";
import { beforeEach, describe, expect, it } from "vitest";
import { mobileQueryStore } from "@/common/hooks/use-mobile";
import { useMobileQuerySync } from "@/widget/providers/sync/use-mobile-query-sync";
import { defaultState, useWidgetStore } from "@/widget/stores/use-widget.store";

describe("useMobileQuerySync", () => {
	beforeEach(() => {
		useWidgetStore.setState(defaultState);
		mobileQueryStore.set({ isExpanded: false });
	});

	it("should sync isExpanded true into the mobile query store", () => {
		useWidgetStore.setState({ isExpanded: true });

		renderHook(() => useMobileQuerySync());

		expect(mobileQueryStore.get().isExpanded).toBe(true);
	});

	it("should sync isExpanded false into the mobile query store", () => {
		mobileQueryStore.set({ isExpanded: true });
		useWidgetStore.setState({ isExpanded: false });

		renderHook(() => useMobileQuerySync());

		expect(mobileQueryStore.get().isExpanded).toBe(false);
	});

	it("should update the mobile query store when isExpanded changes after mount", () => {
		useWidgetStore.setState({ isExpanded: false });
		renderHook(() => useMobileQuerySync());
		expect(mobileQueryStore.get().isExpanded).toBe(false);

		act(() => {
			useWidgetStore.setState({ isExpanded: true });
		});
		expect(mobileQueryStore.get().isExpanded).toBe(true);
	});
});
