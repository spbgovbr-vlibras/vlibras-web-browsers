import { render } from "@testing-library/preact";
import type { ComponentChildren } from "preact";
import { describe, expect, it, vi } from "vitest";

globalThis.IntersectionObserver = class IntersectionObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
	takeRecords() {
		return [];
	}
	root = null;
	rootMargin = "";
	thresholds = [];
} as unknown as typeof IntersectionObserver;

const { mockUseDictionaryCtx, MockProvider } = vi.hoisted(() => {
	const useDictionaryCtx = vi.fn();
	const Provider = ({ children }: { children: ComponentChildren }) => children;
	return { mockUseDictionaryCtx: useDictionaryCtx, MockProvider: Provider };
});

vi.mock("../dictionary-context", () => ({
	useDictionaryCtx: mockUseDictionaryCtx,
	DictionaryProvider: MockProvider,
}));

describe("DictionaryContext", () => {
	it("should provide dictionary context to children", () => {
		const TestComponent = () => {
			const ctx = mockUseDictionaryCtx();
			return <div data-testid="ctx">{ctx?.search ?? ""}</div>;
		};

		mockUseDictionaryCtx.mockReturnValue({ search: "test", isLoading: false });

		const { container } = render(
			<MockProvider>
				<TestComponent />
			</MockProvider>,
		);

		expect(container.querySelector('[data-testid="ctx"]')?.textContent).toBe("test");
	});
});
