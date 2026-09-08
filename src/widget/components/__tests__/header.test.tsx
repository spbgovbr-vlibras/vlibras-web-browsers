import { fireEvent, render, screen } from "@testing-library/preact";
import type { ComponentChildren } from "preact";
import { describe, expect, it, vi } from "vitest";
import { WidgetHeader } from "@/widget/components/header";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

vi.mock("@/widget/components/header/components/expand-option", () => ({
	ExpandOption: () => (
		<button type="button" aria-label="Expand">
			Expand
		</button>
	),
}));

vi.mock("@/widget/components/header/components/menu", () => ({
	WidgetMenu: () => <nav>Menu</nav>,
}));

vi.mock("@/widget/components/ui/icon", () => ({
	Icon: ({ name }: { name: string }) => <span>{name}</span>,
}));

vi.mock("@/widget/components/ui/button", () => ({
	Button: ({
		children,
		onClick,
		className,
		"aria-label": ariaLabel,
	}: {
		children: ComponentChildren;
		onClick?: () => void;
		className?: string;
		"aria-label"?: string;
	}) => (
		<button type="button" onClick={onClick} className={className} aria-label={ariaLabel}>
			{children}
		</button>
	),
}));

vi.mock("@/widget/components/ui/spacer", () => ({
	Spacer: ({ className }: { className: string }) => <div className={className} />,
}));

vi.mock("@/widget/components/draggable", () => ({
	useDraggable: () => ({ onPointerDown: vi.fn(), onKeyDown: vi.fn() }),
	DragHandle: () => <button type="button" />,
}));

vi.mock("@/common/hooks", () => ({
	useMobile: () => false,
}));

vi.mock("@/widget/components/ui/app-overlay", () => ({
	AppOverlay: () => <div>Overlay</div>,
}));

vi.mock("@/widget/components/guide/store", () => ({
	useGuideStore: () => ({ open: false }),
}));

describe("WidgetHeader", () => {
	beforeEach(() => {
		useWidgetStore.setState({ setOpen: vi.fn(), isExpanded: false });
	});

	it("should render the header", () => {
		render(<WidgetHeader />);
		expect(screen.getByText("VLibras")).toBeInTheDocument();
	});

	it("should render expand and close buttons", () => {
		render(<WidgetHeader />);
		expect(screen.getByLabelText("Expand")).toBeInTheDocument();
		expect(screen.getByLabelText("Fechar")).toBeInTheDocument();
	});

	it("should call setOpen(false) when close is clicked", () => {
		const setOpen = vi.fn();
		useWidgetStore.setState({ setOpen, isExpanded: false });
		render(<WidgetHeader />);
		fireEvent.click(screen.getByLabelText("Fechar"));
		expect(setOpen).toHaveBeenCalledWith(false);
	});
});
