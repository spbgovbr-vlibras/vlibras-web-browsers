import { useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useMobile } from "@/common/hooks";
import { Button } from "@/widget/components/ui/button";
import { TranslatorDialog } from "@/widget/dialogs/translator";
import { HelpIcon, InfoIcon, MenuIcon, TranslatorIcon } from "@/widget/icons";
import { DictionaryIcon } from "@/widget/icons/dictionary";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { useGuideStore } from "../guide/store";
import { MenuOption } from "./menu-option";

export const WidgetMenu = () => {
	const isMobile = useMobile();
	const open = useScreensStore((s) => s.open);
	const onGuideOpen = useGuideStore((s) => s.onOpenChange);

	const [translatorOpen, setTranslatorOpen] = useState(false);

	return (
		<Fragment>
			<div className="dropdown dropdown-bottom z-1">
				<Button
					id="header-menu-button"
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
					<MenuOption onClick={() => setTranslatorOpen(true)} label="Tradutor" icon={TranslatorIcon} />
					<MenuOption onClick={() => onGuideOpen(true)} label="Guia Rápido" icon={HelpIcon} />
					<MenuOption onClick={() => open("about")} label="Sobre o VLibras" icon={InfoIcon} />
				</ul>
			</div>

			<TranslatorDialog open={translatorOpen} onOpenChange={setTranslatorOpen} />
		</Fragment>
	);
};
