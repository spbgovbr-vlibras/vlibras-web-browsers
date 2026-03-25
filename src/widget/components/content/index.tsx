import type { ComponentProps } from "preact/compat";
import { cn } from "@/common/lib/utils";
import { Player } from "@/player";
import { WidgetControls } from "@/widget/components/controls";
import { useDraggable } from "@/widget/components/draggable";
import { WidgetHeader } from "@/widget/components/header";
import { useScreensStore } from "@/widget/stores/use-screens.store";

export const WidgetContent = ({ className, ...props }: Omit<ComponentProps<"div">, "children">) => {
	const { onPointerDown, isDragging } = useDraggable();
	const { screen } = useScreensStore();

	return (
		<div
			{...props}
			style={{ cursor: isDragging ? "grabbing" : "grab" }}
			{...{ onPointerDown }}
			className={cn("flex flex-col", className, screen !== "main" && "*:pointer-events-none!")}
		>
			<WidgetHeader />

			<div className="-mb-8 sm:-mb-12">
				<Player className="pointer-events-none h-(--player-height) w-full" />
			</div>

			<WidgetControls />
		</div>
	);
};
