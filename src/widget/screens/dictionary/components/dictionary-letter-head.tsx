import { usePick } from "@/common/hooks";
import { Icon } from "@/widget/components/ui/icon";
import { useDictionaryCtx } from "./dictionary-context";

export const DictionaryLetterHeader = () => {
	const { selectedLetter, setSelectedLetter } = useDictionaryCtx(usePick("selectedLetter", "setSelectedLetter"));
	if (!selectedLetter) return null;

	return (
		<div className="flex w-full animate-move-up items-center gap-1 bg-primary/20 mobile:px-3 px-4 mobile:py-2 py-3">
			<button
				type="button"
				aria-label="Voltar para a lista de letras"
				onClick={() => setSelectedLetter(null)}
				className="group flex h-full w-full items-center justify-start gap-2 text-xs hover:cursor-pointer"
			>
				<Icon name="chevron-left" className="size-4 bg-muted-foreground group-hover:bg-foreground" />
				<span className="font-semibold mobile:text-xs text-sm">{selectedLetter === "#" ? "0–9" : selectedLetter}</span>
			</button>
		</div>
	);
};
