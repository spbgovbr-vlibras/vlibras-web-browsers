import { useTheme } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { Button, buttonVariants } from "@/widget/components/ui/button";
import { ArrowLeftIcon, MoonIcon, SunIcon } from "@/widget/icons";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { ScreenHeader, ScreenTitle } from "../components";

export const SettingsHeader = () => {
	const { closeAll } = useScreensStore();
	const { theme, toggleTheme } = useTheme();

	return (
		<ScreenHeader>
			<Button onClick={closeAll} variant="ghost" size="icon" className="rounded-full">
				<ArrowLeftIcon />
			</Button>
			<ScreenTitle>Configurações</ScreenTitle>

			<label
				className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "swap swap-rotate ml-auto rounded-full")}
			>
				<input
					type="checkbox"
					onChange={toggleTheme}
					className="absolute inset-0 rounded-full"
					checked={theme === "light"}
				/>

				<MoonIcon className={cn("swap-off absolute")} title="Modo escuro" />
				<SunIcon className={cn("swap-on absolute")} title="Modo claro" />
			</label>
		</ScreenHeader>
	);
};
