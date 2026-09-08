import { render, screen } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { WidgetControls } from "@/widget/components/controls";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

vi.mock("@/widget/components/draggable", () => ({
	useDraggable: () => ({ onPointerDown: vi.fn(), onKeyDown: vi.fn() }),
	DragHandle: () => <button type="button" />,
}));

vi.mock("@/widget/components/controls/main-action", () => ({
	MainAction: () => <button type="button">MainAction</button>,
}));

vi.mock("@/widget/components/controls/speed-option", () => ({
	SpeedOption: () => <button type="button">SpeedOption</button>,
}));

vi.mock("@/widget/components/controls/emotions-option", () => ({
	EmotionsOption: () => <button type="button">EmotionsOption</button>,
}));

vi.mock("@/widget/components/controls/subtitles-option", () => ({
	SubtitlesOptions: () => <button type="button">SubtitlesOptions</button>,
}));

vi.mock("@/widget/components/controls/settings-option", () => ({
	SettingsOption: () => <button type="button">SettingsOption</button>,
}));

vi.mock("@/widget/components/controls/progress-bar", () => ({
	ProgressBar: () => <div>ProgressBar</div>,
}));

vi.mock("@/widget/components/ui/app-overlay", () => ({
	AppOverlay: () => <div>Overlay</div>,
}));

vi.mock("@/widget/components/guide/store", () => ({
	useGuideStore: () => ({ open: false }),
}));

describe("WidgetControls", () => {
	beforeEach(() => {
		useWidgetStore.setState({ isOpen: true });
	});

	it("should render controls when open", () => {
		render(<WidgetControls />);
		expect(screen.getByText("ProgressBar")).toBeInTheDocument();
	});

	it("should hide controls when closed", () => {
		useWidgetStore.setState({ isOpen: false });
		const { container } = render(<WidgetControls />);
		expect(container.firstChild).toHaveClass("-bottom-20!");
	});
});
