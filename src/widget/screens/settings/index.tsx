import { useState } from "react";
import { GugaImage, HosanaImage, IcaroImage, logoBrasil } from "@/assets";
import regionalismArray from "@/data/regionalism";
import type { PlayerAvatar } from "@/player/types";
import { usePlayer } from "@/player/use-player";
import { Screen, ScreenContent } from "../components";
import { SettingsHeader } from "./header";
import SettingsField from "./settingsfield";

const avatars: { id: PlayerAvatar; name: string; image: string }[] = [
	{ id: "icaro", name: "Ícaro", image: IcaroImage },
	{ id: "hosana", name: "Hosana", image: HosanaImage },
	{ id: "guga", name: "Guga", image: GugaImage },
];

export const SettingsScreen = () => {
	const {
		toggleAvatar,
		setRegion,
		setOpacity: setPlayerOpacity,
		avatar: currentAvatar,
		opacity: currentOpacity,
	} = usePlayer();
	const [opacity, setOpacity] = useState(Number(currentOpacity));
	const [avatar, setAvatar] = useState(currentAvatar);
	const [regionalismItem, setRegionalismItem] = useState(regionalismArray[0]);

	const getClass = (value: string) =>
		avatar === value
			? "btn btn-primary w-20 text-white border-0 rounded-full focus:outline-none"
			: "btn btn-ghost w-20 bg-white text-primary border-3 rounded-full drop-shadow-md focus:outline-none";

	return (
		<Screen>
			<SettingsHeader />
			<ScreenContent>
				<div className="flex h-full flex-col justify-between gap-2">
					<SettingsField label="Dicionário">
						<div className="flex items-center justify-between">
							<div>Regionalismo</div>
							<div className="dropdown">
								<button type="button" tabIndex={0} className="btn border-none focus:outline-none">
									<div className="flex gap-2">
										<img className="h-5 w-7" src={regionalismItem.url} alt={logoBrasil} />
										<span>{regionalismItem.abbreviation}</span>
									</div>
								</button>
								<ul
									tabIndex={-1}
									className="dropdown-content menu z-1 max-h-50 flex-nowrap overflow-y-auto rounded-box bg-background p-2 shadow-sm"
								>
									{regionalismArray.map((item) => (
										<li>
											<button
												type="button"
												className="flex focus:outline-none"
												onClick={() => {
													setRegionalismItem(item);
													setRegion(item.abbreviation);
													(document.activeElement as HTMLElement)?.blur();
												}}
											>
												<img src={item.url} alt={logoBrasil} />
												<span>{item.abbreviation}</span>
											</button>
										</li>
									))}
								</ul>
							</div>
						</div>
					</SettingsField>

					<SettingsField label="Aparência">
						<div className="flex flex-col">
							<div className="flex justify-between">
								<span>Opacidade</span>
								<span>{opacity} %</span>
							</div>
							<input
								type="range"
								min={0}
								max={100}
								value={opacity}
								onChange={(e) => {
									setOpacity(Number(e.currentTarget.value));
									setPlayerOpacity(Number(e.currentTarget.value));
								}}
								className="accent-primary focus:outline-none"
								onPointerDown={(e) => e.stopPropagation()}
							/>
						</div>
					</SettingsField>

					<div className="flex justify-between">
						<SettingsField label="Posição na tela" className="flex-1">
							<div>Teste 2</div>
						</SettingsField>
						<SettingsField label="Avatar" className="flex-1">
							<div className="flex flex-col gap-2">
								{avatars.map((item) => (
									<div className="flex items-center justify-between">
										<button
											type="button"
											onClick={() => {
												setAvatar(item.id);
												toggleAvatar(item.id);
											}}
											className={`${getClass(item.id)}`}
										>
											{item.name}
										</button>
										<img
											src={item.image}
											alt="Avatar"
											className={`h-10 w-10 rounded-full ${avatar === item.id ? "border-4 border-primary bg-primary/60" : ""}`}
										/>
									</div>
								))}
							</div>
						</SettingsField>
					</div>
				</div>
			</ScreenContent>
		</Screen>
	);
};
