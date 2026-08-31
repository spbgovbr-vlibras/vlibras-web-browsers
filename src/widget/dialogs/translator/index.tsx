import { useEffect, useRef, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useDebouncedCallback } from "@/common/hooks";
import { posthogg } from "@/common/lib/posthog";
import { play } from "@/player/actions";
import { InlineTranslatorButton } from "@/widget/components/inline-translator-button";
import { Button } from "@/widget/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/widget/components/ui/dialog";
import { Icon } from "@/widget/components/ui/icon";
import { Spinner } from "@/widget/components/ui/spinner";
import { useTranslate } from "@/widget/hooks/use-translate";
import { createCallback } from "@/widget/stores/use-callback.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { isValidTranslationText } from "@/widget/utils";

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
	const isValidText = isValidTranslationText(text);

	useEffect(() => void (open && posthogg.trackEvent("open_translator")), [open]);

	const handleTranslate = async () => {
		const text = inputRef.current?.value || "";
		if (!text) return;

		try {
			const gloss = await translate(text);

			play(gloss || text);
			onOpenChange(false);

			createCallback({
				action: () => onOpenChange(true),
				content: (
					<Fragment>
						<Icon name="translator" />
						Reabrir Tradutor
					</Fragment>
				),
			});
		} catch (error) {
			console.error("Falha ao traduzir/reproduzir o texto do tradutor: ", error);
		}
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
				<DialogHeader closeProps={{ "aria-label": "Fechar tradutor" }}>
					<DialogTitle icon="translator">Tradutor</DialogTitle>
				</DialogHeader>

				<div className="space-y-2 overflow-y-auto p-4 pt-2">
					<div className="flex flex-col gap-1">
						<div className="flex h-8 items-center justify-between">
							<label htmlFor="translator-text" className="font-semibold text-sm">
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
									<Icon name="trash" />
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
							className="h-32 w-full resize-none rounded-lg border bg-muted p-2 text-sm"
						/>
					</div>

					<Button
						onClick={handleTranslate}
						disabled={text.length < 3 || isTranslating || isPending || !isValidText}
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
