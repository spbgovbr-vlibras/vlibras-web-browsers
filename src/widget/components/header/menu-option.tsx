import type { ElementType } from "preact/compat";
import { useMobile } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
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
		<li
			className={cn(
				"flex w-auto animate-move-left items-center gap-2",
				"[&_button]:rounded-full [&_button]:border-border [&_button]:bg-background [&_button]:shadow-md [&_button]:hover:bg-muted",
			)}
		>
			<Button
				onClick={onClick}
				role="button"
				aria-label={label}
				size={isMobile ? "icon-sm" : "icon"}
				variant="outline-gov"
			>
				<Icon className="mobile:size-5 size-5.5" />
			</Button>

			<Button tabindex={-1} onClick={onClick} variant="outline" className="w-30" size="xs">
				{label}
			</Button>
		</li>
	);
};
