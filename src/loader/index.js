window.VLibrasWidget = window.VLibrasWidget || {};
window.VLibrasWidget.path = "__APP_ROOT__";
window.VLibrasWidget.configUrl = null;

window.VLibras = window.VLibras || {};

window.VLibras.Widget = function (path, configUrl, avatar) {
  if (path) window.VLibrasWidget.path = path;
  if (configUrl) window.VLibrasWidget.configUrl = configUrl;
  if (avatar) window.VLibrasWidget.avatar = avatar;

  renderWidget();
};

let isRendered = false;
let widget;

function renderWidget() {
  if (isRendered) return;
  isRendered = true;

  const currentPath = window.VLibrasWidget.path;

  const template = `
  <div id="vlibras-access">
      <img id="vlibras-access-popup" src="${currentPath}/assets/images/vlibras-popup.jpg" />
      <button type="button" aria-label="Recursos assistivos com VLibras Widget+" id="vlibras-access-button">
        <img src="${currentPath}/assets/images/vlibras-access.svg" />
      </button>
  </div>
  <style>
  #vlibras-access {
      height: 40px;
      width: 40px;
  }

  #vlibras-access-button,
  #vlibras-access-popup {
      border-radius: 8px;
      overflow: hidden;
      height: 40px;
  }

  #vlibras-access {
      display: flex;
      align-items: center;
      position: fixed;
      z-index: 2147483639;
      right: 10px;
      top: calc(50vh - 20px);
      transition: all .5s ease;
      width: 40px;

      &:hover { 
          width: 208px;
      }
  }

  #vlibras-access-button {
      right: 0;
      z-index: 1;
      position: absolute;
      width: 40px;
      height: 40px;
      border: none;
      padding: 0;
      cursor: pointer;

      &:hover { 
          filter: brightness(1.1);
      }
  }
  </style>`;

  const wrapper = document.createElement("div");
  const shadow = wrapper.attachShadow({ mode: "open" });
  wrapper.id = "vlibras-access-wrapper";

  shadow.innerHTML = template;
  document.body.appendChild(wrapper);

  const initBtn = shadow.querySelector("#vlibras-access-button");

  const open = () => {
    if (widget) {
      widget.dataset.active = "true";
      return;
    }

    const script = document.createElement("script");
    script.src = `${window.VLibrasWidget.path}/vlibras-plugin-app.umd.cjs`;
    script.async = true;
    script.onload = () => {
      widget = document.getElementById("vlibras-app-root");
      if (widget) widget.dataset.active = "true";
    };

    document.body.appendChild(script);
  };

  initBtn.onclick = open;

  window.VLibrasWidget.initBtn = initBtn;
  window.VLibrasWidget.open = open;

  if (localStorage.getItem("@vlibras-wp")?.includes('"isActive":true')) {
    open();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => renderWidget());
} else {
  setTimeout(() => renderWidget(), 50);
}
