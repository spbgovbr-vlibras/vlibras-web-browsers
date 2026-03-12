import { Button } from "@/widget/components/ui/button";
import { ArrowLeftIcon, IcaroIcon } from "@/widget/icons";
import { useScreensStore } from "@/widget/stores/use-screens.store";
import { Screen, ScreenContent, ScreenHeader, ScreenTitle } from "../components";
import { ActiveDarkMode } from "./components/dark-mode";

export const Settings = () => {
	const { open } = useScreensStore();

	return (
		<Screen autofocus>
			<ScreenHeader>
				<Button title="Fechar" aria-label="Fechar" onClick={() => open("main")}>
					<ArrowLeftIcon aria-hidden="true" size={22} />
				</Button>
				<ScreenTitle>Configurações</ScreenTitle>
			</ScreenHeader>
			<div className="h-[calc(100%-120px)]">
				<ScreenContent>
					<div className="relative flex flex-col gap-8 p-4 pb-0">
						<ActiveDarkMode />
					</div>
				</ScreenContent>

				<div className="absolute inset-0 top-auto grid place-items-center bg-background p-4">
					<a
						target="_blank"
						rel="noreferrer noopener"
						href="https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/vlibras"
						className="flex items-center gap-2 hover:underline"
					>
						<div
							tabIndex={-1}
							className="relative grid size-4.5 place-items-center overflow-hidden rounded-[4px] bg-primary"
						>
							<IcaroIcon aria-hidden="true" className="absolute bottom-0 size-3.5 text-primary-foreground" />
						</div>
						<span className="text-xs">VLibras Widget</span>
					</a>
				</div>
			</div>
		</Screen>
	);
};
