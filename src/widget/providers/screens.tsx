import { Fragment } from "preact";
import { lazy, Suspense } from "preact/compat";
import { DialogFallback } from "@/widget/components/dialog-fallback";
import { useScreensStore } from "@/widget/stores/use-screens.store";

const DictionaryScreen = lazy(() =>
	import("@/widget/screens/dictionary").then((m) => ({ default: m.DictionaryScreen })),
);

const AboutScreen = lazy(() => import("@/widget/screens/about").then((m) => ({ default: m.AboutScreen })));

export const ScreensProvider = () => {
	const screen = useScreensStore((s) => s.screen);

	return (
		<Fragment>
			{screen === "dictionary" && (
				<Suspense fallback={<DialogFallback className="top-0" />}>
					<DictionaryScreen />
				</Suspense>
			)}

			{screen === "about" && (
				<Suspense fallback={<DialogFallback className="top-0" />}>
					<AboutScreen />
				</Suspense>
			)}
		</Fragment>
	);
};
