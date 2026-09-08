import type { ComponentChildren, Ref } from "preact";
import { createContext } from "preact";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { cn } from "@/common/lib/utils";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

type Position = { x: number; y: number };

type DraggableProps<TElement> = {
	ref: Ref<TElement>;
	hasMoved: boolean;
	pos: Position;
	isDragging: boolean;
	reset: () => void;
	onPointerDown: (e: PointerEvent) => void;
	onKeyDown: (e: KeyboardEvent) => void;
};

const MOVE_STEP = 24;

const clampPosition = (x: number, y: number, rect: { width: number; height: number }): Position => ({
	x: Math.max(0, Math.min(x, window.innerWidth - rect.width)),
	y: Math.max(0, Math.min(y, window.innerHeight - rect.height)),
});

const ARROW_DELTAS: Record<string, Position> = {
	ArrowUp: { x: 0, y: -MOVE_STEP },
	ArrowDown: { x: 0, y: MOVE_STEP },
	ArrowLeft: { x: -MOVE_STEP, y: 0 },
	ArrowRight: { x: MOVE_STEP, y: 0 },
};

const DraggableContext = createContext<DraggableProps<HTMLElement> | null>(null);

export const useDraggable = () => {
	const context = useContext(DraggableContext);
	if (!context) throw new Error("useDraggable deve ser usado dentro de <Draggable />");
	return context;
};

type Props<TElement> = {
	children: (props: DraggableProps<TElement>) => ComponentChildren;
};

export function Draggable<TElement extends HTMLElement>({ children }: Props<TElement>) {
	const ref = useRef<TElement>(null);
	const start = useRef<Position>({ x: 0, y: 0 });
	const isExpanded = useWidgetStore((s) => s.isExpanded);
	const [pos, setPos] = useState<Position>({ x: 0, y: 0 });
	const [hasMoved, setHasMoved] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const reset = () => {
		setPos({ x: 0, y: 0 });
		setHasMoved(false);
	};

	useEffect(() => {
		if (!ref.current || !hasMoved || !isExpanded) return;

		const validatePosition = () => {
			if (!ref.current) return;

			const rect = ref.current.getBoundingClientRect();

			setPos((prev) => {
				const next = clampPosition(prev.x, prev.y, rect);
				return next.x === prev.x && next.y === prev.y ? prev : next;
			});
		};

		const timer = setTimeout(validatePosition, 200);

		return () => clearTimeout(timer);
	}, [isExpanded]);

	useEffect(() => {
		if (__IS_EXTENSION__) return;

		let rafId: number | null = null;

		const handleResize = () => {
			if (!ref.current || !hasMoved || rafId !== null) return;

			rafId = requestAnimationFrame(() => {
				rafId = null;
				if (!ref.current) return;

				const rect = ref.current.getBoundingClientRect();

				setPos((prevPos) => {
					const next = clampPosition(prevPos.x, prevPos.y, rect);
					return next.x !== prevPos.x || next.y !== prevPos.y ? next : prevPos;
				});
			});
		};

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
			if (rafId !== null) cancelAnimationFrame(rafId);
		};
	}, [hasMoved]);

	useEffect(() => {
		if (__IS_EXTENSION__) return;

		// pointermove pode disparar dezenas de vezes por frame; sem isso, cada evento
		// fazia sua própria leitura (getBoundingClientRect) e escrita (setPos) de layout.
		let rafId: number | null = null;
		const latestPointer = { x: 0, y: 0 };

		const onPointerMove = (e: PointerEvent) => {
			if (!isDragging || !ref.current) return;
			if (e.cancelable) e.preventDefault();

			latestPointer.x = e.clientX;
			latestPointer.y = e.clientY;

			if (rafId !== null) return;

			rafId = requestAnimationFrame(() => {
				rafId = null;
				if (!ref.current) return;

				const x = latestPointer.x - start.current.x;
				const y = latestPointer.y - start.current.y;

				const rect = ref.current.getBoundingClientRect();

				setPos(clampPosition(x, y, rect));
				if (!hasMoved) setHasMoved(true);
			});
		};

		const onPointerUp = () => {
			setIsDragging(false);
			document.body.style.userSelect = "";
			document.body.style.touchAction = "";
		};

		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("pointerup", onPointerUp);
		window.addEventListener("pointercancel", onPointerUp);
		return () => {
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", onPointerUp);
			window.removeEventListener("pointercancel", onPointerUp);
			if (rafId !== null) cancelAnimationFrame(rafId);
		};
	}, [hasMoved, isDragging]);

	useEffect(() => {
		if (ref.current) {
			const rect = ref.current.getBoundingClientRect();
			setPos({ x: rect.left, y: rect.top });
		}
	}, []);

	const onPointerDown = (e: PointerEvent) => {
		if (!ref.current || __IS_EXTENSION__) return;
		if (e.cancelable) e.preventDefault();

		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		setIsDragging(true);

		const rect = ref.current.getBoundingClientRect();
		start.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
		if (!hasMoved) {
			setPos({ x: rect.left, y: rect.top });
			setHasMoved(true);
		}
		document.body.style.userSelect = "none";
		document.body.style.touchAction = "none";
	};

	// Suprime a transição de posição por um instante: evita que a troca da base CSS
	// (que ocorre quando hasMoved muda) seja animada junto com o transform, o que
	// causaria um "pulo" visual até assentar na posição correta. O drag por pointer
	// não sofre disso porque isDragging já fica true antes de hasMoved mudar.
	const suppressPositionTransition = () => {
		setIsDragging(true);
		requestAnimationFrame(() => requestAnimationFrame(() => setIsDragging(false)));
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (__IS_EXTENSION__ || !ref.current) return;

		if (e.key === "Enter" || e.key === "0") {
			e.preventDefault();
			if (hasMoved) suppressPositionTransition();
			reset();
			return;
		}

		const delta = ARROW_DELTAS[e.key];
		if (!delta) return;

		e.preventDefault();

		const rect = ref.current.getBoundingClientRect();
		const base = hasMoved ? pos : { x: rect.left, y: rect.top };

		setPos(clampPosition(base.x + delta.x, base.y + delta.y, rect));
		if (!hasMoved) {
			suppressPositionTransition();
			setHasMoved(true);
		}
	};

	const contextValue: DraggableProps<TElement> = {
		ref,
		hasMoved,
		pos,
		isDragging,
		reset,
		onPointerDown,
		onKeyDown,
	};

	return (
		<DraggableContext.Provider value={contextValue as unknown as DraggableProps<HTMLElement>}>
			{children(contextValue)}
		</DraggableContext.Provider>
	);
}

