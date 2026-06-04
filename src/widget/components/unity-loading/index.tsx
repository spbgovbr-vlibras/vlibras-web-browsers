import { useEffect, useState } from "preact/hooks";
import { usePick } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { MaskIcon } from "@/common/utils/mask-icon";
import { usePlayerStore } from "@/player/use-player.store";
import govBRIcon from "@/widget/icons/govbr.webp";
import icaroIcon from "@/widget/icons/icaro.webp";

export const UnityLoading = () => {
	const { progress, isLoaded } = usePlayerStore(usePick("progress", "isLoaded"));
	const [isStarting, setStarting] = useState(false);

	useEffect(() => {
		if (progress === 100) setTimeout(() => setStarting(true), 1000);
	}, [progress]);

	if (isLoaded) return null;

	return (
		<div
			className={cn(
				"absolute inset-0 z-9999999 flex flex-col items-center justify-between border bg-background p-4",
				!__IS_EXTENSION__ && "rounded-xl",
			)}
		>
			<div className="rounded-full border px-2 py-1">
				<img src={govBRIcon} alt="logo GovBR" className="h-4 w-auto" />
			</div>

			<div className="-mt-4 flex flex-col items-center">
				<div className="mb-2 overflow-hidden rounded-full border-6 border-primary/30">
					<div className="relative flex not-mobile:size-20 size-18 justify-center overflow-hidden rounded-full bg-primary">
						<MaskIcon src={icaroIcon} className="absolute bottom-0 not-mobile:size-15 size-14 bg-primary-foreground" />
					</div>
				</div>

				<p className="mobile:mb-1 font-bold mobile:text-sm text-base">VLibras Widget</p>
				<span className="font-light text-muted-foreground text-xs">v{__VLIBRAS_APP_VERSION__}</span>
			</div>

			{isStarting && (
				<span className="absolute bottom-8 animate-move-up font-semibold text-muted-foreground text-xs">
					Iniciando...
				</span>
			)}

			<div className="bottom-4 h-2 w-44 rounded-full bg-foreground/10">
				<span className="block h-full rounded-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
			</div>
		</div>
	);
};
