import { useMobile, useTheme } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { buttonVariants } from "@/widget/components/ui/button";
import { MoonIcon, SunIcon } from "@/widget/icons";
import { ScreenHeader, ScreenTitle } from "../components";

export const SettingsHeader = () => {
	const { theme, toggleTheme } = useTheme();
	const isMobile = useMobile();

	return (
		<ScreenHeader close>
			<ScreenTitle>Configurações</ScreenTitle>

			<label
				className={cn(
					buttonVariants({ variant: "ghost", size: isMobile ? "icon-sm" : "icon" }),
					"swap swap-rotate ml-auto",
				)}
			>
				<input
					type="checkbox"
					onChange={toggleTheme}
					className="absolute inset-0 rounded-lg"
					checked={theme === "light"}
				/>

				<MoonIcon className={cn("swap-off absolute")} title="Modo escuro" />
				<SunIcon className={cn("swap-on absolute")} title="Modo claro" />
			</label>
		</ScreenHeader>
	);
};
