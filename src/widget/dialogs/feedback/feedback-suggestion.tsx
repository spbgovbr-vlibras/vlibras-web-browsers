import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { useMobile } from "@/common/hooks";
import { toast } from "@/common/lib/toaster";
import { Trie } from "@/common/lib/trie";
import { sendFeedback } from "@/core/actions";
import { useDictionarySigns } from "@/core/actions/hooks";
import { usePlayer } from "@/player/use-player";
import { playerStore } from "@/player/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/widget/components/ui/dialog";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { applySuggestion, getCaretCoordinates, getCurrentWord } from "./lib/suggestions";
import { SuggestionPopup } from "./suggestion-popup";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	gloss: string | undefined;
};

export const FeedbackSuggestion = ({ open, onOpenChange, gloss }: Props) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { play, playStatic } = usePlayer();
	const text = useWidgetStore((s) => s.text);
	const { data } = useDictionarySigns();
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [coords, setCoords] = useState({ top: 0, left: 0 });
	const isMobile = useMobile();
	const [value, setValue] = useState(gloss || "");
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		setValue(gloss || "");
	}, [gloss]);

	const trie = useMemo(() => (data ? new Trie(data) : null), [data]);

	const handleInput = (e: Event) => {
		const el = e.currentTarget as HTMLTextAreaElement;
		const cursorPos = el.selectionStart ?? 0;

		const nextValue = el.value;
		setValue(nextValue);

		const word = getCurrentWord(nextValue, cursorPos);

		if (word.length < 2) {
			setSuggestions([]);
			return;
		}

		setSuggestions(trie ? trie.searchSigns(word) : []);
		setCoords(getCaretCoordinates(el, cursorPos));
	};

	const handleSubmit = async () => {
		if (!text || !gloss || !value) return;
		setIsSubmitting(true);

		try {
			const result = await sendFeedback({
				text,
				translation: gloss,
				review: value,
				rating: "bad",
			});
			if (result.success) {
				onOpenChange(false);
				toast("Agradecemos sua contribuição!", { variant: "primary", className: "font-semibold" });
				playStatic("AGRADECER");
				playerStore.set({ gloss: undefined });
			} else {
				console.error(result.error);
				if (result.error) {
					toast(result.error, { variant: "destructive" });
				}
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Feedback</DialogTitle>
				</DialogHeader>
				<div className="flex flex-1 flex-col gap-1 px-4 py-4">
					<div className="flex items-center justify-between">
						<label
							for="translator-input"
							className="font-medium text-muted-foreground text-xs uppercase tracking-wider"
						>
							Informe a glosa correta
						</label>
					</div>

					<div className="relative">
						<textarea
							ref={textareaRef}
							id="translator-input"
							value={value}
							placeholder=""
							className="w-full rounded-sm border bg-muted/50 px-3 py-2.5 text-foreground text-sm"
							rows={isMobile ? 4 : 6}
							onInput={handleInput}
						/>
						<SuggestionPopup
							suggestions={suggestions}
							coords={coords}
							onSelect={(suggestion) => {
								if (!textareaRef.current) return;

								const cursor = textareaRef.current.selectionStart ?? 0;

								setValue(applySuggestion(value, cursor, suggestion));

								setSuggestions([]);
							}}
						/>
					</div>

					<Button
						className="h-10 w-full rounded-4xl bg-primary font-medium"
						variant="default"
						onClick={handleSubmit}
						disabled={isSubmitting}
					>
						{isSubmitting ? "Enviando..." : "Enviar sugestão"}
					</Button>

					<Button
						className="h-10 w-full rounded-4xl border border-primary bg-background font-medium text-primary"
						variant="ghost"
						onClick={() => {
							play(value);
						}}
					>
						Reproduzir
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
