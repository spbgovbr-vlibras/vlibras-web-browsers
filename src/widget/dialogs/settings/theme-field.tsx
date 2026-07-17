import { useTheme } from "@/common/hooks";
import { posthogg } from "@/common/lib/posthog";
import { InlineTranslatorButton } from "@/widget/components/inline-translator-button";
import { useSettingsCtx } from "./context";

export const SettingsThemeField = () => {
	const theme = useTheme((s) => s.theme);
	const onOpen = useSettingsCtx((s) => s.onOpen);

	const handleToggleTheme = () => {
		const { theme, toggleTheme } = useTheme.getState();
		const newTheme = theme === "dark" ? "Claro" : "Escuro";

		toggleTheme();
		posthogg.trackEvent("theme", { theme: newTheme });
	};

	return (
		<div className="flex w-full items-start justify-between">
			<p className="mobile:text-sm text-base">
				Tema escuro
				<InlineTranslatorButton gloss="TEMA ESCURO" onFinish={onOpen} />
			</p>

			<input
				type="checkbox"
				onChange={handleToggleTheme}
				checked={theme === "dark"}
				className="toggle toggle-sm rounded-full bg-accent text-primary before:size-4 before:rounded-full not-checked:before:bg-background checked:bg-primary checked:text-primary-foreground"
			/>
		</div>
	);
};
