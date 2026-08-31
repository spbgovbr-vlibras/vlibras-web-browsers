import type { ComponentProps, TargetedMouseEvent } from "preact";
import { cn } from "@/common/lib/utils";
import { playStatic } from "@/player/actions";
import { Icon } from "@/widget/components/ui/icon";
import { createCallback, resetCallback } from "@/widget/stores/use-callback.store";

type Props = Omit<ComponentProps<"button">, "children"> & {
	gloss: string;
	onFinish?: () => void;
};

export const InlineTranslatorButton = ({ className, gloss, onFinish, onClick, ...props }: Props) => {
	const handleClick = (e: TargetedMouseEvent<HTMLButtonElement>) => {
		resetCallback();
		playStatic(gloss);
		onClick?.(e);

		if (onFinish) createCallback({ action: onFinish, auto: true });
	};

	return (
		<button
			onClick={handleClick}
			type="button"
			aria-label="Traduzir texto"
			className={cn(
				"pointer-events-auto relative -bottom-1 inline cursor-pointer rounded-sm p-0.5 hover:text-primary",
				className,
			)}
			{...props}
		>
			<Icon name="hands" className="size-4" />
		</button>
	);
};
