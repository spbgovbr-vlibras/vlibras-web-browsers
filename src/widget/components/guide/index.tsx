import { useMemo } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useMobile } from "@/common/hooks";
import { cn } from "@/common/lib/utils";
import { useRootStore } from "@/widget/stores/use-root.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";
import { useDraggable } from "../draggable";
import { guideVariants } from "./variants";

export const Guide = () => {
	const { pos } = useDraggable();
	const { innerWidth, innerHeight } = window;

	const isExpanded = useWidgetStore((s) => s.isExpanded);
	const appContent = useRootStore((s) => s.appContent);
	const isMobile = useMobile();

	const isLeft = useMemo(() => pos.x < (innerWidth - (appContent?.clientWidth || 0)) / 2, [pos.x, innerWidth]);
	const isTop = useMemo(() => pos.y < (innerHeight - (appContent?.clientHeight || 0)) / 2, [pos.y, innerHeight]);

	if (!appContent) return null;

	return (
		<Fragment>
			<div className={cn(guideVariants({ isMobile, isLeft, isTop, isExpanded }))}>
				<span className="text-primary-foreground text-sm">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptas. Lorem ipsum dolor sit amet
					consectetur adipisicing elit. Quisquam, voluptas.
				</span>
			</div>
		</Fragment>
	);
};
