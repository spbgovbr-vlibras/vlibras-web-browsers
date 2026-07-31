import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/widget/components/ui/dialog";
import { Spinner } from "@/widget/components/ui/spinner";

export const TranslatorFallback = () => {
	return (
		<Dialog open>
			<DialogContent>
				<DialogHeader>
					<DialogTitle icon="translator">Tradutor</DialogTitle>
				</DialogHeader>

				<div className="grid h-46 place-content-center">
					<Spinner />
				</div>
			</DialogContent>
		</Dialog>
	);
};
