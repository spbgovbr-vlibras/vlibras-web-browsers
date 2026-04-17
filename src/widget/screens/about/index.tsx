import { camaraIcon, lavidIcon, mdhcIcon, mgispIcon, rnpIcon } from "@/assets";
import { cn } from "@/common/lib/utils";
import { Button } from "@/widget/components/ui/button";
import { IcaroIcon } from "@/widget/icons";
import { FacebookIcon } from "@/widget/icons/facebook";
import { InstagramIcon } from "@/widget/icons/instagram";
import { TwitterIcon } from "@/widget/icons/twitter";
import { WorldwideIcon } from "@/widget/icons/worldwide";
import { YoutubeIcon } from "@/widget/icons/youtube";
import { Screen, ScreenContent, ScreenHeader, ScreenTitle } from "../components";
import { AboutField } from "./aboutfield";

export const AboutScreen = () => {
	return (
		<Screen>
			<ScreenHeader close>
				<ScreenTitle>Sobre</ScreenTitle>
			</ScreenHeader>

			<ScreenContent className="flex flex-col text-sm">
				<AboutField label="Sobre o VLibras">
					<p className="">
						A <strong>Suíte VLibras</strong> é um conjunto de ferramentas gratuitas de código aberto que traduz conteúdo
						digital (texto, áudio e vídeo) em Português para Libras.
					</p>
				</AboutField>

				<AboutField label="Realizadores">
					<div className="flex w-full flex-col justify-between gap-1">
						<div className="flex w-full justify-between gap-2">
							<img src={mdhcIcon} alt={""} className="h-auto min-w-15 max-w-27" />
							<img src={mgispIcon} alt={""} className="h-auto min-w-15 max-w-27" />
						</div>
						<div className="flex justify-between gap-1">
							<img src={lavidIcon} alt={""} className="h-auto min-w-15 max-w-27" />
							<img src={rnpIcon} alt={""} className="h-auto min-w-15 max-w-27" />
							<img src={camaraIcon} alt={""} className="h-auto min-w-15 max-w-27" />
						</div>
					</div>
				</AboutField>

				<div className="relative mobile:-m-2 mt-auto! flex min-h-32 flex-col overflow-hidden rounded-xl border p-4 font-semibold text-primary-foreground">
					<p className="text-center">Nos acompanhe nas redes sociais</p>
					<div
						className={cn(
							"z-999 mt-auto flex w-full items-center gap-2",
							"[&_button]:w-full [&_button]:rounded-full [&_button]:bg-primary-foreground [&_button]:text-primary",
						)}
					>
						<Button
							size="icon-sm"
							onClick={() =>
								window.open("https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/vlibras", "_blank")
							}
						>
							<WorldwideIcon />
						</Button>
						<Button size="icon-sm" onClick={() => window.open("https://www.facebook.com/vlibras", "_blank")}>
							<FacebookIcon />
						</Button>
						<Button size="icon-sm" onClick={() => window.open("https://www.instagram.com/vlibrasoficial", "_blank")}>
							<InstagramIcon />
						</Button>
						<Button size="icon-sm" onClick={() => window.open("https://x.com/VLibrasoficial", "_blank")}>
							<TwitterIcon />
						</Button>
						<Button size="icon-sm" onClick={() => window.open("https://www.youtube.com/@vlibras-lavid3180", "_blank")}>
							<YoutubeIcon />
						</Button>
					</div>
					<IcaroIcon className="absolute top-4 left-0 -z-1 size-32 text-primary-foreground opacity-15" />
					<div className="absolute inset-0 -z-10 bg-primary" />
				</div>
			</ScreenContent>
		</Screen>
	);
};
