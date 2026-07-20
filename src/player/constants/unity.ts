export const UNITY_OBJECTS = {
	PLAYER: "PlayerManager",
	EMOTION: "EmotionBridge",
	CUSTOMIZATION: "CustomizationBridge",
} as const;

export const UNITY_METHODS = {
	PLAY_WELCOME: "playWellcome",
	PLAY: "playNow",
	STOP: "stopAll",
	REPEAT: "repeat",
	SET_SPEED: "setSlider",
	SET_AVATAR: "Change",
	SET_PAUSE_STATE: "setPauseState",
	SET_BASE_URL: "setBaseUrl",
	SET_PERSONALIZATION: "setURL",
	SET_SUBTITLES_STATE: "setSubtitlesState",
	APPLY_DEFAULT_EMOTION: "ApplyDefaultEmotion",
	APPLY_HAPPY_EMOTION: "ApplyHappyEmotion",
	APPLY_SAD_EMOTION: "ApplySadEmotion",
	// APPLY_DOUBT_EMOTION: "ApplyDoubtEmotion",
	APPLY_ANGRY_EMOTION: "ApplyAngryEmotion",
	APPLY_DISGUST_EMOTION: "ApplyDisgustEmotion",
	APPLY_FEAR_EMOTION: "ApplyFearEmotion",
	APPLY_SURPRISE_EMOTION: "ApplySurpriseEmotion",
	SET_SUBTITLE_COLOR: "SetSubtitleColor",
	SET_SUBTITLE_OUTLINE_COLOR: "SetSubtitleOutlineColor",
	SET_SUBTITLE_SHADOW_COLOR: "SetSubtitleShadowColor",
} as const;

export const UNITY_EVENTS = {
	ON_LOAD_PLAYER: "on_load_player",
	ON_PLAYING_STATE_CHANGE: "on_playing_state_change",
	COUNTER_GLOSS: "counter_gloss",
	UPDATE_PROGRESS: "update_progress",
	GET_AVATAR: "get_avatar",
	FINISH_WELCOME: "finish_welcome",
} as const;

export type UNITY_EVENTS = (typeof UNITY_EVENTS)[keyof typeof UNITY_EVENTS];
export type UNITY_OBJECTS = (typeof UNITY_OBJECTS)[keyof typeof UNITY_OBJECTS];
export type UNITY_METHODS = (typeof UNITY_METHODS)[keyof typeof UNITY_METHODS];
