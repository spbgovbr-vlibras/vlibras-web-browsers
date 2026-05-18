import { useMemo } from "preact/hooks";
import { usePick } from "@/common/hooks";
import { usePlayer } from "@/player/use-player";
import { usePlayerStore } from "@/player/use-player.store";
import { RepeatIcon, XIcon } from "@/widget/icons";
import { Button } from "../ui/button";
import { useGuideCtx } from ".";

export const GuideActions = () => {
	const { onClose } = useGuideCtx();
	const { status, gloss } = usePlayerStore(usePick("gloss", "status"));
	const { repeat } = usePlayer();

	const canRepeat = useMemo(() => gloss && status === "idle", [gloss, status]);

	return (
		<div className="absolute top-1 right-1 flex flex-col rounded-lg">
			<Button tabindex={1} onClick={onClose} size="icon-xs">
				<XIcon aria-label="Fechar guia" />
			</Button>

			{canRepeat && (
				<Button tabindex={1} onClick={repeat} size="icon-xs" className="animate-move-right">
					<RepeatIcon aria-label="Repetir texto" />
				</Button>
			)}
		</div>
	);
};
