import { useEffect, useState } from "preact/hooks";
import { usePick } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { playerStore, usePlayerStore } from "@/player/stores/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import { Spinner } from "@/widget/components/ui/spinner";

export const UnityLoading = () => {
	const { progress, isLoaded, isBroken } = usePlayerStore(usePick("progress", "isLoaded", "isBroken"));
	const [isStarting, setStarting] = useState(false);

	useEffect(() => {
		if (progress !== 100) return;
		const timer = setTimeout(() => setStarting(true), 1000);
		return () => clearTimeout(timer);
	}, [progress]);

	if (isLoaded) return null;

	const handleRetryLoad = () => playerStore.get().retryLoad();

	return (
		<div
			className={cn(
				"absolute inset-0 z-9999999 flex flex-col items-center justify-between border bg-background p-4",
				!__IS_EXTENSION__ && "widget-radius",
			)}
		>
			<div className="grid place-content-center rounded-full border px-2 py-1">
				<Icon name="govbr" colored className="h-4 w-12" />
			</div>

			<div className="-mt-4 flex flex-col items-center">
				<div className="mb-2 overflow-hidden rounded-full border-6 border-primary/30">
					<div className="relative flex mobile:size-18 size-20 justify-center overflow-hidden rounded-full bg-primary">
						<Icon name="icaro" className="absolute bottom-0 mobile:size-14 size-15 text-primary-foreground" />
					</div>
				</div>

				<p className="mobile:mb-1 font-bold mobile:text-sm text-base">VLibras Widget</p>
				<span className="text-muted-foreground text-xs">v{__VLIBRAS_APP_VERSION__}</span>
			</div>

			{isStarting && (
				<span className="absolute bottom-8 animate-move-up font-semibold text-muted-foreground text-xs">
					Iniciando...
				</span>
			)}

			{progress === 0 && !isBroken && <Spinner className="absolute bottom-8" size={16} />}

			{isBroken && (
				<div className="absolute inset-x-6 top-auto bottom-4 flex animate-move-up flex-col items-center gap-2">
					<p className="font-semibold text-muted-foreground text-xs">Não foi possível carregar o player.</p>
					<Button size="xs" variant="default" className="rounded-full" onClick={handleRetryLoad}>
						Tentar novamente
					</Button>
				</div>
			)}

			<div className={cn("bottom-4 h-2 w-44 rounded-full bg-foreground/10", isBroken && "invisible bg-destructive")}>
				<span className="block h-full rounded-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
			</div>
		</div>
	);
};
