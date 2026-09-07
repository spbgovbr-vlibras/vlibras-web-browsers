import { render, screen } from "@testing-library/preact";
import type { ComponentChildren } from "preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DictionaryLetterList } from "../dictionary-letter-list";

const { mockUseDictionaryCtx } = vi.hoisted(() => ({
	mockUseDictionaryCtx: vi.fn(),
}));

vi.mock("../dictionary-context", () => ({
	useDictionaryCtx: mockUseDictionaryCtx,
	DictionaryProvider: ({ children }: { children: ComponentChildren }) => children,
}));

vi.mock("../dictionary-letter-head", () => ({
	DictionaryLetterHeader: () => <div>LetterHeader</div>,
}));

vi.mock("../dictionary-letter-words", () => ({
	DictionaryLetterWords: () => <div>LetterWords</div>,
}));

describe("DictionaryLetterList", () => {
	beforeEach(() => {
		mockUseDictionaryCtx.mockReset();
	});

	it("should render DictionaryLetterHeader and DictionaryLetterWords", () => {
		mockUseDictionaryCtx.mockReturnValue({
			selectedLetter: "A",
			setSelectedLetter: vi.fn(),
			visibleLetterWords: ["SIGN1", "SIGN2"],
			onLetterScroll: vi.fn(),
			listRef: { current: null },
		});

		render(<DictionaryLetterList />);
		expect(screen.getByText("LetterHeader")).toBeInTheDocument();
		expect(screen.getByText("LetterWords")).toBeInTheDocument();
	});

	it("should render DictionaryLetterHeader and DictionaryLetterWords even when no letter is selected", () => {
		mockUseDictionaryCtx.mockReturnValue({
			selectedLetter: null,
			setSelectedLetter: vi.fn(),
			visibleLetterWords: [],
			onLetterScroll: vi.fn(),
			listRef: { current: null },
		});

		render(<DictionaryLetterList />);
		expect(screen.getByText("LetterHeader")).toBeInTheDocument();
		expect(screen.getByText("LetterWords")).toBeInTheDocument();
	});
});
