import { useId } from "preact/hooks";
import { useTheme } from "@/common/hooks";
import { posthogg } from "@/common/lib/posthog";
import { InlineTranslatorButton } from "@/widget/components/inline-translator-button";
import { useSettingsCtx } from "./context";

export const SettingsThemeField = () => {
	const theme = useTheme((s) => s.theme);
	const onOpen = useSettingsCtx((s) => s.onOpen);
	const labelId = useId();

	const handleToggleTheme = () => {
		const { theme, toggleTheme } = useTheme.getState();
		const newTheme = theme === "dark" ? "Claro" : "Escuro";

		toggleTheme();
		posthogg.trackEvent("theme", { theme: newTheme });
	};

	return (
		<div className="flex w-full items-center justify-between">
			<span className="mobile:text-sm text-base">
				<span id={labelId}>Tema escuro</span>
				<InlineTranslatorButton gloss="TEMA ESCURO" onFinish={onOpen} />
			</span>

			<input
				type="checkbox"
				id={`${labelId}-input`}
				aria-labelledby={labelId}
				onChange={handleToggleTheme}
				checked={theme === "dark"}
				className="toggle toggle-sm rounded-full bg-accent text-primary before:size-4 before:rounded-full not-checked:before:bg-background checked:bg-primary checked:text-primary-foreground"
			/>
		</div>
	);
};
