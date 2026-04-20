import { useEffect, useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useMobile } from "@/common/hooks";
import { usePlayerStore } from "@/player/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { Tooltip } from "@/widget/components/ui/tooltip";
import { SettingsDialog } from "@/widget/dialogs/settings";
import { SettingsIcon } from "@/widget/icons";
import { useRootStore } from "@/widget/stores/use-root.store";

export const SettingsOption = () => {
	const isMobile = useMobile();
	const appContent = useRootStore((s) => s.appContent);
	const status = usePlayerStore((s) => s.status);

	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (!appContent || status !== "idle") return;
	}, [status]);

	return (
		<Fragment>
			<Tooltip
				className="whitespace-nowrap text-xs"
				offset={8}
				align="end"
				content="Configurações"
				placement="top"
				arrow={{ position: "bottom-right" }}
			>
				<Button onClick={() => setOpen(true)} variant="ghost-gov" size={isMobile ? "icon-sm" : "icon"}>
					<SettingsIcon />
				</Button>
			</Tooltip>

			<SettingsDialog open={open} onOpenChange={setOpen} />
		</Fragment>
	);
};
