import { Fragment } from "preact/jsx-runtime";
import { usePick } from "@/common/hooks";
import { usePlayerStore } from "@/player/use-player.store";
import { WidgetCallback } from "@/widget/components/controls/callback";
import { TranslatingBadge } from "@/widget/components/controls/translating-badge";
import { UnityLoading } from "@/widget/components/unity-loading";
import { FeedbackTrigger } from "@/widget/dialogs/feedback/trigger";
import { ScreensProvider } from "@/widget/providers/screens";
import { ToasterProvider } from "@/widget/providers/toaster";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

export const WidgetAppProviders = () => {
	const { status, gloss } = usePlayerStore(usePick("status", "gloss"));

	const text = useWidgetStore((s) => s.text);
	const isTranslating = useWidgetStore((s) => s.isTranslating);
	const showFeedback = Boolean(status === "idle" && !isTranslating && gloss && text);

	return (
		<Fragment>
			<WidgetCallback />
			<ScreensProvider />
			<UnityLoading />
			<ToasterProvider />

			{isTranslating && <TranslatingBadge />}
			{showFeedback && <FeedbackTrigger />}
		</Fragment>
	);
};
