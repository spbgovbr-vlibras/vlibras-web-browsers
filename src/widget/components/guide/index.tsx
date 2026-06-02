import { type Dispatch, type StateUpdater, useEffect, useMemo, useState } from "preact/hooks";
import { useMobile } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { zusContext } from "@/common/lib/zus-context";
import { $, $$ } from "@/common/utils/dom";
import { play, stop } from "@/player/actions";
import { playerStore } from "@/player/use-player.store";
import { useRootStore } from "@/widget/stores/use-root.store";
import { useWidgetStore, widgetStore } from "@/widget/stores/use-widget.store";
import { useDraggable } from "../draggable";
import { GuideActions } from "./actions";
import { guideElements } from "./elements";
import { GuideFooter } from "./footer";
import { type GuideState, guideStore, useGuideStore } from "./store";
import { guideVariants } from "./variants";

export const { Provider: GuideProvider, useCtx: useGuideCtx } = zusContext<
	{ index: number; setIndex: Dispatch<StateUpdater<number>>; onClose: () => void } & GuideState
>();

export const Guide = () => {
	const { pos } = useDraggable();
	const { innerWidth, innerHeight } = window;

	const [index, setIndex] = useState(0);

	const store = useGuideStore();
	const isExpanded = useWidgetStore((s) => s.isExpanded);
	const isTranslating = useWidgetStore((s) => s.isTranslating);
	const appRoot = useRootStore((s) => s.appRoot);
	const isMobile = useMobile();

	const isLeft = useMemo(() => pos.x < (innerWidth - (appRoot?.clientWidth || 0)) / 2, [pos.x, innerWidth]);
	const isTop = useMemo(() => pos.y < (innerHeight - (appRoot?.clientHeight || 0)) / 2, [pos.y, innerHeight]);
	const element = useMemo(() => guideElements[index], [index]);

	const onClose = () => {
		widgetStore.set({ text: undefined });
		playerStore.set({ gloss: undefined });
		guideStore.get().reset();

		removeAllHighlights();
		stop();
	};

	useEffect(() => void (isTranslating && onClose()), [isTranslating]);

	useEffect(() => {
		if (!appRoot) return;

		removeAllHighlights();
		play(element.gloss);

		element.action?.();

		const target = $(element.selector, appRoot);
		if (target) {
			guideStore.set({ element });
			target.dataset.highlight = "true";
		}
	}, [element]);

	if (!appRoot) return null;

	const removeAllHighlights = () => {
		if (!appRoot) return;

		const targets = $$("[data-highlight=true]", appRoot);
		targets?.forEach((target) => (target.dataset.highlight = "false"));
	};

	return (
		<GuideProvider data={{ index, setIndex, onClose, ...store }}>
			<div
				className={cn(
					guideVariants({ isMobile, isLeft, isTop, isExpanded }),
					!isExpanded && !isMobile && element.guideClx,
					isExpanded && element.guideClxExpanded,
				)}
			>
				<div className="pr-4">
					<span className="break-anywhere expanded:text-base! text-primary-foreground text-sm sm:text-base">
						{element.text}
					</span>
				</div>

				<GuideActions />
				<GuideFooter />

				{!isExpanded && (
					<span
						className={cn(
							"absolute -z-10 my-4 size-4 rotate-45 rounded-xs bg-primary max-lg:hidden",
							element.guideClx,
							isLeft ? "-left-1" : "-right-1",
						)}
					/>
				)}
			</div>
		</GuideProvider>
	);
};
