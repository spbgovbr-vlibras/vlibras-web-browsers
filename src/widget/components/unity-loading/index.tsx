import { useEffect, useState } from "preact/hooks";
import { GovBRIcon, IcaroIcon } from "@/widget/icons";

type Props = {
	progress: number;
};

export const UnityLoading = ({ progress }: Props) => {
	const [isStarting, setStarting] = useState(false);

	useEffect(() => {
		if (progress === 100) setTimeout(() => setStarting(true), 1000);
	}, [progress]);

	return (
		<div className="absolute inset-0 z-9999999 flex flex-col items-center justify-between bg-background p-4">
			<div className="rounded-full border px-2 py-1">
				<GovBRIcon className="h-4 w-auto" />
			</div>

			<div className="-mt-4 flex flex-col items-center">
				<div className="mb-2 overflow-hidden rounded-full border-6 border-primary/30">
					<div className="relative flex size-20 justify-center overflow-hidden rounded-full bg-primary">
						<IcaroIcon className="absolute bottom-0 size-15 text-primary-foreground" />
					</div>

					{/* <span className="absolute inset-0 rounded-full border-6 border-white/20" /> */}
				</div>

				<p className="font-bold text-base">VLibras Widget</p>
				<span className="font-light text-muted-foreground text-xs">v{__APP_VERSION__}</span>
			</div>

			{isStarting && (
				<span className="absolute bottom-9 animate-move-up font-semibold text-muted-foreground text-xs">
					Iniciando...
				</span>
			)}

			<div className="bottom-4 h-2.5 w-44 rounded-full bg-foreground/10">
				<span className="block h-full rounded-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
			</div>
		</div>
	);
};
