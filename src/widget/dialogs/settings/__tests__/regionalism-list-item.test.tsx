import { fireEvent, render, screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import type { Region } from "@/data/regionalism";
import { RegionalismListItem } from "../regionalism-list-item";

describe("RegionalismListItem", () => {
	it("should render region name and flag", () => {
		const region: Region = { abbreviation: "BR", name: "Brazil", flag: "br.png" };
		render(<RegionalismListItem region={region} isSelected={false} onSelect={() => {}} />);
		expect(screen.getByText("Brazil")).toBeInTheDocument();
	});

	it("should call onSelect when clicked", () => {
		const onSelect = vi.fn();
		const region: Region = { abbreviation: "BR", name: "Brazil", flag: "br.png" };
		render(<RegionalismListItem region={region} isSelected={false} onSelect={onSelect} />);
		fireEvent.click(screen.getByRole("button"));
		expect(onSelect).toHaveBeenCalledOnce();
	});

	it("should be selected when isSelected is true", () => {
		const region: Region = { abbreviation: "BR", name: "Brazil", flag: "br.png" };
		const { container } = render(<RegionalismListItem region={region} isSelected={true} onSelect={() => {}} />);
		const radio = container.querySelector('input[type="radio"]') as HTMLInputElement;
		expect(radio.checked).toBe(true);
	});
});
