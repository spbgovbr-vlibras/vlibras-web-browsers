import type { ComponentProps } from "preact/compat";
import { cn } from "@/common/lib/utils";
import { Player } from "@/player";
import { usePlayerStore } from "@/player/use-player.store";
import { WidgetControls } from "@/widget/components/controls";
import { WidgetHeader } from "@/widget/components/header";
import { rootStore } from "@/widget/stores/use-root.store";
import { useScreensStore } from "@/widget/stores/use-screens.store";

export const WidgetContent = ({ className, ...props }: Omit<ComponentProps<"div">, "children">) => {
	const screen = useScreensStore((s) => s.screen);
	const isLoaded = usePlayerStore((s) => s.isLoaded);

	return (
		<div
			{...props}
			id="vlibras-app-content"
			inert={screen !== "main"}
			ref={(ref) => void (ref && rootStore.set({ appContent: ref }))}
			className={cn("flex flex-col", (!isLoaded || screen !== "main") && "opacity-0", className)}
		>
			<WidgetHeader />
			<Player className="mb-2 h-(--player-height) max-h-[calc(100dvh-52px)] w-full" />
			<WidgetControls />
		</div>
	);
};
