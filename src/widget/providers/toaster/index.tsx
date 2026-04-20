import { createPortal } from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import { subscribe, type ToastData } from "@/common/lib/toaster";
import { useRootStore } from "@/widget/stores/use-root.store";
import { ToastItem } from "./toast-item";

export const ToasterProvider = () => {
	const [list, setList] = useState<ToastData[]>([]);
	const appRoot = useRootStore((s) => s.appRoot);

	useEffect(() => {
		return subscribe(setList);
	}, []);

	if (!appRoot) return null;

	return createPortal(
		<div className="pointer-events-none absolute inset-0 z-40">
			{list.map((t) => (
				<ToastItem key={t.id} {...t} />
			))}
		</div>,
		appRoot,
	);
};
