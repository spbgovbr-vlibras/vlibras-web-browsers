import { render, screen } from "@testing-library/preact";
import type { ComponentChildren } from "preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useDictionaryStore } from "../../stores/use-dictionary.store";
import { useDictionaryHistoryStore } from "../../stores/use-dictionary-history.store";
import { DictionaryList } from "../dictionary-list";

const { mockUseDictionaryCtx } = vi.hoisted(() => ({
	mockUseDictionaryCtx: vi.fn(),
}));

vi.mock("../dictionary-context", () => ({
	useDictionaryCtx: mockUseDictionaryCtx,
	DictionaryProvider: ({ children }: { children: ComponentChildren }) => children,
}));

vi.mock("../dictionary-error", () => ({
	DictionaryError: ({ onRetry, isMaxRetries }: { onRetry: () => void; isMaxRetries: boolean }) => (
		<div data-testid="dictionary-error">
			<button type="button" onClick={onRetry}>
				Retry
			</button>
			{isMaxRetries && <span>Try again later.</span>}
		</div>
	),
}));

vi.mock("../dictionary-loading", () => ({
	DictionaryLoading: () => <div data-testid="dictionary-loading">Loading</div>,
}));

vi.mock("../dictionary-search", () => ({
	DictionarySearch: () => <div data-testid="dictionary-search">Search</div>,
}));

vi.mock("../dictionary-filter", () => ({
	DictionaryFilter: () => <div data-testid="dictionary-filter">Filter</div>,
}));

vi.mock("../dictionary-categories", () => ({
	DictionaryCategories: () => <div data-testid="dictionary-categories">Categories</div>,
}));

vi.mock("../dictionary-categories-list", () => ({
	DictionaryCategoryList: () => <div data-testid="dictionary-category-list">CategoryList</div>,
}));

vi.mock("../dictionary-letter-list", () => ({
	DictionaryLetterList: () => <div data-testid="dictionary-letter-list">LetterList</div>,
}));

vi.mock("../dictionary-all-words", () => ({
	DictionaryAllWords: () => <div data-testid="dictionary-all-words">AllWords</div>,
}));

describe("DictionaryList", () => {
	beforeEach(() => {
		useDictionaryStore.setState({ isMaxRetries: false, retriesCount: 0 });
		useDictionaryHistoryStore.setState({ signs: [] });
		mockUseDictionaryCtx.mockReset();
	});

	it("should render loading state", () => {
		mockUseDictionaryCtx.mockReturnValue({
			isLoading: true,
			data: null,
			filter: "all",
			search: "",
			selectedLetter: null,
			selectedCategory: null,
			retry: vi.fn(),
			isMaxRetries: false,
			filteredLetterWords: [],
			filteredCategoryWords: [],
			filteredSigns: [],
		});

		render(<DictionaryList />);
		expect(screen.getByTestId("dictionary-loading")).toBeInTheDocument();
	});

	it("should render error when no data and filter is all", () => {
		mockUseDictionaryCtx.mockReturnValue({
			isLoading: false,
			data: null,
			filter: "all",
			search: "",
			selectedLetter: null,
			selectedCategory: null,
			retry: vi.fn(),
			isMaxRetries: false,
			filteredLetterWords: [],
			filteredCategoryWords: [],
			filteredSigns: [],
		});

		render(<DictionaryList />);
		expect(screen.getByTestId("dictionary-error")).toBeInTheDocument();
	});

	it("should render search and filter", () => {
		mockUseDictionaryCtx.mockReturnValue({
			isLoading: false,
			data: { signs: [] },
			filter: "all",
			search: "",
			selectedLetter: null,
			selectedCategory: null,
			retry: vi.fn(),
			isMaxRetries: false,
			filteredLetterWords: [],
			filteredCategoryWords: [],
			filteredSigns: [],
		});

		render(<DictionaryList />);
		expect(screen.getByTestId("dictionary-search")).toBeInTheDocument();
		expect(screen.getByTestId("dictionary-filter")).toBeInTheDocument();
	});

	it("should render empty results message when search has no matches", () => {
		mockUseDictionaryCtx.mockReturnValue({
			isLoading: false,
			data: { signs: [] },
			filter: "all",
			search: "NO_RESULTS",
			selectedLetter: null,
			selectedCategory: null,
			retry: vi.fn(),
			isMaxRetries: false,
			filteredLetterWords: [],
			filteredCategoryWords: [],
			filteredSigns: [],
		});

		render(<DictionaryList />);
		expect(screen.getByText(/Sem resultados/i)).toBeInTheDocument();
	});

	it("should render all words when not in categories mode", () => {
		mockUseDictionaryCtx.mockReturnValue({
			isLoading: false,
			data: { signs: [] },
			filter: "all",
			search: "",
			selectedLetter: null,
			selectedCategory: null,
			retry: vi.fn(),
			isMaxRetries: false,
			filteredLetterWords: [],
			filteredCategoryWords: [],
			filteredSigns: [],
		});

		render(<DictionaryList />);
		expect(screen.getByTestId("dictionary-all-words")).toBeInTheDocument();
	});
});
