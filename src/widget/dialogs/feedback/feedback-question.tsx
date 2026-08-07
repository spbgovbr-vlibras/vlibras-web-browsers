import { Button } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";

type Props = {
	isPending: boolean;
	onLike: () => void;
	onDislike: () => void;
};

export const FeedbackQuestion = ({ isPending, onLike, onDislike }: Props) => (
	<div className="flex animate-move-down items-center justify-center gap-4 mobile:text-sm text-base [&>button]:flex-col [&>button]:text-muted-foreground">
		<Button
			disabled={isPending}
			variant="ghost"
			size="icon-xl"
			className="px-7 py-10 font-semibold hover:bg-primary/5 hover:text-primary"
			onClick={onLike}
		>
			<Icon name="thumbs-up" />
			Sim
		</Button>
		<Button
			disabled={isPending}
			variant="ghost"
			size="icon-xl"
			className="px-7 py-10 font-semibold hover:bg-destructive/5 hover:text-destructive"
			onClick={onDislike}
		>
			<Icon name="thumbs-down" />
			Não
		</Button>
	</div>
);
