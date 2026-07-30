import { useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useMobile } from "@/common/hooks";
import { Button } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import { Tooltip } from "@/widget/components/ui/tooltip";
import { SettingsDialog } from "@/widget/dialogs/settings";

export const SettingsOption = () => {
	const isMobile = useMobile();
	const [open, setOpen] = useState(false);

	return (
		<Fragment>
			<Tooltip
				className="whitespace-nowrap"
				offset={8}
				align="end"
				content="Configurações"
				placement="top"
				arrow={{ position: "bottom-right" }}
			>
				<Button onClick={() => setOpen(true)} variant="ghost-gov" size={isMobile ? "icon-sm" : "icon"}>
					<Icon name="settings" />
				</Button>
			</Tooltip>

			<SettingsDialog open={open} onOpenChange={setOpen} />
		</Fragment>
	);
};
