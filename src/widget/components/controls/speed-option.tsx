import type { TargetedKeyboardEvent } from "preact";
import { useMobile } from "@/common/hooks";
import { posthogg } from "@/common/lib/posthog";
import { cn } from "@/common/lib/utils";
import { usePlayer } from "@/player/use-player";
import { Button } from "@/widget/components/ui/button";

const speeds = [2.5, 2, 1.5, 1];

export const SpeedOption = () => {
	const isMobile = useMobile();
	const { speed: currentSpeed, setSpeed } = usePlayer();

	const onKeyDown = (event: TargetedKeyboardEvent<HTMLButtonElement>, speed: number) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleSpeedChange(speed);
		}
	};

	const handleSpeedChange = (speed: number) => {
		setSpeed(speed);
		(document.activeElement as HTMLElement)?.blur();
		posthogg.trackEvent("change_speed", { speed });
	};

	return (
		<div className="dropdown dropdown-center dropdown-top">
			<Button className="" tabindex={0} variant="ghost-gov" size={isMobile ? "icon-sm" : "icon"}>
				<span className="-mt-0.5 font-bold text-sm">{currentSpeed}x</span>
			</Button>

			<ul
				tabIndex={-1}
				style={{ boxShadow: "0 0 10px 0px rgba(0, 0, 0, 0.15)" }}
				className={cn(
					"dropdown-content mb-4 space-y-1 rounded-lg border bg-background p-1 font-semibold text-primary text-sm",
				)}
			>
				{speeds.map((speed) => {
					const isActive = speed === currentSpeed;

					return (
						<li key={speed}>
							<button
								type="button"
								onClick={() => handleSpeedChange(speed)}
								onKeyDown={(e) => onKeyDown(e, speed)}
								className={cn(
									"w-full cursor-pointer whitespace-nowrap rounded-sm px-2 py-1 text-center text-xs hover:bg-primary/10 sm:text-sm",
									isActive &&
										"pointer-events-none bg-primary! text-primary-foreground! outline-1 outline-primary outline-solid",
								)}
							>
								{speed}x
							</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
};
