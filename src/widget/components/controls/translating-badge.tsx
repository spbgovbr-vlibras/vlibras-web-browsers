import { Spinner } from "@/widget/components/ui/spinner";

export const TranslatingBadge = () => {
	return (
		<div className="absolute bottom-15 left-1/2 grid -translate-x-1/2 animate-move-up place-content-center rounded-full border bg-background p-0.5 pr-2">
			<span className="flex items-center gap-1 font-semibold text-primary text-xs dark:text-secondary-foreground">
				<Spinner className="size-4 text-current" />
				Traduzindo...
			</span>
		</div>
	);
};
