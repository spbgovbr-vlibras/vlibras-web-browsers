import { type ComponentProps, useEffect, useRef } from "preact/compat";
import { cn } from "@/common/lib/utils";
import { Player } from "@/player";
import { usePlayerStore } from "@/player/use-player.store";
import { WidgetControls } from "@/widget/components/controls";
import { WidgetHeader } from "@/widget/components/header";
import { useRootStore } from "@/widget/stores/use-root.store";
import { useScreensStore } from "@/widget/stores/use-screens.store";

export const WidgetContent = ({ className, ...props }: Omit<ComponentProps<"div">, "children">) => {
	const contentRef = useRef<HTMLDivElement>(null);
	const screen = useScreensStore((s) => s.screen);
	const isLoaded = usePlayerStore((s) => s.isLoaded);

	useEffect(() => {
		if (contentRef.current) useRootStore.setState({ appContent: contentRef.current });
	}, []);

	return (
		<div
			{...props}
			ref={contentRef}
			inert={screen !== "main"}
			className={cn("flex flex-col", (!isLoaded || screen !== "main") && "opacity-0", className)}
		>
			<WidgetHeader />
			<Player className="mobile:mb-1 h-(--player-height) w-full" />
			<WidgetControls />
		</div>
	);
};
