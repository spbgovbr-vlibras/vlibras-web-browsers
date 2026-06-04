import { useMemo } from "preact/hooks";
import { usePick } from "@/common/hooks";
import { MaskIcon } from "@/common/utils/mask-icon";
import { repeat } from "@/player/actions";
import { usePlayerStore } from "@/player/use-player.store";
import { Button } from "@/widget/components/ui/button";
import repeatICon from "@/widget/icons/repeat.webp";
import xIcon from "@/widget/icons/x.webp";
import { useGuideCtx } from ".";

export const GuideActions = () => {
	const { onClose } = useGuideCtx();
	const { status, gloss } = usePlayerStore(usePick("gloss", "status"));

	const canRepeat = useMemo(() => gloss && status === "idle", [gloss, status]);

	return (
		<div className="absolute top-1 right-1 flex flex-col rounded-lg">
			<Button tabindex={1} onClick={onClose} size="icon-xs">
				<MaskIcon src={xIcon} className="size-4 bg-white" />
			</Button>

			{canRepeat && (
				<Button tabindex={1} onClick={repeat} size="icon-xs" className="animate-move-right">
					<MaskIcon src={repeatICon} className="size-4 bg-white" />
				</Button>
			)}
		</div>
	);
};
