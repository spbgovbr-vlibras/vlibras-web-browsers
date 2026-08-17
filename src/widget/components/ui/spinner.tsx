import type { ComponentProps } from "preact";
import { cn } from "@/common/lib/utils";

type SpinnerProps = ComponentProps<"span"> & {
	size?: number;
};

export const Spinner = ({ className, size = 24, ...props }: SpinnerProps) => {
	return (
		<span className={cn("flex shrink-0 items-center justify-center text-primary", className)} {...props}>
			<svg
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				width={size}
				height={size}
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				className="animate-spin"
			>
				<path d="M21 12a9 9 0 1 1-6.219-8.56" />
			</svg>
			<span className="sr-only">Loading...</span>
		</span>
	);
};
