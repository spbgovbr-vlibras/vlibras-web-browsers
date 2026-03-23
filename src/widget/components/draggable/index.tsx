import type { ComponentChildren, Ref } from "preact";
import { createContext } from "preact";
import { useContext, useEffect, useRef, useState } from "preact/hooks";

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
	const [pos, setPos] = useState<Position>({ x: 0, y: 0 });
	const [hasMoved, setHasMoved] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	const reset = () => {
		setPos({ x: 0, y: 0 });
		setHasMoved(false);
	};

	useEffect(() => {
		const handleResize = () => {
			if (!ref.current || !hasMoved) return;
			setPos((prevPos) => {
				if (!ref.current) return prevPos;
				const rect = ref.current.getBoundingClientRect();

				const maxX = window.innerWidth - rect.width;
				const maxY = window.innerHeight - rect.height;

				const newX = Math.max(0, Math.min(prevPos.x, maxX));
				const newY = Math.max(0, Math.min(prevPos.y, maxY));

				return newX !== prevPos.x || newY !== prevPos.y ? { x: newX, y: newY } : prevPos;
			});
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [hasMoved]);

	useEffect(() => {
		const onPointerMove = (e: PointerEvent) => {
			if (!isDragging || !ref.current) return;

			const x = e.clientX - start.current.x;
			const y = e.clientY - start.current.y;

			const rect = ref.current.getBoundingClientRect();

			const safeX = Math.max(0, Math.min(x, window.innerWidth - rect.width));
			const safeY = Math.max(0, Math.min(y, window.innerHeight - rect.height));

			setPos({ x: safeX, y: safeY });
			if (!hasMoved) setHasMoved(true);
		};

		const onPointerUp = () => {
			setIsDragging(false);
			document.body.style.userSelect = "";
		};

		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("pointerup", onPointerUp);
		return () => {
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("pointerup", onPointerUp);
		};
	}, [hasMoved, isDragging]);

	const onPointerDown = (e: PointerEvent) => {
		if (!ref.current) return;
		setIsDragging(true);
		const rect = ref.current.getBoundingClientRect();
		start.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
		if (!hasMoved) {
			setPos({ x: rect.left, y: rect.top });
			setHasMoved(true);
		}
		document.body.style.userSelect = "none";
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
