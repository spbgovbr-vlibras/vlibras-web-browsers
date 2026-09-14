import { useId } from "preact/hooks";
import { useTheme } from "@/common/hooks";
import { posthogg } from "@/common/lib/posthog";
import { InlineTranslatorButton } from "@/widget/components/inline-translator-button";
import { useSettingsCtx } from "./context";

export const SettingsThemeField = () => {
	const theme = useTheme((s) => s.theme);
	const onOpen = useSettingsCtx((s) => s.onOpen);
	const inputId = useId();

	const handleToggleTheme = () => {
		const { theme, toggleTheme } = useTheme.getState();
		const newTheme = theme === "dark" ? "Claro" : "Escuro";

		toggleTheme();
		posthogg.trackEvent("theme", { theme: newTheme });
	};

	return (
		<label htmlFor={inputId} className="flex w-full cursor-pointer items-center justify-between py-1">
			<span className="mobile:text-sm text-base">
				Tema escuro
				<InlineTranslatorButton gloss="TEMA ESCURO" label="Tema escuro" onFinish={onOpen} />
			</span>

			<input
				type="checkbox"
				id={inputId}
				onChange={handleToggleTheme}
				checked={theme === "dark"}
				className="toggle toggle-sm rounded-full bg-accent text-primary before:size-4 before:rounded-full not-checked:before:bg-background checked:bg-primary checked:text-primary-foreground"
			/>
		</label>
	);
};
