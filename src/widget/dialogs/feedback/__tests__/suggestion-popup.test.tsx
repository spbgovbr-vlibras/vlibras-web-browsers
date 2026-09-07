import { fireEvent, render, screen } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { SuggestionPopup } from "../suggestion-popup";

describe("SuggestionPopup", () => {
	it("should render nothing when there are no suggestions", () => {
		const { container } = render(<SuggestionPopup suggestions={[]} coords={{ top: 0, left: 0 }} onSelect={() => {}} />);

		expect(container.firstChild).toBeNull();
	});

	it("should render one button per suggestion", () => {
		render(
			<SuggestionPopup suggestions={["CASA", "CASADO", "CARRO"]} coords={{ top: 0, left: 0 }} onSelect={() => {}} />,
		);

		expect(screen.getByText("CASA")).toBeInTheDocument();
		expect(screen.getByText("CASADO")).toBeInTheDocument();
		expect(screen.getByText("CARRO")).toBeInTheDocument();
	});

	it("should call onSelect with the exact suggestion that was clicked", () => {
		const onSelect = vi.fn();
		render(
			<SuggestionPopup suggestions={["CASA", "CASADO", "CARRO"]} coords={{ top: 0, left: 0 }} onSelect={onSelect} />,
		);

		fireEvent.click(screen.getByText("CASADO"));

		expect(onSelect).toHaveBeenCalledTimes(1);
		expect(onSelect).toHaveBeenCalledWith("CASADO");
	});

	it("should position the popup using the given coordinates", () => {
		render(<SuggestionPopup suggestions={["CASA"]} coords={{ top: 42, left: 17 }} onSelect={() => {}} />);

		const popup = screen.getByText("CASA").parentElement;

		expect(popup?.style.top).toBe("42px");
		expect(popup?.style.left).toBe("17px");
	});
});
