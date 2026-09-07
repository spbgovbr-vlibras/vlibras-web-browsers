import { render, screen } from "@testing-library/preact";
import type { ComponentProps } from "preact";
import { describe, expect, it } from "vitest";
import { useTheme } from "@/common/hooks/use-theme";
import { SettingsProvider } from "../context";
import { SettingsThemeField } from "../theme-field";

vi.mock("@/widget/components/inline-translator-button", () => ({
	InlineTranslatorButton: ({
		children,
		onFinish,
		...props
	}: {
		children: ComponentProps<"button">;
		onFinish: () => void;
	}) => (
		<button {...props} onClick={onFinish}>
			{children}
		</button>
	),
}));

vi.mock("@/common/lib/posthog", () => ({
	posthogg: { trackEvent: () => {} },
}));

describe("SettingsThemeField", () => {
	beforeEach(() => {
		useTheme.setState({ theme: "light" });
	});

	it("should render dark theme toggle", () => {
		render(
			<SettingsProvider data={{ onOpen: () => {}, onClose: () => {} }}>
				<SettingsThemeField />
			</SettingsProvider>,
		);
		expect(screen.getByText(/Tema escuro/i)).toBeInTheDocument();
	});

	it("should render checkbox for theme toggle", () => {
		render(
			<SettingsProvider data={{ onOpen: () => {}, onClose: () => {} }}>
				<SettingsThemeField />
			</SettingsProvider>,
		);
		const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
		expect(checkbox).toBeInTheDocument();
		expect(checkbox.checked).toBe(false);
	});
});
