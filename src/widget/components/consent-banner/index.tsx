import { useEffect, useId, useRef } from "preact/hooks";
import { consentStore } from "@/common/stores/use-consent.store";
import { InlineTranslatorButton } from "@/widget/components/inline-translator-button";
import { Button } from "@/widget/components/ui/button";
import { Separator } from "@/widget/components/ui/separator";
import { focusWidgetPanel, trapTabFocus } from "@/widget/utils/focus";
import { useConsentBannerVisible } from "./use-visible";

export const ConsentBanner = () => {
	const bannerRef = useRef<HTMLDivElement | null>(null);
	const hintId = useId();

	const isVisible = useConsentBannerVisible();

	useEffect(() => {
		if (!isVisible) return;
		const frame = requestAnimationFrame(() => bannerRef.current?.focus({ preventScroll: true }));
		return () => cancelAnimationFrame(frame);
	}, [isVisible]);

	if (!isVisible) return null;

	const handleDecline = () => {
		consentStore.get().decline();
		requestAnimationFrame(() => focusWidgetPanel());
	};

	const handleAccept = () => {
		consentStore.get().accept();
		requestAnimationFrame(() => focusWidgetPanel());
	};

	const handleEscape = () => {
		handleDecline();
	};

	return (
		<div
			ref={bannerRef}
			tabIndex={-1}
			role="dialog"
			aria-modal="true"
			aria-label="Consentimento de coleta de dados"
			aria-describedby={hintId}
			onKeyDown={(e) => {
				if (e.key === "Escape") {
					e.stopPropagation();
					handleEscape();
					return;
				}
				trapTabFocus(bannerRef.current, e);
			}}
			className="absolute inset-2 top-auto z-100 flex animate-move-up flex-col gap-2 rounded-lg border bg-background p-2.5 text-sm shadow-2xl dark:bg-muted"
		>
			<p>
				Podemos coletar dados anônimos de uso para melhorar o <strong>VLibras</strong>?
				<InlineTranslatorButton
					gloss="COLETAR DADO&INFORMAÇÃO ANÔNIMO USAR MELHORAR VLIBRAS [INTERROGAÇÃO]"
					label="Consentimento de coleta de dados"
				/>
			</p>

			<p id={hintId} className="text-muted-foreground text-xs">
				Fechar este aviso ou pressionar Esc equivale a não aceitar.
			</p>

			<Separator className="-mx-2.5" />

			<div className="flex justify-end gap-2">
				<Button
					className="hover:bg-destructive/5 hover:text-destructive"
					onClick={handleDecline}
					variant="ghost"
					size="sm"
				>
					Não aceitar
				</Button>

				<Button onClick={handleAccept} variant="default" size="sm">
					Aceitar
				</Button>
			</div>
		</div>
	);
};
