import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";
import { useDebouncedCallback, useMobile } from "@/common/hooks";
import { Trie } from "@/common/lib/trie";
import { useDictionarySigns, useSendFeedback } from "@/core/actions/hooks";
import { playStatic } from "@/player/actions";
import { playerStore } from "@/player/stores/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/widget/components/ui/dialog";
import { createCallback } from "@/widget/stores/use-callback.store";
import { widgetStore } from "@/widget/stores/use-widget.store";
import { onFeedbackSuccess } from "@/widget/utils/feedback";
import { applySuggestion, getCaretCoordinates, getCurrentWord } from "./lib/suggestions";
import { feedbackSuggestionStore } from "./stores/use-feedback-suggestion.store";
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

	useEffect(() => {
		const { draftValue } = feedbackSuggestionStore.get();
		setValue(draftValue ?? playerStore.get().gloss ?? "");
		feedbackSuggestionStore.set({ reopen: false, draftValue: undefined });
	}, []);

	const trie = useMemo(() => (data ? new Trie(data) : null), [data]);
	const isEmpty = !value.trim();

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

	const handleSubmit = () => {
		const { text } = widgetStore.get();
		const { gloss } = playerStore.get();

		if (!text || !gloss || !value) return;

		try {
			sendFeedback({
				text,
				translation: gloss,
				review: value.toUpperCase(),
				rating: "bad",
			});
		} finally {
			onOpenChange(false);
			onFeedbackSuccess();
		}
	};

	const handleSelectSuggestion = (suggestion: string) => {
		if (!textareaRef.current) return;

		const cursor = textareaRef.current.selectionStart ?? 0;

		setValue(applySuggestion(value, cursor, suggestion));
		setSuggestions([]);
		textareaRef.current.focus();
	};

	const handlePlay = useCallback(() => {
		if (!value) return;

		playStatic(value);
		createCallback({
			action: () => feedbackSuggestionStore.set({ reopen: true, draftValue: value }),
			auto: true,
		});
	}, [value]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle icon="comment">Feedback</DialogTitle>
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

						<Button disabled={isPending || isEmpty} variant="outline" onClick={handlePlay}>
							Reproduzir
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
