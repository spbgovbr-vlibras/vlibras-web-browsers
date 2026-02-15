export type Position = { x: number; y: number };
type ArrowPosition = "bottom" | "top" | "left" | "right" | "bottom-left" | "bottom-right" | "top-left" | "top-right";

export const normalizePosition = ({
	x: _x,
	y: _y,
	tooltip,
}: Position & {
	tooltip: HTMLButtonElement | null;
}): Position & {
	arrow: ArrowPosition;
} => {
	const rect = tooltip?.getBoundingClientRect() || { width: 0, height: 0 };

	let x = _x;
	let y = _y - 36;
	let arrow: ArrowPosition = "bottom";

	if (x < 34) {
		x = 34;
		arrow = "left";
	}

	if (x + rect.width > window.innerWidth) {
		x = window.innerWidth - rect.width + 12;
		arrow = "right";
	}

	if (y < 46) {
		y = 54;
		arrow = arrow === "right" ? "top-right" : "top-left";
	} else arrow = arrow === "right" ? "bottom-right" : "bottom-left";

	return { x, y, arrow };
};
