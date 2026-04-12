import { logoBrasil } from "@/assets";
import { usePlayerStore } from "@/player/use-player.store";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { Screen, ScreenContent } from "../components";
import { SettingsHeader } from "./header";
import { SettingsField } from "./settingsfield";

export const SettingsScreen = () => {
	const { region } = usePlayerStore();
	const { opacity } = useWidgetStore();
	const { open } = useScreensStore();

	return (
		<Screen>
			<SettingsHeader />
			<ScreenContent>
				<div className="flex h-full flex-col justify-start gap-2">
					<SettingsField label="Dicionário">
						<button
							type="button"
							onClick={() => open("regionalism")}
							className="flex w-full cursor-pointer items-center justify-between focus:outline-none"
						>
							<div>Regionalismo</div>
							<div className="flex items-center gap-3 rounded-sm p-1 hover:bg-foreground/10">
								<img className="h-7 w-auto rounded-sm" src={region.url} alt={logoBrasil} />
								<span>{region.abbreviation}</span>
							</div>
						</button>
					</SettingsField>

					<SettingsField label="Aparência">
						<div className="flex flex-col">
							<div className="flex justify-between">
								<span>Opacidade</span>
								<span>{Math.round(Number(opacity) * 100)} %</span>
							</div>
							<input
								type="range"
								min={0}
								max={100}
								step={5}
								value={Number(opacity) * 100}
								onChange={(e) => {
									useWidgetStore.setState({ opacity: Number(e.currentTarget.value) / 100 });
								}}
								className="accent-primary focus:outline-none"
								onPointerDown={(e) => e.stopPropagation()}
							/>
						</div>
					</SettingsField>
				</div>
			</ScreenContent>
		</Screen>
	);
};
