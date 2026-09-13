import { useEffect, useRef } from "preact/hooks";
import { cn } from "@/common/lib/utils";

type Props = {
	id: string;
	activeIndex: number;
	suggestions: string[];
	coords: { top: number; left: number };
	onSelect: (suggestion: string) => void;
};

export const SuggestionPopup = ({ id, activeIndex, suggestions, coords, onSelect }: Props) => {
	const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

	useEffect(() => {
		if (activeIndex >= 0) {
			itemRefs.current[activeIndex]?.scrollIntoView?.({ block: "nearest" });
		}
	}, [activeIndex]);

	if (suggestions.length === 0) {
		return null;
	}

	return (
		<div
			role="listbox"
			id={id}
			aria-label="Sugestões de glosa"
			className="absolute z-50 flex max-h-30 max-w-45 flex-col gap-1 overflow-x-auto overflow-y-auto rounded-md border bg-background p-1 shadow-md"
			style={{
				top: `${coords.top}px`,
				left: `${coords.left}px`,
			}}
		>
			{suggestions.map((suggestion, index) => (
				<button
					key={suggestion}
					ref={(el) => {
						itemRefs.current[index] = el;
					}}
					id={`${id}-${index}`}
					type="button"
					tabIndex={-1}
					role="option"
					aria-selected={index === activeIndex}
					onClick={() => onSelect(suggestion)}
					className={cn(
						"rounded px-2 py-1 text-left text-sm hover:cursor-pointer hover:bg-muted",
						index === activeIndex && "bg-muted",
					)}
				>
					{suggestion}
				</button>
			))}
		</div>
	);
};
