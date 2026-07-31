import type { ComponentChildren, Ref } from "preact";
import { createContext } from "preact";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

type Position = { x: number; y: number };

type DraggableProps<TElement> = {
	ref: Ref<TElement>;
	hasMoved: boolean;
	pos: Position;
	isDragging: boolean;
	reset: () => void;
	onPointerDown: (e: PointerEvent) => void;
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
			const maxX = window.innerWidth - rect.width;
			const maxY = window.innerHeight - rect.height;

			setPos((prev) => {
				const newX = Math.max(0, Math.min(prev.x, maxX));
				const newY = Math.max(0, Math.min(prev.y, maxY));

				if (newX === prev.x && newY === prev.y) return prev;
				return { x: newX, y: newY };
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
				const maxX = window.innerWidth - rect.width;
				const maxY = window.innerHeight - rect.height;

				setPos((prevPos) => {
					const newX = Math.max(0, Math.min(prevPos.x, maxX));
					const newY = Math.max(0, Math.min(prevPos.y, maxY));

					return newX !== prevPos.x || newY !== prevPos.y ? { x: newX, y: newY } : prevPos;
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

				const safeX = Math.max(0, Math.min(x, window.innerWidth - rect.width));
				const safeY = Math.max(0, Math.min(y, window.innerHeight - rect.height));

				setPos({ x: safeX, y: safeY });
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

	const contextValue: DraggableProps<TElement> = {
		ref,
		hasMoved,
		pos,
		isDragging,
		reset,
		onPointerDown,
	};

	return (
		<DraggableContext.Provider value={contextValue as unknown as DraggableProps<HTMLElement>}>
			{children(contextValue)}
		</DraggableContext.Provider>
	);
}
