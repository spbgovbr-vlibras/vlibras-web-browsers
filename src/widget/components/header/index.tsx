import { useMobile } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { usePlayer } from "@/player/use-player";
import { Button } from "@/widget/components/ui/button";
import { Spacer } from "@/widget/components/ui/spacer";
import { IcaroIcon, XIcon } from "@/widget/icons";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { useDraggable } from "../draggable";
import { useGuideStore } from "../guide/store";
import { ExpandOption } from "./expand-option";
import { WidgetMenu } from "./menu";

export const WidgetHeader = () => {
	const { onPointerDown } = useDraggable();
	const { pause } = usePlayer();

	const isMobile = useMobile();
	const setOpen = useWidgetStore((s) => s.setOpen);
	const isGuideOpen = useGuideStore((s) => s.open);

	const handleClose = () => {
		setOpen(false);
		pause();
	};

	return (
		<div className={cn("relative bottom-auto z-50 bg-primary px-2 py-1.5 sm:rounded-t-xl")}>
			<div
				{...{ onPointerDown }}
				className="absolute inset-0 z-0 touch-none not-expanded:hover:cursor-move sm:hover:cursor-move"
			/>

			<div
				inert={isGuideOpen}
				className="flex w-full items-center justify-center gap-1 **:data-[highlight=true]:animate-highlight-primary-foreground"
			>
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

				<div id="header-actions" className="flex items-center gap-1 [&_button]:bg-transparent">
					<ExpandOption />

					<Button
						onClick={handleClose}
						aria-label="Fechar"
						size={isMobile ? "icon-sm" : "icon"}
						variant="default"
						className="z-1"
					>
						<XIcon />
					</Button>
				</div>
			</div>
		</div>
	);
};
