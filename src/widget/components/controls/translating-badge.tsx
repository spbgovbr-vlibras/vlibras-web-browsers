export const TranslatingBadge = () => {
	return (
		<div className="absolute -top-8 left-1/2 grid -translate-x-1/2 animate-move-up place-content-center rounded-full border bg-background p-0.5 pr-2">
			<span className="flex items-center gap-1 font-semibold text-xs">
				<span className="loading loading-spinner loading-xs" />
				Traduzindo...
			</span>
		</div>
	);
};