export const DragHandle = ({ className }: { className?: string }) => {
	const { onPointerDown, onKeyDown } = useDraggable();

	return (
		<button
			type="button"
			data-slot="drag-handle"
			aria-label="Mover janela VLibras. Use as setas para mover; Enter ou 0 para redefinir a posição."
			onPointerDown={onPointerDown}
			onKeyDown={onKeyDown}
			className={cn(
				"absolute inset-0 -z-1! touch-none outline-none!",
				!__IS_EXTENSION__ && "not-expanded:hover:cursor-move sm:hover:cursor-move",
				className,
			)}
		/>
	);
};

const HINT_BASE = cn(
	"pointer-events-none absolute z-2147483647 size-0 opacity-0 drop-shadow-sm transition-opacity duration-150",
	"group-has-[[data-slot=drag-handle]:focus-visible]/widget:opacity-100",
);

export const DragHint = () => (
	<>
		<span
			aria-hidden="true"
			className={cn(
				HINT_BASE,
				"-top-2.5 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-0 border-b-primary",
			)}
		/>
		<span
			aria-hidden="true"
			className={cn(
				HINT_BASE,
				"top-1/2 -right-2.5 -translate-y-1/2 border-8 border-transparent border-r-0 border-l-primary",
			)}
		/>
		<span
			aria-hidden="true"
			className={cn(
				HINT_BASE,
				"-bottom-2.5 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-primary border-b-0",
			)}
		/>
		<span
			aria-hidden="true"
			className={cn(
				HINT_BASE,
				"top-1/2 -left-2.5 -translate-y-1/2 border-8 border-transparent border-r-primary border-l-0",
			)}
		/>
	</>
);
