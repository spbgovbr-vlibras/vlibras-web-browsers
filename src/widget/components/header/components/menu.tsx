import { lazy, Suspense } from "preact/compat";
import { useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useMobile } from "@/common/hooks";
import { DialogFallback } from "@/widget/components/dialog-fallback";
import { useGuideStore } from "@/widget/components/guide/store";
import { Button } from "@/widget/components/ui/button";
import { Dropdown, DropdownContent, DropdownTrigger } from "@/widget/components/ui/dropdown";
import { Icon } from "@/widget/components/ui/icon";
import { useScreensStore } from "@/widget/stores/use-screens.store";
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

				<DropdownContent className="mt-4 space-y-1 [&_button]:dark:text-secondary-foreground">
					<MenuOption onClick={() => setTranslatorOpen(true)} label="Tradutor" icon="translator" />
					<MenuOption onClick={() => open("dictionary")} label="Dicionário" icon="dictionary" />
					{!__IS_EXTENSION__ && <MenuOption onClick={() => onGuideOpen(true)} label="Guia Rápido" icon="help" />}
					<MenuOption onClick={() => open("about")} label="Sobre o VLibras" icon="info" />
				</DropdownContent>
			</Dropdown>

			{translatorOpen !== undefined && (
				<Suspense fallback={<DialogFallback className="h-[80%]" />}>
					<TranslatorDialog open={translatorOpen} onOpenChange={setTranslatorOpen} />
				</Suspense>
			)}
		</Fragment>
	);
};
