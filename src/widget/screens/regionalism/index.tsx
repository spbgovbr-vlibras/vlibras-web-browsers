import { useState } from "react";
import { cn } from "@/common/lib/utils";
import { type Regionalism, regionalismArray } from "@/data/regionalism";
import { usePlayer } from "@/player/use-player";
import { usePlayerStore } from "@/player/use-player.store";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { Screen, ScreenContent } from "../components";
import { RegionalismHeader } from "./header";

export const RegionalismScreen = () => {
	const { region } = usePlayerStore();
	const { setRegion } = usePlayer();
	const { open } = useScreensStore();
	const [selected, setSelected] = useState<Regionalism>(region || regionalismArray[0]);
	return (
		<Screen>
			<RegionalismHeader />
			<ScreenContent className="p-0">
				<div className="m-0 flex h-full w-full flex-col justify-start overflow-y-auto">
					{regionalismArray.map((regionalism: Regionalism) => (
						<button
							type="button"
							key={regionalism.abbreviation}
							onClick={() => {
								setSelected(regionalism);
								setRegion(regionalism);
								open("settings");
							}}
							className={cn(
								"m-0 flex w-full cursor-pointer items-center justify-between px-5 py-2 transition-all hover:bg-foreground/10",
								selected === regionalism && "order-first",
							)}
						>
							<div className="flex items-center justify-start gap-3 font-semibold text-secondary text-sm dark:text-white">
								<img src={regionalism.url} alt={"teste"} className="h-7 w-auto rounded-sm" />
								{regionalism.name}
							</div>
							<input
								type="radio"
								className="radio-primary checked:radio-secondary h-5 w-5 border"
								checked={selected === regionalism}
								onChange={() => {
									setSelected(regionalism);
									setRegion(regionalism);
									open("settings");
								}}
							/>
						</button>
					))}
				</div>
			</ScreenContent>
		</Screen>
	);
};
