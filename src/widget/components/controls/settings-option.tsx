import { lazy, Suspense } from "preact/compat";
import { useState } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import { useMobile } from "@/common/hooks";
import { DialogFallback } from "@/widget/components/dialog-fallback";
import { Button } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import { Tooltip } from "@/widget/components/ui/tooltip";

const SettingsDialog = lazy(() => import("@/widget/dialogs/settings").then((m) => ({ default: m.SettingsDialog })));

export const SettingsOption = () => {
	const isMobile = useMobile();
	const [open, setOpen] = useState<boolean>();

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

			{open !== undefined && (
				<Suspense fallback={<DialogFallback className="h-1/2" />}>
					<SettingsDialog open={open} onOpenChange={setOpen} />
				</Suspense>
			)}
		</Fragment>
	);
};
