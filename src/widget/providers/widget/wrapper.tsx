import { lazy, Suspense } from "preact/compat";
import { Fragment } from "preact/jsx-runtime";
import { useGuideStore } from "@/widget/components/guide/store";

const Guide = lazy(() => import("@/widget/components/guide").then((m) => ({ default: m.Guide })));

export const WidgetWrapperProviders = () => {
	const isGuideOpen = useGuideStore((s) => s.open);

	return (
		<Fragment>
			{isGuideOpen && (
				<Suspense fallback={null}>
					<Guide />
				</Suspense>
			)}
		</Fragment>
	);
};
