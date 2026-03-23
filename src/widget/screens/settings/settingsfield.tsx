import type { ReactElement } from "preact/compat";

type SettingsFieldProps = {
	label: string;
	description?: string;
	children: ReactElement;
	className?: string;
};

export default function SettingsField({ label, description, children, className }: SettingsFieldProps) {
	return (
		<div className={`flex flex-col gap-2 ${className}`}>
			<div>
				<p className="font-bold text-base">{label}</p>
				{description && <p className="text-muted-foreground text-xs">{description}</p>}
			</div>
			<div>{children}</div>
		</div>
	);
}
