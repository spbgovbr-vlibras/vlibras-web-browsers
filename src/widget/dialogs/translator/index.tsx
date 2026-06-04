import { useRef, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useDebouncedCallback } from "@/common/hooks";
import { MaskIcon } from "@/common/utils/mask-icon";
import { useTranslate } from "@/core/actions/hooks";
import { play } from "@/player/actions";
import { InlineTranslatorButton } from "@/widget/components/inline-translator-button";
import { Button } from "@/widget/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/widget/components/ui/dialog";
import { Spinner } from "@/widget/components/ui/spinner";
import translatorIcon from "@/widget/icons/translator.webp";
import trashIcon from "@/widget/icons/trash.webp";
import { createCallback } from "@/widget/stores/use-callback.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export const TranslatorDialog = ({ open, onOpenChange }: Props) => {
	const inputRef = useRef<HTMLTextAreaElement>(null);
	const isTranslating = useWidgetStore((s) => s.isTranslating);

	const [text, setText] = useState("");
	const { mutateAsync: translate, isPending } = useTranslate();

	const onTextChange = useDebouncedCallback(setText, 300);

	const handleTranslate = async () => {
		const text = inputRef.current?.value || "";
		if (!text) return;

		try {
			const gloss = await translate(text);
			if (!gloss.length) throw new Error("Empty gloss");

			play(gloss);
			onOpenChange(false);

			createCallback({
				action: () => onOpenChange(true),
				content: (
					<Fragment>
						<MaskIcon src={translatorIcon} />
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
					<DialogTitle maskIconSrc={translatorIcon}>Tradutor</DialogTitle>
				</DialogHeader>

				<div className="space-y-2 overflow-y-auto p-4 pt-2">
					<div className="flex flex-col gap-1">
						<div className="flex h-8 items-center justify-between">
							<label htmlFor="translator-text" className="text-sm">
								Insira seu texto
								<InlineTranslatorButton gloss="INSERIR TEXTO" onFinish={() => onOpenChange(true)} />
							</label>

							{text.length > 0 && (
								<Button
									aria-label="Limpar texto"
									onClick={handleClear}
									size="icon-xs"
									variant="ghost"
									className="animate-move-up text-destructive"
								>
									<MaskIcon src={trashIcon} />
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
							className="h-32 w-full resize-none rounded-xl border bg-muted p-2"
						/>
					</div>

					<Button
						onClick={handleTranslate}
						disabled={isTranslating || isPending}
						className="h-10 w-full rounded-full text-sm"
					>
						{isPending && <Spinner className="size-4 text-primary-foreground" />}
						{isPending ? "Traduzindo..." : "Traduzir"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
