import { fireEvent, render, screen } from "@testing-library/preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useConsentStore } from "@/widget/stores/use-consent.store";
import { ConsentBanner } from "..";

vi.mock("@/common/lib/posthog", () => ({
	isTrackingAvailable: true,
}));

vi.mock("@/widget/components/inline-translator-button", () => ({
	InlineTranslatorButton: () => null,
}));

describe("ConsentBanner", () => {
	beforeEach(() => {
		useConsentStore.setState({ status: "pending" });
	});

	it("describes what Escape does for screen reader users", () => {
		render(<ConsentBanner />);

		const dialog = screen.getByRole("dialog", { name: "Consentimento de coleta de dados" });
		const description = screen.getByText(/pressionar Esc equivale a não aceitar/i);

		expect(dialog).toHaveAttribute("aria-describedby", description.id);
	});

	it("declines consent when Escape is pressed", () => {
		render(<ConsentBanner />);

		fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

		expect(useConsentStore.getState().status).toBe("declined");
	});
});
