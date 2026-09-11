import { beforeEach, describe, expect, it, vi } from "vitest";
import type { EmotionKey } from "@/data/emotions";
import { emotionsMap } from "@/data/emotions";
import { regions } from "@/data/regionalism";
import * as actions from "@/player/actions";
import type { SubtitleColors } from "@/player/actions/types";
import { avatars } from "@/player/constants";
import { UNITY_METHODS, UNITY_OBJECTS } from "@/player/constants/unity";
import type { PlayerStoreState } from "@/player/stores/use-player.store";
import { playerStore, usePlayerStore } from "@/player/stores/use-player.store";
import { usePlayerOptionsStore } from "@/player/stores/use-player-options.store";
import type { PlayerAvatar, PlayerStatus } from "@/player/types";

describe("player/actions", () => {
	const mockSend = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		usePlayerStore.setState({
			config: { baseUrl: "https://original.com/", personalizationUrl: "" },
			avatar: "icaro" as PlayerAvatar,
			gloss: undefined,
			isWelcomeFinished: true,
			isPlayingWelcome: false,
			showSubtitles: true,
			speed: 1,
			region: regions[0],
			emotion: emotionsMap.default,
			status: "idle" as PlayerStatus,
			progress: 0,
			countGloss: { count: 0, max: 0 },
			send: mockSend,
		} as Partial<PlayerStoreState>);
		usePlayerOptionsStore.setState({ isInitialized: false } as Partial<
			ReturnType<typeof usePlayerOptionsStore.getState>
		>);
	});

	describe("send", () => {
		it("should delegate to playerStore.send", () => {
			actions.send(UNITY_OBJECTS.PLAYER, UNITY_METHODS.PLAY, "ola");
			expect(mockSend).toHaveBeenCalledWith(UNITY_OBJECTS.PLAYER, UNITY_METHODS.PLAY, "ola");
		});
	});

	describe("setConfig", () => {
		it("should early return without baseUrl/personalizationUrl", () => {
			actions.setConfig({});
			expect(mockSend).not.toHaveBeenCalled();
		});

		it("should send SET_BASE_URL and update store config", () => {
			actions.setConfig({ baseUrl: "https://new.com/" });
			expect(mockSend).toHaveBeenCalledWith(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_BASE_URL, "https://new.com/");
			expect(playerStore.get().config.baseUrl).toBe("https://new.com/");
		});

		it("should send SET_PERSONALIZATION when personalizationUrl provided", () => {
			actions.setConfig({ personalizationUrl: "https://perso.com" });
			expect(mockSend).toHaveBeenCalledWith(
				UNITY_OBJECTS.CUSTOMIZATION,
				UNITY_METHODS.SET_PERSONALIZATION,
				"https://perso.com",
			);
		});
	});

	describe("play", () => {
		it("should send pause when gloss undefined", () => {
			actions.play(undefined);
			expect(mockSend).toHaveBeenCalledWith(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_PAUSE_STATE, 0);
			expect(mockSend).not.toHaveBeenCalledWith(UNITY_OBJECTS.PLAYER, UNITY_METHODS.PLAY, expect.anything());
		});

		it("should send PLAY and set gloss and call onPlay", () => {
			const onPlay = vi.fn();
			usePlayerOptionsStore.setState({ onPlay } as Partial<ReturnType<typeof usePlayerOptionsStore.getState>>);
			usePlayerStore.setState({ isWelcomeFinished: false, isPlayingWelcome: true } as Partial<PlayerStoreState>);

			actions.play("OLA");

			expect(mockSend).toHaveBeenCalledWith(UNITY_OBJECTS.PLAYER, UNITY_METHODS.PLAY, "OLA");
			expect(playerStore.get().gloss).toBe("OLA");
			expect(onPlay).toHaveBeenCalledWith("OLA");
			expect(playerStore.get().isWelcomeFinished).toBe(true);
			expect(playerStore.get().isPlayingWelcome).toBe(false);
		});

		it("should not finish welcome if already finished", () => {
			usePlayerStore.setState({ isWelcomeFinished: true } as Partial<PlayerStoreState>);
			actions.play("OLA");
			expect(playerStore.get().isWelcomeFinished).toBe(true);
		});
	});

	describe("playWelcome", () => {
		it("should send PLAY_WELCOME and SET_SUBTITLES_STATE and set isPlayingWelcome", () => {
			actions.playWelcome();
			expect(mockSend).toHaveBeenCalledWith(UNITY_OBJECTS.PLAYER, UNITY_METHODS.PLAY_WELCOME, undefined);
			expect(mockSend).toHaveBeenCalledWith(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_SUBTITLES_STATE, 1);
			expect(playerStore.get().isPlayingWelcome).toBe(true);
		});

		it("should send subtitles 0 when showSubtitles false", () => {
			usePlayerStore.setState({ showSubtitles: false } as Partial<PlayerStoreState>);
			actions.playWelcome();
			expect(mockSend).toHaveBeenCalledWith(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_SUBTITLES_STATE, 0);
		});
	});

	describe("playStatic", () => {
		it("should temporarily set static baseUrl, play, and restore", () => {
			const onPlayStatic = vi.fn();
			usePlayerOptionsStore.setState({ onPlayStatic } as Partial<ReturnType<typeof usePlayerOptionsStore.getState>>);

			actions.playStatic("OBRIGADO");

			// first setConfig with static url, then send PLAY, then restore to DICTIONARY_URL
			expect(mockSend).toHaveBeenCalledWith(
				UNITY_OBJECTS.PLAYER,
				UNITY_METHODS.SET_BASE_URL,
				expect.stringContaining("/WEBGL/"),
			);
			expect(mockSend).toHaveBeenCalledWith(UNITY_OBJECTS.PLAYER, UNITY_METHODS.PLAY, "OBRIGADO");
			expect(onPlayStatic).toHaveBeenCalledWith("OBRIGADO");
			// playStatic restores to config.DICTIONARY_URL (production/development), not original custom url
			expect(mockSend).toHaveBeenCalledWith(
				UNITY_OBJECTS.PLAYER,
				UNITY_METHODS.SET_BASE_URL,
				expect.stringContaining("vlibras.gov.br"),
			);
		});

		it("should send pause when gloss empty and static play", () => {
			actions.playStatic("");
			expect(mockSend).toHaveBeenCalledWith(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_PAUSE_STATE, 0);
		});

		it("should use custom _staticUrl when provided", () => {
			actions.playStatic("OI", "https://custom.static/");
			expect(mockSend).toHaveBeenCalledWith(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_BASE_URL, "https://custom.static/");
		});
	});

	describe("repeat / stop / pause", () => {
		it("repeat should replay gloss and call onRepeat", () => {
			const onRepeat = vi.fn();
			usePlayerOptionsStore.setState({ onRepeat } as Partial<ReturnType<typeof usePlayerOptionsStore.getState>>);
			usePlayerStore.setState({ gloss: "OLA" } as Partial<PlayerStoreState>);
			actions.repeat();
			expect(mockSend).toHaveBeenCalledWith(UNITY_OBJECTS.PLAYER, UNITY_METHODS.PLAY, "OLA");
			expect(onRepeat).toHaveBeenCalled();
		});

		it("repeat without gloss should only call onRepeat", () => {
			const onRepeat = vi.fn();
			usePlayerOptionsStore.setState({ onRepeat } as Partial<ReturnType<typeof usePlayerOptionsStore.getState>>);
			usePlayerStore.setState({ gloss: undefined } as Partial<PlayerStoreState>);
			actions.repeat();
			expect(mockSend).not.toHaveBeenCalledWith(UNITY_OBJECTS.PLAYER, UNITY_METHODS.PLAY, expect.anything());
			expect(onRepeat).toHaveBeenCalled();
		});

		it("stop should send STOP and call onStop", () => {
			const onStop = vi.fn();
			usePlayerOptionsStore.setState({ onStop } as Partial<ReturnType<typeof usePlayerOptionsStore.getState>>);
			actions.stop();
			expect(mockSend).toHaveBeenCalledWith(UNITY_OBJECTS.PLAYER, UNITY_METHODS.STOP, undefined);
			expect(onStop).toHaveBeenCalled();
		});

		it("pause should send SET_PAUSE_STATE 1 and call onPause", () => {
			const onPause = vi.fn();
			usePlayerOptionsStore.setState({ onPause } as Partial<ReturnType<typeof usePlayerOptionsStore.getState>>);
			actions.pause();
			expect(mockSend).toHaveBeenCalledWith(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_PAUSE_STATE, 1);
			expect(onPause).toHaveBeenCalled();
		});
	});

	describe("setSpeed", () => {
		it("should send SET_SPEED and set store speed", () => {
			actions.setSpeed(1.5);
			expect(mockSend).toHaveBeenCalledWith(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_SPEED, 1.5);
			expect(playerStore.get().speed).toBe(1.5);
		});

		it("should early return if speed not a number", () => {
			// @ts-expect-error invalid speed type for test
			actions.setSpeed("fast");
			expect(mockSend).not.toHaveBeenCalled();
		});
	});

	describe("toggleAvatar", () => {
		it("should error and not change avatar for invalid avatar", () => {
			const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
			actions.toggleAvatar("invalido" as unknown as PlayerAvatar);
			expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("inválido"));
			expect(playerStore.get().avatar).toBe("icaro");
			consoleSpy.mockRestore();
		});

		it("should cycle to next avatar when no arg", () => {
			actions.toggleAvatar();
			expect(playerStore.get().avatar).toBe(avatars[1]); // guga
			expect(mockSend).toHaveBeenCalledWith(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_AVATAR, avatars[1]);
		});

		it("should set specific avatar when valid", () => {
			actions.toggleAvatar("hosana" as PlayerAvatar);
			expect(playerStore.get().avatar).toBe("hosana");
			expect(mockSend).toHaveBeenCalledWith(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_AVATAR, "hosana");
		});
	});

	describe("toggleSubtitles", () => {
		it("should toggle when no arg", () => {
			actions.toggleSubtitles();
			expect(playerStore.get().showSubtitles).toBe(false);
			expect(mockSend).toHaveBeenCalledWith(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_SUBTITLES_STATE, 0);
		});

		it("should set explicit value", () => {
			actions.toggleSubtitles(true);
			expect(playerStore.get().showSubtitles).toBe(true);
			expect(mockSend).toHaveBeenCalledWith(UNITY_OBJECTS.PLAYER, UNITY_METHODS.SET_SUBTITLES_STATE, 1);
		});
	});

	describe("setRegion / setEmotion / setSubtitleColor", () => {
		it("should set region and config baseUrl", () => {
			const region = regions[1] ?? regions[0];
			actions.setRegion(region);
			expect(playerStore.get().region).toBe(region);
			expect(mockSend).toHaveBeenCalledWith(
				UNITY_OBJECTS.PLAYER,
				UNITY_METHODS.SET_BASE_URL,
				expect.stringContaining(region.abbreviation),
			);
		});

		it("should error on invalid emotion", () => {
			const spy = vi.spyOn(console, "error").mockImplementation(() => {});
			// @ts-expect-error invalid emotion for test
			actions.setEmotion("invalida");
			expect(spy).toHaveBeenCalled();
			spy.mockRestore();
		});

		it("should set valid emotion and send emotion bridge", () => {
			actions.setEmotion("happy" as unknown as EmotionKey, 0.8);
			expect(playerStore.get().emotion).toBeDefined();
			expect(mockSend).toHaveBeenCalledWith(UNITY_OBJECTS.EMOTION, expect.any(String), 0.8);
		});

		it("should send subtitle colors with defaults", () => {
			actions.setSubtitleColor({ color: "#fff", outline: undefined, shadow: undefined } as unknown as SubtitleColors);
			expect(mockSend).toHaveBeenCalledWith(UNITY_OBJECTS.CUSTOMIZATION, UNITY_METHODS.SET_SUBTITLE_COLOR, "#fff");
			expect(mockSend).toHaveBeenCalledWith(
				UNITY_OBJECTS.CUSTOMIZATION,
				UNITY_METHODS.SET_SUBTITLE_OUTLINE_COLOR,
				"#fff",
			);
			expect(mockSend).toHaveBeenCalledWith(
				UNITY_OBJECTS.CUSTOMIZATION,
				UNITY_METHODS.SET_SUBTITLE_SHADOW_COLOR,
				"#fff",
			);
		});

		it("should send explicit outline/shadow colors", () => {
			actions.setSubtitleColor({ color: "#fff", outline: "#000", shadow: "#333" } as SubtitleColors);
			expect(mockSend).toHaveBeenCalledWith(
				UNITY_OBJECTS.CUSTOMIZATION,
				UNITY_METHODS.SET_SUBTITLE_OUTLINE_COLOR,
				"#000",
			);
			expect(mockSend).toHaveBeenCalledWith(
				UNITY_OBJECTS.CUSTOMIZATION,
				UNITY_METHODS.SET_SUBTITLE_SHADOW_COLOR,
				"#333",
			);
		});
	});
});
