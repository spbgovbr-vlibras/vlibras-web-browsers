import { fireEvent, render, screen } from "@testing-library/preact";
import type { ComponentChildren, ComponentProps } from "preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DictionarySearch } from "../dictionary-search";

const { mockUseDictionaryCtx } = vi.hoisted(() => ({
	mockUseDictionaryCtx: vi.fn(),
}));

vi.mock("../dictionary-context", () => ({
	useDictionaryCtx: mockUseDictionaryCtx,
	DictionaryProvider: ({ children }: { children: ComponentChildren }) => children,
}));

vi.mock("@/widget/components/ui/button", () => ({
	Button: ({ children, ...props }: ComponentProps<"button">) => <button {...props}>{children}</button>,
}));

vi.mock("@/widget/components/ui/icon", () => ({
	Icon: ({ name }: { name: string }) => <span>{name}</span>,
}));

describe("DictionarySearch", () => {
	beforeEach(() => {
		mockUseDictionaryCtx.mockReset();
	});

	it("should render the search input", () => {
		mockUseDictionaryCtx.mockReturnValue({
			search: "",
			searchRef: { current: null },
			handleSearchChange: vi.fn(),
			handleClearSearch: vi.fn(),
		});

		render(<DictionarySearch />);
		expect(screen.getByPlaceholderText("Pesquisar (ex: AJUDAR)...")).toBeInTheDocument();
	});

	it("should call handleSearchChange on input", () => {
		const handleSearchChange = vi.fn();
		mockUseDictionaryCtx.mockReturnValue({
			search: "",
			searchRef: { current: null },
			handleSearchChange,
			handleClearSearch: vi.fn(),
		});

		render(<DictionarySearch />);
		const input = screen.getByPlaceholderText("Pesquisar (ex: AJUDAR)...") as HTMLInputElement;
		fireEvent.input(input, { target: { value: "AJU" } });
		expect(handleSearchChange).toHaveBeenCalledWith("AJU");
	});

	it("should render clear button when search is not empty", () => {
		mockUseDictionaryCtx.mockReturnValue({
			search: "AJU",
			searchRef: { current: null },
			handleSearchChange: vi.fn(),
			handleClearSearch: vi.fn(),
		});

		render(<DictionarySearch />);
		expect(screen.getByLabelText("Limpar busca")).toBeInTheDocument();
	});

	it("should not render clear button when search is empty", () => {
		mockUseDictionaryCtx.mockReturnValue({
			search: "",
			searchRef: { current: null },
			handleSearchChange: vi.fn(),
			handleClearSearch: vi.fn(),
		});

		render(<DictionarySearch />);
		expect(screen.queryByLabelText("Limpar busca")).not.toBeInTheDocument();
	});
});
