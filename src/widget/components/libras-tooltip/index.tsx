import type { ComponentChildren } from "preact";
import { useConfig } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { Tooltip, type TooltipProps } from "@/widget/components/ui/tooltip";
import { DropdownTrigger } from "../ui/dropdown";

type VideoKey = "active-dark-theme";

type Props = {
	videoKey: VideoKey;
	children: ComponentChildren;
	placement?: TooltipProps["placement"];
	videoClassName?: string;
};

export const LibrasTooltip = ({ videoKey, placement = "top", videoClassName, children }: Props) => {
	const { path } = useConfig();

	const videoSrc = `${path}/assets/videos/${videoKey}.mp4`;

	return (
		<Tooltip
			inert
			content={
				<div className="grid h-38 w-26 place-content-center">
					<video className={cn("mx-auto h-38 object-cover", videoClassName)} src={videoSrc} muted autoPlay loop inert />
				</div>
			}
			align="start"
			placement={placement}
			className="overflow-hidden p-0!"
		>
			<DropdownTrigger asChild className="hover:underline hover:decoration-wavy">
				{children}
			</DropdownTrigger>
		</Tooltip>
	);
};
