import { useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { toast } from "@/common/lib/toaster";
import { sendFeedback } from "@/core/actions";
import { ERROR_MESSAGES } from "@/core/actions/messages";
import { playStatic } from "@/player/actions";
import { playerStore } from "@/player/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/widget/components/ui/dialog";
import { Icon } from "@/widget/components/ui/icon";
import { widgetStore } from "@/widget/stores/use-widget.store";
import { FeedbackSuggestion } from "./feedback-suggestion";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export const FeedbackDialog = ({ open, onOpenChange }: Props) => {
	const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);

	const handleSuggestionOpen = () => {
		onOpenChange(false);
		setIsSuggestionOpen(true);
	};

	const handleLike = async () => {
		const { gloss } = playerStore.get();
		const { text } = widgetStore.get();

		if (!gloss || !text) return;

		const result = await sendFeedback({ text: text, translation: gloss, review: gloss, rating: "good" });

		if (result.success) {
			onOpenChange(false);
			toast("Agradecemos sua contribuição!", { variant: "primary", className: "font-semibold" });
			playStatic("AGRADECER");
		} else {
			onOpenChange(false);
			if (result.error) toast(ERROR_MESSAGES.SEND_REVIEW_ERROR, { variant: "destructive" });
			console.error(result.error);
		}
	};

	return (
		<Fragment>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle icon="comment">Feedback</DialogTitle>
					</DialogHeader>

					<div className="flex flex-col items-center justify-center gap-2 p-6">
						<p className="font-semibold">Gostou da tradução?</p>
						<div className="flex items-center justify-center gap-4 [&>button]:flex-col [&>button]:text-muted-foreground">
							<Button
								variant="ghost"
								size="icon-xl"
								className="px-7 py-10 font-semibold hover:bg-primary/5 hover:text-primary"
								onClick={handleLike}
							>
								<Icon name="thumbs-up" />
								<span>Sim</span>
							</Button>
							<Button
								variant="ghost"
								size="icon-xl"
								className="px-7 py-10 font-semibold hover:bg-destructive/5 hover:text-destructive"
								onClick={handleSuggestionOpen}
							>
								<Icon name="thumbs-down" />
								<span>Não</span>
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
			<FeedbackSuggestion open={isSuggestionOpen} onOpenChange={setIsSuggestionOpen} />
		</Fragment>
	);
};
