import { useRef } from "preact/hooks";
import { isTrackingAvailable } from "@/common/lib/posthog";
import { useGuideStore } from "@/widget/components/guide/store";
import { InlineTranslatorButton } from "@/widget/components/inline-translator-button";
import { Button } from "@/widget/components/ui/button";
import { consentStore, useConsentStore } from "@/widget/stores/use-consent.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

export const ConsentBanner = () => {
	const status = useConsentStore((s) => s.status);
	const isTranslating = useWidgetStore((s) => s.isTranslating);
	const isGuideOpen = useGuideStore((s) => s.open);

	const hasTranslatedRef = useRef(false);
	if (isTranslating) hasTranslatedRef.current = true;

	if (!isTrackingAvailable || status !== "pending" || hasTranslatedRef.current || isGuideOpen) return null;

	return (
		<div className="absolute inset-2 top-auto z-100 flex animate-move-up flex-col gap-2 rounded-lg border bg-background p-2.5 text-sm shadow-2xl dark:bg-muted">
			<p>
				Podemos coletar dados anônimos de uso para melhorar o <strong>VLibras</strong>?
				<InlineTranslatorButton gloss="COLETAR DADO&INFORMAÇÃO ANÔNIMO USAR MELHORAR VLIBRAS [INTERROGAÇÃO]" />
			</p>

			<div className="flex justify-end gap-2">
				<Button
					className="hover:bg-destructive/5 hover:text-destructive"
					onClick={() => consentStore.get().decline()}
					variant="ghost"
					size="sm"
				>
					Não aceitar
				</Button>

				<Button onClick={() => consentStore.get().accept()} variant="default" size="sm">
					Aceitar
				</Button>
			</div>
		</div>
	);
};
