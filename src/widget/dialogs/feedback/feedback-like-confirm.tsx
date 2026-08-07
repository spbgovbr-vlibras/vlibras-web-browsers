import { Button } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import { Spinner } from "@/widget/components/ui/spinner";

type Props = {
	isPending: boolean;
	isMobile: boolean;
	onConfirm: () => void;
	onCancel: () => void;
};

export const FeedbackLikeConfirm = ({ isPending, isMobile, onConfirm, onCancel }: Props) => (
	<div className="mobile:mt-2 mt-4 flex w-full animate-move-up flex-col items-center gap-2 [&>button]:w-full [&>button]:rounded-full">
		<Button disabled={isPending} onClick={onConfirm} size={isMobile ? "default" : "lg"} className="w-full">
			{isPending ? <Spinner className="text-primary-foreground" /> : <Icon name="like" />}
			{isPending ? "Enviando" : "Confirmar"}
		</Button>
		<Button disabled={isPending} onClick={onCancel} variant="outline-gov" size={isMobile ? "default" : "lg"}>
			Voltar
		</Button>
	</div>
);
