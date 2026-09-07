import { render, screen } from "@testing-library/preact";
import type { ComponentChildren } from "preact";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DictionaryCategoryWords } from "../dictionary-category-words";

const { mockUseDictionaryCtx } = vi.hoisted(() => ({
	mockUseDictionaryCtx: vi.fn(),
}));

vi.mock("../dictionary-context", () => ({
	useDictionaryCtx: mockUseDictionaryCtx,
	DictionaryProvider: ({ children }: { children: ComponentChildren }) => children,
}));

vi.mock("../hooks/use-handle-play", () => ({
	useHandlePlay: () => () => {},
}));

vi.mock("@/widget/hooks/use-translate", () => ({
	useTranslate: () => ({ mutateAsync: () => Promise.resolve("") }),
}));

vi.mock("@/widget/stores/use-callback.store", () => ({
	createCallback: () => {},
}));

vi.mock("@/widget/stores/use-screens.store", () => ({
	screenStore: { set: () => {} },
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

vi.mock("@/widget/components/ui/spinner", () => ({
	Spinner: () => <span>Spinner</span>,
}));

vi.mock("../lib/wiktionary", () => ({
	sanitizeWikiText: (text: string) => text,
}));

vi.mock("@/common/hooks", () => ({
	useMobile: () => false,
	usePick: (...keys: string[]) => keys,
	useQuery: () => ({ data: [], isLoading: false }),
	useDebouncedCallback: <T,>(fn: (params: T) => void) => fn,
}));

vi.mock("@/common/lib/utils", () => ({
	cn: (...classes: string[]) => classes.filter(Boolean).join(" "),
}));

describe("DictionaryCategoryWords", () => {
	beforeEach(() => {
		mockUseDictionaryCtx.mockReset();
	});

	it("should render category words", () => {
		mockUseDictionaryCtx.mockReturnValue({
			visibleCategoryWords: ["sign1", "sign2"],
			isVerbCategory: false,
			listRef: { current: null },
			onCategoryScroll: () => {},
		});

		render(<DictionaryCategoryWords />);
		expect(screen.getByText("sign1")).toBeInTheDocument();
		expect(screen.getByText("sign2")).toBeInTheDocument();
	});
});
