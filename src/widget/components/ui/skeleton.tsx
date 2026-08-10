import type { ComponentProps } from "preact";

export const Skeleton = ({ className, ...props }: ComponentProps<"div">) => {
	return <div {...props} className={`animate-pulse rounded-lg bg-accent ${className}`} />;
};
