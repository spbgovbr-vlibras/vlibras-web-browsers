import type { ReactElement } from "preact/compat";
import { cn } from "@/common/lib/utils";

type SettingsFieldProps = {
	label: string;
	description?: string;
	children: ReactElement;
	className?: string;
};

export const SettingsField = ({ label, description, children, className }: SettingsFieldProps) => {
	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<div>
				<p className="font-bold mobile:text-sm text-base">{label}</p>
				{description && <p className="text-muted-foreground text-xs">{description}</p>}
			</div>
			<div>{children}</div>
		</div>
	);
};
