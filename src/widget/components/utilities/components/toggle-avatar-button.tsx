import { appConfig } from "@/common/hooks/use-config";
import { posthogg } from "@/common/lib/posthog";
import { cn } from "@/common/lib/utils";
import { toggleAvatar } from "@/player/actions";
import { usePlayerStore } from "@/player/stores/use-player.store";
import type { PlayerAvatar } from "@/player/types";
import { useGuideStore } from "@/widget/components/guide/store";
import { Button } from "@/widget/components/ui/button";
import { Dropdown, DropdownContent, DropdownTrigger } from "@/widget/components/ui/dropdown";
import { Icon } from "@/widget/components/ui/icon";
import { Tooltip } from "@/widget/components/ui/tooltip";
import type { IconName } from "@/widget/icons/types";
import { overlayStore } from "@/widget/stores/use-overlay.store";
import { useWidgetStore } from "@/widget/stores/use-widget.store";

const avatars: { name: PlayerAvatar; path: string; icon: IconName }[] = [
	{ name: "icaro", path: "/icaro.webp", icon: "icaro" },
	{ name: "hosana", path: "/hosana.webp", icon: "hosana" },
	{ name: "guga", path: "/guga.webp", icon: "guga" },
];

const getAvatarImage = (path: string) => {
	const { path: configPath } = appConfig.getState();
	return `${configPath}/assets/images/avatars/${path}`;
};

export const ToggleAvatarButton = () => {
	const avatar = usePlayerStore((s) => s.avatar);
	const isGuideOpen = useGuideStore((s) => s.open);
	const isGuideSelected = useGuideStore((s) => s.element?.selector === "#toggle-avatar-button");
	const isExpanded = useWidgetStore((s) => s.isExpanded);

	const currentAvatar = avatars.find(({ name }) => name === avatar) || avatars[0];

	const handleSelectAvatar = (name: PlayerAvatar) => {
		toggleAvatar(name);
		overlayStore.close();
		posthogg.trackEvent("avatar_selected", { avatar: name });
	};

	return (
		<Dropdown
			showOverlay={false}
			open={isGuideOpen ? isGuideSelected : undefined}
			className="dropdown-top dropdown-end z-1 h-9 animate-move-up [&_button]:shadow-md"
		>
			<Tooltip
				className="whitespace-nowrap"
				content="Alterar avatar"
				placement="top"
				align="end"
				arrow={{ position: "bottom-right" }}
				disabled={isGuideOpen}
			>
				<DropdownTrigger openOnFocus>
					<Button
						aria-label="Alterar avatar"
						id="toggle-avatar-button"
						variant="outline"
						size="icon"
						className={cn(
							"rounded-full bg-background text-primary hover:bg-muted! data-[highlight=true]:animate-highlight-primary",
							isGuideOpen && "pointer-events-none",
						)}
					>
						<Icon name={currentAvatar.icon} className="size-5.5" />
					</Button>
				</DropdownTrigger>
			</Tooltip>

			<DropdownContent>
				<ul className="mb-2 space-y-2">
					{avatars
						.filter(({ name }) => name !== avatar)
						.map((avatar) => (
							<li key={avatar.name} role="presentation" className="flex animate-move-up items-center justify-end gap-1">
								{!(isGuideSelected && isExpanded) && (
									<span
										aria-hidden="true"
										className="flex h-7 w-fit items-center justify-center whitespace-nowrap rounded-full border border-foreground/20 bg-background px-2.5 py-1 text-xs capitalize"
									>
										{avatar.name}
									</span>
								)}

								<Button
									role="menuitem"
									aria-label={`Alterar avatar para ${avatar.name}`}
									onClick={() => handleSelectAvatar(avatar.name)}
									variant="outline"
									className="rounded-full bg-background hover:bg-muted!"
									size="icon"
								>
									<img src={getAvatarImage(avatar.path)} alt="" />
								</Button>
							</li>
						))}
				</ul>
			</DropdownContent>
		</Dropdown>
	);
};
