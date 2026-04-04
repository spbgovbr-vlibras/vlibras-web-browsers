import { useMobile } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import { FullscreenIcon, XIcon } from "@/widget/icons";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { useDraggable } from "../draggable";
import { WidgetMenu } from "./menu";

export const WidgetHeader = () => {
	const { onPointerDown } = useDraggable();

	const setOpen = useWidgetStore((s) => s.setOpen);
	const isMobile = useMobile();

	const onClose = () => {
		setOpen(false);
	};

	return (
		<div className={cn("relative bottom-auto flex items-center justify-between gap-1 bg-primary px-2 py-1.5")}>
			<div {...{ onPointerDown }} className="absolute inset-0 z-0 hover:cursor-move" />

			<span
				inert
				className="absolute left-1/2 -translate-x-1/2 font-semibold text-primary-foreground text-sm leading-0 sm:text-base"
			>
				VLibras
			</span>

			<WidgetMenu />

			<Tooltip
				className="whitespace-nowrap text-xs"
				offset={2}
				content="Tela cheia"
				placement="bottom"
				align="end"
				arrow={{ position: "top-right" }}
			>
				<Button className="z-1" aria-label="Tela cheia" size={isMobile ? "icon-sm" : "icon"} variant="default">
					<FullscreenIcon />
				</Button>
			</Tooltip>

			<Button
				onClick={onClose}
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
