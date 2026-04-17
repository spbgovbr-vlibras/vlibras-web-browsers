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
				<div className="flex h-full w-full flex-col justify-start overflow-y-auto p-1">
					{regionalismArray.map((regionalism: Regionalism) => {
						const isSelected = currentRegion === regionalism;

						return (
							<button
								inert={isSelected}
								type="button"
								key={regionalism.abbreviation}
								onClick={() => handleRegionChange(regionalism)}
								className={cn(
									"flex w-full cursor-pointer items-center justify-between whitespace-nowrap rounded-lg px-4 py-2 transition-all hover:bg-primary/10",
									isSelected && "order-first",
								)}
							>
								<div className="flex items-center justify-start gap-3 font-semibold mobile:text-xs text-secondary text-sm dark:text-white">
									<img
										src={regionalism.flag}
										alt={regionalism.name}
										className="h-7 mobile:h-6 w-auto rounded-md border"
									/>
									{regionalism.name}
								</div>
								<input
									inert
									type="radio"
									name="regionalism"
									className="radio mobile:size-4 size-5 border border-primary bg-transparent! p-0.75! text-primary"
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
