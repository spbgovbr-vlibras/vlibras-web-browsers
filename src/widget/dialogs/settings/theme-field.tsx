import { useTheme } from "@/common/hooks";
import { LibrasTooltip } from "@/widget/components/libras-tooltip";
import { HandsIcon } from "@/widget/icons";

export const SettingsThemeField = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<div className="flex w-full items-start justify-between">
			<LibrasTooltip videoKey="active-dark-theme" videoClassName="h-44 mt-6">
				<p className="mobile:text-sm text-base">
					Tema escuro
					<HandsIcon aria-hidden="true" className="-mt-1.5 ml-1 inline size-4" />
				</p>
			</LibrasTooltip>

			<input
				type="checkbox"
				onChange={toggleTheme}
				checked={theme === "dark"}
				className="toggle toggle-sm rounded-full bg-accent text-primary before:size-4 before:rounded-full not-checked:before:bg-background checked:bg-primary checked:text-primary-foreground"
			/>
		</div>
	);
};
