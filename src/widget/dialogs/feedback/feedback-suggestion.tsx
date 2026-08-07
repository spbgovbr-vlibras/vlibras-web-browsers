import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { useDebouncedCallback, useMobile } from "@/common/hooks";
import { Trie } from "@/common/lib/trie";
import { useDictionarySigns, useSendFeedback } from "@/core/actions/hooks";
import { playStatic } from "@/player/actions";
import { playerStore } from "@/player/stores/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/widget/components/ui/dialog";
import { widgetStore } from "@/widget/stores/use-widget.store";
import { onFeedbackError, onFeedbackSuccess } from "@/widget/utils/feedback";
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
	const { mutateAsync: sendFeedback, isPending } = useSendFeedback();

	const [suggestions, setSuggestions] = useState<string[]>([]);
	const [coords, setCoords] = useState({ top: 0, left: 0 });
	const [value, setValue] = useState<string>("");
	const isEmpty = !value.trim();

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

		try {
			await sendFeedback({
				text,
				translation: gloss,
				review: value.toUpperCase(),
				rating: "bad",
			});

			onOpenChange(false);
			onFeedbackSuccess();
		} catch (err) {
			onFeedbackError(err as Error);
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
							className="h-40 mobile:h-32 w-full resize-none rounded-lg border bg-muted p-3 mobile:text-sm uppercase placeholder:normal-case"
							rows={isMobile ? 4 : 6}
							onChange={handleInput}
						/>
						<SuggestionPopup onSelect={handleSelectSuggestion} suggestions={suggestions} coords={coords} />
					</div>

					<div className="space-y-2 [&>button]:h-10 [&>button]:w-full [&>button]:rounded-full mobile:[&>button]:text-sm">
						<Button variant="default" onClick={handleSubmit} disabled={isPending || isEmpty}>
							{isPending ? "Enviando..." : "Enviar sugestão"}
						</Button>

						<Button disabled={isPending || isEmpty} variant="outline" onClick={() => playStatic(value)}>
							Reproduzir
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
