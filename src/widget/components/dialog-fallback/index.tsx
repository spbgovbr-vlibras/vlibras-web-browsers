import { createPortal } from "preact/compat";
import { cn } from "@/common/lib/utils";
import { Skeleton } from "@/widget/components/ui/skeleton";
import { Spinner } from "@/widget/components/ui/spinner";
import { useRootStore } from "@/widget/stores/use-root.store";

type Props = {
	className?: string;
};

export const DialogFallback = ({ className }: Props) => {
	const root = useRootStore((s) => s.appRoot);

	if (!root) return null;

	return createPortal(
		<div
			style={{ boxShadow: "0 -5px 10px -5px rgba(0, 0, 0, 0.15)" }}
			className={cn("widget-radius absolute inset-0 top-auto z-100 flex min-h-40 flex-col bg-background", className)}
		>
			<div className="flex items-center gap-2 border-b p-4">
				<Skeleton className="size-4 shrink-0" />
				<Skeleton className="h-4 w-24" />
			</div>

			<div className="grid flex-1 place-content-center">
				<Spinner />
			</div>
		</div>,
		root,
	);
};
