import { fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, describe, expect, it } from "vitest";
import { Dropdown, DropdownContent, DropdownTrigger } from "@/widget/components/ui/dropdown";
import { overlayStore } from "@/widget/stores/use-overlay.store";

const MenuHarness = ({ checked = 1 }: { checked?: number }) => (
	<Dropdown showOverlay={false}>
		<DropdownTrigger>
			<button type="button">open menu</button>
		</DropdownTrigger>
		<DropdownContent>
			{/* biome-ignore lint/a11y/useSemanticElements: grupo de menuitemradio segue o padrão APG de menu com grupos; fieldset implicaria semântica de formulário */}
			<div role="group" aria-label="options">
				{[0, 1, 2].map((index) => (
					<button
						key={index}
						type="button"
						role="menuitemradio"
						aria-checked={index === checked}
						aria-label={`option ${index}`}
					>
						{index}
					</button>
				))}
			</div>
		</DropdownContent>
	</Dropdown>
);

const tabbables = () => screen.getAllByRole("menuitemradio").filter((el) => el.tabIndex === 0);

afterEach(() => {
	overlayStore.close();
});

describe("Dropdown roving tabindex", () => {
	it("should expose a single tab stop with the checked item tabbable when opened", () => {
		render(<MenuHarness checked={1} />);
		fireEvent.click(screen.getByRole("button", { name: "open menu" }));

		const items = screen.getAllByRole("menuitemradio");
		expect(items[1].tabIndex).toBe(0);
		expect(items[0].tabIndex).toBe(-1);
		expect(items[2].tabIndex).toBe(-1);
		expect(tabbables()).toHaveLength(1);
	});

	it("should move the tab stop together with arrow-key navigation", () => {
		render(<MenuHarness checked={0} />);
		fireEvent.click(screen.getByRole("button", { name: "open menu" }));

		const items = screen.getAllByRole("menuitemradio");
		items[0].focus();
		fireEvent.keyDown(items[0], { key: "ArrowDown" });

		expect(document.activeElement).toBe(items[1]);
		expect(tabbables()).toEqual([items[1]]);
	});

	it("should keep the tab stop on the focused item across an unrelated re-render", () => {
		const { rerender } = render(<MenuHarness checked={0} />);
		fireEvent.click(screen.getByRole("button", { name: "open menu" }));

		const items = screen.getAllByRole("menuitemradio");
		items[0].focus();
		fireEvent.keyDown(items[0], { key: "ArrowDown" });
		expect(tabbables()).toEqual([items[1]]);

		// simulates something unrelated (e.g. another store tick) re-rendering Dropdown
		// while the user is mid arrow-key navigation on a non-checked item
		rerender(<MenuHarness checked={0} />);

		expect(tabbables()).toEqual([items[1]]);
	});

	it("should make the first item tabbable when none is checked", () => {
		render(
			<Dropdown showOverlay={false}>
				<DropdownTrigger>
					<button type="button">open menu</button>
				</DropdownTrigger>
				<DropdownContent>
					<button type="button" role="menuitem">
						solo
					</button>
					<button type="button" role="menuitem">
						duo
					</button>
				</DropdownContent>
			</Dropdown>,
		);
		fireEvent.click(screen.getByRole("button", { name: "open menu" }));

		const items = screen.getAllByRole("menuitem");
		expect(items[0].tabIndex).toBe(0);
		expect(items[1].tabIndex).toBe(-1);
	});
});
