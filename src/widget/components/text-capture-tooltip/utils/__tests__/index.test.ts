import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { normalizePosition } from "@/widget/components/text-capture-tooltip/utils";

const TOOLTIP_WIDTH = 150;
const TOOLTIP_HEIGHT = 36;

const mockTooltip = (width = TOOLTIP_WIDTH, height = TOOLTIP_HEIGHT) =>
	({
		getBoundingClientRect: () => ({ width, height }),
	}) as HTMLButtonElement;

const mockEvent = (clientX: number, clientY: number, scrollX = 0, scrollY = 0) =>
	({
		clientX,
		clientY,
		pageX: clientX + scrollX,
		pageY: clientY + scrollY,
	}) as MouseEvent;

const setWindow = (props: { innerWidth?: number; innerHeight?: number; scrollX?: number; scrollY?: number }) => {
	if (props.innerWidth !== undefined)
		Object.defineProperty(window, "innerWidth", { value: props.innerWidth, configurable: true });
	if (props.innerHeight !== undefined)
		Object.defineProperty(window, "innerHeight", { value: props.innerHeight, configurable: true });
	if (props.scrollX !== undefined)
		Object.defineProperty(window, "scrollX", { value: props.scrollX, configurable: true });
	if (props.scrollY !== undefined)
		Object.defineProperty(window, "scrollY", { value: props.scrollY, configurable: true });
};

describe("normalizePosition", () => {
	beforeEach(() => {
		setWindow({ innerWidth: 1024, innerHeight: 768, scrollX: 0, scrollY: 0 });
	});

	afterEach(() => {
		setWindow({ innerWidth: 1024, innerHeight: 768, scrollX: 0, scrollY: 0 });
	});

	it("should place tooltip above the click in the middle of the viewport", () => {
		const position = normalizePosition({ event: mockEvent(500, 400), tooltip: mockTooltip() });

		expect(position.placement).toBe("above");
		expect(position.arrow).toBe("bottom-left");
		expect(position.y).toBe(400 - 12 - 8 - TOOLTIP_HEIGHT);
		expect(position.x).toBe(500 - 24);
	});

	it("should flip below when the click is at the top edge", () => {
		const position = normalizePosition({ event: mockEvent(500, 10), tooltip: mockTooltip() });

		expect(position.placement).toBe("below");
		expect(position.arrow).toBe("top-left");
		expect(position.y).toBe(10 + 12 + 8);
		expect(position.y).toBeGreaterThanOrEqual(0);
	});

	it("should flip below when there is not enough room above (regression: clientY=60)", () => {
		// 60 - 12 (gap) - 8 (arrow) - 36 (height) = 4 < 8 (margin): acima ficaria fora da tela.
		const position = normalizePosition({ event: mockEvent(500, 60), tooltip: mockTooltip() });

		expect(position.placement).toBe("below");
		expect(position.arrow).toBe("top-left");
	});

	it("should clamp to the right edge and move the arrow", () => {
		const position = normalizePosition({ event: mockEvent(1000, 400), tooltip: mockTooltip() });

		expect(position.x).toBe(1024 - TOOLTIP_WIDTH - 8);
		expect(position.arrow).toBe("bottom-right");
	});

	it("should flip below and to the right corner at the top-right edge", () => {
		const position = normalizePosition({ event: mockEvent(1000, 10), tooltip: mockTooltip() });

		expect(position.placement).toBe("below");
		expect(position.arrow).toBe("top-right");
		expect(position.x).toBe(1024 - TOOLTIP_WIDTH - 8);
		expect(position.y).toBeGreaterThanOrEqual(0);
	});

	it("should clamp to the left edge", () => {
		const position = normalizePosition({ event: mockEvent(5, 400), tooltip: mockTooltip() });

		expect(position.x).toBe(8);
		expect(position.arrow).toBe("bottom-left");
	});

	it("should use fallback size when the tooltip is hidden (zero rect)", () => {
		const position = normalizePosition({ event: mockEvent(500, 10), tooltip: mockTooltip(0, 0) });

		expect(position.placement).toBe("below");
		expect(position.y).toBe(10 + 12 + 8);
	});

	it("should anchor to the document when the page is scrolled", () => {
		setWindow({ scrollX: 0, scrollY: 2000 });
		const position = normalizePosition({
			event: mockEvent(500, 10, 0, 2000),
			tooltip: mockTooltip(),
		});

		expect(position.placement).toBe("below");
		expect(position.y).toBe(2010 + 12 + 8);
	});
});
