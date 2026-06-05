import { useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useMobile } from "@/common/hooks";
import { useGuideStore } from "@/widget/components/guide/store";
import { Button } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import { FeedbackDialog } from "@/widget/dialogs/feedback";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

export const FeedbackTrigger = () => {
	const [open, setOpen] = useState(false);

	const isMobile = useMobile();
	const isExpanded = useWidgetStore((s) => s.isExpanded);
	const isGuideOpen = useGuideStore((s) => s.open);

	if (isGuideOpen) return null;

	return (
		<Fragment>
			<Button
				onClick={() => setOpen(true)}
				className="animate-move-up rounded-full bg-background! font-semibold text-primary hover:bg-muted!"
				variant="outline"
				size={isExpanded ? "default" : isMobile ? "xs" : "sm"}
			>
				<Icon name="like" />
				Avaliar
			</Button>

			<FeedbackDialog open={open} onOpenChange={setOpen} />
		</Fragment>
	);
};
