import { create } from "zustand";

const THEME_KEY = "@vwp-theme";

type Theme = "light" | "dark";

type ThemeStoreState = {
	theme: Theme;
	toggleTheme: () => void;
	setTheme: (theme: Theme) => void;
};

const isValidTheme = (theme: Theme) => {
	return ["light", "dark"].includes(theme);
};

export const useTheme = create<ThemeStoreState>((set) => ({
	theme: (() => {
		const theme = (localStorage.getItem(THEME_KEY) as Theme) || "";
		return isValidTheme(theme) ? theme : "light";
	})(),
	toggleTheme: () =>
		set((state) => {
			const newTheme = state.theme === "dark" ? "light" : "dark";
			localStorage.setItem(THEME_KEY, newTheme);
			return { theme: newTheme };
		}),
	setTheme: (theme: Theme) => {
		localStorage.setItem(THEME_KEY, theme);
		set({ theme });
	},
}));
