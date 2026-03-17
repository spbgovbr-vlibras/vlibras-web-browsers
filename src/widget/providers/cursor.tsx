import { useEffect, useRef, useState } from "react";

export const CustomCursor = () => {
	const cursorRef = useRef<HTMLDivElement>(null);
	const [cursorType, setCursorType] = useState("default");

	useEffect(() => {
		const moveCursor = (e: MouseEvent) => {
			if (cursorRef.current) {
				cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
			}
		};

		const handleMouseOver = (e: MouseEvent) => {
			const target = (e.target as Element)?.closest("[data-cursor]");
			if (target) setCursorType(target.getAttribute("data-cursor") || "default");
			else setCursorType("default");
		};

		window.addEventListener("mousemove", moveCursor);
		window.addEventListener("mouseover", handleMouseOver);

		return () => {
			window.removeEventListener("mousemove", moveCursor);
			window.removeEventListener("mouseover", handleMouseOver);
		};
	}, []);

	return (
		<div
			ref={cursorRef}
			className={`sr-only pointer-events-none fixed top-0 left-0 z-9999 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white mix-blend-difference transition-[width,height,background-color] duration-300 ease-out ${cursorType === "pointer" ? "h-12 w-12 bg-white/20" : "h-5 w-5 bg-transparent"}
        ${cursorType === "text" ? "h-8 w-1 rounded-none bg-blue-500" : ""}
      `}
		>
			{cursorType === "pointer" && <span className="font-bold text-[8px] text-white uppercase">Click</span>}
		</div>
	);
};
