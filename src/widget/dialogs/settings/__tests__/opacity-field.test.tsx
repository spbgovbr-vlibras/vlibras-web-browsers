import { act, fireEvent, render, screen } from "@testing-library/preact";
import type { ComponentChildren } from "preact";
import { describe, expect, it, vi } from "vitest";
import { posthogg } from "@/common/lib/posthog";
import { useWidgetStore, widgetStore } from "@/widget/stores/use-widget.store";
import { SettingsProvider } from "../context";
import { SettingsOpacityField } from "../opacity-field";

vi.mock("@/widget/components/inline-translator-button", () => ({
	InlineTranslatorButton: ({ children, onFinish }: { children: ComponentChildren; onFinish: () => void }) => (
		<button type="button" onClick={onFinish}>
			{children}
		</button>
	),
}));

describe("SettingsOpacityField", () => {
	beforeEach(() => {
		useWidgetStore.setState({ opacity: 0.5 });
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should render opacity value", () => {
		render(
			<SettingsProvider data={{ onOpen: () => {}, onClose: () => {} }}>
				<SettingsOpacityField />
			</SettingsProvider>,
		);
		expect(screen.getByText("50%")).toBeInTheDocument();
	});

	it("should call widgetStore.set when slider changes", () => {
		const widgetSet = vi.fn();
		const originalSet = widgetStore.set;
		widgetStore.set = widgetSet;

		render(
			<SettingsProvider data={{ onOpen: () => {}, onClose: () => {} }}>
				<SettingsOpacityField />
			</SettingsProvider>,
		);
		const slider = screen.getByRole("slider") as HTMLInputElement;
		fireEvent.change(slider, { target: { value: "75" } });
		expect(widgetSet).toHaveBeenCalledWith({ opacity: 0.75 });

		widgetStore.set = originalSet;
	});

	it("should schedule tracking event on change", () => {
		const trackEvent = vi.fn();
		const originalTrackEvent = posthogg.trackEvent;
		posthogg.trackEvent = trackEvent;

		render(
			<SettingsProvider data={{ onOpen: () => {}, onClose: () => {} }}>
				<SettingsOpacityField />
			</SettingsProvider>,
		);
		const slider = screen.getByRole("slider") as HTMLInputElement;
		fireEvent.change(slider, { target: { value: "80" } });

		expect(trackEvent).not.toHaveBeenCalled();
		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(trackEvent).toHaveBeenCalledWith("opacity_change", { opacity: 80 });

		posthogg.trackEvent = originalTrackEvent;
	});
});
