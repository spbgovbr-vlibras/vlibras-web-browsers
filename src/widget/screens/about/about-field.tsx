import type { ComponentChildren } from "preact";

type AboutFieldProps = {
	label: string;
	description?: string;
	children: ComponentChildren;
};

export const AboutField = ({ label, description, children }: AboutFieldProps) => {
	return (
		<div className="flex flex-col gap-2 text-sm">
			<div>
				<p className="font-bold">{label}</p>
				{description && <p className="text-muted-foreground text-xs">{description}</p>}
			</div>
			<div className="mobile:text-xs">{children}</div>
		</div>
	);
};
