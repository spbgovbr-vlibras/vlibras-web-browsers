import { fireEvent, render, screen } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { DictionaryWordMeaning } from "../dictionary-word-meaning";

vi.mock("@/widget/components/ui/icon", () => ({
	Icon: ({ name }: { name: string }) => <span>{name}</span>,
}));

vi.mock("@/widget/components/ui/spinner", () => ({
	Spinner: ({ className, size: _size }: { className?: string; size?: number }) => (
		<span className={className} data-testid="spinner" />
	),
}));

vi.mock("@/common/hooks", () => ({
	useMobile: () => false,
}));

describe("DictionaryWordMeaning", () => {
	it("should render loading state", () => {
		render(<DictionaryWordMeaning wordName="test" meaning={null} isLoading={true} onPlayDefinition={() => {}} />);
		expect(screen.getByText("Buscando significado...")).toBeInTheDocument();
	});

	it("should render not found message when no definitions", () => {
		render(<DictionaryWordMeaning wordName="test" meaning={{}} isLoading={false} onPlayDefinition={() => {}} />);
		expect(screen.getByText("Significado não encontrado.")).toBeInTheDocument();
	});

	it("should render definitions when available", () => {
		const meaning = { definitions: ["definition 1", "definition 2"] };
		const onPlayDefinition = vi.fn();
		render(
			<DictionaryWordMeaning wordName="test" meaning={meaning} isLoading={false} onPlayDefinition={onPlayDefinition} />,
		);
		expect(screen.getByText("Significado")).toBeInTheDocument();
		expect(screen.getByText("1. definition 1")).toBeInTheDocument();
		expect(screen.getByText("2. definition 2")).toBeInTheDocument();
	});

	it("should call onPlayDefinition when definition play button is clicked", () => {
		const onPlayDefinition = vi.fn();
		const meaning = { definitions: ["test definition"] };
		render(
			<DictionaryWordMeaning wordName="test" meaning={meaning} isLoading={false} onPlayDefinition={onPlayDefinition} />,
		);
		const button = screen.getByLabelText("Traduzir definição");
		fireEvent.click(button);
		expect(onPlayDefinition).toHaveBeenCalledWith("test definition");
	});

	it("should only show up to 3 definitions", () => {
		const meaning = { definitions: ["d1", "d2", "d3", "d4", "d5"] };
		render(<DictionaryWordMeaning wordName="test" meaning={meaning} isLoading={false} onPlayDefinition={() => {}} />);
		const items = screen.getAllByRole("listitem");
		expect(items.length).toBeLessThanOrEqual(3);
	});
});
