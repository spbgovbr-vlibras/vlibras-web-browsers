import { useEffect, useMemo, useRef } from "preact/hooks";
import { usePick } from "@/common/hooks";
import { Button } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import { useGuideCtx } from ".";
import { guideElements } from "./elements";

export const GuideFooter = () => {
	const advanceButtonRef = useRef<HTMLButtonElement>(null);
	const backButtonRef = useRef<HTMLButtonElement>(null);

	const { index, setIndex, onClose } = useGuideCtx(usePick("index", "setIndex", "onClose"));

	const isFirstElement = useMemo(() => index === 0, [index]);
	const isLastElement = useMemo(() => index === guideElements.length - 1, [index]);

	useEffect(() => advanceButtonRef.current?.focus(), [isFirstElement]);
	useEffect(() => backButtonRef.current?.focus(), [isLastElement]);

	return (
		<div className="flex items-center justify-between gap-2">
			<Button
				tabindex={2}
				ref={backButtonRef}
				disabled={isFirstElement}
				variant="ghost"
				size="sm"
				className="text-primary-foreground outline-primary-foreground hover:bg-primary-foreground/5"
				onClick={() => setIndex(index - 1)}
			>
				<Icon name="arrow-left" aria-hidden="true" />
				Voltar
			</Button>

			<div className="flex h-4 w-40 items-center justify-center gap-1 [&_span]:rounded-full [&_span]:bg-primary-foreground/30">
				{guideElements.map((_, i) => (
					<span
						key={i}
						data-active={i === index}
						className="size-2 rounded-full data-[active=true]:bg-primary-foreground!"
					/>
				))}
			</div>

			<Button
				tabindex={2}
				ref={advanceButtonRef}
				variant="ghost"
				size="sm"
				className="text-primary-foreground outline-primary-foreground hover:bg-primary-foreground/5"
				onClick={isLastElement ? onClose : () => setIndex((i) => i + 1)}
			>
				{isLastElement ? "Concluir" : "Avançar"}
				{!isLastElement && <Icon name="arrow-right" aria-hidden="true" />}
			</Button>
		</div>
	);
};
