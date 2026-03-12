export const UNITY_OBJECTS = {
	PLAYER: "PlayerManager",
	EMOTION: "EmotionBridge",
	CUSTOM: "CustomizationBridge",
} as const;

export const UNITY_METHODS = {
	PLAY: "playNow",
	STOP: "stopAll",
	REPEAT: "repeat",
	SEND_REVIEW: "sendReview",
	SET_SPEED: "setSpeed",
	SET_AVATAR: "Change",
	SET_PAUSE_STATE: "setPauseState",
	PLAY_WELCOME: "playWellcome",
} as const;

export const UNITY_EVENTS = {
	ON_LOAD_PLAYER: "on_load_player",
	ON_PLAYING_STATE_CHANGE: "on_playing_state_change",
	COUNTER_GLOSS: "counter_gloss",
	UPDATE_PROGRESS: "update_progress",
	GET_AVATAR: "get_avatar",
} as const;

export type UNITY_EVENTS = (typeof UNITY_EVENTS)[keyof typeof UNITY_EVENTS];
export type UNITY_OBJECTS = (typeof UNITY_OBJECTS)[keyof typeof UNITY_OBJECTS];
export type UNITY_METHODS = (typeof UNITY_METHODS)[keyof typeof UNITY_METHODS];
