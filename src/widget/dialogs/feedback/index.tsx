import { usePlayerStore } from "@/player/use-player.store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/widget/components/ui/dialog";
import { CommentIcon } from "@/widget/icons";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export const FeedbackDialog = ({ open, onOpenChange }: Props) => {
	const gloss = usePlayerStore((s) => s.gloss);
	const text = useWidgetStore((s) => s.text);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle icon={CommentIcon}>Feedback</DialogTitle>
				</DialogHeader>

				<div className="overflow-y-auto p-4 pt-2 text-sm">
					<p className="mb-1 text-muted-foreground">{text}</p>
					<span className="font-semibold">{gloss}</span>
				</div>
			</DialogContent>
		</Dialog>
	);
};
