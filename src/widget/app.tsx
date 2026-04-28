import type { RefObject } from "preact";
import { useEffect } from "preact/hooks";
import { usePick } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { getWidgetPositionClasses } from "./app.styles";
import { WidgetContent } from "./components/content";
import { Draggable } from "./components/draggable";
import { AppBackground } from "./components/ui/app-background";
import { WidgetProviders } from "./providers/app";
import { rootStore } from "./stores/use-root.store";
import { useWidgetStore } from "./stores/use-widget.store";

export const WidgetApp = () => {
	const { isOpen, position, isExpanded } = useWidgetStore(usePick("isOpen", "position", "isExpanded"));

	return (
		<Draggable<HTMLDivElement>>
			{({ ref: draggableRef, hasMoved, pos, isDragging, reset }) => {
				useEffect(() => void (!isOpen && reset()), [isOpen]);

				return (
					<div
						inert={!isOpen}
						id="vlibras-app"
						ref={(ref) => {
							if (ref) rootStore.set({ appRoot: ref });
							if (typeof draggableRef === "function") draggableRef(ref);
							else if (draggableRef && "current" in draggableRef) {
								(draggableRef as RefObject<HTMLDivElement | null>).current = ref;
							}
						}}
						style={{
							boxShadow: "0 0 15px -5px rgba(0, 0, 0, 0.15)",
							transform: hasMoved && isOpen ? `translate3d(${pos.x}px, ${pos.y}px, 0)` : undefined,
						}}
						className={cn(
							"fixed z-2147483647 flex h-fit w-(--widget-width) flex-col overflow-hidden rounded-xl",
							!isDragging && "transition-all",
							(!hasMoved || !isOpen) && getWidgetPositionClasses(position, isOpen),
							hasMoved && isOpen && "top-0 left-0",
							isExpanded &&
								isOpen &&
								cn(
									"w-dvw max-w-dvw sm:h-auto sm:w-xl sm:[--player-height:800px]",
									"max-sm:translate-none! max-sm:transform-none! [--player-height:calc(100dvh-54px)] max-sm:inset-0 max-sm:rounded-none! max-sm:border-none!",
								),
						)}
					>
						<WidgetContent />
						<WidgetProviders />

						<AppBackground />
					</div>
				);
			}}
		</Draggable>
	);
};
