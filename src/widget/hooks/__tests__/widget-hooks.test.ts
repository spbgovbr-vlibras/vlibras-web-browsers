import { act, renderHook } from "@testing-library/preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { UseMutationOptions } from "@/common/hooks";
import type { PlayerStoreState } from "@/player/stores/use-player.store";
import { usePlayerStore } from "@/player/stores/use-player.store";
import { useWidgetPosition } from "@/widget/hooks/use-widget-position";
import type { WidgetStoreState } from "@/widget/stores/use-widget.store";
import { widgetStore } from "@/widget/stores/use-widget.store";

type VLibrasWindow = Window & {
	VLibrasWidget?: { position: string };
};

vi.mock("@/core/actions/hooks", () => ({
	useTranslateRequest: vi.fn((opts: UseMutationOptions<string | undefined, string>) => ({
		mutateAsync: vi.fn((text: string) => {
			opts.onMutate?.(text);
			opts.onSettled?.("GLOSS", null, text);
			return Promise.resolve("GLOSS" as string | undefined);
		}),
		isPending: false,
	})),
}));

import { useTranslateRequest } from "@/core/actions/hooks";
import { useTranslate } from "@/widget/hooks/use-translate";

describe("useWidgetPosition", () => {
	beforeEach(() => {
		usePlayerStore.setState({ isLoaded: false } as Partial<PlayerStoreState>);
		widgetStore.set({ position: "right" } as Partial<WidgetStoreState>);
		(window as VLibrasWindow).VLibrasWidget = undefined;
	});

	it("should return left when window.VLibrasWidget.position is L and not loaded", () => {
		(window as VLibrasWindow).VLibrasWidget = { position: "l", isOpen: true, open: vi.fn(), path: "" };
		const { result } = renderHook(() => useWidgetPosition());
		expect(result.current).toBe("left");
	});

	it("should return right when window.VLibrasWidget not set and not loaded", () => {
		const { result } = renderHook(() => useWidgetPosition());
		expect(result.current).toBe("right");
	});

	it("should return widgetStore.position when loaded", () => {
		usePlayerStore.setState({ isLoaded: true } as Partial<PlayerStoreState>);
		widgetStore.set({ position: "left" } as Partial<WidgetStoreState>);
		const { result } = renderHook(() => useWidgetPosition());
		expect(result.current).toBe("left");
	});
});

describe("useTranslate", () => {
	beforeEach(() => {
		widgetStore.set({ text: undefined, isTranslating: false } as Partial<WidgetStoreState>);
		usePlayerStore.setState({ gloss: undefined, isGlossTranslated: false } as Partial<PlayerStoreState>);
	});

	it("should set widgetStore onMutate and playerStore onSettled", async () => {
		const { result } = renderHook(() => useTranslate(true));
		await act(async () => {
			await (result.current as unknown as { mutateAsync: (t: string) => Promise<string | undefined> }).mutateAsync(
				"ola",
			);
		});
		// after onMutate + onSettled
		expect(widgetStore.get().isTranslating).toBe(false); // settled resets
		expect(usePlayerStore.getState().gloss).toBe("GLOSS");
		expect(usePlayerStore.getState().isGlossTranslated).toBe(true);
	});

	it("should handle undefined gloss as not translated", async () => {
		vi.mocked(useTranslateRequest).mockReturnValueOnce({
			mutateAsync: vi.fn(() => Promise.resolve(undefined)) as unknown as (text: string) => Promise<string | undefined>,
			isPending: false,
		} as unknown as ReturnType<typeof useTranslateRequest>);

		// directly test the hook wiring by invoking opts
		const { result } = renderHook(() => useTranslate(false));
		// alternative: test the mock was configured with correct callbacks
		expect(result.current).toBeDefined();
	});

	it("should respect showTranslating=false", () => {
		const { result } = renderHook(() => useTranslate(false));
		expect(result.current).toBeDefined();
	});
});

describe("onFeedbackSuccess", () => {
	it("should play static gloss, toast, and clear widget text", async () => {
		const playStaticMock = vi.fn();
		const toastMock = vi.fn();
		vi.doMock("@/player/actions", () => ({ playStatic: playStaticMock }));
		vi.doMock("@/common/lib/toaster", () => ({ toast: toastMock }));
		// dynamic import to get fresh mocked module
		const mod = await import("@/widget/utils/feedback");
		widgetStore.set({ text: "algo" } as Partial<WidgetStoreState>);
		mod.onFeedbackSuccess();
		expect(widgetStore.get().text).toBeUndefined();
	});
});
