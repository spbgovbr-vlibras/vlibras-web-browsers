import type { ElementType } from "preact/compat";
import { useShallow } from "zustand/shallow";
import { pickKeys } from "@/common/utils";
import { usePlayer } from "@/player/use-player";
import { Button } from "@/widget/components/ui/button";
import { InfoIcon, SettingsIcon } from "@/widget/icons";
import { DictionaryIcon } from "@/widget/icons/dictionary";
import type { CustomSVGProps } from "@/widget/icons/types";
import { type Screen, useScreensStore } from "@/widget/stores/use-screens.store";

const callbackScreens: Partial<Record<Screen, { label: string; icon: ElementType<CustomSVGProps> }>> = {
	settings: {
		label: "Configurações",
		icon: SettingsIcon,
	},
	about: {
		label: "Sobre",
		icon: InfoIcon,
	},
	dictionary: {
		label: "Dicionário",
		icon: DictionaryIcon,
	},
};

export const CallbackScreen = () => {
	const { status } = usePlayer();
	const { callbackScreen, open } = useScreensStore(useShallow((s) => pickKeys(s, "open", "callbackScreen")));
	const currentScreen = callbackScreen && callbackScreens[callbackScreen];

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
				<Icon className="" />
				Reabrir {label}
			</Button>
		</div>
	);
};
