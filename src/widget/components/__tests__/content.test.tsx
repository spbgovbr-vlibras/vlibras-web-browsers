import { render, screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { usePlayerStore } from "@/player/stores/use-player.store";
import { WidgetContent } from "@/widget/components/content";
import { rootStore } from "@/widget/stores/use-root.store";
import { useScreensStore } from "@/widget/stores/use-screens.store";

vi.mock("@/widget/components/header", () => ({
	WidgetHeader: () => <header>Header</header>,
}));

vi.mock("@/widget/components/controls", () => ({
	WidgetControls: () => <div>Controls</div>,
}));

vi.mock("@/widget/components/utilities", () => ({
	Utilities: () => <div>Utilities</div>,
}));

vi.mock("@/widget/components/consent-banner", () => ({
	ConsentBanner: () => <div>Consent</div>,
}));

vi.mock("@/player", () => ({
	Player: () => <div>Player</div>,
}));

vi.mock("@/widget/components/content/player-options", () => ({
	playerOptions: {},
}));

vi.mock("@/widget/components/draggable", () => ({
	useDraggable: () => ({ onPointerDown: vi.fn() }),
}));

describe("WidgetContent", () => {
	beforeEach(() => {
		useScreensStore.setState({ screen: "main" });
		usePlayerStore.setState({ isLoaded: true, isMounted: true });
		rootStore.set({});
	});

	it("should render all main sections", () => {
		render(<WidgetContent />);
		expect(screen.getByText("Header")).toBeInTheDocument();
		expect(screen.getByText("Player")).toBeInTheDocument();
		expect(screen.getByText("Controls")).toBeInTheDocument();
	});

	it("should have opacity-0 when not loaded", () => {
		usePlayerStore.setState({ isLoaded: false, isMounted: true });
		const { container } = render(<WidgetContent />);
		const div = container.querySelector('[id="vlibras-app-content"]') as HTMLElement;
		expect(div.className).toContain("opacity-0");
	});

	it("should have opacity-0 when screen is not main", () => {
		useScreensStore.setState({ screen: "dictionary" });
		const { container } = render(<WidgetContent />);
		const div = container.querySelector('[id="vlibras-app-content"]') as HTMLElement;
		expect(div.className).toContain("opacity-0");
	});

	it("should not render Player when not mounted", () => {
		usePlayerStore.setState({ isMounted: false });
		render(<WidgetContent />);
		expect(screen.queryByText("Player")).not.toBeInTheDocument();
	});
});
