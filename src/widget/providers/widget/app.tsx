import { Fragment } from "preact/jsx-runtime";
import { usePlayerStore } from "@/player/stores/use-player.store";
import { TranslatingBadge } from "@/widget/components/controls/translating-badge";
import { UnityLoading } from "@/widget/components/unity-loading";
import { ScreensProvider } from "@/widget/providers/screens";
import { ToasterProvider } from "@/widget/providers/toaster";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

export const WidgetAppProviders = () => {
	const isTranslating = useWidgetStore((s) => s.isTranslating);
	const isLoaded = usePlayerStore((s) => s.isLoaded);

	return (
		<Fragment>
			{!isLoaded && <UnityLoading />}

			<ScreensProvider />
			<ToasterProvider />

			{isTranslating && <TranslatingBadge />}
		</Fragment>
	);
};
