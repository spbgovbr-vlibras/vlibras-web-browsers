type Props = {
	suggestions: string[];

	coords: {
		top: number;
		left: number;
	};

	onSelect: (suggestion: string) => void;
};

export const SuggestionPopup = ({ suggestions, coords, onSelect }: Props) => {
	if (suggestions.length === 0) {
		return null;
	}

	return (
		<div
			className="absolute z-50 flex max-h-30 flex-col gap-1 overflow-y-auto overflow-x-hidden rounded-md border bg-background p-1 shadow-md"
			style={{
				top: `${coords.top}px`,
				left: `${coords.left}px`,
			}}
		>
			{suggestions.map((suggestion) => (
				<button
					key={suggestion}
					type="button"
					onClick={() => onSelect(suggestion)}
					className="rounded px-2 py-1 text-left text-sm hover:cursor-pointer hover:bg-muted"
				>
					{suggestion}
				</button>
			))}
		</div>
	);
};
