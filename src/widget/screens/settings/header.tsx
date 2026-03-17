import { useTheme } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { Button, buttonVariants } from "@/widget/components/ui/button";
import { ArrowLeftIcon, MoonIcon, SunIcon } from "@/widget/icons";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { ScreenHeader, ScreenTitle } from "../components";

export const SettingsHeader = () => {
	const { closeAllScreens } = useScreensStore();
	const { theme, toggleTheme } = useTheme();

	return (
		<ScreenHeader>
			<Button onClick={closeAllScreens} className="rounded-full" variant="ghost" size="icon-sm">
				<ArrowLeftIcon className="size-5" />
			</Button>
			<ScreenTitle>Configurações</ScreenTitle>

			<label
				className={cn("swap swap-rotate ml-auto rounded-full!", buttonVariants({ variant: "ghost", size: "icon-sm" }))}
			>
				<input type="checkbox" onChange={toggleTheme} className="sr-only" checked={theme === "light"} />

				<MoonIcon className={cn("swap-off absolute size-5")} />
				<SunIcon className={cn("swap-on absolute size-5")} />
			</label>
		</ScreenHeader>
	);
};
