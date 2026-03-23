export type PlayerAvatar = "icaro" | "hosana" | "guga";

export type PlayerStatus = "idle" | "playing" | "paused" | "stopped";

export type PlayerConfig = {
	baseUrl: string;
	personalizationUrl: string;
};

export type CountGloss = {
	count: number;
	max: number;
};
