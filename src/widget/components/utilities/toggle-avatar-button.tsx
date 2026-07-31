import { appConfig } from "@/common/hooks/use-config";
import { posthogg } from "@/common/lib/posthog";
import { cn } from "@/common/lib/utils";
import { toggleAvatar } from "@/player/actions";
import type { PlayerAvatar } from "@/player/types";
import { usePlayerStore } from "@/player/use-player.store";
import { useGuideStore } from "@/widget/components/guide/store";
import { Button } from "@/widget/components/ui/button";
import { Icon } from "@/widget/components/ui/icon";
import { Tooltip } from "@/widget/components/ui/tooltip";
import type { IconName } from "@/widget/icons/types";

const avatars: { name: PlayerAvatar; path: string; icon: IconName }[] = [
	{ name: "icaro", path: "/icaro.png", icon: "icaro" },
	{ name: "hosana", path: "/hosana.png", icon: "hosana" },
	{ name: "guga", path: "/guga.png", icon: "guga" },
];

const getAvatarImage = (path: string) => {
	const { path: configPath } = appConfig.getState();
	return `${configPath}/assets/images/avatars/${path}`;
};

export const ToggleAvatarButton = () => {
	const avatar = usePlayerStore((s) => s.avatar);
	const isGuideOpen = useGuideStore((s) => s.open);

	const currentAvatar = avatars.find(({ name }) => name === avatar) || avatars[0];

	const handleSelectAvatar = (name: PlayerAvatar) => {
		(document.activeElement as HTMLElement)?.blur();
		setTimeout(() => toggleAvatar(name), 150);

		posthogg.trackEvent("avatar_selected", { avatar: name });
	};

	return (
		<div
			inert={isGuideOpen}
			className={cn(
				"dropdown dropdown-top dropdown-end z-1 h-9 animate-move-up focus-within:**:data-[slot=tooltip-content]:hidden [&_button]:shadow-md",
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
					className="rounded-full bg-background text-primary hover:bg-muted! data-[highlight=true]:animate-highlight-primary"
				>
					<Icon name={currentAvatar.icon} aria-hidden="true" className="size-5.5" />
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
								className="w-16 rounded-full bg-background capitalize hover:bg-muted!"
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
