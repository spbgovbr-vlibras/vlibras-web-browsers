import { lazy, Suspense } from "preact/compat";
import { useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useMobile } from "@/common/hooks";
import { TranslatorFallback } from "@/widget/components/fallbacks/translator";
import { useGuideStore } from "@/widget/components/guide/store";
import { Button } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { Dropdown, DropdownContent, DropdownTrigger } from "../ui/dropdown";
import { MenuOption } from "./menu-option";

const TranslatorDialog = lazy(() =>
	import("@/widget/dialogs/translator").then((m) => ({ default: m.TranslatorDialog })),
);

export const WidgetMenu = () => {
	const isMobile = useMobile();
	const open = useScreensStore((s) => s.open);
	const onGuideOpen = useGuideStore((s) => s.onOpenChange);

	const [translatorOpen, setTranslatorOpen] = useState<boolean>();

	return (
		<Fragment>
			<Dropdown showOverlay={false} className="dropdown-bottom">
				<DropdownTrigger>
					<Button
						id="header-menu-button"
						tabindex={0}
						aria-label="Menu de opções"
						size={isMobile ? "icon-sm" : "icon"}
						variant="default"
					>
						<Icon name="menu" />
					</Button>
				</DropdownTrigger>

				<DropdownContent className="mt-4 space-y-2 [&_button]:dark:text-secondary-foreground">
					<MenuOption onClick={() => open("dictionary")} label="Dicionário" icon="dictionary" />
					<MenuOption onClick={() => setTranslatorOpen(true)} label="Tradutor" icon="translator" />
					{!__IS_EXTENSION__ && <MenuOption onClick={() => onGuideOpen(true)} label="Guia Rápido" icon="help" />}
					<MenuOption onClick={() => open("about")} label="Sobre o VLibras" icon="info" />
				</DropdownContent>
			</Dropdown>

			{translatorOpen !== undefined && (
				<Suspense fallback={<TranslatorFallback />}>
					<TranslatorDialog open={translatorOpen} onOpenChange={setTranslatorOpen} />
				</Suspense>
			)}
		</Fragment>
	);
};
