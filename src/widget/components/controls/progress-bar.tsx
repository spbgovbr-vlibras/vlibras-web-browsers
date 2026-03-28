import { useMemo } from "preact/hooks";
import { cn } from "@/common/lib/utils";
import { usePlayerStore } from "@/player/use-player.store";

export const ProgressBar = () => {
	const { max, count } = usePlayerStore((s) => s.countGloss);

	const progress = useMemo(() => {
		if (max === 0) return 0;
		return (count / Math.max(max, count)) * 100;
	}, [max]);

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
