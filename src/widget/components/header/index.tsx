import { Fragment } from "preact/jsx-runtime";
import { useMobile } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { pause } from "@/player/actions";
import { useGuideStore } from "@/widget/components/guide/store";
import { Button } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import { Spacer } from "@/widget/components/ui/spacer";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { useDraggable } from "../draggable";
import { ExpandOption } from "./expand-option";
import { WidgetMenu } from "./menu";

export const WidgetHeader = () => {
	const { onPointerDown } = useDraggable();

	const isMobile = useMobile();
	const setOpen = useWidgetStore((s) => s.setOpen);
	const isGuideOpen = useGuideStore((s) => s.open);

	const handleClose = () => {
		setOpen(false);
		pause();
	};

	return (
		<div className={cn("relative bottom-auto z-50 bg-primary px-2 py-1.5", !__IS_EXTENSION__ && "sm:rounded-t-xl")}>
			<div
				{...{ onPointerDown }}
				className={cn(
					"absolute inset-0 z-0 touch-none",
					!__IS_EXTENSION__ && "not-expanded:hover:cursor-move sm:hover:cursor-move",
				)}
			/>

			<div
				inert={isGuideOpen}
				className="flex w-full items-center justify-between gap-1 **:data-[highlight=true]:animate-highlight-primary-foreground"
			>
				<WidgetMenu />

				{!__IS_EXTENSION__ && (
					<div className="mr-2 ml-1">
						<span className="absolute inset-y-0 w-px bg-primary-foreground/30" />
					</div>
				)}

				<div className="mr-2 flex items-center gap-1.5 font-semibold text-primary-foreground text-sm">
					<div className="flex size-5.5 items-end justify-center rounded-full bg-primary-foreground text-primary">
						<Icon name="icaro" className="size-4.5" />
					</div>
					VLibras
				</div>

				{!__IS_EXTENSION__ && (
					<Fragment>
						<Spacer className="w-full" />

						<div id="header-actions" className="flex items-center gap-1 [&_button]:not-hover:bg-transparent">
							<ExpandOption />

							<Button
								onClick={handleClose}
								aria-label="Fechar"
								size={isMobile ? "icon-sm" : "icon"}
								variant="default"
								className="z-1"
							>
								<Icon name="x" />
							</Button>
						</div>
					</Fragment>
				)}
			</div>
		</div>
	);
};
