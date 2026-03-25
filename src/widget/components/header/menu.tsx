import { cn } from "@/common/lib/utils";
import { Button } from "@/widget/components/ui/button";
import { HelpIcon, InfoIcon, MenuIcon, TranslatorIcon } from "@/widget/icons";
import { DictionaryIcon } from "@/widget/icons/dictionary";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { MenuOption } from "./menu-option";

export const WidgetMenu = () => {
	const { open } = useScreensStore();

	return (
		<div
			className={cn(
				"fab fab-open abosolute! inset-auto top-2 left-2 gap-1! pt-10",
				"**:data-[slot=tooltip-content]:ml-10!",
			)}
		>
			<Button
				role="button"
				tabindex={0}
				aria-label="Menu de opções"
				size="icon"
				variant="ghost-gov"
				className="absolute top-0! focus-within:bg-primary focus-within:text-primary-foreground active:bg-primary"
			>
				<MenuIcon />
			</Button>

			<MenuOption onClick={() => open("about")} label="Sobre o VLibras" icon={InfoIcon} />
			<MenuOption label="Guia Rápido" icon={HelpIcon} />
			<MenuOption label="Tradutor" icon={TranslatorIcon} />
			<MenuOption label="Dicionário" icon={DictionaryIcon} />
		</div>
	);
};
