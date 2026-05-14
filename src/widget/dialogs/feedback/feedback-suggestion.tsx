import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { useMobile } from "@/common/hooks";
import { toast } from "@/common/lib/toaster";
import { Trie } from "@/common/lib/trie";
import { sendFeedback } from "@/core/actions";
import { useDictionarySigns } from "@/core/actions/hooks";
import { usePlayer } from "@/player/use-player";
import { playerStore } from "@/player/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { ChevronDownIcon } from "@/widget/icons/chevron-down";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { applySuggestion, getCaretCoordinates, getCurrentWord } from "./lib/suggestions";
import { SuggestionPopup } from "./suggestion-popup";

type Props = {
	isOpen: boolean;
	gloss: string | undefined;
	onClose: () => void;
};

export const FeedbackSuggestion = ({ isOpen, gloss, onClose }: Props) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { play, playText } = usePlayer();
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
				onClose();
				toast("Agradecemos sua contribuição!", { variant: "success" });
				await playText("Agradecemos sua contribuição!");
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

	if (!isOpen) return null;

	return (
		<div data-backdrop="true" className="pointer-events-auto fixed inset-0 z-50 animate-move-up">
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
			</div>
		</div>
	);
};
