import { useMemo } from "preact/hooks";
import { cn } from "@/common/lib/utils";
import { usePlayerStore } from "@/player/stores/use-player.store";

export const ProgressBar = () => {
	const { count, max } = usePlayerStore((s) => s.countGloss);

	const progress = useMemo(() => {
		const _count = count + 1;
		return (_count / Math.max(max, _count)) * 100;
	}, [max, count]);

	if (count === 0 || max === 0) return null;

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
