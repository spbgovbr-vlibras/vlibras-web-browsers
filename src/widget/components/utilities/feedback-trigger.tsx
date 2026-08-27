import { lazy, Suspense } from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useMobile } from "@/common/hooks";
import { useGuideStore } from "@/widget/components/guide/store";
import { Button } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import { useFeedbackSuggestionStore } from "@/widget/dialogs/feedback/stores/use-feedback-suggestion.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

const FeedbackDialog = lazy(() => import("@/widget/dialogs/feedback").then((m) => ({ default: m.FeedbackDialog })));

export const FeedbackTrigger = () => {
	const [open, setOpen] = useState<boolean>();

	const isMobile = useMobile();
	const isExpanded = useWidgetStore((s) => s.isExpanded);
	const isGuideOpen = useGuideStore((s) => s.open);
	const reopenSuggestion = useFeedbackSuggestionStore((s) => s.reopen);

	useEffect(() => void (reopenSuggestion && setOpen(true)), [reopenSuggestion]);

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

			{open !== undefined && (
				<Suspense fallback={null}>
					<FeedbackDialog open={open} onOpenChange={setOpen} />
				</Suspense>
			)}
		</Fragment>
	);
};
