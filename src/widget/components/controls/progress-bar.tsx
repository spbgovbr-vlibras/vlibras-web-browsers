import { useMemo } from "preact/hooks";
import { cn } from "@/common/lib/utils";
import { usePlayer } from "@/player/use-player";

export const ProgressBar = () => {
	const { countGloss } = usePlayer();

	const progress = useMemo(() => {
		if (countGloss.max === 0) return 0;
		return (countGloss.count / Math.max(countGloss.max, countGloss.count)) * 100;
	}, [countGloss]);

	return (
		<div className="absolute -top-1.75 left-0 h-1.5 w-full">
			<div
				role="progressbar"
				aria-valuenow={progress}
				className={cn("h-full bg-primary transition-[width]", progress < 100 && "rounded-r-full")}
				style={{ width: `${progress}%` }}
			/>
		</div>
	);
};
