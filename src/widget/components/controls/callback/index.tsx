import { usePick } from "@/common/hooks";
import { toast } from "@/common/lib/toaster";
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
		toast(
			<span className="line-clamp-2">
				testandook akdokokoko oo kwdkokawd pawokd paowkdawkdopkokk awodkawkdp awkd aowkdiawdijo
			</span>,
			{
				position: "top",
				align: "end",
			},
		);
		action();
		resetCallback();
	};

	return (
		<div className="absolute inset-x-2 bottom-14 flex animate-move-up items-center gap-2">
			<Button
				onClick={handleClick}
				variant="outline"
				className="rounded-full bg-background! font-semibold text-primary hover:bg-muted!"
				size={isExpanded ? "sm" : "xs"}
			>
				{content}
			</Button>
		</div>
	);
};
