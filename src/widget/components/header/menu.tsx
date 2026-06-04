import { useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useMobile } from "@/common/hooks";
import { MaskIcon } from "@/common/utils/mask-icon";
import { Button } from "@/widget/components/ui/button";
import { TranslatorDialog } from "@/widget/dialogs/translator";
import dictionaryIcon from "@/widget/icons/dictionary.webp";
import helpIcon from "@/widget/icons/help.webp";
import infoIcon from "@/widget/icons/info.webp";
import menuIcon from "@/widget/icons/menu.webp";
import translatorIcon from "@/widget/icons/translator.webp";
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
					<MaskIcon src={menuIcon} />
				</Button>

				<ul className="dropdown-content mt-4 space-y-2">
					<MenuOption onClick={() => open("dictionary")} label="Dicionário" maskIconSrc={dictionaryIcon} />
					<MenuOption onClick={() => setTranslatorOpen(true)} label="Tradutor" maskIconSrc={translatorIcon} />
					{!__IS_EXTENSION__ && (
						<MenuOption onClick={() => onGuideOpen(true)} label="Guia Rápido" maskIconSrc={helpIcon} />
					)}
					<MenuOption onClick={() => open("about")} label="Sobre o VLibras" maskIconSrc={infoIcon} />
				</ul>
			</div>

			<TranslatorDialog open={translatorOpen} onOpenChange={setTranslatorOpen} />
		</Fragment>
	);
};
