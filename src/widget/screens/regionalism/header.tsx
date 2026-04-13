import { useTheme } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { buttonVariants } from "@/widget/components/ui/button";
import { MoonIcon, SunIcon } from "@/widget/icons";
import { ScreenHeader, ScreenTitle } from "../components";

export const RegionalismHeader = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<ScreenHeader close>
			<ScreenTitle>Regionalismo</ScreenTitle>

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
