import { cva } from "class-variance-authority";
import type { ToastData } from "@/common/lib/toaster";
import { cn } from "@/common/lib/utils";

const toastVariants = cva(
	"absolute mobile:text-center w-auto! z-99999999 inset-x-2 overflow-hidden mx-auto flex items-center justify-center transition-all duration-500",
	{
		variants: {
			position: {
				top: "top-14 mobile:top-13 animate-move-down",
				bottom: "bottom-15 mobile:bottom-13 animate-move-up",
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
	},
);

export const ToastItem = ({
	message,
	isExiting,
	position = "bottom",
	align = "center",
	variant = "default",
	className,
}: ToastData) => {
	const isTheme = variant === "light" || variant === "dark";

	return (
		<div
			data-theme={isTheme ? variant : undefined}
			className={cn(
				toastVariants({ position, align }),
				isExiting && (position === "top" ? "-top-100!" : "-bottom-100!"),
				className,
			)}
		>
			<div
				data-slot="toast-content"
				className={cn(
					"pointer-events-auto rounded-lg border bg-background px-2.5 py-1.5 mobile:text-xs text-sm transition-all duration-500 ease-in-out",
					variant === "success" && "border-none bg-success text-success-foreground",
					variant === "destructive" && "border-none bg-destructive text-destructive-foreground",
					variant === "primary" && "border-none bg-primary text-primary-foreground",
				)}
			>
				<div className="break-anywhere text-center">{message}</div>
			</div>
		</div>
	);
};
