import { useMemo } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useMobile, useTheme } from "@/common/hooks";
import { regions } from "@/data/regionalism";
import { usePlayerStore } from "@/player/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/widget/components/ui/dialog";
import { Tooltip } from "@/widget/components/ui/tooltip";
import { RotateLeftIcon } from "@/widget/icons";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { SettingsOpacityField } from "./opacity-field";
import { SettingsRegionalismField } from "./regionalism-field";
import { SettingsThemeField } from "./theme-field";

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export const SettingsDialog = ({ open, onOpenChange }: Props) => {
	const isMobile = useMobile();
	const region = usePlayerStore((s) => s.region);
	const opacity = useWidgetStore((s) => s.opacity);

	const { theme, setTheme } = useTheme();

	const handleReset = () => {
		const defaultRegion = regions[0];

		setTheme("light");
		usePlayerStore.setState({ region: defaultRegion });
		useWidgetStore.setState({ opacity: 1 });
	};

	const isDefaultSettings = useMemo(() => {
		return region.abbreviation === "BR" && opacity === 1 && theme === "light";
	}, [region, opacity, theme]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader className="relative">
					<DialogTitle className="ml-0">Configurações</DialogTitle>

					{!isDefaultSettings && (
						<Fragment>
							<Tooltip
								className="-mr-1 text-xs"
								align="end"
								placement="bottom"
								content="Redefinir"
								arrow={{ position: "top-right" }}
							>
								<Button
									onClick={handleReset}
									variant="ghost"
									size={isMobile ? "icon-xs" : "icon-sm"}
									className="animate-move-up mobile:text-xs text-sm"
								>
									<RotateLeftIcon />
								</Button>
							</Tooltip>

							<div>
								<span className="absolute inset-y-0 w-px bg-border" />
							</div>
						</Fragment>
					)}
				</DialogHeader>

				<div className="space-y-4 overflow-y-auto p-4">
					<SettingsThemeField />
					<SettingsRegionalismField />
					<SettingsOpacityField />
				</div>
			</DialogContent>
		</Dialog>
	);
};
