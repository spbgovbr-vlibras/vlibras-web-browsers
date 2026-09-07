import { render, screen } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { DictionaryLoading } from "../dictionary-loading";

vi.mock("@/widget/components/ui/spinner", () => ({
	Spinner: () => <div data-testid="spinner" />,
}));

describe("DictionaryLoading", () => {
	it("should render a spinner", () => {
		render(<DictionaryLoading />);
		expect(screen.getByTestId("spinner")).toBeInTheDocument();
	});

	it("should be centered", () => {
		const { container } = render(<DictionaryLoading />);
		const div = container.firstChild as HTMLElement;
		expect(div.className).toContain("place-content-center");
	});
});
