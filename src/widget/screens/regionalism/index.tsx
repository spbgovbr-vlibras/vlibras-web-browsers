import { posthogg } from "@/common/lib/posthog";
import { cn } from "@/common/lib/utils";
import { type Regionalism, regionalismArray } from "@/data/regionalism";
import { usePlayer } from "@/player/use-player";
import { usePlayerStore } from "@/player/use-player.store";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { Screen, ScreenContent } from "../components";
import { RegionalismHeader } from "./header";

export const RegionalismScreen = () => {
	const currentRegion = usePlayerStore((s) => s.region);
	const open = useScreensStore((s) => s.open);

	const { setRegion } = usePlayer();

	const handleRegionChange = (region: Regionalism) => {
		setRegion(region);
		open("settings");
		posthogg.trackEvent("region_change", { region });
	};

	return (
		<Screen>
			<RegionalismHeader />
			<ScreenContent className="p-0">
				<div className="m-0 flex h-full w-full flex-col justify-start overflow-y-auto">
					{regionalismArray.map((regionalism: Regionalism) => {
						const isSelected = currentRegion === regionalism;

						return (
							<button
								inert={isSelected}
								type="button"
								key={regionalism.abbreviation}
								onClick={() => handleRegionChange(regionalism)}
								className={cn(
									"m-0 flex w-full cursor-pointer items-center justify-between whitespace-nowrap px-5 py-2 transition-all hover:bg-foreground/10",
									isSelected && "order-first",
								)}
							>
								<div className="flex items-center justify-start gap-3 font-semibold mobile:text-xs text-secondary text-sm dark:text-white">
									<img src={regionalism.url} alt={regionalism.name} className="h-7 w-auto rounded-sm" />
									{regionalism.name}
								</div>
								<input
									inert
									type="radio"
									name="radio1"
									className="radio-primary checked:radio-secondary size-5 border"
									checked={currentRegion === regionalism}
								/>
							</button>
						);
					})}
				</div>
			</ScreenContent>
		</Screen>
	);
};
