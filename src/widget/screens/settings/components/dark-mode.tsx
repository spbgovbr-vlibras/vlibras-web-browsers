import { useTheme } from "@/common/hooks";

export const ActiveDarkMode = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<div className="flex w-full flex-col space-y-1">
			<label className="flex w-full items-end justify-between">
				<p className="flex items-center gap-2 font-semibold text-base">Modo escuro</p>
				<div class="relative grid cursor-pointer place-items-center">
					<input checked={theme === "dark"} onChange={toggleTheme} type="checkbox" className="peer sr-only" />
					<div className="peer h-7 w-12 rounded-full bg-foreground/20 transition-colors duration-300 peer-checked:bg-primary" />
					<div className="absolute left-1 size-5 transform rounded-full bg-primary-foreground shadow-md transition-transform duration-300 peer-checked:translate-x-full" />
				</div>
			</label>

			<span className="text-muted-foreground text-sm">
				ltera a paleta de cores da interface para tons escuros, proporcionando uma experiência visual mais confortável
				em ambientes com pouca luz.
			</span>
		</div>
	);
};
