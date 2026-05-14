import { usePick } from "@/common/hooks";
import { usePlayerStore } from "@/player/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { screensMap } from "./screens-map";

export const CallbackScreen = () => {
	const status = usePlayerStore((s) => s.status);
	const { callbackScreen, open } = useScreensStore(usePick("callbackScreen", "open"));

	const currentScreen = callbackScreen && screensMap[callbackScreen];

	if (!callbackScreen || status !== "idle" || !currentScreen) return null;

	const { label, icon: Icon } = currentScreen;

	const handleReopen = () => {
		open(callbackScreen);
		useScreensStore.setState({ callbackScreen: undefined });
	};

	return (
		<div className="absolute -top-9 z-50 animate-move-up rounded-full bg-background!">
			<Button
				onClick={handleReopen}
				variant="outline"
				size="xs"
				className="h-auto! rounded-full bg-background! font-semibold text-primary hover:bg-muted!"
			>
				<Icon />
				Reabrir {label}
			</Button>
		</div>
	);
};
