export enum POSTHOG_EVENT {
	AVATAR_SELECTED = "avatar_selected",
	CHANGE_EMOTION = "change_emotion",
	CHANGE_REGION = "change_region",
	CHANGE_SPEED = "change_speed",
	DICTIONARY_GLOSS = "dictionary_gloss",
	EXPANDED = "expanded",
	OPACITY_CHANGE = "opacity_change",
	OPEN_TRANSLATOR = "open_translator",
	SUBTITLES_TOGGLED = "subtitles_toggled",
	THEME = "theme",
}

// Espelha PlayerAvatar (@/player/types). common não pode importar de player,
// então os literais vivem aqui — mantenha sincronizado com a fonte.
export type POSTHOG_AVATAR = "icaro" | "hosana" | "guga";

export type POSTHOG_EVENT_PROPERTIES = {
	[POSTHOG_EVENT.AVATAR_SELECTED]: { avatar: POSTHOG_AVATAR };
	[POSTHOG_EVENT.CHANGE_EMOTION]: { emotion: string };
	[POSTHOG_EVENT.CHANGE_REGION]: { region: string };
	[POSTHOG_EVENT.CHANGE_SPEED]: { speed: number };
	[POSTHOG_EVENT.DICTIONARY_GLOSS]: { sign: string };
	[POSTHOG_EVENT.EXPANDED]: never;
	[POSTHOG_EVENT.OPACITY_CHANGE]: { opacity: number };
	[POSTHOG_EVENT.OPEN_TRANSLATOR]: never;
	[POSTHOG_EVENT.SUBTITLES_TOGGLED]: { status: "disabled" | "enabled" };
	[POSTHOG_EVENT.THEME]: { theme: "Claro" | "Escuro" };
};
