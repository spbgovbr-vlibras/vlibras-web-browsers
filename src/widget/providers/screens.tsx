import { lazy, Suspense } from "preact/compat";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { Skeleton } from "../components/ui/skeleton";

const Dictionary = lazy(() => import("@/widget/screens/dictionary").then((m) => m.DictionaryScreen));
const About = lazy(() => import("@/widget/screens/about").then((m) => m.AboutScreen));

export const ScreensProvider = () => {
	const screen = useScreensStore((s) => s.screen);

	return (
		<Suspense fallback={<ScreenLoader />}>
			{screen === "dictionary" && <Dictionary />}
			{screen === "about" && <About />}
		</Suspense>
	);
};

const ScreenLoader = () => {
	return (
		<div className="absolute inset-0 w-full">
			<div className="flex w-full items-center gap-3 border-b p-2">
				<Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
				<Skeleton className="h-4 w-1/2" />
			</div>

			<div className="flex w-full flex-col gap-4 p-4">
				<Skeleton className="size-4 w-full" />
				<Skeleton className="size-4 w-[60%]" />
				<Skeleton className="size-4 w-[80%]" />
				<Skeleton className="size-4 w-[70%]" />
				<Skeleton className="size-4 w-[60%]" />
			</div>
		</div>
	);
};
