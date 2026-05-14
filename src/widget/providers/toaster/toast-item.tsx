import { cva } from "class-variance-authority";
import type { ToastData } from "@/common/lib/toaster";
import { cn } from "@/common/lib/utils";

const toastVariants = cva("absolute inset-x-2 flex items-center justify-center transition-all duration-500", {
	variants: {
		position: {
			top: "top-14 animate-move-down",
			bottom: "bottom-14 animate-move-up",
		},
		align: {
			start: "justify-start",
			end: "justify-end",
			center: "justify-center",
		},
	},
	defaultVariants: {
		position: "bottom",
		align: "center",
	},
});

export const ToastItem = ({
	message,
	isExiting,
	position = "bottom",
	align = "center",
	variant = "default",
	className,
}: ToastData) => {
	return (
		<div
			className={cn(
				toastVariants({ position, align }),
				isExiting && (position === "top" ? "-top-100!" : "-bottom-100!"),
				className,
			)}
		>
			<div
				data-slot="toast-content"
				className={cn(
					"pointer-events-auto w-fit rounded-lg border bg-background px-2.5 py-1.5 text-sm transition-all duration-500 ease-in-out",
					variant === "success" && "border-none bg-success text-success-foreground",
					variant === "destructive" && "border-none bg-destructive text-destructive-foreground",
				)}
			>
				<div>{message}</div>
			</div>
		</div>
	);
};
