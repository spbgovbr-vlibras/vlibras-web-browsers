import { useEffect, useRef } from "preact/hooks";
import { isTrackingAvailable } from "@/common/lib/posthog";
import { usePlayerStore } from "@/player/stores/use-player.store";
import { useGuideStore } from "@/widget/components/guide/store";
import { InlineTranslatorButton } from "@/widget/components/inline-translator-button";
import { Button } from "@/widget/components/ui/button";
import { consentStore, useConsentStore } from "@/widget/stores/use-consent.store";
import { focusWidgetPanel, trapTabFocus } from "@/widget/utils/focus";

export const ConsentBanner = () => {
	const status = useConsentStore((s) => s.status);
	const isGuideOpen = useGuideStore((s) => s.open);
	const isPlaying = usePlayerStore((s) => s.status === "playing" && !!s.gloss);
	const bannerRef = useRef<HTMLDivElement | null>(null);

	const isVisible = isTrackingAvailable && status === "pending" && !isGuideOpen && !isPlaying;

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
			aria-label="Consentimento de coleta de dados"
			onKeyDown={(e) => {
				if (e.key === "Escape") {
					e.stopPropagation();
					handleEscape();
					return;
				}
				trapTabFocus(bannerRef.current, e);
			}}
			className="absolute inset-2 top-auto z-100 flex animate-move-up flex-col gap-2.5 rounded-lg border bg-background p-2.5 text-sm shadow-2xl dark:bg-muted"
		>
			<p>
				Podemos coletar dados anônimos de uso para melhorar o <strong>VLibras</strong>?
				<InlineTranslatorButton gloss="COLETAR DADO&INFORMAÇÃO ANÔNIMO USAR MELHORAR VLIBRAS [INTERROGAÇÃO]" />
			</p>

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
