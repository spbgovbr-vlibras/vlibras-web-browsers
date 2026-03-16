import { usePlayer } from "@/player/use-player";
import { Button } from "@/widget/components/ui/button";
import { XIcon } from "@/widget/icons";

export const WidgetHeader = () => {
	const { play } = usePlayer();

	return (
		<div className="absolute top-2 right-2 flex">
			<Button
				onClick={() => play("testando")}
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
