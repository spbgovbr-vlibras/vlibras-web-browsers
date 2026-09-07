import { render, screen } from "@testing-library/preact";
import "@testing-library/jest-dom/vitest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Screen, ScreenClose, ScreenTitle } from "@/widget/screens/components";
import { screenStore } from "@/widget/stores/use-screens.store";

function mockMatchMedia(matches: boolean) {
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		value: vi.fn().mockReturnValue({
			matches,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		}),
	});
}

describe("Screen", () => {
	it("should render the content", () => {
		render(
			<Screen>
				<span>content</span>
			</Screen>,
		);

		expect(screen.getByText("content")).toBeInTheDocument();
	});

	it("should render the title", () => {
		render(<ScreenTitle>Dictionary</ScreenTitle>);

		expect(screen.getByRole("heading", { name: "Dictionary" })).toBeInTheDocument();
	});
});

describe("ScreenClose (navigation between screens)", () => {
	beforeEach(() => {
		mockMatchMedia(false);
		screenStore.set({ screen: "dictionary" });
	});

	it("should go back to the main screen when close is clicked", async () => {
		const { container } = render(<ScreenClose />);

		const button = container.querySelector("button") as HTMLElement;
		button.click();

		expect(screenStore.get().screen).toBe("main");
	});

	it("should use a compact button on mobile", () => {
		mockMatchMedia(true);
		const { container } = render(<ScreenClose />);

		const button = container.querySelector("button") as HTMLElement;
		expect(button.className).toContain("size-8");
	});
});
