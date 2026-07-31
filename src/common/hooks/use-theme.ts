import { create } from "zustand";

const THEME_KEY = "@vlibras-theme";

export type Theme = "light" | "dark";

type ThemeStoreState = {
	theme: Theme;
	toggleTheme: () => void;
	setTheme: (theme: Theme) => void;
};

const isValidTheme = (theme: Theme) => {
	return ["light", "dark"].includes(theme);
};

const readStoredTheme = (): Theme => {
	try {
		const theme = (localStorage.getItem(THEME_KEY) as Theme) || "";
		return isValidTheme(theme) ? theme : "light";
	} catch {
		return "light";
	}
};

const writeStoredTheme = (theme: Theme) => {
	try {
		localStorage.setItem(THEME_KEY, theme);
	} catch {
		// localStorage pode estar indisponível (modo privado, política do navegador etc.);
		// o tema ainda funciona no estado em memória, só não persiste entre sessões.
	}
};

export const useTheme = create<ThemeStoreState>((set) => ({
	theme: readStoredTheme(),
	toggleTheme: () =>
		set((state) => {
			const newTheme = state.theme === "dark" ? "light" : "dark";
			writeStoredTheme(newTheme);
			return { theme: newTheme, isDark: newTheme === "dark" };
		}),
	setTheme: (theme: Theme) => {
		writeStoredTheme(theme);
		set({ theme });
	},
}));
