import { useRef } from "preact/hooks";
import { logoBrasil } from "@/assets";
import { posthogg } from "@/common/lib/posthog";
import { regionalismArray } from "@/data/regionalism";
import { usePlayerStore } from "@/player/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { Screen, ScreenContent } from "../components";
import { SettingsHeader } from "./header";
import { SettingsField } from "./settingsfield";

export const SettingsScreen = () => {
	const timeoutRef = useRef<NodeJS.Timeout>(null);

	const region = usePlayerStore((s) => s.region);
	const opacity = useWidgetStore((s) => s.opacity);
	const open = useScreensStore((s) => s.open);

	const handleReset = () => {
		const defaultRegion = regionalismArray[0];

		usePlayerStore.setState({ region: defaultRegion });
		useWidgetStore.setState({ opacity: 1 });
	};

	const handleOpacityChange = (opacity: number) => {
		useWidgetStore.setState({ opacity: opacity / 100 });

		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => posthogg.trackEvent("opacity_change", { opacity }), 2000);
	};

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
							<span className="text-muted-foreground">Regionalismo</span>
							<div className="flex items-center gap-3 rounded-sm p-1 hover:bg-foreground/10">
								<img className="h-7 w-auto rounded-sm" src={region.url} alt={logoBrasil} />
								<span>{region.abbreviation}</span>
							</div>
						</button>
					</SettingsField>

					<SettingsField label="Aparência">
						<div className="flex flex-col gap-2">
							<div className="flex justify-between">
								<span className="text-muted-foreground">Opacidade</span>
								<span>{Math.round(Number(opacity) * 100)} %</span>
							</div>
							<input
								type="range"
								min={0}
								max={100}
								step={5}
								value={Number(opacity) * 100}
								onChange={(e) => handleOpacityChange(Number(e.currentTarget.value))}
								className="range range-xs text-primary [--range-bg:var(--muted)] [--range-thumb:var(--primary-foreground)]"
								onPointerDown={(e) => e.stopPropagation()}
							/>
						</div>
					</SettingsField>
				</div>

				<Button onClick={handleReset} variant="outline" className="mt-auto" size="sm">
					Restaurar padrão
				</Button>
			</ScreenContent>
		</Screen>
	);
};
