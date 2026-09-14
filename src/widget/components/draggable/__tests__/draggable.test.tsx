import { render, screen } from "@testing-library/preact";
import { describe, expect, it } from "vitest";
import { Draggable, DragHandle } from "..";

describe("DragHandle", () => {
	it("stays in the tab order by default", () => {
		render(<Draggable>{() => <DragHandle />}</Draggable>);

		expect(screen.getByRole("button", { name: /mover janela/i })).not.toHaveAttribute("tabindex");
	});

	it("is removed from the tab order when focusable is false", () => {
		render(<Draggable>{() => <DragHandle focusable={false} />}</Draggable>);

		expect(screen.getByRole("button", { name: /mover janela/i })).toHaveAttribute("tabindex", "-1");
	});
});
