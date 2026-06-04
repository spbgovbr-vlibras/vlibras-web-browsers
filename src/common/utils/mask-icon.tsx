import { cn } from "@/common/lib/utils";
import { useMobile } from "../hooks";

type MaskIconProps = {
	src: string;
	className?: string;
	"aria-label"?: string;
};

export function MaskIcon({ src, className, "aria-label": ariaLabel }: MaskIconProps) {
	const isMobile = useMobile();
	return (
		<div
			{...(ariaLabel ? { role: "img", "aria-label": ariaLabel } : { "aria-hidden": true })}
			className={cn(
				isMobile ? "size-4.5" : "size-5.25",
				"shrink-0 bg-current",
				"mask-(--icon)",
				"mask-center",
				"mask-no-repeat",
				"mask-contain",
				className,
			)}
			style={{ "--icon": `url(${src})` }}
		/>
	);
}
