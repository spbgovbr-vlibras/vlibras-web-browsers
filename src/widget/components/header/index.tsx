import { useDraggable } from "@/widget/components/draggable";
import { Button } from "@/widget/components/ui/button";
import { MoveIcon, XIcon } from "@/widget/icons";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

export const WidgetHeader = () => {
	const { setOpen } = useWidgetStore();
	const { onPointerDown } = useDraggable();

	const onClose = () => {
		setOpen(false);
		setTimeout(() => setOpen(true), 1000);
	};

	return (
		<div className="absolute inset-0 bottom-auto flex items-center justify-between p-2">
			<Button
				{...{ onPointerDown }}
				aria-label="Arrastar"
				title="Arrastar"
				size="icon-sm"
				variant="ghost"
				className="bg-transparent! hover:opacity-80"
			>
				<MoveIcon className="size-5" />
			</Button>

			<Button
				onClick={onClose}
				aria-label="Fechar"
				title="Fechar"
				size="icon-sm"
				variant="ghost"
				className="hover:bg-destructive hover:text-destructive-foreground"
			>
				<XIcon className="size-5" />
			</Button>
		</div>
	);
};
