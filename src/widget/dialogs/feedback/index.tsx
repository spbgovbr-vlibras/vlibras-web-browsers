import { useEffect, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useMobile } from "@/common/hooks";
import { useSendFeedback } from "@/core/actions/hooks";
import { playerStore } from "@/player/stores/use-player.store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/widget/components/ui/dialog";
import { widgetStore } from "@/widget/stores/use-widget.store";
import { onFeedbackError, onFeedbackSuccess } from "@/widget/utils/feedback";
import { FeedbackLikeConfirm } from "./feedback-like-confirm";
import { FeedbackQuestion } from "./feedback-question";
import { FeedbackSuggestion } from "./feedback-suggestion";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export const FeedbackDialog = ({ open, onOpenChange }: Props) => {
	const isMobile = useMobile();

	const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
	const [isLikeConfirmOpen, setLikeConfirmOpen] = useState(false);

	const { mutateAsync: sendFeedback, isPending } = useSendFeedback();

	useEffect(() => void (open && setLikeConfirmOpen(false)), [open]);

	const handleSuggestionOpen = () => {
		onOpenChange(false);
		setIsSuggestionOpen(true);
	};

	const handleConfirmLike = async () => {
		const { gloss } = playerStore.get();
		const { text } = widgetStore.get();

		if (!gloss || !text) return;

		try {
			await sendFeedback({
				text: text,
				translation: gloss,
				review: gloss,
				rating: "good",
			});

			onFeedbackSuccess();
		} catch (err) {
			onFeedbackError(err as Error);
		} finally {
			onOpenChange(false);
			setLikeConfirmOpen(false);
		}
	};

	return (
		<Fragment>
			<Dialog open={open || isPending} onOpenChange={onOpenChange}>
				<DialogContent>
					<DialogHeader>
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
			<FeedbackSuggestion open={isSuggestionOpen} onOpenChange={setIsSuggestionOpen} />
		</Fragment>
	);
};
