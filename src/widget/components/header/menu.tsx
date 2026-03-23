import { cn } from "@/common/lib/utils";
import { Button } from "@/widget/components/ui/button";
import { HelpIcon, InfoIcon, MenuIcon, TranslatorIcon } from "@/widget/icons";
import { DictionaryIcon } from "@/widget/icons/dictionary";
import { MenuOption } from "./menu-option";

export const WidgetMenu = () => {
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
				variant="ghost"
				className="absolute top-0! not-focus-within:bg-transparent focus-within:text-primary"
			>
				<MenuIcon />
			</Button>

			<MenuOption label="Sobre o VLibras" icon={InfoIcon} />
			<MenuOption label="Guia Rápido" icon={HelpIcon} />
			<MenuOption label="Tradutor" icon={TranslatorIcon} />
			<MenuOption label="Dicionário" icon={DictionaryIcon} />
		</div>
	);
};
