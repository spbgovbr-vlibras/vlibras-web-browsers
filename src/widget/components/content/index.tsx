import { type ComponentProps, useEffect } from "preact/compat";
import { cn } from "@/common/lib/utils";
import { createStyle } from "@/core/dom";
import { Player } from "@/player";
import { usePlayer } from "@/player/use-player";
import { WidgetControls } from "@/widget/components/controls";
import { WidgetHeader } from "@/widget/components/header";
import css from "@/widget/styles/text-capture.css?inline";
import { textCapture } from "@/widget/utils/text-capture";

export const WidgetContent = ({ className, ...props }: Omit<ComponentProps<"div">, "children">) => {
	const { play, isLoaded } = usePlayer();

	useEffect(() => {
		if (!isLoaded) return;

		createStyle(css, "TEXT_CAPTURE");
		const cleanup = textCapture({
			hoverClss: "vlb--hover",
			activeClass: "vlb--active",
			callback: play,
		});
		return () => cleanup?.();
	}, [isLoaded]);

	return (
		<div {...props} className={cn("flex flex-col", className)}>
			<WidgetHeader />
			<Player className="pointer-events-none h-(--player-height) w-full" />
			<WidgetControls />
		</div>
	);
};
