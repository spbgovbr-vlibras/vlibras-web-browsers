import { fireEvent, render, screen } from "@testing-library/preact";
import type { ComponentChildren } from "preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DictionaryCategories } from "../dictionary-categories";

const { mockUseDictionaryCtx } = vi.hoisted(() => ({
	mockUseDictionaryCtx: vi.fn(),
}));

vi.mock("../dictionary-context", () => ({
	useDictionaryCtx: mockUseDictionaryCtx,
	DictionaryProvider: ({ children }: { children: ComponentChildren }) => children,
}));

vi.mock("@/widget/components/ui/icon", () => ({
	Icon: ({ name }: { name: string }) => <span>{name}</span>,
}));

vi.mock("@/common/lib/utils", () => ({
	cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

vi.mock("../dictionary-loading", () => ({
	DictionaryLoading: () => <div data-testid="spinner" />,
}));

describe("DictionaryCategories", () => {
	beforeEach(() => {
		mockUseDictionaryCtx.mockReset();
	});

	it("should render loading state when categories are loading", () => {
		mockUseDictionaryCtx.mockReturnValue({
			categories: [],
			isLoadingCategories: true,
			search: "",
			setSelectedCategory: vi.fn(),
			listRef: { current: null },
			setFilter: vi.fn(),
		});

		render(<DictionaryCategories />);
		expect(screen.getByTestId("spinner")).toBeInTheDocument();
	});

	it("should render no connection message when categories are empty", () => {
		mockUseDictionaryCtx.mockReturnValue({
			categories: [],
			isLoadingCategories: false,
			search: "",
			setSelectedCategory: vi.fn(),
			listRef: { current: null },
			setFilter: vi.fn(),
		});

		render(<DictionaryCategories />);
		expect(screen.getByText(/Sem conexão com a internet/i)).toBeInTheDocument();
	});

	it("should render no results message when filter returns empty", () => {
		const categories = [{ id: 1, name: "Test", active: true, description: null, url: undefined }];
		mockUseDictionaryCtx.mockReturnValue({
			categories,
			isLoadingCategories: false,
			search: "xyzxyzxyz",
			setSelectedCategory: vi.fn(),
			listRef: { current: null },
			setFilter: vi.fn(),
		});

		render(<DictionaryCategories />);
		expect(screen.getByText(/Nenhuma categoria encontrada/i)).toBeInTheDocument();
	});

	it("should render category list", () => {
		const categories = [
			{ id: 1, name: "Food", active: true, description: null, url: undefined },
			{ id: 2, name: "Animals", active: true, description: null, url: undefined },
		];
		mockUseDictionaryCtx.mockReturnValue({
			categories,
			isLoadingCategories: false,
			search: "",
			setSelectedCategory: vi.fn(),
			listRef: { current: null },
			setFilter: vi.fn(),
		});

		render(<DictionaryCategories />);
		expect(screen.getByText("Food")).toBeInTheDocument();
		expect(screen.getByText("Animals")).toBeInTheDocument();
	});

	it("should call setSelectedCategory when category is clicked", () => {
		const setSelectedCategory = vi.fn();
		const categories = [{ id: 1, name: "Food", active: true, description: null, url: undefined }];
		mockUseDictionaryCtx.mockReturnValue({
			categories,
			isLoadingCategories: false,
			search: "",
			setSelectedCategory,
			listRef: { current: null },
			setFilter: vi.fn(),
		});

		render(<DictionaryCategories />);
		fireEvent.click(screen.getByText("Food"));
		expect(setSelectedCategory).toHaveBeenCalledWith(categories[0]);
	});

	it("should call setFilter when ALL is clicked", () => {
		const setFilter = vi.fn();
		const categories = [{ id: 1, name: "Food", active: true, description: null, url: undefined }];
		mockUseDictionaryCtx.mockReturnValue({
			categories,
			isLoadingCategories: false,
			search: "",
			setSelectedCategory: vi.fn(),
			listRef: { current: null },
			setFilter,
		});

		render(<DictionaryCategories />);
		fireEvent.click(screen.getByText("TODOS"));
		expect(setFilter).toHaveBeenCalledWith("all");
	});
});
