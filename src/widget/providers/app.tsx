import { Fragment } from "preact/jsx-runtime";
import { WidgetCallback } from "@/widget/components/controls/callback";
import { TranslatingBadge } from "@/widget/components/controls/translating-badge";
import { UnityLoading } from "@/widget/components/unity-loading";
import { useWidgetStore } from "../stores/use-widget.store";
import { ScreensProvider } from "./screens";
import { ToasterProvider } from "./toaster";

export const WidgetProviders = () => {
	const isTranslating = useWidgetStore((s) => s.isTranslating);

	return (
		<Fragment>
			<WidgetCallback />
			<ScreensProvider />
			<UnityLoading />
			<ToasterProvider />

			{isTranslating && <TranslatingBadge />}
		</Fragment>
	);
};
