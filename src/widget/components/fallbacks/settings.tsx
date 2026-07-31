import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/widget/components/ui/dialog";
import { Spinner } from "@/widget/components/ui/spinner";

export const SettingsFallback = () => {
	return (
		<Dialog open>
			<DialogContent>
				<DialogHeader>
					<DialogTitle icon="settings">Configurações</DialogTitle>
				</DialogHeader>

				<div className="grid h-36 place-content-center">
					<Spinner />
				</div>
			</DialogContent>
		</Dialog>
	);
};
