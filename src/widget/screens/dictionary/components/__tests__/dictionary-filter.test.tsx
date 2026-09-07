import { fireEvent, render, screen } from "@testing-library/preact";
import type { ComponentChildren } from "preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DictionaryFilter } from "../dictionary-filter";

const { mockUseDictionaryCtx } = vi.hoisted(() => ({
	mockUseDictionaryCtx: vi.fn(),
}));

vi.mock("../stores/use-dictionary-history.store", () => ({
	useDictionaryHistoryStore: {
		getState: () => ({ signs: [] }),
		subscribe: () => {},
		setState: () => {},
	},
}));

vi.mock("../dictionary-context", () => ({
	useDictionaryCtx: mockUseDictionaryCtx,
	DictionaryProvider: ({ children }: { children: ComponentChildren }) => children,
}));

vi.mock("@/widget/components/ui/button", () => ({
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

vi.mock("@/common/hooks", () => ({
	useMobile: () => false,
	usePick: (...keys: string[]) => keys,
}));

vi.mock("@/common/lib/utils", () => ({
	cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

describe("DictionaryFilter", () => {
	beforeEach(() => {
		mockUseDictionaryCtx.mockReset();
	});

	it("should render all filter options", () => {
		mockUseDictionaryCtx.mockReturnValue({
			filter: "all",
			setFilter: vi.fn(),
			handleHistoryClear: vi.fn(),
		});

		render(<DictionaryFilter />);
		expect(screen.getByText("Categorias")).toBeInTheDocument();
		expect(screen.getByText("A-Z")).toBeInTheDocument();
		expect(screen.getByText("Recentes")).toBeInTheDocument();
	});

	it("should call setFilter when a filter option is clicked", () => {
		const setFilter = vi.fn();
		mockUseDictionaryCtx.mockReturnValue({
			filter: "all",
			setFilter,
			handleHistoryClear: vi.fn(),
		});

		render(<DictionaryFilter />);
		fireEvent.click(screen.getByText("Categorias"));
		expect(setFilter).toHaveBeenCalledWith("categories");
	});

	it("should not render recents button when history is empty", () => {
		mockUseDictionaryCtx.mockReturnValue({
			filter: "all",
			setFilter: vi.fn(),
			handleHistoryClear: vi.fn(),
		});

		render(<DictionaryFilter />);
		expect(screen.queryByLabelText("Limpar histórico")).not.toBeInTheDocument();
	});
});
