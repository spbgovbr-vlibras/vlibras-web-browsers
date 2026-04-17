import type { ComponentProps } from "preact/compat";
import { cn } from "@/common/lib/utils";
import { Player } from "@/player";
import { usePlayerStore } from "@/player/use-player.store";
import { WidgetControls } from "@/widget/components/controls";
import { WidgetHeader } from "@/widget/components/header";
import { useScreensStore } from "@/widget/stores/use-screens.store";

export const WidgetContent = ({ className, ...props }: Omit<ComponentProps<"div">, "children">) => {
	const screen = useScreensStore((s) => s.screen);
	const isLoaded = usePlayerStore((s) => s.isLoaded);

	return (
		<div
			{...props}
			inert={screen !== "main"}
			className={cn("flex flex-col", (!isLoaded || screen !== "main") && "opacity-0", className)}
		>
			<WidgetHeader />
			<Player className="mobile:mb-1 h-(--player-height) w-full" />
			<WidgetControls />
		</div>
	);
};
