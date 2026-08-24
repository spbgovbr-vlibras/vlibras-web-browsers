(() => {
	["log", "warn", "error", "info"].forEach((method) => {
		const original = console[method];
		console[method] = (...args) => {
			const stack = new Error().stack || "";
			if (stack.indexOf("/unity/") !== -1) return;
			original.apply(console, args);
		};
	});
})();

let gameInstance;

const postEvent = (event, data) => {
	if (window.parent) {
		window.parent.postMessage({ type: "unity_event", event, data }, "*");
	}
};

gameInstance = UnityLoader.instantiate("gameContainer", "playerweb.json?v=__APP_VERSION__", {
	onProgress: (_, progress) => {
		postEvent("update_progress", progress);
	},
	compatibilityCheck: (_, accept, deny) => {
		if (UnityLoader.SystemInfo.hasWebGL) {
			accept();
		} else {
			const msg = "Seu navegador não suporta WEBGL";
			alert(msg);
			console.error(msg);
			postEvent("on_error", "unsupported");
			deny();
		}
	},
});

window.addEventListener("message", (e) => {
	if (!gameInstance) return;

	const m = e.data;

	if (m.type === "get_unity_instance") return gameInstance;
	if (m.type !== "unity") return;

	gameInstance.SendMessage(m.object, m.method, m.params);
});

window.getUnityInstance = () => gameInstance;

window.onPlayingStateChange = (...data) => {
	postEvent("on_playing_state_change", data);
};

window.CounterGloss = (...data) => {
	postEvent("counter_gloss", data);
};

window.onLoadPlayer = () => {
	postEvent("on_load_player");
};

window.GetAvatar = (data) => {
	postEvent("get_avatar", data);
};

window.FinishWelcome = (data) => {
	postEvent("finish_welcome", data);
};

window.SetFullscreen = (mode) => {
	gameInstance.SetFullscreen(mode);
};
