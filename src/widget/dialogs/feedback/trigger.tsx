import { useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useGuideStore } from "@/widget/components/guide/store";
import { Button } from "@/widget/components/ui/button";
import { LikeIcon } from "@/widget/icons";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { FeedbackDialog } from ".";

export const FeedbackTrigger = () => {
	const [open, setOpen] = useState(false);

	const isExpanded = useWidgetStore((s) => s.isExpanded);
	const isGuideOpen = useGuideStore((s) => s.open);

	if (isGuideOpen) return null;

	return (
		<Fragment>
			<Button
				onClick={() => setOpen(true)}
				className="absolute right-2 bottom-15 animate-move-up rounded-full bg-background! font-semibold text-primary hover:bg-muted!"
				variant="outline"
				size={isExpanded ? "sm" : "xs"}
			>
				<LikeIcon />
				Avaliar
			</Button>

			<FeedbackDialog open={open} onOpenChange={setOpen} />
		</Fragment>
	);
};
