import { useTheme } from "@/common/hooks";

export const SettingsThemeField = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<label className="flex w-full items-start justify-between">
			<p className="mobile:text-sm text-base">Tema escuro</p>
			<input
				type="checkbox"
				onChange={toggleTheme}
				checked={theme === "dark"}
				className="toggle toggle-sm rounded-full bg-accent text-primary before:size-4 before:rounded-full not-checked:before:bg-background checked:bg-primary checked:text-primary-foreground"
			/>
		</label>
	);
};
