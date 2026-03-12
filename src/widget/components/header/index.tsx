import { Button } from "@/widget/components/ui/button";
import { XIcon } from "@/widget/icons";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

export const WidgetHeader = () => {
	const { setOpenWidget } = useWidgetStore();

	return (
		<div className="absolute top-2 right-2 flex">
			<Button
				onClick={() => setOpenWidget(false)}
				aria-label="Fechar"
				title="Fechar"
				size="icon"
				variant="muted"
				className="rounded-full hover:bg-destructive hover:text-destructive-foreground"
			>
				<XIcon className="size-5" />
			</Button>
		</div>
	);
};
