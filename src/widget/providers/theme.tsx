import { useEffect } from "preact/hooks";
import { useTheme } from "@/common/hooks/use-theme";

interface ThemeProviderProps {
	children: preact.ComponentChildren;
	root?: HTMLElement | ShadowRoot;
}

export const ThemeProvider = ({ children, root: rootElement }: ThemeProviderProps) => {
	const { theme } = useTheme();

	useEffect(() => {
		const root = rootElement || document.documentElement;
		const targetElement = root instanceof ShadowRoot ? (root.host as HTMLElement) : (root as HTMLElement);

		targetElement.classList.toggle("dark", theme === "dark");
	}, [theme, rootElement]);

	return children;
};
