import type { ElementType } from "preact/compat";
import { useMobile } from "@/common/hooks";
import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import type { CustomSVGProps } from "@/widget/icons/types";

type Props = {
	label: string;
	onClick?: () => void;
	icon: ElementType<CustomSVGProps>;
};

export const MenuOption = ({ label, onClick, icon }: Props) => {
	const isMobile = useMobile();
	const Icon = icon;

	return (
		<li className="w-auto">
			<Tooltip offset={42} className="whitespace-nowrap text-xs" content={label} align="start" placement="right">
				<Button
					onClick={onClick}
					role="button"
					aria-label={label}
					size={isMobile ? "icon-sm" : "icon"}
					variant="outline-gov"
					className="rounded-full border-border"
				>
					<Icon className="size-5.5" />
				</Button>
			</Tooltip>
		</li>
	);
};
