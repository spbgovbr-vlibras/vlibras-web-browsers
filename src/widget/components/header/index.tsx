import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import { FullscreenIcon, XIcon } from "@/widget/icons";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { WidgetMenu } from "./menu";

export const WidgetHeader = () => {
	const { setOpen } = useWidgetStore();

	const onClose = () => {
		setOpen(false);
	};

	return (
		<div className="absolute inset-0 bottom-auto flex items-center justify-between gap-1 p-2 [&_button]:rounded-full">
			<WidgetMenu />

			<div className="ml-auto">
				<Tooltip
					className="whitespace-nowrap text-xs"
					offset={2}
					content="Tela cheia"
					placement="bottom"
					align="end"
					arrow={{ position: "top-right" }}
				>
					<Button aria-label="Tela cheia" size="icon" variant="outline">
						<FullscreenIcon />
					</Button>
				</Tooltip>
			</div>

			<Button
				onClick={onClose}
				aria-label="Fechar"
				size="icon"
				variant="ghost"
				className="hover:bg-destructive hover:text-destructive-foreground"
			>
				<XIcon />
			</Button>
		</div>
	);
};
