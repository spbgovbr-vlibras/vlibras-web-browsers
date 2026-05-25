import { useRef } from "preact/hooks";
import { appConfig } from "@/common/hooks/use-config";
import { cn } from "@/common/lib/utils";
import type { PlayerAvatar } from "@/player/types";
import { usePlayer } from "@/player/use-player";
import { usePlayerStore } from "@/player/use-player.store";
import { Button } from "@/widget/components/ui/button";
import { useGuideStore } from "../guide/store";
import { Tooltip } from "../ui/tooltip";

const avatars: { name: PlayerAvatar; path: string }[] = [
	{ name: "icaro", path: "/icaro.png" },
	{ name: "hosana", path: "/hosana.png" },
	{ name: "guga", path: "/guga.png" },
];

const getAvatarImage = (path: string) => {
	const { path: configPath } = appConfig.getState();
	return `${configPath}/assets/images/avatars/${path}`;
};

export const ToggleAvatarButton = () => {
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { toggleAvatar } = usePlayer();

	const avatar = usePlayerStore((s) => s.avatar);
	const isGuideOpen = useGuideStore((s) => s.open);

	const currentAvatar = avatars.find(({ name }) => name === avatar);
	const currentAvatarImage = getAvatarImage(currentAvatar?.path || avatars[0].path);

	const handleSelectAvatar = (name: PlayerAvatar) => {
		dropdownRef.current?.blur();
		setTimeout(() => toggleAvatar(name), 150);
	};

	return (
		<div
			ref={dropdownRef}
			inert={isGuideOpen}
			autofocus
			className={cn(
				"dropdown dropdown-top dropdown-end z-1 h-9 animate-move-up focus-within:**:data-[slot=tooltip-content]:hidden",
			)}
		>
			<Tooltip
				className="whitespace-nowrap"
				content="Alterar avatar"
				placement="top"
				align="end"
				arrow={{ position: "bottom-right" }}
			>
				<Button
					id="toggle-avatar-button"
					variant="outline"
					size="icon"
					className="rounded-full bg-background hover:bg-muted! data-[highlight=true]:animate-highlight-primary"
				>
					<img src={currentAvatarImage} alt={avatar} />
				</Button>
			</Tooltip>

			<ul className="dropdown-content mb-2 space-y-2">
				{avatars
					.filter(({ name }) => name !== avatar)
					.map((avatar) => (
						<li key={avatar.name} className="flex animate-move-up items-center justify-end gap-2">
							<Button
								tabindex={-1}
								onClick={() => handleSelectAvatar(avatar.name)}
								variant="outline"
								className="rounded-full bg-background capitalize hover:bg-muted!"
								size="xs"
							>
								{avatar.name}
							</Button>

							<Button
								onClick={() => handleSelectAvatar(avatar.name)}
								variant="outline"
								className="rounded-full bg-background hover:bg-muted!"
								size="icon"
							>
								<img src={getAvatarImage(avatar.path)} alt={avatar.name} />
							</Button>
						</li>
					))}
			</ul>
		</div>
	);
};
