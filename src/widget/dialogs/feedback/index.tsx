import { useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { toast } from "@/common/lib/toaster";
import { useSendFeedback } from "@/core/actions/hooks";
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

	const { mutateAsync: sendFeedback, isPending } = useSendFeedback();

	const handleSuggestionOpen = () => {
		onOpenChange(false);
		setIsSuggestionOpen(true);
	};

	const handleLike = async () => {
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

			onOpenChange(false);
			toast("Agradecemos sua contribuição!", { variant: "primary", className: "font-semibold" });
			playStatic("AGRADECER");

			widgetStore.set({ text: undefined });
		} catch (err) {
			const error = err as Error;
			if (error.message) toast(error.message, { variant: "destructive" });
		} finally {
			onOpenChange(false);
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
								disabled={isPending}
								variant="ghost"
								size="icon-xl"
								className="px-7 py-10 font-semibold hover:bg-primary/5 hover:text-primary"
								onClick={handleLike}
							>
								<Icon name="thumbs-up" />
								<span>Sim</span>
							</Button>
							<Button
								disabled={isPending}
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
