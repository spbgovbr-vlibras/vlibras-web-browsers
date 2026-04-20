import { usePick } from "@/common/hooks";
import { usePlayerStore } from "@/player/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { resetCallback, useCallbackButtonStore } from "@/widget/stores/use-callback.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

export const WidgetCallback = () => {
	const status = usePlayerStore((s) => s.status);
	const isExpanded = useWidgetStore((s) => s.isExpanded);
	const { action, content } = useCallbackButtonStore(usePick("action", "content"));

	if (!action || !content || status !== "idle") return null;

	const handleClick = () => {
		action();
		resetCallback();
	};

	return (
		<div className="absolute inset-x-2 bottom-15 flex animate-move-up items-center gap-2">
			<Button
				onClick={handleClick}
				variant="outline"
				className="rounded-full bg-background! text-primary hover:bg-muted!"
				size={isExpanded ? "sm" : "xs"}
			>
				{content}
			</Button>
		</div>
	);
};
