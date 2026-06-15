import { camaraIcon, lavidIcon, mdhcIcon, mgispIcon, rnpIcon } from "@/assets";
import { cn } from "@/common/lib/utils";
import { InlineTranslatorButton } from "@/widget/components/inline-translator-button";
import { Icon } from "@/widget/components/ui/icon";
import { screenStore } from "@/widget/stores/use-screens.store";
import { Screen, ScreenContent, ScreenHeader, ScreenTitle } from "../components";
import { AboutField } from "./about-field";
import { socialLinks } from "./social-links";

export const AboutScreen = () => {
	const handleReopenScreen = () => {
		screenStore.get().open("about");
	};

	return (
		<Screen>
			<ScreenHeader close>
				<ScreenTitle>Sobre</ScreenTitle>
			</ScreenHeader>

			<ScreenContent className="flex flex-col text-sm">
				<AboutField label="Sobre o VLibras">
					<p>
						A <strong>Suíte VLibra1s</strong> é um conjunto de ferramentas gratuitas de código aberto que traduz
						conteúdo digital (texto, áudio e vídeo) em Português para Libras.
						<InlineTranslatorButton
							gloss="SUÍTE VLIBRAS CONJUNTO&GRUPO FERRAMENTA GRATUITO CÓDIGO&COMPUTAÇÃO ABRIR&AFASTAR TRADUZIR CONTEÚDO&ASSUNTO DIGITAL&COMPUTADOR TEXTO ÁUDIO VÍDEO PORTUGUÊS LIBRAS [PONTO]"
							onFinish={handleReopenScreen}
						/>
					</p>
				</AboutField>

				<AboutField
					label={
						<p>
							Realizadores
							<InlineTranslatorButton gloss="REALIZAR" onFinish={handleReopenScreen} />
						</p>
					}
				>
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
					<p className="mb-4 text-center mobile:text-sm text-base leading-none">
						Nos acompanhe nas redes sociais
						<InlineTranslatorButton gloss="ACOMPANHAR REDE&GRUPO SOCIAL" onFinish={handleReopenScreen} />
					</p>
					<div
						className={cn(
							"z-999 mt-auto flex w-full items-center justify-between gap-2",
							"[&_button]:w-full [&_button]:rounded-full [&_button]:bg-primary-foreground [&_button]:text-primary",
						)}
					>
						{socialLinks.map((social) => (
							<a
								key={social.name}
								href={social.href}
								target="_blank"
								rel="noopener noreferrer"
								className="grid place-content-center rounded-full bg-white p-2"
							>
								<Icon name={social.iconName} className="size-4 bg-primary" aria-label={social.name} />
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
