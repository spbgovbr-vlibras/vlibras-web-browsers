import { cn } from "@/common/lib/utils";
import { Button } from "@/widget/components/ui/button";
import { IcaroIcon, XIcon } from "@/widget/icons";
import { Screen, ScreenContent, ScreenHeader, ScreenTitle } from "../components";

export const AboutScreen = () => {
	return (
		<Screen>
			<ScreenHeader close>
				<ScreenTitle>Sobre</ScreenTitle>
			</ScreenHeader>

			<ScreenContent className="flex flex-col text-sm">
				<p className="">
					A <strong>Suíte VLibras</strong> é um conjunto de ferramentas gratuitas de código aberto que traduz conteúdo
					digital (texto, áudio e vídeo) em Português para Libras.
				</p>

				<div className="relative mt-auto! flex min-h-32 flex-col overflow-hidden rounded-xl border p-4 font-semibold text-primary-foreground max-sm:-m-2">
					<p className="text-center">Nos acompanhe nas redes sociais</p>
					<div
						className={cn(
							"z-999 mt-auto flex w-full items-center gap-2",
							"[&_button]:w-full [&_button]:rounded-full [&_button]:bg-primary-foreground [&_button]:text-primary",
						)}
					>
						<Button size="icon-sm">
							<XIcon />
						</Button>
						<Button size="icon-sm">
							<XIcon />
						</Button>
						<Button size="icon-sm">
							<XIcon />
						</Button>
						<Button size="icon-sm">
							<XIcon />
						</Button>
					</div>
					<IcaroIcon className="absolute top-4 left-0 -z-1 size-32 text-primary-foreground opacity-15" />
					<div className="absolute inset-0 -z-10 bg-primary" />
				</div>
			</ScreenContent>
		</Screen>
	);
};
