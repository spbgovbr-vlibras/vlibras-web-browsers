import type { ComponentProps } from "preact";
import { cn } from "@/common/lib/utils";
import { overlayStore, useOverlayStore } from "@/widget/stores/use-overlay.store";

export const AppOverlay = ({ className, ...props }: ComponentProps<"div">) => {
	const isOpen = useOverlayStore((s) => s.openId !== null);
	const showOverlay = useOverlayStore((s) => s.showOverlay);

	if (!isOpen) return null;

	return (
		<div
			{...{ onClick: overlayStore.close }}
			{...props}
			className={cn("absolute inset-0", showOverlay && "bg-black/5", className)}
		/>
	);
};
