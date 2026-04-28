export type Position = { x: number; y: number };
type ArrowPosition = "bottom" | "top" | "left" | "right" | "bottom-left" | "bottom-right" | "top-left" | "top-right";

type NormalizePrositionProps = {
	event: MouseEvent;
	tooltip: HTMLButtonElement;
};

export const normalizePosition = ({
	event,
	tooltip,
}: NormalizePrositionProps): Position & {
	arrow: ArrowPosition;
} => {
	const rect = tooltip?.getBoundingClientRect() || { width: 0, height: 0 };

	let x = event.pageX;
	let y = event.pageY - 36;
	let arrow: ArrowPosition = "bottom";

	if (x < 34) {
		x = 34;
		arrow = "left";
	}

	if (x + rect.width > window.innerWidth) {
		x = window.innerWidth - rect.width + 12;
		arrow = "right";
	}

	if (event.clientY < 46) {
		y = event.pageY + rect.height * 2;
		arrow = arrow === "right" ? "top-right" : "top-left";
	} else {
		arrow = arrow === "right" ? "bottom-right" : "bottom-left";
	}

	return { x, y, arrow };
};
