import type { ElementType } from "preact/compat";
import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import type { CustomSVGProps } from "@/widget/icons/types";

type Props = {
	label: string;
	onClick?: () => void;
	icon: ElementType<CustomSVGProps>;
};

export const MenuOption = ({ label, onClick, icon }: Props) => {
	const Icon = icon;

	return (
		<Tooltip className="text-xs" content={label} align="start" placement="right">
			<Button onClick={onClick} role="button" aria-label={label} size="icon" variant="ghost-gov" className="">
				<Icon className="size-5.5" />
			</Button>
		</Tooltip>
	);
};
