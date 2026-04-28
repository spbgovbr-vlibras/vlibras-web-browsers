import { Fragment } from "preact/jsx-runtime";
import { usePick } from "@/common/hooks";
import { usePlayerStore } from "@/player/use-player.store";
import { WidgetCallback } from "@/widget/components/controls/callback";
import { TranslatingBadge } from "@/widget/components/controls/translating-badge";
import { UnityLoading } from "@/widget/components/unity-loading";
import { FeedbackTrigger } from "@/widget/dialogs/feedback/trigger";
import { useWidgetStore } from "../stores/use-widget.store";
import { ScreensProvider } from "./screens";
import { ToasterProvider } from "./toaster";

export const WidgetProviders = () => {
	const { status, gloss } = usePlayerStore(usePick("status", "gloss"));
	const isTranslating = useWidgetStore((s) => s.isTranslating);
	const text = useWidgetStore((s) => s.text);

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
