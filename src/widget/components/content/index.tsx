import type { ComponentProps } from "preact/compat";
import { cn } from "@/common/lib/utils";
import { Player } from "@/player";
import { WidgetControls } from "@/widget/components/controls";
import { WidgetHeader } from "@/widget/components/header";

export const WidgetContent = ({ className, ...props }: Omit<ComponentProps<"div">, "children">) => {
	return (
		<div {...props} className={cn("flex flex-col text-black", className)}>
			<WidgetHeader />
			<Player className="h-(--player-height) w-full" />
			<WidgetControls />
		</div>
	);
};
