import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { useDebouncedCallback, useMobile } from "@/common/hooks";
import { toast } from "@/common/lib/toaster";
import { Trie } from "@/common/lib/trie";
import { sendFeedback } from "@/core/actions";
import { useDictionarySigns } from "@/core/actions/hooks";
import { play, playStatic } from "@/player/actions";
import { playerStore } from "@/player/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/widget/components/ui/dialog";
import { widgetStore } from "@/widget/stores/use-widget.store";
import { applySuggestion, getCaretCoordinates, getCurrentWord } from "./lib/suggestions";
import { SuggestionPopup } from "./suggestion-popup";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export const FeedbackSuggestion = ({ open, onOpenChange }: Props) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const isMobile = useMobile();

	const { data } = useDictionarySigns();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [coords, setCoords] = useState({ top: 0, left: 0 });
	const [value, setValue] = useState<string>("");

	useEffect(() => setValue(playerStore.get().gloss || ""), []);

	const trie = useMemo(() => (data ? new Trie(data) : null), [data]);

	const handleInput = useDebouncedCallback<Event>(() => {
		if (!textareaRef.current) return;
		const el = textareaRef.current;
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
	}, 300);

	const handleSubmit = async () => {
		const { text } = widgetStore.get();
		const { gloss } = playerStore.get();

		if (!text || !gloss || !value) return;
		setIsSubmitting(true);

		try {
			const result = await sendFeedback({
				text,
				translation: gloss,
				review: value.toUpperCase(),
				rating: "bad",
			});
			if (result.success) {
				onOpenChange(false);
				toast("Agradecemos sua contribuição!", { variant: "primary", className: "font-semibold" });
				playStatic("AGRADECER");
				playerStore.set({ gloss: undefined });
			} else {
				console.error(result.error);
				if (result.error) toast(result.error, { variant: "destructive" });
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSelectSuggestion = (suggestion: string) => {
		if (!textareaRef.current) return;

		const cursor = textareaRef.current.selectionStart ?? 0;

		setValue(applySuggestion(value, cursor, suggestion));
		setSuggestions([]);
		textareaRef.current.focus();
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Feedback</DialogTitle>
				</DialogHeader>
				<div className="flex h-full flex-col gap-2 px-4 py-4">
					<div className="flex items-center justify-between">
						<label for="translator-input" className="font-semibold mobile:text-sm text-muted-foreground">
							Informe a glosa correta
						</label>
					</div>

					<div className="relative">
						<textarea
							ref={textareaRef}
							id="translator-input"
							value={value}
							placeholder="Digite aqui..."
							className="h-40 mobile:h-32 w-full resize-none rounded-xl border bg-muted p-3 mobile:text-sm uppercase placeholder:normal-case"
							rows={isMobile ? 4 : 6}
							onChange={handleInput}
						/>
						<SuggestionPopup onSelect={handleSelectSuggestion} suggestions={suggestions} coords={coords} />
					</div>

					<div className="space-y-2 [&>button]:h-10 [&>button]:w-full [&>button]:rounded-full mobile:[&>button]:text-sm">
						<Button variant="default" onClick={handleSubmit} disabled={isSubmitting}>
							{isSubmitting ? "Enviando..." : "Enviar sugestão"}
						</Button>

						<Button variant="outline" onClick={() => play(value)}>
							Reproduzir
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
