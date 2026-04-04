import { useMobile } from "@/common/hooks";
import { Button } from "@/widget/components/ui/button";
import { HelpIcon, InfoIcon, MenuIcon, TranslatorIcon } from "@/widget/icons";
import { DictionaryIcon } from "@/widget/icons/dictionary";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { MenuOption } from "./menu-option";

export const WidgetMenu = () => {
	const open = useScreensStore((s) => s.open);
	const isMobile = useMobile();

	return (
		<div className="dropdown dropdown-bottom z-1 mr-auto">
			<Button
				role="button"
				tabindex={0}
				aria-label="Menu de opções"
				size={isMobile ? "icon-sm" : "icon"}
				variant="default"
			>
				<MenuIcon />
			</Button>

			<ul className="dropdown-content mt-4 space-y-2">
				<MenuOption onClick={() => open("dictionary")} label="Dicionário" icon={DictionaryIcon} />
				<MenuOption label="Tradutor" icon={TranslatorIcon} />
				<MenuOption label="Guia Rápido" icon={HelpIcon} />
				<MenuOption onClick={() => open("about")} label="Sobre o VLibras" icon={InfoIcon} />
			</ul>
		</div>
	);
};
