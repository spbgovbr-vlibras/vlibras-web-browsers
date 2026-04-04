import type { ComponentProps } from "preact/compat";
import { cn } from "@/common/lib/utils";
import { Player } from "@/player";
import { usePlayer } from "@/player/use-player";
import { WidgetControls } from "@/widget/components/controls";
import { WidgetHeader } from "@/widget/components/header";
import { useScreensStore } from "@/widget/stores/use-screens.store";

export const WidgetContent = ({ className, ...props }: Omit<ComponentProps<"div">, "children">) => {
	const screen = useScreensStore((s) => s.screen);
	const { isLoaded } = usePlayer();

	return (
		<div
			{...props}
			inert={screen !== "main"}
			className={cn("flex flex-col", (!isLoaded || screen !== "main") && "opacity-0", className)}
		>
			<WidgetHeader />
			<Player className="h-(--player-height) w-full" />
			<WidgetControls />
		</div>
	);
};
