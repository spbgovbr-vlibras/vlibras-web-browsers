export type Position = { x: number; y: number };
export type TooltipPlacement = "above" | "below";
export type ArrowPosition = "bottom-left" | "bottom-right" | "top-left" | "top-right";

type NormalizePositionProps = {
	event: MouseEvent;
	tooltip: HTMLButtonElement;
};

// Fallback usado quando o tooltip ainda está escondido (`display: none`)
// e o `getBoundingClientRect` retorna zeros (ex.: `h-9` = 36px de altura).
const FALLBACK_WIDTH = 160;
const FALLBACK_HEIGHT = 36;
// Distância entre o ponto clicado e o tooltip.
const CURSOR_GAP = 12;
// Sobreposição da seta (`-bottom-1.5`/`-top-1.5` = 6px).
const ARROW_SIZE = 8;
// Margem mínima em relação às bordas da viewport.
const VIEWPORT_MARGIN = 8;
// Deslocamento horizontal para a seta (`left-5`) apontar próximo ao clique.
const CLICK_OFFSET_X = 24;

export const normalizePosition = ({
	event,
	tooltip,
}: NormalizePositionProps): Position & {
	arrow: ArrowPosition;
	placement: TooltipPlacement;
} => {
	const rect = tooltip?.getBoundingClientRect();
	const width = rect?.width || FALLBACK_WIDTH;
	const height = rect?.height || FALLBACK_HEIGHT;

	const fitsAbove = event.clientY - CURSOR_GAP - ARROW_SIZE - height >= VIEWPORT_MARGIN;
	const fitsBelow = event.clientY + CURSOR_GAP + ARROW_SIZE + height <= window.innerHeight - VIEWPORT_MARGIN;
	const placement: TooltipPlacement = fitsAbove || !fitsBelow ? "above" : "below";

	const y =
		placement === "above" ? event.pageY - CURSOR_GAP - ARROW_SIZE - height : event.pageY + CURSOR_GAP + ARROW_SIZE;

	const maxLeft = window.innerWidth - width - VIEWPORT_MARGIN;
	const clampedLeft = Math.min(
		Math.max(event.clientX - CLICK_OFFSET_X, VIEWPORT_MARGIN),
		Math.max(maxLeft, VIEWPORT_MARGIN),
	);
	const clampedRight = event.clientX - CLICK_OFFSET_X > maxLeft;
	const arrow: ArrowPosition =
		placement === "above" ? (clampedRight ? "bottom-right" : "bottom-left") : clampedRight ? "top-right" : "top-left";

	return { x: clampedLeft + window.scrollX, y, arrow, placement };
};
