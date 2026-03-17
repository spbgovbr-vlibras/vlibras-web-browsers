import { useEffect } from "preact/hooks";
import { cn } from "@/common/lib/utils";
import { usePlayer } from "@/player/use-player";
import { usePlayerStore } from "@/player/use-player.store";
import { getWidgetPositionClasses } from "./app.styles";
import { WidgetContent } from "./components/content";
import { Draggable } from "./components/draggable";
import { UnityLoading } from "./components/unity-loading";
import { WidgetProviders } from "./providers/app";
import { useWidgetStore } from "./stores/use-widget.store";

export const WidgetApp = () => {
	const { playWelcome } = usePlayer();
	const { progress, isLoaded } = usePlayerStore();
	const { isOpenWidget, position } = useWidgetStore();

	useEffect(() => void (isLoaded && playWelcome()), [isLoaded]);

	return (
		<Draggable<HTMLDivElement>>
			{({ ref, hasMoved, pos, onPointerDown, isDragging }) => {
				return (
					<div
						ref={ref}
						onPointerDown={onPointerDown}
						style={{
							boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
							transform: hasMoved && isOpenWidget ? `translate3d(${pos.x}px, ${pos.y}px, 0)` : undefined,
							cursor: isDragging ? "grabbing" : "grab",
							touchAction: "none",
						}}
						className={cn(
							"fixed z-2147483647 flex h-fit w-(--widget-width) flex-col overflow-hidden rounded-3xl border border-foreground/20 bg-white",
							!isDragging && "transition-all",
							(!hasMoved || !isOpenWidget) && getWidgetPositionClasses(position, isOpenWidget),
							hasMoved && isOpenWidget && "top-0 left-0",
						)}
					>
						{!isLoaded && <UnityLoading progress={progress} />}

						<WidgetContent />
						<WidgetProviders />
					</div>
				);
			}}
		</Draggable>
	);
};
