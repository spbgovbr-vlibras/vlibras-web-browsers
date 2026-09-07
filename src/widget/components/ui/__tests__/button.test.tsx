import { fireEvent, render, screen } from "@testing-library/preact";
import { describe, expect, it, vi } from "vitest";
import { Button, buttonVariants } from "@/widget/components/ui/button";

describe("buttonVariants", () => {
	it("should generate default classes", () => {
		expect(buttonVariants()).toContain("rounded-lg");
	});

	it("should generate classes for variant and size", () => {
		expect(buttonVariants({ variant: "outline" })).toContain("border");
		expect(buttonVariants({ size: "sm" })).toContain("h-8");
	});
});

describe("Button", () => {
	it("should render the content", () => {
		render(<Button>Translate</Button>);

		expect(screen.getByRole("button", { name: "Translate" })).toBeInTheDocument();
	});

	it("should use type button by default", () => {
		render(<Button>ok</Button>);

		expect(screen.getByRole("button").getAttribute("type")).toBe("button");
	});

	it("should fire onClick", () => {
		const onClick = vi.fn();
		render(<Button onClick={onClick}>ok</Button>);

		fireEvent.click(screen.getByRole("button"));

		expect(onClick).toHaveBeenCalledOnce();
	});

	it("should apply the disabled state", () => {
		render(<Button disabled>ok</Button>);

		const button = screen.getByRole("button");
		expect(button).toBeDisabled();
		expect(button.getAttribute("tabindex")).toBe("-1");
		expect(button.className).toContain("opacity-50");
	});
});
