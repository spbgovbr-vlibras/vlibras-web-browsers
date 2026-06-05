import { useMobile } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { Icon } from "@/widget/components/ui/icon";
import { Spinner } from "@/widget/components/ui/spinner";
import type { WordMeaning } from "../lib/types";
import { sanitizeWikiText } from "../lib/wiktionary";

interface Props {
	wordName: string;
	meaning: WordMeaning | null | undefined;
	isLoading: boolean;
	onPlayDefinition: (text: string) => void;
}

export const DictionaryWordMeaning = ({ meaning, isLoading, onPlayDefinition }: Props) => {
	const isMobile = useMobile();
	if (isLoading) {
		return (
			<div className="flex animate-pulse items-center gap-1.5 px-6 py-2 text-muted-foreground text-xs">
				<Spinner className="size-3" />
				Buscando significado...
			</div>
		);
	}

	if (!meaning?.definitions?.length) {
		return <div className="px-6 py-2 text-muted-foreground text-xs">Significado não encontrado.</div>;
	}

	return (
		<div className="w-full border-primary/20 border-l-2 bg-muted pr-3 pb-5 pl-4 text-black dark:text-white">
			<p className="mb-1 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Significado</p>
			<ol className="flex flex-col gap-5">
				{meaning.definitions.slice(0, 3).map((def, i) => {
					const definitionText = sanitizeWikiText(def.split("§")[0]);
					return (
						<li key={i} className="break-word flex min-w-0 flex-1 items-center justify-between pl-4">
							<span
								className={cn("min-w-0 max-w-50 flex-1 text-xs sm:text-sm", isMobile ? "max-w-40" : "max-w-50")}
							>{`${i + 1}. ${definitionText}`}</span>
							<button
								type="button"
								onClick={() => onPlayDefinition(definitionText)}
								className="shrink-0 cursor-pointer text-primary hover:opacity-70"
								aria-label="Traduzir definição"
							>
								<Icon name="libras" className={cn(isMobile ? "size-5" : "size-6")} />
							</button>
						</li>
					);
				})}
			</ol>
		</div>
	);
};
