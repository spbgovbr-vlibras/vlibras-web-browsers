import { useRef, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useDebouncedCallback } from "@/common/hooks";
import { useTranslate } from "@/core/actions/hooks";
import { usePlayer } from "@/player/use-player";
import { Button } from "@/widget/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/widget/components/ui/dialog";
import { TranslatorIcon, TrashIcon } from "@/widget/icons";
import { createCallback } from "@/widget/stores/use-callback.store";
import { useRootStore } from "@/widget/stores/use-root.store";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export const TranslatorDialog = ({ open, onOpenChange }: Props) => {
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const { play } = usePlayer();
	const { mutateAsync: translate, isPending } = useTranslate();
	const [text, setText] = useState("");
	const appContent = useRootStore((s) => s.appContent);

	const onTextChange = useDebouncedCallback(setText, 300);

	const handleTranslate = async () => {
		if (!appContent) return;

		try {
			const gloss = await translate(text);
			if (!gloss.length) throw new Error("Empty gloss");

			play(gloss);
			onOpenChange(false);

			createCallback({
				action: () => onOpenChange(true),
				content: (
					<Fragment>
						<TranslatorIcon />
						Reabrir Tradutor
					</Fragment>
				),
			});
		} catch {}
	};

	const handleClear = () => {
		if (!inputRef.current) return;

		inputRef.current.value = "";
		inputRef.current?.focus();
		setText("");
	};

	const onKeyPress = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (text.length >= 3) handleTranslate();
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="flex items-center gap-1.5">
						<TranslatorIcon className="size-5" />
						Tradutor
					</DialogTitle>
				</DialogHeader>

				<div className="space-y-2 overflow-y-auto p-4 pt-2">
					<div className="flex flex-col gap-1">
						<div className="flex h-8 items-center justify-between">
							<label htmlFor="translator-text" className="text-sm">
								Insira seu texto
							</label>

							{text.length > 0 && (
								<Button
									aria-label="Limpar texto"
									onClick={handleClear}
									size="icon-xs"
									variant="ghost"
									className="animate-move-up text-destructive"
								>
									<TrashIcon />
								</Button>
							)}
						</div>

						<textarea
							defaultValue={text}
							ref={inputRef}
							onKeyPress={onKeyPress}
							onChange={(e) => onTextChange(e.currentTarget.value)}
							name="text"
							id="translator-text"
							className="h-32 w-full resize-none rounded-lg border bg-muted p-2"
						/>
					</div>

					<Button onClick={handleTranslate} disabled={text.length < 3 || isPending} className="w-full text-sm">
						{isPending ? "Traduzindo..." : "Traduzir"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
