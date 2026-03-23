import { useEffect } from "preact/hooks";
import { cn } from "@/common/lib/utils";
import { usePlayer } from "@/player/use-player";
import { usePlayerStore } from "@/player/use-player.store";
import { getWidgetPositionClasses } from "./app.styles";
import { WidgetContent } from "./components/content";
import { Draggable } from "./components/draggable";
import { UnityLoading } from "./components/unity-loading";
import { WidgetGrabber } from "./components/widget-grabber";
import { WidgetProviders } from "./providers/app";
import { useWidgetStore } from "./stores/use-widget.store";

export const WidgetApp = () => {
	const { playWelcome } = usePlayer();
	const { progress, isLoaded } = usePlayerStore();
	const { isOpen, position } = useWidgetStore();

	useEffect(() => void (isLoaded && playWelcome()), [isLoaded]);

	return (
		<Draggable<HTMLDivElement>>
			{({ ref, hasMoved, pos, onPointerDown, isDragging, reset }) => {
				useEffect(() => void (!isOpen && reset()), [isOpen]);

				return (
					<div
						ref={ref}
						style={{
							boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
							transform: hasMoved && isOpen ? `translate3d(${pos.x}px, ${pos.y}px, 0)` : undefined,
							touchAction: "none",
						}}
						className={cn(
							"fixed z-2147483647 flex h-fit w-(--widget-width) flex-col overflow-hidden rounded-3xl border border-foreground/20 bg-white",
							!isDragging && "transition-all",
							(!hasMoved || !isOpen) && getWidgetPositionClasses(position, isOpen),
							hasMoved && isOpen && "top-0 left-0",
						)}
					>
						{!isLoaded && <UnityLoading progress={progress} />}

						<WidgetGrabber onPointerDown={onPointerDown} isDragging={isDragging} />

						<WidgetContent />
						<WidgetProviders />
					</div>
				);
			}}
		</Draggable>
	);
};
