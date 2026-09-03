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
    const cfg =
      path && typeof path === "object"
        ? path
        : { rootPath: path, personalization, avatar, position };

    Object.assign(vw, {
      path: cfg.rootPath || vw.path,
      personalization: cfg.personalization,
      avatar: cfg.avatar,
      position: cfg.position,
    });

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

        &:hover,
        &:has(#vlibras-button:focus-visible) { 
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
        border: none;
        padding: 0;
        cursor: pointer;
        outline: var(--vlibras-btn-outline);

        &:focus-visible {
          outline: var(--vlibras-btn-focus-visible-outline, 2px solid #fff);
          box-shadow: var(--vlibras-btn-focus-visible-shadow, 0 0 10px 4px #1351b4);
        }

        &:hover { 
            filter: var(--vlibras-btn-hover-filter, brightness(1.1));
        }
    }
  </style>`;

    const wrapper = document.createElement("div");
    const shadow = wrapper.attachShadow({ mode: "open" });

    wrapper.id = "vlibras-access-wrapper";

    shadow.innerHTML = template;
    document.body.appendChild(wrapper);

    const initBtn = shadow.querySelector("#vlibras-button");
    const access = shadow.querySelector("#vlibras-access");

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
    vw.access = access;
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
