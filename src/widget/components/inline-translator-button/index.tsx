import type { ComponentProps, TargetedMouseEvent } from "preact";
import { cn } from "@/common/lib/utils";
import { MaskIcon } from "@/common/utils/mask-icon";
import { playStatic } from "@/player/actions";
import handsIcon from "@/widget/icons/hands.webp";
import { createCallback } from "@/widget/stores/use-callback.store";

type Props = Omit<ComponentProps<"button">, "children"> & {
	gloss: string;
	onFinish?: () => void;
};

export const InlineTranslatorButton = ({ className, gloss, onFinish, onClick, ...props }: Props) => {
	const handleClick = (e: TargetedMouseEvent<HTMLButtonElement>) => {
		if (onFinish) createCallback({ action: onFinish, auto: true });

		playStatic(gloss);
		onClick?.(e);
	};

	return (
		<button
			onClick={handleClick}
			type="button"
			aria-label="Traduzir texto"
			className={cn("relative -bottom-1 inline cursor-pointer rounded-sm p-0.5 hover:text-primary", className)}
			{...props}
		>
			<MaskIcon src={handsIcon} className="size-4" />
		</button>
	);
};
