import type { ComponentProps } from "preact/compat";
import { cn } from "@/common/lib/utils";
import { Player } from "@/player";
import { usePlayer } from "@/player/use-player";
import { WidgetControls } from "@/widget/components/controls";
import { useDraggable } from "@/widget/components/draggable";
import { WidgetHeader } from "@/widget/components/header";
import { useScreensStore } from "@/widget/stores/use-screens.store";

export const WidgetContent = ({ className, ...props }: Omit<ComponentProps<"div">, "children">) => {
	const screen = useScreensStore((s) => s.screen);

	const { isLoaded } = usePlayer();
	const { onPointerDown, isDragging } = useDraggable();

	return (
		<div
			{...props}
			{...{ onPointerDown }}
			inert={screen !== "main"}
			className={cn(
				"flex flex-col",
				isDragging ? "cursor-grabbing" : "cursor-grab",
				(!isLoaded || screen !== "main") && "opacity-0",
				className,
			)}
		>
			<WidgetHeader />

			<div className="-mb-12">
				<Player className="pointer-events-none h-(--player-height) w-full" />
			</div>

			<WidgetControls />
		</div>
	);
};
