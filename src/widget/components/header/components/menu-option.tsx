import { useMobile } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { Button } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import type { IconName } from "@/widget/icons/types";

type Props = {
	label: string;
	onClick?: () => void;
	icon: IconName;
};

export const MenuOption = ({ label, onClick, icon: iconName }: Props) => {
	const isMobile = useMobile();

	return (
		<li
			role="presentation"
			className={cn(
				"flex w-auto animate-move-left items-center gap-1",
				"[&_button]:rounded-full [&_button]:border-border [&_button]:bg-background [&_button]:shadow-md [&_button]:hover:bg-muted",
			)}
		>
			<Button
				role="menuitem"
				onClick={onClick}
				aria-label={label}
				size={isMobile ? "icon-sm" : "icon"}
				variant="outline-gov"
			>
				{iconName && <Icon name={iconName} className="mobile:size-5 size-5.5" />}
			</Button>

			<span
				aria-hidden="true"
				className="flex h-7 w-fit items-center justify-center whitespace-nowrap rounded-full border border-border bg-background px-2.5 py-1 font-semibold text-xs shadow-md"
			>
				{label}
			</span>
		</li>
	);
};
