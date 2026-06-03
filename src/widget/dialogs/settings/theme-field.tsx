import { useTheme } from "@/common/hooks";
import { InlineTranslatorButton } from "@/widget/components/inline-translator-button";
import { useSettingsCtx } from "./context";

export const SettingsThemeField = () => {
	const { theme, toggleTheme } = useTheme();
	const { onOpen } = useSettingsCtx();

	return (
		<div className="flex w-full items-start justify-between">
			<p className="mobile:text-sm text-base">
				Tema escuro
				<InlineTranslatorButton gloss="TEMA ESCURO" onFinish={onOpen} />
			</p>

			<input
				type="checkbox"
				onChange={toggleTheme}
				checked={theme === "dark"}
				className="toggle toggle-sm rounded-full bg-accent text-primary before:size-4 before:rounded-full not-checked:before:bg-background checked:bg-primary checked:text-primary-foreground"
			/>
		</div>
	);
};
