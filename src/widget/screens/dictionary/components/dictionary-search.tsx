import { Button } from "@/widget/components/ui/button";
import { XIcon } from "@/widget/icons";
import { useDictionaryCtx } from "./dictionary-context";

export const DictionarySearch = () => {
	const { search, searchRef, handleSearchChange, handleClearSearch } = useDictionaryCtx();

	return (
		<div className="relative flex items-center p-4 pb-0">
			<input
				ref={searchRef}
				type="text"
				placeholder="Pesquisar (ex: AJUDAR)..."
				onInput={(e) => handleSearchChange(e.currentTarget.value)}
				className="h-9 w-full rounded-md border p-2 pr-8 text-black outline-primary placeholder:text-sm focus:outline-2 focus:outline-solid dark:text-white"
			/>

			{search && (
				<Button
					onClick={handleClearSearch}
					aria-label="Limpar busca"
					variant="ghost"
					size="icon-xs"
					className="absolute right-5 rounded-sm bg-transparent! text-muted-foreground outline-destructive hover:text-destructive focus:text-destructive"
				>
					<XIcon />
				</Button>
			)}
		</div>
	);
};
