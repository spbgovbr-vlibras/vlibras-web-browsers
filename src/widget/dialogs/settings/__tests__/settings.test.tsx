import { render, screen } from "@testing-library/preact";
import type { ComponentChildren } from "preact";
import { describe, expect, it, vi } from "vitest";
import { useTheme } from "@/common/hooks/use-theme";
import { usePlayerStore } from "@/player/stores/use-player.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { SettingsDialog } from "../index";

vi.mock("@/widget/components/ui/dialog", () => ({
	Dialog: ({
		open: _open,
		onOpenChange: _onOpenChange,
		children,
	}: {
		open: boolean;
		onOpenChange: (v: boolean) => void;
		children: ComponentChildren;
	}) => <div role="dialog">{children}</div>,
	DialogTrigger: ({
		children,
		className,
		onClick,
	}: {
		children: ComponentChildren;
		className?: string;
		onClick?: () => void;
	}) => (
		<button type="button" className={className} onClick={onClick}>
			{children}
		</button>
	),
	DialogContent: ({ children }: { children: ComponentChildren }) => <div>{children}</div>,
	DialogHeader: ({ children, closeProps }: { children: ComponentChildren; closeProps?: { "aria-label"?: string } }) => (
		<header>
			{children}
			{closeProps && (
				<button type="button" aria-label={closeProps["aria-label"]}>
					Close
				</button>
			)}
		</header>
	),
	DialogTitle: ({ children }: { children: ComponentChildren }) => <h2>{children}</h2>,
}));

vi.mock("@/widget/components/ui/button", () => ({
	buttonVariants: () => "",
	Button: ({
		children,
		onClick,
		className,
	}: {
		children: ComponentChildren;
		onClick?: () => void;
		className?: string;
	}) => (
		<button type="button" onClick={onClick} className={className}>
			{children}
		</button>
	),
}));

vi.mock("@/widget/components/ui/icon", () => ({
	Icon: ({ name }: { name: string }) => <span>{name}</span>,
}));

vi.mock("@/widget/components/ui/tooltip", () => ({
	Tooltip: ({ children, content }: { children: ComponentChildren; content?: string }) => (
		<span role="tooltip" aria-label={content}>
			{children}
		</span>
	),
}));

vi.mock("@/widget/hooks/use-translate", () => ({
	useTranslate: () => ({ mutateAsync: () => Promise.resolve("") }),
}));

vi.mock("@/widget/stores/use-callback.store", () => ({
	createCallback: () => {},
}));

vi.mock("@/widget/components/inline-translator-button", () => ({
	InlineTranslatorButton: ({ children, onFinish }: { children: ComponentChildren; onFinish: () => void }) => (
		<button type="button" onClick={onFinish}>
			{children}
		</button>
	),
}));

vi.mock("@/common/hooks", () => ({
	useMobile: () => false,
	useTheme: () => ({ theme: "light", setTheme: vi.fn(), toggleTheme: vi.fn() }),
}));

describe("SettingsDialog", () => {
	beforeEach(() => {
		usePlayerStore.setState({ region: { abbreviation: "BR", name: "Brazil", flag: "br.png" } });
		useWidgetStore.setState({ opacity: 1 });
		useTheme.setState({ theme: "light" });
	});

	it("should render settings dialog", () => {
		render(<SettingsDialog open={true} onOpenChange={() => {}} />);
		expect(screen.getByText("Configurações")).toBeInTheDocument();
	});

	it("should not render reset button when default settings", () => {
		render(<SettingsDialog open={true} onOpenChange={() => {}} />);
		expect(screen.queryByLabelText("Redefinir")).not.toBeInTheDocument();
	});

	it("should render reset button when non-default settings", () => {
		usePlayerStore.setState({ region: { abbreviation: "SP", name: "São Paulo", flag: "sp.png" } });
		render(<SettingsDialog open={true} onOpenChange={() => {}} />);
		expect(screen.getByLabelText("Redefinir")).toBeInTheDocument();
	});

	it("should render theme and regionalism fields", () => {
		render(<SettingsDialog open={true} onOpenChange={() => {}} />);
		expect(screen.getByText(/Tema escuro/i)).toBeInTheDocument();
		expect(screen.getByText(/Regionalismo/i)).toBeInTheDocument();
	});
});
