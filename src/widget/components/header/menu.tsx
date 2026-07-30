import { useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useMobile } from "@/common/hooks";
import { useGuideStore } from "@/widget/components/guide/store";
import { Button } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import { TranslatorDialog } from "@/widget/dialogs/translator";
import { useScreensStore } from "@/widget/stores/use-screens.store";
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
					tabindex={0}
					aria-label="Menu de opções"
					size={isMobile ? "icon-sm" : "icon"}
					variant="default"
				>
					<Icon name="menu" />
				</Button>

				<ul className="dropdown-content mt-4 space-y-2 [&_button]:dark:text-secondary-foreground">
					<MenuOption onClick={() => open("dictionary")} label="Dicionário" icon="dictionary" />
					<MenuOption onClick={() => setTranslatorOpen(true)} label="Tradutor" icon="translator" />
					{!__IS_EXTENSION__ && <MenuOption onClick={() => onGuideOpen(true)} label="Guia Rápido" icon="help" />}
					<MenuOption onClick={() => open("about")} label="Sobre o VLibras" icon="info" />
				</ul>
			</div>

			<TranslatorDialog open={translatorOpen} onOpenChange={setTranslatorOpen} />
		</Fragment>
	);
};
