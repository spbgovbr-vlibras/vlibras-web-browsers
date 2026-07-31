import type { ComponentProps } from "preact";
import { usePick } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { Player } from "@/player";
import { usePlayerStore } from "@/player/use-player.store";
import { ConsentBanner } from "@/widget/components/consent-banner";
import { WidgetControls } from "@/widget/components/controls";
import { WidgetHeader } from "@/widget/components/header";
import { Utilities } from "@/widget/components/utilities";
import { rootStore } from "@/widget/stores/use-root.store";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { playerOptions } from "./player-options";

export const WidgetContent = ({ className, ...props }: Omit<ComponentProps<"div">, "children">) => {
	const screen = useScreensStore((s) => s.screen);
	const { isLoaded, isMounted } = usePlayerStore(usePick("isLoaded", "isMounted"));

	return (
		<div
			{...props}
			id="vlibras-app-content"
			inert={screen !== "main"}
			ref={(ref) => void (ref && rootStore.set({ appContent: ref }))}
			className={cn("flex flex-col", (!isLoaded || screen !== "main") && "opacity-0", className)}
		>
			<WidgetHeader />
			<ConsentBanner />
			{isMounted && (
				<Player
					className={cn("mb-2 h-(--player-height) w-full", !__IS_EXTENSION__ && "max-h-[calc(100dvh-52px)]")}
					options={playerOptions}
				/>
			)}
			<Utilities />
			<WidgetControls />
		</div>
	);
};
