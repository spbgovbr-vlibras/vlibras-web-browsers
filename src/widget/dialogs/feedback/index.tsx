import { useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { toast } from "@/common/lib/toaster";
import { sendFeedback } from "@/core/actions";
import { usePlayer } from "@/player/use-player";
import { playerStore, usePlayerStore } from "@/player/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/widget/components/ui/dialog";
import { CommentIcon } from "@/widget/icons";
import { ThumbsDownIcon } from "@/widget/icons/thumbs-down";
import { ThumbsUpIcon } from "@/widget/icons/thumbs-up";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { FeedbackSuggestion } from "./feedback-suggestion";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export const FeedbackDialog = ({ open, onOpenChange }: Props) => {
	const gloss = usePlayerStore((s) => s.gloss);
	const text = useWidgetStore((s) => s.text);
	const { playStatic } = usePlayer();

	const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);

	return (
		<Fragment>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle icon={CommentIcon}>Feedback</DialogTitle>
					</DialogHeader>

					<div className="mt-6 flex flex-col items-center justify-center">
						<p className="font-semibold">Gostou da tradução?</p>
						<div className="flex items-center justify-center gap-5">
							<Button
								variant="ghost"
								size="icon-xl"
								className="px-7 py-10"
								onClick={async () => {
									if (text && gloss) {
										const result = await sendFeedback({
											text: text,
											translation: gloss,
											review: gloss,
											rating: "good",
										});

										if (result.success) {
											onOpenChange(false);
											toast("Agradecemos sua contribuição!", { variant: "success" });
											playStatic("AGRADECER");
											playerStore.set({ gloss: undefined });
										} else {
											onOpenChange(false);
											if (result.error) {
												toast(result.error, { variant: "destructive" });
											}
											console.error(result.error);
										}
									}
								}}
							>
								<div className="flex flex-col items-center justify-center">
									<ThumbsUpIcon className="text-muted-foreground" />
									<span>Sim</span>
								</div>
							</Button>
							<Button
								variant="ghost"
								size="icon-xl"
								className="px-7 py-10"
								onClick={() => {
									onOpenChange(false);
									setIsSuggestionOpen(true);
								}}
							>
								<div className="flex flex-col items-center justify-center">
									<ThumbsDownIcon className="text-muted-foreground" />
									<span>Não</span>
								</div>
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
			<FeedbackSuggestion open={isSuggestionOpen} onOpenChange={setIsSuggestionOpen} gloss={gloss} />
		</Fragment>
	);
};
