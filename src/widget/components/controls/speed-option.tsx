import type { TargetedKeyboardEvent } from "preact";
import { useMobile } from "@/common/hooks";
import { posthogg } from "@/common/lib/posthog";
import { cn } from "@/common/lib/utils";
import { setSpeed } from "@/player/actions";
import { usePlayerStore } from "@/player/use-player.store";
import { DropdownTrigger } from "@/widget/components/ui/dropdown";
import { Tooltip } from "@/widget/components/ui/tooltip";

const speeds = [2.5, 2, 1.5, 1, 0.5];

export const SpeedOption = () => {
	const isMobile = useMobile();
	const currentSpeed = usePlayerStore((s) => s.speed);

	const onKeyDown = (event: TargetedKeyboardEvent<HTMLButtonElement>, speed: number) => {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			handleSpeedChange(speed);
		}
	};

	const handleSpeedChange = (speed: number) => {
		setSpeed(speed);
		posthogg.trackEvent("change_speed", { speed });
	};

	return (
		<div className="dropdown dropdown-center dropdown-top focus-within:**:data-[slot=tooltip-content]:hidden">
			<Tooltip offset={8} content="Velocidade" placement="top" arrow={{ position: "bottom" }}>
				<DropdownTrigger aria-label="Alterar velocidade" variant="ghost-gov" size={isMobile ? "icon-sm" : "icon"}>
					<span inert className="-mt-0.5 font-bold mobile:text-xs text-sm">
						{currentSpeed}x
					</span>
				</DropdownTrigger>
			</Tooltip>

			<div tabIndex={-1} className="dropdown-content widget-radius mb-4 border bg-background drop-shadow-lg">
				<ul
					className={cn(
						"space-y-1 p-1 font-semibold text-primary text-sm",
						"focus-within:pointer-events-auto focus-within:visible",
					)}
				>
					{speeds.map((speed) => {
						const isActive = speed === currentSpeed;

						return (
							<li key={speed}>
								<button
									type="button"
									inert={isActive}
									onClick={() => handleSpeedChange(speed)}
									onKeyDown={(e) => onKeyDown(e, speed)}
									className={cn(
										"w-full cursor-pointer whitespace-nowrap rounded-md px-2 py-1 text-center mobile:text-xs text-sm hover:bg-primary/10",
										isActive && "bg-primary! text-primary-foreground! outline-1 outline-primary outline-solid",
									)}
								>
									{speed}x
								</button>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
};
