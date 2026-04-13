import { useMobile } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { Button } from "@/widget/components/ui/button";
import { Spacer } from "@/widget/components/ui/spacer";
import { IcaroIcon, XIcon } from "@/widget/icons";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { useDraggable } from "../draggable";
import { FullscreenOption } from "./fullscreen-option";
import { WidgetMenu } from "./menu";

export const WidgetHeader = () => {
	const { onPointerDown } = useDraggable();

	const isMobile = useMobile();
	const setOpen = useWidgetStore((s) => s.setOpen);

	return (
		<div className={cn("relative bottom-auto flex items-center justify-center gap-1 bg-primary px-2 py-1.5")}>
			<div {...{ onPointerDown }} className="absolute inset-0 z-0 hover:cursor-move" />

			<WidgetMenu />

			<div className="mr-2 ml-1">
				<span className="absolute inset-y-0 w-px bg-primary-foreground/30" />
			</div>

			<div className="flex items-center gap-1.5 font-semibold text-primary-foreground text-sm">
				<div className="flex size-5.5 items-end justify-center rounded-full bg-primary-foreground">
					<IcaroIcon className="size-4.5 text-primary" />
				</div>
				VLibras
			</div>

			<Spacer className="w-full" />

			<FullscreenOption />

			<Button
				onClick={() => setOpen(false)}
				aria-label="Fechar"
				size={isMobile ? "icon-sm" : "icon"}
				variant="default"
				className="z-1 hover:bg-destructive hover:text-destructive-foreground"
			>
				<XIcon />
			</Button>
		</div>
	);
};
