import type { ComponentProps } from "preact";
import { cn } from "@/common/lib/utils";
import { Button } from "@/widget/components/ui/button";
import { MoveIcon } from "@/widget/icons";

type Props = ComponentProps<"button"> & {
	isDragging?: boolean;
};

export const WidgetGrabber = ({ isDragging, className, ...props }: Props) => {
	return (
		<Button
			size="icon"
			variant="ghost"
			className={cn("absolute top-2 left-2 rounded-full", className)}
			style={{ cursor: isDragging ? "grabbing" : "grab" }}
			{...props}
		>
			<MoveIcon className="size-5" />
		</Button>
	);
};
