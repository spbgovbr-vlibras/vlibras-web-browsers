import type { ElementType } from "preact/compat";
import { useMobile } from "@/common/hooks";
import { Button } from "@/widget/components/ui/button";
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
		<li className="flex w-auto animate-move-left items-center gap-2">
			<Button
				onClick={onClick}
				role="button"
				aria-label={label}
				size={isMobile ? "icon-sm" : "icon"}
				variant="outline-gov"
				className="rounded-full border-0 bg-background drop-shadow-md hover:bg-muted"
			>
				<Icon className="size-5.5" />
			</Button>

			<Button
				onClick={onClick}
				variant="outline"
				className="w-30 rounded-full border-0 bg-background drop-shadow-md hover:bg-muted"
				size="xs"
			>
				{label}
			</Button>
		</li>
	);
};
