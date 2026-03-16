import type { ComponentPropsWithRef } from "preact/compat";
import { Player } from "@/player";
import { WidgetControls } from "../controls";
import { WidgetHeader } from "../header";

export const WidgetContent = (props: Omit<ComponentPropsWithRef<"div">, "children">) => {
	return (
		<div {...props} className="flex flex-col">
			<WidgetHeader />
			<Player className="h-96 w-full sm:h-z" />
			<WidgetControls />
		</div>
	);
};
