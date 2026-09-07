import { render, screen } from "@testing-library/preact";
import type { ComponentChildren, ComponentProps } from "preact";
import { describe, expect, it, vi } from "vitest";
import { usePlayerStore } from "@/player/stores/use-player.store";
import { SettingsProvider } from "../context";
import { SettingsRegionalismField } from "../regionalism-field";

vi.mock("@/widget/components/inline-translator-button", () => ({
	InlineTranslatorButton: ({ onFinish, ...props }: ComponentProps<"button"> & { onFinish: () => void }) => (
		<button {...props} onClick={onFinish} />
	),
}));

vi.mock("@/common/lib/posthog", () => ({
	posthogg: { trackEvent: () => {} },
}));

vi.mock("@/widget/components/ui/dialog", () => ({
	Dialog: ({ children }: { children: ComponentChildren }) => <div>{children}</div>,
	DialogTrigger: (props: ComponentProps<"button">) => <button {...props} />,
	DialogContent: ({ children }: { children: ComponentChildren }) => <div>{children}</div>,
	DialogHeader: ({ children }: { children: ComponentChildren }) => <header>{children}</header>,
	DialogTitle: ({ children }: { children: ComponentChildren }) => <h2>{children}</h2>,
}));

vi.mock("@/widget/components/ui/button", () => ({
	buttonVariants: () => "",
	Button: (props: ComponentProps<"button">) => <button {...props} />,
}));

vi.mock("@/widget/components/ui/icon", () => ({
	Icon: ({ name }: { name: string }) => <span>{name}</span>,
}));

vi.mock("@/widget/components/ui/dropdown", () => ({
	Dropdown: ({ children }: { children: ComponentChildren }) => <div>{children}</div>,
	DropdownTrigger: ({ children }: { children: ComponentChildren }) => children,
	DropdownContent: ({ children }: { children: ComponentChildren }) => <div>{children}</div>,
}));

vi.mock("@/widget/components/ui/tooltip", () => ({
	Tooltip: ({ children }: { children: ComponentChildren }) => <span>{children}</span>,
}));

describe("SettingsRegionalismField", () => {
	beforeEach(() => {
		usePlayerStore.setState({ region: { abbreviation: "BR", name: "Brazil", flag: "br.png" } });
	});

	it("should render current region abbreviation", () => {
		render(
			<SettingsProvider data={{ onOpen: () => {}, onClose: () => {} }}>
				<SettingsRegionalismField />
			</SettingsProvider>,
		);
		expect(screen.getByText("BR")).toBeInTheDocument();
	});
});
