const path = window.vw_path || "https://vlibras.com/dist";

const template = `
<div id="vp-access-wrapper">
	<img id="vp-access-popup" src="${path}/assets/images/vp-popup.webp" />
	<button type="button" aria-label="Recursos assistivos com VLibras Widget+" id="vp-access-button">
      <img src="${path}/assets/images/vp-access.svg" />
    </button>
</div>
<style>
#vp-access-wrapper {
	height: 40px;
	width: 40px;
}

#vp-access-button,
#vp-access-popup {
	border-radius: 8px;
	overflow: hidden;
	height: 40px;
}

#vp-access-wrapper {
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

#vp-access-button {
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
wrapper.id = "vp-app-wrapper";

shadow.innerHTML = template;
document.body.appendChild(wrapper);

let widget;
const initBtn = shadow.querySelector("#vp-access-button");

const open = () => {
  if (widget) return (widget.dataset.active = true);

  const script = document.createElement("script");
  script.src = `${path}/vlibras-plugin-app.umd.cjs`;
  script.async = true;
  script.onload = () => {
    widget = document.getElementById("vp-app-root");
    widget.dataset.active = true;
  };

  document.body.appendChild(script);
};

initBtn.onclick = open;

window.VLibrasWidget = {};
window.VLibrasWidget = { path, initBtn, open };

if (localStorage.getItem("@vlibras-wp").includes('"isActive":true')) open();
