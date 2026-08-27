(() => {
  const vw = (window.VLibrasWidget = Object.assign(
    { path: "__APP_ROOT__" },
    window.VLibrasWidget,
  ));

  (window.VLibras = window.VLibras || {}).Widget = function (
    path,
    personalization,
    avatar,
    position,
  ) {
    if (typeof path === "object") {
      Object.assign(vw, {
        path: path.rootPath || vw.path,
        avatar: path.avatar,
        position: path.position,
        personalization: path.personalization,
      });
    } else {
      Object.assign(vw, {
        path: path || vw.path,
        personalization,
        avatar,
        position,
      });
    }

    renderWidget();
  };

  let isRendered = false;
  let widget;

  function renderWidget() {
    if (isRendered) return;
    isRendered = true;

    const currentPath = vw.path;
    const position = vw.position?.toLowerCase() === "l" ? "left" : "right";

    const template = `
  <div id="vlibras-access">
      <img id="vlibras-popup" src="${currentPath}/assets/images/vlibras-popup.webp" />
      <button type="button" aria-label="Conteúdo acessível em Libras usando o VLibras Widget com opções dos Avatares Ícaro, Hosana ou Guga." id="vlibras-button">
        <img src="${currentPath}/assets/images/vlibras-access.svg" />
      </button>
  </div>
  <style>
  #vlibras-access {
      display: flex;
      align-items: center;
      position: fixed;
      z-index: 2147483639;
      ${position}: 10px;
      flex-direction: ${position === "left" ? "row-reverse" : "row"};
      top: calc(50vh - 20px);
      transition: all .5s ease;
      width: 40px;
      height: 40px;

      &:hover { 
          width: 200px;
      }
  }

  #vlibras-button,
  #vlibras-popup {
      border-radius: 8px;
      overflow: hidden;
      height: 40px;
  }

  #vlibras-button {
      ${position}: 0;
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

    const initBtn = shadow.querySelector("#vlibras-button");

    const open = () => {
      if (widget) {
        widget.dataset.active = "true";
        return;
      }

      const script = document.createElement("script");
      script.type = "module";
      script.src = `${vw.path}/vlibras-plugin-app.js?v=__APP_VERSION__`;
      script.async = true;
      script.onload = () => {
        widget = document.getElementById("vlibras-app-root");
        if (widget) widget.dataset.active = "true";
      };

      document.body.appendChild(script);
    };

    initBtn.onclick = open;
    vw.initBtn = initBtn;
    vw.open = open;

    try {
      if (localStorage["@vlibras-widget"]?.includes('"isOpen":true')) open();
    } catch {
      // Ignore
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => renderWidget());
  } else setTimeout(() => renderWidget(), 50);
})();
