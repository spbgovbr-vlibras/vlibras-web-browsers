import { useRef } from "preact/hooks";
import { cn } from "@/common/lib/utils";
import { useTranslate } from "@/core/actions/hooks";
import { usePlayer } from "@/player/use-player";
import { Button } from "@/widget/components/ui/button";
import { XIcon } from "@/widget/icons";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

export const TranslatorSheet = ({ isOpen, onClose }: Props) => {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const { mutateAsync: translate } = useTranslate();
	const { play } = usePlayer();

	return (
		<div
			inert={!isOpen}
			data-backdrop="true"
			className={cn(
				"fixed inset-0 z-50 transition-all duration-10",
				isOpen ? "pointer-events-auto bg-background/30" : "bg-transparent",
			)}
		>
			<div
				className={cn(
					"absolute right-0 bottom-0 left-0 h-4/5",
					"rounded-t-2xl bg-background shadow-2xl",
					"flex flex-col",
					"transition-transform duration-300 ease-out",
					isOpen ? "translate-y-0" : "translate-y-full",
				)}
			>
				<div className="flex items-center justify-between border-b px-4 py-3">
					<span className="font-semibold text-foreground">Tradutor</span>
					<Button
						onClick={onClose}
						aria-label="Fechar"
						size="icon"
						variant="ghost"
						className="bg-background hover:bg-destructive hover:text-destructive-foreground"
					>
						<XIcon />
					</Button>
				</div>

				<div className="flex flex-1 flex-col gap-1 overflow-hidden px-4 py-4">
					<div className="flex items-center justify-between">
						<label
							for="translator-input"
							className="font-medium text-muted-foreground text-xs uppercase tracking-wider"
						>
							Insira seu texto
						</label>
						<Button
							onClick={() => {
								if (textareaRef.current) textareaRef.current.value = "";
							}}
							className="bg-transparent font-semibold text-destructive/70 hover:text-destructive"
						>
							Limpar
						</Button>
					</div>

					<textarea
						ref={textareaRef}
						id="translator-input"
						placeholder="Digite o texto para traduzir..."
						className="w-full flex-1 rounded-sm border bg-muted/50 px-3 py-2.5 text-foreground text-sm"
					/>

					<Button
						className="h-10 w-full rounded-xl bg-primary font-medium"
						variant="default"
						onClick={async () => {
							const text = textareaRef.current?.value;
							if (text) {
								useWidgetStore.setState({ isTranslating: true, text });
								const gloss = await translate(text);
								useWidgetStore.setState({ isTranslating: false });
								play(gloss);
								onClose();
							}
						}}
					>
						Traduzir
					</Button>
				</div>
			</div>
		</div>
	);
};
