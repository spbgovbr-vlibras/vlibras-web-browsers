import { camaraIcon, lavidIcon, mdhcIcon, mgispIcon, rnpIcon } from "@/assets";
import { cn } from "@/common/lib/utils";
import { Icon } from "@/widget/components/ui/icon";
import type { IconName } from "@/widget/icons/types";
import { Screen, ScreenContent, ScreenHeader, ScreenTitle } from "../components";
import { AboutField } from "./aboutfield";

const socialLinks: { href: string; iconName: IconName }[] = [
	{ href: "https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/vlibras", iconName: "worldwide" },
	{ href: "https://www.facebook.com/vlibras", iconName: "facebook" },
	{ href: "https://www.instagram.com/vlibrasoficial", iconName: "instagram" },
	{ href: "https://x.com/VLibrasoficial", iconName: "twitter" },
	{ href: "https://www.youtube.com/@vlibras-lavid3180", iconName: "youtube" },
];

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
					<div className="flex w-full flex-col justify-between gap-2 rounded-xl bg-white p-2">
						<div className="flex w-full items-center justify-between gap-2">
							<div className="flex min-w-0 flex-1 justify-start">
								<img src={mdhcIcon} alt="logo do Ministério dos Direitos Humanos e da Cidadania" />
							</div>
							<div className="flex min-w-0 flex-1 justify-start">
								<img src={mgispIcon} alt={"logo do Ministério da Gestão e da Inovação em Serviços Públicos"} />
							</div>
						</div>
						<div className="flex items-center justify-between gap-2">
							<div className="flex min-w-0 flex-1 items-center justify-start">
								<img src={lavidIcon} alt={"logo do lavid"} className="max-w-15" />
							</div>
							<div className="flex min-w-0 flex-1 items-center justify-start">
								<img src={rnpIcon} alt={"logo da RNP"} />
							</div>
							<div className="flex min-w-0 flex-1 items-center justify-start">
								<img src={camaraIcon} alt={"logo da Câmara dos Deputados"} />
							</div>
						</div>
					</div>
				</AboutField>

				<div className="relative mobile:-m-2 mt-auto! flex min-h-32 flex-col overflow-hidden rounded-xl border p-4 font-semibold text-primary-foreground dark:bg-muted">
					<p className="text-center">Nos acompanhe nas redes sociais</p>
					<div
						className={cn(
							"z-999 mt-auto flex w-full items-center justify-between gap-2",
							"[&_button]:w-full [&_button]:rounded-full [&_button]:bg-primary-foreground [&_button]:text-primary",
						)}
					>
						{socialLinks.map(({ href, iconName }) => (
							<a
								key={href}
								href={href}
								target="_blank"
								rel="noopener noreferrer"
								className="grid place-content-center rounded-full bg-white p-2"
							>
								<Icon name={iconName} className="size-4 bg-primary" />
							</a>
						))}
					</div>
					<Icon name="icaro" className="absolute top-4 left-0 z-1 size-32 opacity-15 dark:text-white dark:opacity-10" />
					<div className="absolute inset-0 -z-10 bg-primary" />
				</div>
			</ScreenContent>
		</Screen>
	);
};
