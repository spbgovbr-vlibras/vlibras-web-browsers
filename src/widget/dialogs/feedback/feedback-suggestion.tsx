import { useRef } from "preact/hooks";
import { usePlayer } from "@/player/use-player";
import { Button } from "@/widget/components/ui/button";
import { ChevronDownIcon } from "@/widget/icons/chevron-down";

type Props = {
	isOpen: boolean;
	gloss: string | undefined;
	onClose: () => void;
};

export const FeedbackSuggestion = ({ isOpen, gloss, onClose }: Props) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { play } = usePlayer();

	return (
		<div inert={!isOpen} data-backdrop="true" className="pointer-events-auto fixed inset-0 z-50 animate-move-up">
			<div className="absolute right-0 bottom-0 left-0 flex h-4/5 flex-col rounded-t-2xl bg-background shadow-2xl">
				<div className="flex items-center justify-between border-b px-4 py-3">
					<span className="font-semibold text-foreground">Feedback</span>
					<Button
						onClick={onClose}
						aria-label="Fechar"
						size="icon"
						variant="ghost"
						className="bg-background hover:bg-muted"
					>
						<ChevronDownIcon />
					</Button>
				</div>

				<div className="flex flex-1 flex-col gap-1 overflow-hidden px-4 py-4">
					<div className="flex items-center justify-between">
						<label
							for="translator-input"
							className="font-medium text-muted-foreground text-xs uppercase tracking-wider"
						>
							Informe a glosa correta
						</label>
					</div>

					<textarea
						ref={textareaRef}
						id="translator-input"
						placeholder=""
						className="w-full rounded-sm border bg-muted/50 px-3 py-2.5 text-foreground text-sm"
						rows={6}
					>
						{gloss}
					</textarea>

					<Button className="h-10 w-full rounded-4xl bg-primary font-medium" variant="default" onClick={async () => {}}>
						Enviar sugestão
					</Button>

					<Button
						className="h-10 w-full rounded-4xl border border-primary bg-background font-medium text-primary"
						variant="ghost"
						onClick={async () => {
							if (textareaRef.current) {
								play(textareaRef.current.value);
							}
						}}
					>
						Reproduzir
					</Button>
				</div>
			</div>
		</div>
	);
};
