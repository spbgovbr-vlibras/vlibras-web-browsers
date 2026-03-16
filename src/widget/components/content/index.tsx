import { type ComponentPropsWithRef, useEffect } from "preact/compat";
import { cn } from "@/common/lib/utils";
import { textCapture } from "@/common/utils/text-capture";
import { createStyle } from "@/core/dom";
import { Player } from "@/player";
import { usePlayer } from "@/player/use-player";
import css from "@/widget/styles/text-capture.css?inline";
import { WidgetControls } from "../controls";
import { WidgetHeader } from "../header";

export const WidgetContent = ({ className, ...props }: Omit<ComponentPropsWithRef<"div">, "children">) => {
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
			<Player className="h-(--player-height) w-full" />
			<WidgetControls />
		</div>
	);
};
