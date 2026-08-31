import { lazy, Suspense } from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useMobile } from "@/common/hooks";
import { useSendFeedback } from "@/core/actions/hooks";
import { playerStore } from "@/player/stores/use-player.store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/widget/components/ui/dialog";
import { widgetStore } from "@/widget/stores/use-widget.store";
import { onFeedbackSuccess } from "@/widget/utils/feedback";
import { FeedbackLikeConfirm } from "./feedback-like-confirm";
import { FeedbackQuestion } from "./feedback-question";
import { useFeedbackSuggestionStore } from "./stores/use-feedback-suggestion.store";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

const FeedbackSuggestion = lazy(() => import("./feedback-suggestion").then((m) => ({ default: m.FeedbackSuggestion })));

export const FeedbackDialog = ({ open, onOpenChange }: Props) => {
	const isMobile = useMobile();

	const [isSuggestionOpen, setIsSuggestionOpen] = useState<boolean>();
	const [isLikeConfirmOpen, setLikeConfirmOpen] = useState(false);
	const reopenSuggestion = useFeedbackSuggestionStore((s) => s.reopen);

	const { mutateAsync: sendFeedback, isPending } = useSendFeedback();

	useEffect(() => void (open && setLikeConfirmOpen(false)), [open]);

	const handleSuggestionOpen = () => {
		onOpenChange(false);
		setIsSuggestionOpen(true);
	};

	useEffect(() => void (reopenSuggestion && handleSuggestionOpen()), [reopenSuggestion]);

	const handleConfirmLike = () => {
		const { gloss } = playerStore.get();
		const { text } = widgetStore.get();

		if (!gloss || !text) return;

		try {
			sendFeedback({
				text: text,
				translation: gloss,
				review: gloss,
				rating: "good",
			});
		} finally {
			onOpenChange(false);
			setLikeConfirmOpen(false);
			onFeedbackSuccess();
		}
	};

	return (
		<Fragment>
			<Dialog open={open || isPending} onOpenChange={onOpenChange}>
				<DialogContent>
					<DialogHeader closeProps={{ "aria-label": "Fechar feedback" }}>
						<DialogTitle icon="comment">Feedback</DialogTitle>
					</DialogHeader>

					<div className="flex flex-col items-center justify-center gap-2 p-6">
						<p className="font-semibold mobile:text-sm text-base">
							{isLikeConfirmOpen ? "Confirmar avaliação positiva?" : "Gostou da tradução?"}
						</p>

						{isLikeConfirmOpen ? (
							<FeedbackLikeConfirm
								isPending={isPending}
								isMobile={isMobile}
								onConfirm={handleConfirmLike}
								onCancel={() => setLikeConfirmOpen(false)}
							/>
						) : (
							<FeedbackQuestion
								isPending={isPending}
								onLike={() => setLikeConfirmOpen(true)}
								onDislike={handleSuggestionOpen}
							/>
						)}
					</div>
				</DialogContent>
			</Dialog>

			{isSuggestionOpen !== undefined && (
				<Suspense fallback={null}>
					<FeedbackSuggestion open={isSuggestionOpen} onOpenChange={setIsSuggestionOpen} />
				</Suspense>
			)}
		</Fragment>
	);
};
