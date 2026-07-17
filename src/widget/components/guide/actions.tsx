import { useMemo } from "preact/hooks";
import { usePick } from "@/common/hooks";
import { repeat } from "@/player/actions";
import { usePlayerStore } from "@/player/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import { useGuideCtx } from ".";

export const GuideActions = () => {
	const onClose = useGuideCtx((s) => s.onClose);
	const { status, gloss } = usePlayerStore(usePick("gloss", "status"));

	const canRepeat = useMemo(() => gloss && status === "idle", [gloss, status]);

	return (
		<div className="widget-radius absolute top-1 right-1 flex flex-col">
			<Button tabindex={1} onClick={onClose} size="icon-xs" aria-label="Fechar guia">
				<Icon name="x" aria-hidden="true" />
			</Button>

			{canRepeat && (
				<Button tabindex={1} aria-label="Repetir texto" onClick={repeat} size="icon-xs" className="animate-move-right">
					<Icon name="repeat" aria-hidden="true" />
				</Button>
			)}
		</div>
	);
};
