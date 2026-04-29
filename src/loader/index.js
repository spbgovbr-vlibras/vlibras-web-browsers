const path = window.vw_app_root || "__APP_ROOT__";

const template = `
<div id="vlibras-access">
	<img id="vlibras-access-popup" src="${path}/assets/images/vlibras-popup.jpg" />
	<button type="button" aria-label="Recursos assistivos com VLibras Widget+" id="vlibras-access-button">
      <img src="${path}/assets/images/vlibras-access.svg" />
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

let widget;
const initBtn = shadow.querySelector("#vlibras-access-button");

const open = () => {
  if (widget) return (widget.dataset.active = true);

  const script = document.createElement("script");
  script.src = `${path}/vlibras-plugin-app.umd.cjs`;
  script.async = true;
  script.onload = () => {
    widget = document.getElementById("vlibras-app-root");
    widget.dataset.active = true;
  };

  document.body.appendChild(script);
};

initBtn.onclick = open;

window.VLibrasWidget = {};
window.VLibrasWidget = { path, initBtn, open };

if (localStorage.getItem("@vlibras-wp")?.includes('"isActive":true')) open();
