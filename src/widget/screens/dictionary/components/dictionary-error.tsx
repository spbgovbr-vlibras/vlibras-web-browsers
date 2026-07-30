import sadFace from "@/assets/images/emojis/sad-face.webp";
import { useMobile } from "@/common/hooks";
import { Button } from "@/widget/components/ui/button";

type Props = {
	onRetry: () => void;
	isMaxRetries: boolean;
};

export const DictionaryError = ({ onRetry, isMaxRetries }: Props) => {
	const isMobile = useMobile();

	return (
		<div className="flex h-full flex-col items-center justify-center gap-2 px-4">
			<img src={sadFace} alt="Emoji de rosto triste" className="size-7 sm:size-8" />

			<p className="mb-3 px-4 text-center font-semibold mobile:text-sm text-base">
				Não foi possível carregar o dicionário de sinais.
			</p>

			{!isMaxRetries && (
				<Button onClick={onRetry} size={isMobile ? "xs" : "sm"} className="rounded-full" variant="outline-gov">
					Tentar novamente
				</Button>
			)}

			{isMaxRetries && (
				<span className="mobile:text-xs text-muted-foreground text-sm">Tente novamente mais tarde.</span>
			)}
		</div>
	);
};
