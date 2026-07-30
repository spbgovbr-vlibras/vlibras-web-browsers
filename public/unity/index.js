let gameInstance;

const postEvent = (event, data) => {
  if (window.parent) {
    window.parent.postMessage({ type: "unity_event", event, data }, "*");
  }
};

gameInstance = UnityLoader.instantiate("gameContainer", "playerweb.json", {
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
  const m = e.data;
  if (!gameInstance || m.type !== "unity") return;

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
