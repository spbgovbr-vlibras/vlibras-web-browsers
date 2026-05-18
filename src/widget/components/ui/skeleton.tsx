import type { ComponentProps } from "preact/compat";

export const Skeleton = ({ className, ...props }: ComponentProps<"div">) => {
	return <div {...props} className={`h-4 animate-pulse rounded-lg bg-muted ${className}`} />;
};
