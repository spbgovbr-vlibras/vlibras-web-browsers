import { useEffect, useRef, useState } from "preact/hooks";
import { cn } from "@/common/lib/utils";
import { usePlayerStore } from "@/player/stores/use-player.store";

const START_DELAY_SECONDS = 1;

export const ProgressBar = () => {
	const { max, count } = usePlayerStore((s) => s.countGloss);
	const isPlaying = usePlayerStore((s) => s.status === "playing");

	const [visualProgress, setVisualProgress] = useState(0);

	const progressRef = useRef(0);
	const accumulatedTimeRef = useRef(0);
	const lastTickTimeRef = useRef<number | null>(null);

	useEffect(() => {
		if (count === 0 && max === 0) {
			accumulatedTimeRef.current = 0;
			lastTickTimeRef.current = null;
			progressRef.current = 0;
			setVisualProgress(0);
		}
	}, [count, max]);

	useEffect(() => {
		if (!isPlaying) {
			lastTickTimeRef.current = null;
			return;
		}

		let animationFrameId: number;

		const updateAnimation = () => {
			if (max === 0) return setVisualProgress(0);

			if (count >= max && max > 0) {
				progressRef.current = 100;
				setVisualProgress(100);
				return;
			}

			const now = Date.now();

			if (lastTickTimeRef.current !== null) {
				const deltaSeconds = (now - lastTickTimeRef.current) / 1000;
				accumulatedTimeRef.current += deltaSeconds;
			}

			lastTickTimeRef.current = now;

			if (accumulatedTimeRef.current < START_DELAY_SECONDS) {
				animationFrameId = requestAnimationFrame(updateAnimation);
				return;
			}

			const effectiveTime = accumulatedTimeRef.current - START_DELAY_SECONDS;
			const timeBasedProgress = (1 - Math.exp(-effectiveTime / 30)) * 95;
			const realProgress = (count / max) * 100;
			const target = Math.min(Math.max(timeBasedProgress, realProgress), 98);

			if (progressRef.current < target) {
				const diff = target - progressRef.current;
				progressRef.current += Math.max(diff * 0.05, 0.01);
			} else {
				progressRef.current += 0.008;
			}

			progressRef.current = Math.min(progressRef.current, 98);

			setVisualProgress(progressRef.current);
			animationFrameId = requestAnimationFrame(updateAnimation);
		};

		animationFrameId = requestAnimationFrame(updateAnimation);

		return () => cancelAnimationFrame(animationFrameId);
	}, [max, count, isPlaying]);

	if (max === 0) return null;

	return (
		<div className="absolute -top-1.5 left-0 h-1.5 w-full overflow-hidden">
			<div
				role="progressbar"
				aria-valuenow={visualProgress}
				className={cn("h-full bg-primary", visualProgress < 100 && "rounded-r-full")}
				style={{ width: `${visualProgress}%` }}
			/>
		</div>
	);
};
