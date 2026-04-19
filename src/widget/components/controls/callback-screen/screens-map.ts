import type { ElementType } from "preact/compat";
import { InfoIcon } from "@/widget/icons";
import { DictionaryIcon } from "@/widget/icons/dictionary";
import type { CustomSVGProps } from "@/widget/icons/types";
import type { Screen } from "@/widget/stores/use-screens.store";

export const screensMap: Partial<Record<Screen, { label: string; icon: ElementType<CustomSVGProps> }>> = {
	dictionary: { label: "Dicionário", icon: DictionaryIcon },
	about: { label: "Sobre", icon: InfoIcon },
};
