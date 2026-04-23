import type { ReactElement } from "preact/compat";
import { cn } from "@/common/lib/utils";

type AboutFieldProps = {
	label: string;
	description?: string;
	children: ReactElement;
	className?: string;
};

export const AboutField = ({ label, description, children, className }: AboutFieldProps) => {
	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<div>
				<p className="font-bold text-base">{label}</p>
				{description && <p className="text-muted-foreground text-xs">{description}</p>}
			</div>
			<div>{children}</div>
		</div>
	);
};
